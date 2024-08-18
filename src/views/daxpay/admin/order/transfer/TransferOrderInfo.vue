<template>
  <basic-modal
    title="退款订单"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1200"
    :open="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-descriptions bordered :column="4">
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
        {{ order.amount || '无' }}
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
      <a-descriptions-item label="收款人账号" :span="4">
        {{ order.payeeAccount }}
      </a-descriptions-item>
      <a-descriptions-item label="状态" :span="2">
        <a-tag>{{ dictConvert('transfer_status', order.status) || '空' }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="创建时间" :span="2">
        {{ order.createTime }}
      </a-descriptions-item>
      <a-descriptions-item label="完成时间" :span="2">
        {{ order.finishTime }}
      </a-descriptions-item>
      <a-descriptions-item v-if="order.errorCode" label="错误码" :span="2">
        {{ order.errorCode }}
      </a-descriptions-item>
      <a-descriptions-item v-if="order.errorMsg" label="错误信息" :span="2">
        {{ order.errorMsg }}
      </a-descriptions-item>
      <a-descriptions-item label="终端ip" :span="4">
        {{ order.clientIp }}
      </a-descriptions-item>
      <a-descriptions-item label="商户号" :span="2">
        {{ order.mchNo }}
      </a-descriptions-item>
      <a-descriptions-item label="应用AppId" :span="2">
        {{ order.appId }}
      </a-descriptions-item>
      <a-descriptions-item label="商户扩展参数" :span="4">
        {{ order.attach || '无' }}
      </a-descriptions-item>
    </a-descriptions>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { getByBizTransferNo, TransferOrder } from './TransferOrder.api'
  import { BasicModal } from '@/components/Modal'
  import { useDict } from '@/hooks/bootx/useDict'
  import { ref } from 'vue'

  const { handleCancel, confirmLoading, visible, showable } = useFormEdit()
  const { dictConvert } = useDict()
  // 表单
  const order = ref<TransferOrder>({})

  // 入口
  async function init(bizTransferNo) {
    visible.value = true
    confirmLoading.value = true
    getByBizTransferNo(bizTransferNo).then(({ data }) => {
      order.value = data
      confirmLoading.value = false
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped>
  :deep(.ant-descriptions-item-label) {
    width: 200px;
  }
  :deep(.ant-descriptions-item-content) {
    width: 400px;
  }
</style>
