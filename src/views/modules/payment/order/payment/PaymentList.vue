<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <b-super-query
            :queryState="superQueryFlag"
            :fields="queryFields"
            :width="880"
            button-title="超级查询器"
            model-title="超级查询器"
            @query="changeSuperQuery"
            @reset="resetQuery"
          />
        </template>
      </vxe-toolbar>
      <vxe-table
        row-id="id"
        ref="xTable"
        :sort-config="{ remote: true, trigger: 'cell', defaultSort: { field: 'createTime', order: 'desc' } }"
        :data="pagination.records"
        :loading="loading"
        @sort-change="sortChange"
      >
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="businessId" title="业务ID" />
        <vxe-column field="title" title="标题" />
        <vxe-column field="amount" title="金额" sortable />
        <vxe-column field="refundableBalance" title="可退余额" sortable />
        <vxe-column field="payStatus" title="支付状态" sortable>
          <template #default="{ row }">
            {{ dictConvert('PayStatus', row.payStatus) }}
          </template>
        </vxe-column>
        <vxe-column field="asyncPayMode" title="是否是异步支付">
          <template #default="{ row }">
            {{ row.asyncPayMode ? '是' : '否' }}
          </template>
        </vxe-column>
        <vxe-column field="asyncPayChannel" title="异步支付方式">
          <template #default="{ row }">
            {{ dictConvert('PayChannel', row.asyncPayChannel) }}
          </template>
        </vxe-column>
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
                    <a-link @click="sync(row)">刷新信息</a-link>
                  </a-menu-item>
                  <a-menu-item v-if="[0].includes(row.payStatus)">
                    <a-link @click="remove(row)" danger>关闭</a-link>
                  </a-menu-item>
                  <a-menu-item v-if="[1, 4].includes(row.payStatus) && row.refundableBalance > 0">
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
      <payment-info ref="paymentInfo" />
      <refund-model ref="refundModel" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page, superPage } from './Payment.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import PaymentInfo from './PaymentInfo.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { BOOLEAN, DATE_TIME, LIST, NUMBER, QueryField, QueryParam, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { cancelByPaymentId, syncByBusinessId } from '/@/api/common/Pay'
  import RefundModel from './RefundModel.vue'
  import BSuperQuery from '/@/components/Bootx/SuperQuery/BSuperQuery.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQuery, resetQueryParams, pagination, pages, model, loading, superQueryFlag } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDownNumber } = useDict()

  // 查询条件
  const fields = [
    { field: 'paymentId', type: STRING, name: '支付单号', placeholder: '请输入支付单号' },
    { field: 'businessId', type: STRING, name: '业务ID', placeholder: '请输入业务ID' },
    { field: 'title', type: STRING, name: '标题', placeholder: '请输入标题' },
  ] as QueryField[]
  const queryFields = [
    { field: 'id', name: '支付ID', type: STRING },
    { field: 'businessId', name: '业务ID', type: STRING },
    { field: 'userId', name: '用户ID', type: STRING },
    { field: 'title', name: '标题', type: STRING },
    { field: 'amount', name: '金额', type: NUMBER, precision: 2 },
    { field: 'errorCode', name: '错误码', type: STRING },
    { field: 'asyncPayMode', name: '异步支付', type: BOOLEAN },
    { field: 'asyncPayChannel', name: '异步支付方式', type: LIST, selectList: dictDropDownNumber('PayChannel') },
    { field: 'payTime', name: '支付时间', type: DATE_TIME },
    { field: 'payStatus', name: '支付状态', type: LIST, selectList: dictDropDownNumber('PayStatus') },
  ] as QueryField[]

  let superQueryParam = $ref<QueryParam[]>([])
  let sortParam = $ref({
    sortField: 'createTime',
    asc: false,
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const paymentInfo = $ref<any>()
  const refundModel = $ref<any>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  function init() {
    if (superQueryFlag.value) {
      superQuery()
    } else {
      queryPage()
    }
  }

  // 分页查询
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

  // 排序条件变动
  function sortChange({ order, property }) {
    sortParam.sortField = order ? property : null
    sortParam.asc = order === 'asc'
    init()
  }
  // 超级查询条件变动
  function changeSuperQuery(queryParams) {
    superQueryParam = queryParams
    superQuery()
  }
  // 超级查询
  function superQuery() {
    superQueryFlag.value = true
    loading.value = true
    superPage(pages, {
      queryParams: superQueryParam,
      queryOrders: [sortParam],
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }

  // 查看
  function show(record) {
    paymentInfo.init(record.id)
  }

  // 同步信息
  function sync(record) {
    loading.value = true
    syncByBusinessId(record.businessId).then(() => {
      createMessage.success('信息同步成功')
      queryPage()
    })
  }
  // 关闭支付
  function cancel(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否关闭支付',
      onOk: () => {
        cancelByPaymentId(record.id).then(() => {
          queryPage()
        })
      },
    })
  }
  // 退款
  function refund(record) {
    refundModel.init(record.id)
  }
</script>

<style lang="less" scoped></style>
