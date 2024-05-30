<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" :default-item-count="3" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
      <vxe-table
        row-id="id"
        ref="xTable"
        :data="pagination.records"
        :loading="loading"
        :sort-config="{ remote: true, trigger: 'cell' }"
        @sort-change="sortChange"
      >
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="allocationNo" title="分账单号" :min-width="220">
          <template #default="{ row }">
            <a @click="show(row)">
              {{ row.allocationNo }}
            </a>
          </template>
        </vxe-column>
        <vxe-column field="title" title="订单标题" :min-width="150" />
        <vxe-column field="orderNo" title="支付订单号" :min-width="220">
          <template #default="{ row }">
            <a @click="showPayOrder(row)">
              {{ row.orderNo }}
            </a>
          </template>
        </vxe-column>

        <vxe-column field="channel" title="所属通道" :min-width="100">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayChannel', row.channel) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="amount" title="总分账金额(元)" :min-width="120">
          <template #default="{ row }"> {{ row.amount ? (row.amount / 100).toFixed(2) : 0 }} </template>
        </vxe-column>
        <vxe-column field="status" title="状态" :min-width="120">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('AllocOrderStatus', row.status) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="result" title="分账结果" :min-width="100">
          <template #default="{ row }"> {{ dictConvert('AllocOrderResult', row.result) }} </template> </vxe-column
        ><vxe-column field="errorMsg" title="错误原因" :min-width="160" />
        <vxe-column field="createTime" title="创建时间" :min-width="160" />
        <vxe-column fixed="right" :min-width="200" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link @click="showDetail(row)">明细列表</a-link>
            <a-divider type="vertical" />
            <a-dropdown>
              <a>
                更多
                <icon icon="ant-design:down-outlined" :size="12" />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item v-if="['allocation_processing', 'allocation_end', 'allocation_failed'].includes(row.status)">
                    <a-link @click="retryInfo(row)">重试</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="syncInfo(row)">同步</a-link>
                  </a-menu-item>
                  <a-menu-item v-if="row.status === 'allocation_end'">
                    <a-link @click="finishInfo(row)">完结</a-link>
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
    </div>
    <pay-order-info ref="payOrderInfo" />
    <allocation-order-info ref="allocationOrderInfo" />
    <allocation-order-detail-list ref="allocationOrderDetailList" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page, findChannels, sync, finish, retry } from './AllocationOrder.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useDict } from '/@/hooks/bootx/useDict'
  import ALink from '/@/components/Link/Link.vue'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import AllocationOrderDetailList from './AllocationOrderDetailList.vue'
  import AllocationOrderInfo from './AllocationOrderInfo.vue'
  import PayOrderInfo from '/@/views/payment/order/pay/PayOrderInfo.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, sortChange, sortParam, pages, model, loading } =
    useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const allocationOrderDetailList = $ref<any>()
  const allocationOrderInfo = $ref<any>()

  let payChannelList = $ref<LabeledValue[]>([])
  const payOrderInfo = $ref<any>()

  const fields = computed(() => {
    return [
      { field: 'channel', type: LIST, name: '分账通道', placeholder: '请选择分账通道', selectList: payChannelList },
      { field: 'orderNo', type: STRING, name: '分账订单号', placeholder: '请输入分账订单号' },
      { field: 'paymentId', type: STRING, name: '支付订单ID', placeholder: '请输入支付订单ID' },
      { field: 'title', type: STRING, name: '支付订单标题', placeholder: '请输入支付订单标题' },
      { field: 'allocationNo', type: STRING, name: '分账业务号', placeholder: '请输入分账业务号' },
    ] as QueryField[]
  })
  onMounted(() => {
    vxeBind()
    initData()
    queryPage()
  })

  /**
   * 绑定
   */
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    findChannels().then(({ data }) => (payChannelList = data))
  }

  /**
   * 查看
   */
  function show(record) {
    allocationOrderInfo.init(record, FormEditType.Show)
  }

  /**
   * 查询分账明细列表
   * @param record
   */
  function showDetail(record) {
    allocationOrderDetailList.init(record)
  }

  /**
   * 查看支付单信息
   */
  function showPayOrder(record) {
    payOrderInfo.init(record.orderNo)
  }

  /**
   * 同步分账状态
   * @param record
   */
  function syncInfo(record) {
    createConfirm({
      iconType: 'info',
      title: '同步分账状态',
      content: '确定同步分账状态吗？',
      onOk: () => {
        sync(record.allocationNo).then(() => {
          createMessage.success('同步成功')
          queryPage()
        })
      },
    })
  }

  /**
   * 分账重试
   */
  function retryInfo(record) {
    createConfirm({
      iconType: 'info',
      title: '分账重试',
      content: '确定分账重试吗？',
      onOk: () => {
        retry(record.bizAllocationNo).then(() => {
          createMessage.success('分账重试请求发送成功')
          queryPage()
        })
      },
    })
  }

  /**
   * 完结分账
   */
  function finishInfo(record) {
    createConfirm({
      iconType: 'info',
      title: '完结分账',
      content: '确定完结分账吗？',
      onOk: () => {
        finish(record.allocationNo).then(() => {
          createMessage.success('完结请求发送成功')
          queryPage()
        })
      },
    })
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
    return Promise.resolve()
  }
</script>

<style scoped lang="less"></style>
