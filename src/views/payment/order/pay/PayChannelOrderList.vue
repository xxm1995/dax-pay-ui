<template>
  <basic-drawer forceRender v-bind="$attrs" title="通道订单列表" width="60%" :visible="visible" @close="visible = false">
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
    <vxe-table row-id="id" ref="xTable" :data="records" :loading="loading">
      <vxe-column type="seq" width="60" />
      <vxe-column field="id" title="通道支付单ID" width="170" />
      <vxe-column field="channel" title="支付通道">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('PayChannel', row.channel) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="payWay" title="支付方式">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('PayWay', row.payWay) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="amount" title="订单金额" />
      <vxe-column field="refundableBalance" title="可退款金额" />
      <vxe-column field="async" title="异步支付">
        <template #default="{ row }">
          <a-tag v-if="row.async" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="status" title="支付状态">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('PayStatus', row.status) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column fixed="right" width="60" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
        </template>
      </vxe-column>
    </vxe-table>
    <pay-channel-order-info ref="payChannelOrderInfo" />
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
  import { listByChannel, PayChannelOrder, PayOrder } from '/@/views/payment/order/pay/PayOrder.api'
  import PayChannelOrderInfo from './PayChannelOrderInfo.vue'

  // 使用hooks
  const { resetQueryParams, model, loading } = useTablePage(queryPage)
  const { notification, createMessage } = useMessage()
  const { dictDropDown, dictConvert } = useDict()

  let visible = $ref(false)
  let payOrder = $ref<PayOrder>()
  let records = $ref<PayChannelOrder[]>([])
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const payChannelOrderInfo = $ref<any>()

  nextTick(() => {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  })

  /**
   * 入口
   * @param record
   */
  function init(record) {
    visible = true
    payOrder = record
    queryPage()
  }

  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    listByChannel(payOrder?.id).then(({ data }) => {
      records = data
      loading.value = false
    })
  }
  /**
   * 查看
   */
  function show(record) {
    payChannelOrderInfo.init(record)
  }
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
