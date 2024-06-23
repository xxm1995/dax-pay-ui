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
      <a-descriptions-item label="转账号" :span="2">
        {{ order.transferNo }}
      </a-descriptions-item>
      <a-descriptions-item label="商户转账号" :span="2">
        {{ order.transferNo }}
      </a-descriptions-item>
      <a-descriptions-item label="通道转账号" :span="2">
        {{ order.outTransferNo }}
      </a-descriptions-item>
      <a-descriptions-item label="标题" :span="2">
        {{ order.title }}
      </a-descriptions-item>
      <a-descriptions-item label="转账金额(元)" :span="2">
        {{ order.amount ? (order.amount / 100).toFixed(2) : 0 }}
      </a-descriptions-item>
      <a-descriptions-item label="退款发起时间" :span="2">
        {{ order.createTime }}
      </a-descriptions-item>
      <a-descriptions-item label="转账原因" :span="2">
        {{ order.reason }}
      </a-descriptions-item>
      <a-descriptions-item label="收款人姓名" :span="2">
        {{ order.payeeName || '空' }}
      </a-descriptions-item>
      <a-descriptions-item label="收款人账号" :span="2">
        {{ order.payeeAccount }}
      </a-descriptions-item>
      <a-descriptions-item label="收款人类型" :span="2">
        <a-tag>{{ dictConvert('TransferPayeeType', order.payeeType) }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="转账类型" :span="2">
        <a-tag>{{ dictConvert('TransferType', order.transferType) || '空' }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="状态" :span="2">
        <a-tag>{{ dictConvert('TransferStatus', order.status) || '空' }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="转账时间" :span="2">
        {{ order.createTime }}
      </a-descriptions-item>
      <a-descriptions-item label="完成时间" :span="2">
        {{ order.successTime }}
      </a-descriptions-item>
      <a-descriptions-item v-if="order.errorCode" label="错误码" :span="2">
        {{ order.errorCode }}
      </a-descriptions-item>
      <a-descriptions-item v-if="order.errorMsg" label="错误信息" :span="2">
        {{ order.errorMsg }}
      </a-descriptions-item>
      <a-descriptions-item label="终端ip">
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
  import { getByBizTransferNo, TransferOrder } from './TransferOrder.api'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  const { handleCancel, confirmLoading, visible, showable } = useFormEdit()
  const { dictConvert } = useDict()
  // 表单
  let order = $ref<TransferOrder>({})

  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  async function init(bizTransferNo) {
    visible.value = true
    confirmLoading.value = true
    getByBizTransferNo(bizTransferNo).then(({ data }) => {
      order = data
      confirmLoading.value = false
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
