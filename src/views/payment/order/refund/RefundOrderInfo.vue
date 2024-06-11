<template>
  <basic-modal
    title="退款订单"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1200"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-descriptions bordered>
      <a-descriptions-item label="退款号" :span="2">
        {{ order.refundNo }}
      </a-descriptions-item>
      <a-descriptions-item label="商户退款号" :span="2">
        {{ order.bizRefundNo }}
      </a-descriptions-item>

      <a-descriptions-item label="原支付标题" :span="2">
        {{ order.title }}
      </a-descriptions-item>
      <a-descriptions-item label="支付订单号" :span="2">
        {{ order.orderNo }}
      </a-descriptions-item>
      <a-descriptions-item label="商户支付订单号" :span="2">
        {{ order.bizOrderNo }}
      </a-descriptions-item>
      <a-descriptions-item label="退款金额(元)" :span="2">
        {{ order.amount ? (order.amount / 100).toFixed(2) : 0 }}
      </a-descriptions-item>
      <a-descriptions-item label="退款发起时间" :span="2">
        {{ order.createTime }}
      </a-descriptions-item>
      <a-descriptions-item label="退款完成时间" :span="2">
        {{ order.finishTime }}
      </a-descriptions-item>
      <a-descriptions-item v-if="order.errorCode" label="错误码" :span="2">
        {{ order.errorCode }}
      </a-descriptions-item>
      <a-descriptions-item v-if="order.errorMsg" label="错误信息" :span="2">
        {{ order.errorMsg }}
      </a-descriptions-item>
      <a-descriptions-item label="退款状态" :span="2">
        <a-tag>{{ dictConvert('RefundStatus', order.status) }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="退款终端ip">
        {{ order.clientIp }}
      </a-descriptions-item>
    </a-descriptions>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { getByRefundNo, RefundOrder } from './RefundOrder.api'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  const { handleCancel, confirmLoading, visible, showable } = useFormEdit()
  const { dictConvert } = useDict()
  // 表单
  let order = $ref<RefundOrder>({})

  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  async function init(refundNo) {
    visible.value = true
    confirmLoading.value = true
    getByRefundNo(refundNo).then(({ data }) => {
      order = data
      confirmLoading.value = false
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
