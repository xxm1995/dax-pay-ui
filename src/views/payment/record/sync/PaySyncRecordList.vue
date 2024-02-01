<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :default-item-count="3" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="orderId" title="本地订单号" width="170" sortable>
          <template #default="{ row }">
            <a @click="showOrder(row)">
              {{ row.orderId }}
            </a>
          </template>
        </vxe-column>
        <vxe-column field="orderNo" title="本地业务号" />
        <vxe-column field="channel" title="同步类型">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PaymentType', row.syncType) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="channel" title="同步通道">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('AsyncPayChannel', row.asyncChannel) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="status" title="同步结果">
          <template #default="{ row }">
            <a-tag v-if="row.syncType === 'pay'">{{ dictConvert('PaySyncStatus', row.gatewayStatus) }}</a-tag>
            <a-tag v-else>{{ dictConvert('RefundSyncStatus', row.gatewayStatus) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="repairOrder" title="是否修复" width="170">
          <template #default="{ row }">
            <a-tag v-if="row.repairOrder" color="green"> {{ row.repairOrderNo }} </a-tag>
            <a-tag v-else>否</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="gatewayOrderNo" title="网关订单号" width="170" />
        <vxe-column field="errorMsg" title="错误消息" />
        <vxe-column field="createTime" title="同步时间" />
        <vxe-column fixed="right" width="60" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a-link @click="show(row)">查看</a-link>
            </span>
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
    <pay-sync-record-info ref="paySyncRecordInfo" />
    <pay-order-info ref="payOrderInfo" />
    <refund-order-info ref="refundOrderInfo" />
    <pay-repair-record-info ref="payRepairRecordInfo" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page } from './PaySyncRecord.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import PaySyncRecordInfo from './PaySyncRecordInfo.vue'
  import PayOrderInfo from '/@/views/payment/order/pay/PayOrderInfo.vue'
  import PayRepairRecordInfo from '/@/views/payment/record/repair/PayRepairRecordInfo.vue'
  import RefundOrderInfo from '/@/views/payment/order/refund/RefundOrderInfo.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  let syncStatusList = $ref<LabeledValue[]>([])
  let payChannelList = $ref<LabeledValue[]>([])
  let syncTypeList = $ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'orderId', type: STRING, name: '本地订单ID', placeholder: '请输入本地订单ID' },
      { field: 'orderNo', type: STRING, name: '本地订单号', placeholder: '请输入本地订单号' },
      {
        field: 'syncType',
        type: LIST,
        name: '同步类型',
        placeholder: '请选择同步类型',
        selectList: syncTypeList,
      },
      {
        field: 'gatewayStatus',
        type: LIST,
        name: '同步结果',
        placeholder: '请选择同步结果',
        selectList: syncStatusList,
      },
      {
        field: 'channel',
        type: LIST,
        name: '同步通道',
        placeholder: '请选择同步通道',
        selectList: payChannelList,
      },
    ] as QueryField[]
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const paySyncRecordInfo = $ref<any>()
  const payOrderInfo = $ref<any>()
  const refundOrderInfo = $ref<any>()
  const payRepairRecordInfo = $ref<any>()

  onMounted(() => {
    init()
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 初始化
   */
  async function init() {
    syncStatusList = await dictDropDown('PaySyncStatus')
    payChannelList = await dictDropDown('PayChannel')
    syncTypeList = await dictDropDown('PaymentType')
  }

  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }
  /**
   * 查看
   */
  function show(record) {
    paySyncRecordInfo.init(record.id)
  }

  /**
   * 查看支付单信息
   */
  function showOrder(record) {
    if (record.callbackType === 'pay') {
      payOrderInfo.init(record.orderId)
    } else {
      refundOrderInfo.init(record.orderId)
    }
  }
  /**
   * 查看修复信息
   */
  function showRepairInfo(repairId) {
    payRepairRecordInfo.init(repairId)
  }
</script>

<style lang="less" scoped></style>
