<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
      <vxe-table
        row-id="id"
        ref="xTable"
        :sort-config="{ remote: true, trigger: 'cell' }"
        :data="pagination.records"
        :loading="loading"
        @sort-change="sortChange"
      >
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="id" title="支付ID" />
        <vxe-column field="businessId" title="业务ID" />
        <vxe-column field="title" title="标题" />
        <vxe-column field="amount" title="金额(分)" sortable />
        <vxe-column field="refundableBalance" title="可退余额(分)" sortable />
        <vxe-column field="status" title="支付状态" sortable>
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayStatus', row.status) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="asyncPay" title="异步支付">
          <template #default="{ row }">
            <a-tag>{{ row.asyncPay ? '是' : '否' }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="combinationPayMode" title="组合支付">
          <template #default="{ row }">
            <a-tag>{{ row.combinationPayMode ? '是' : '否' }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="asyncPayChannel" title="异步支付方式">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayChannel', row.asyncChannel) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="expiredTime" title="过期时间" sortable />
        <vxe-column field="createTime" title="创建时间" sortable />
        <vxe-column fixed="right" width="120" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a-link @click="show(row)">查看</a-link>
            </span>
            <a-divider type="vertical" />
            <a-dropdown>
              <a> 更多 <icon icon="ant-design:down-outlined" :size="12" /></a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-link @click="syncInfo(row)">同步</a-link>
                  </a-menu-item>
                  <a-menu-item v-if="[PayStatus.PROGRESS].includes(row.status)">
                    <a-link @click="closeOrder(row)" danger>关闭</a-link>
                  </a-menu-item>
                  <a-menu-item v-if="[PayStatus.SUCCESS, PayStatus.PARTIAL_REFUND].includes(row.status) && row.refundableBalance > 0">
                    <a-link @click="refund(row)" danger>退款</a-link>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </vxe-column>
      </vxe-table>
      <vxe-pager
        size="medium"
        :loading="loading"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @page-change="handleTableChange"
      />
      <pay-order-info ref="payOrderInfo" />
      <refund-model ref="refundModel" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { close, page, sync } from './PayOrder.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import PayOrderInfo from './PayOrderInfo.vue'
  import RefundModel from './RefundModel.vue'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { VxeTableInstance, VxeToolbarInstance, VxePager, VxeTable, VxeToolbar } from 'vxe-table'
  import ALink from '/@/components/Link/Link.vue'
  import { PayStatus } from '/@/enums/payment/PayStatus'
  import { LabeledValue } from 'ant-design-vue/lib/select'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQuery, resetQueryParams, pagination, pages, model, loading, superQueryFlag } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  let cayChannelList = $ref<LabeledValue[]>([])
  let payStatusList = $ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'paymentId', type: STRING, name: '支付ID', placeholder: '请输入支付ID' },
      { field: 'businessNo', type: STRING, name: '业务号', placeholder: '请输入业务号' },
      { field: 'title', type: STRING, name: '标题', placeholder: '请输入标题' },
      { field: 'errorCode', name: '错误码', type: STRING },
      { field: 'asyncPayChannel', name: '异步支付方式', type: LIST, selectList: cayChannelList },
      { field: 'payStatus', name: '支付状态', type: LIST, selectList: payStatusList },
    ] as QueryField[]
  })

  let sortParam = $ref({
    sortField: 'createTime',
    asc: false,
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const payOrderInfo = $ref<any>()
  const refundModel = $ref<any>()

  onMounted(() => {
    initData()
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    cayChannelList = await dictDropDown('AsyncPayChannel')
    payStatusList = await dictDropDown('PayCallbackStatus')
  }
  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...pages,
      ...sortParam,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }

  /**
   * 排序条件变动
   */
  function sortChange({ order, property }) {
    sortParam.sortField = order ? property : null
    sortParam.asc = order === 'asc'
    queryPage()
  }

  /**
   * 查看
   */
  function show(record) {
    payOrderInfo.init(record.id)
  }

  /**
   * 同步信息
   */
  function syncInfo(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否同步支付信息',
      onOk: () => {
        loading.value = true
        sync(record.id).then(({ data }) => {
          // TODO 后期可以根据返回结果进行相应的处理
          createMessage.success('同步成功')
          console.log(data)
          queryPage()
        })
      },
    })
  }
  /**
   * 关闭支付
   */
  function closeOrder(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否关闭支付订单',
      onOk: () => {
        close(record.id).then(() => {
          createMessage.success('关闭成功')
          queryPage()
        })
      },
    })
  }
  /**
   * 退款
   */
  function refund(record) {
    refundModel.init(record.id)
  }
</script>

<style lang="less" scoped></style>
