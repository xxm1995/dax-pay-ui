<template>
  <basic-drawer forceRender v-bind="$attrs" title="通道退款订单列表" width="60%" :visible="visible" @close="visible = false">
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
    <vxe-table row-id="id" ref="xTable" :cell-style="cellStyle" :data="records" :loading="loading">
      <vxe-column type="seq" width="60" />
      <vxe-column field="channel" title="退款通道">
        <template #default="{ row }">{{ dictConvert('PayChannel', row.channel) }}</template>
      </vxe-column>
      <vxe-column field="orderAmount" title="订单金额" />
      <vxe-column field="amount" title="退款金额" />
      <vxe-column field="refundableAmount" title="剩余可退余额" />
      <vxe-column field="refundStatus" title="状态">
        <template #default="{ row }">{{ dictConvert('RefundStatus', row.status) }}</template>
      </vxe-column>
      <vxe-column field="payChannelId" title="通道支付单ID" />
      <vxe-column fixed="right" width="60" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
        </template>
      </vxe-column>
    </vxe-table>
    <refund-channel-order-info ref="refundChannelOrderInfo" />
  </basic-drawer>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import { $ref } from 'vue/macros'
import useTablePage from '/@/hooks/bootx/useTablePage'
import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
import { useMessage } from '/@/hooks/web/useMessage'
import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
import { useDict } from '/@/hooks/bootx/useDict'
import { listByChannel, RefundOrder } from './RefundOrder.api'
import RefundChannelOrderInfo from './RefundChannelOrderInfo.vue'

// 使用hooks
const { resetQueryParams, model, loading } = useTablePage(queryPage)
const { notification, createMessage } = useMessage()
const { dictDropDown, dictConvert } = useDict()

let visible = $ref(false)
let refundOrder = $ref<RefundOrder>()
let records = $ref<RefundOrder[]>([])
const xTable = $ref<VxeTableInstance>()
const xToolbar = $ref<VxeToolbarInstance>()
const refundChannelOrderInfo = $ref<any>()

nextTick(() => {
  xTable?.connect(xToolbar as VxeToolbarInstance)
})

/**
 * 入口
 * @param record
 */
function init(record) {
  visible = true
  refundOrder = record
  queryPage()
}

/**
 * 分页查询
 */
function queryPage() {
  loading.value = true
  listByChannel(refundOrder?.id).then(({ data }) => {
    records = data
    loading.value = false
  })
}
/**
 * 查看
 */
function show(record) {
  refundChannelOrderInfo.init(record)
}

function cellStyle({ row, column }) {
  if (column.field == 'refundStatus') {
    if (row.status == 'success') {
      return { color: 'green' }
    }
    if (row.status == 'fail') {
      return { color: 'red' }
    }
    if (row.status == 'progress') {
      return { color: 'orange' }
    }
    if (row.status == 'close') {
      return { color: 'gray' }
    }
    return { color: 'red' }
  }
}
defineExpose({
  init,
})
</script>

<style scoped lang="less"></style>
