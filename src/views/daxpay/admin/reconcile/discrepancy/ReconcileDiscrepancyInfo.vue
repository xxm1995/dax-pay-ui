<template>
  <basic-modal
    title="转账订单"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1200"
    :open="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-descriptions bordered :column="{ lg: 2, md: 1 }">
      <a-descriptions-item label="对账标题" :span="1">
        {{ discrepancy.name }}
      </a-descriptions-item>
      <a-descriptions-item label="对账通道" :span="1">
        <a-tag>{{ dictConvert('channel', discrepancy.channel) }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="对账日期" :span="1">
        {{ discrepancy.reconcileDate }}
      </a-descriptions-item>
      <a-descriptions-item label="差异类型" :span="1">
        <a-tag>{{ dictConvert('reconcile_discrepancy_type', discrepancy.discrepancyType) }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="对账号" :span="2">
        {{ discrepancy.reconcileNo }}
      </a-descriptions-item>
      <a-descriptions-item label="交易号(平台)" :span="1">
        {{ discrepancy.tradeNo }}
      </a-descriptions-item>
      <a-descriptions-item label="平台交易号(通道)" :span="1">
        {{ discrepancy.channelTradeNo }}
      </a-descriptions-item>
      <a-descriptions-item label="通道交易号(平台)" :span="1">
        {{ discrepancy.outTradeNo }}
      </a-descriptions-item>
      <a-descriptions-item label="通道交易号" :span="1">
        {{ discrepancy.channelOutTradeNo }}
      </a-descriptions-item>
      <a-descriptions-item label="商户订单号(平台)" :span="1">
        {{ discrepancy.bizTradeNo }}
      </a-descriptions-item>
      <a-descriptions-item label="" :span="1" />
      <a-descriptions-item label="交易类型 (平台)" :span="1">
        {{ dictConvert('trade_type', discrepancy.tradeType) }}
      </a-descriptions-item>
      <a-descriptions-item label="交易类型 (通道)" :span="1">
        {{ dictConvert('trade_type', discrepancy.channelTradeType) }}
      </a-descriptions-item>
      <a-descriptions-item label="交易金额(平台)" :span="1">
        {{ discrepancy.tradeAmount }}
      </a-descriptions-item>
      <a-descriptions-item label="交易金额(通道)" :span="1">
        {{ discrepancy.channelTradeAmount }}
      </a-descriptions-item>
      <a-descriptions-item label="交易状态(平台)" :span="1">
        {{ dictConvert('trade_status', discrepancy.tradeStatus) }}
      </a-descriptions-item>
      <a-descriptions-item label="交易状态(通道)" :span="1">
        {{ dictConvert('trade_status', discrepancy.channelTradeStatus) }}
      </a-descriptions-item>
      <a-descriptions-item label="交易时间(平台)" :span="1">
        {{ discrepancy.tradeTime }}
      </a-descriptions-item>
      <a-descriptions-item label="交易时间(通道)" :span="1">
        {{ discrepancy.channelTradeTime }}
      </a-descriptions-item>

      <a-descriptions-item label="商户号" :span="1">
        {{ discrepancy.mchNo }}
      </a-descriptions-item>
      <a-descriptions-item label="应用AppId" :span="1">
        {{ discrepancy.appId }}
      </a-descriptions-item>
    </a-descriptions>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { get, ReconcileDiscrepancy } from './ReconcileDiscrepancy.api'
  import { BasicModal } from '@/components/Modal'
  import { useDict } from '@/hooks/bootx/useDict'
  import { ref } from 'vue'

  const { handleCancel, confirmLoading, visible, showable } = useFormEdit()
  const { dictConvert } = useDict()
  // 表单
  const discrepancy = ref<ReconcileDiscrepancy>({})

  // 入口
  async function init(id) {
    visible.value = true
    confirmLoading.value = true
    get(id).then(({ data }) => {
      discrepancy.value = data
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
