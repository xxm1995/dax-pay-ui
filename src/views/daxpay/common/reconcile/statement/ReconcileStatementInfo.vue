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
        {{ statement.name }}
      </a-descriptions-item>
      <a-descriptions-item label="对账号" :span="1">
        {{ statement.reconcileNo }}
      </a-descriptions-item>
      <a-descriptions-item label="对账通道" :span="1">
        {{ dictConvert('channel', statement.channel) }}
      </a-descriptions-item>
      <a-descriptions-item label="对账日期" :span="1">
        {{ statement.date }}
      </a-descriptions-item>
      <a-descriptions-item label="下载" :span="1">
        <a-tag color="green" v-if="statement.downOrUpload">已下载</a-tag>
        <a-tag color="red" v-else>未下载</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="比对" :span="1">
        <a-tag color="green" v-if="statement.compare">已比对</a-tag>
        <a-tag color="red" v-else>未比对</a-tag>
      </a-descriptions-item>

      <a-descriptions-item label="支付订单数(平台)" :span="1">
        {{ statement.orderCount }}
      </a-descriptions-item>
      <a-descriptions-item label="支付订单数(通道)" :span="1">
        {{ statement.channelOrderCount }}
      </a-descriptions-item>
      <a-descriptions-item label="支付交易金额(平台)" :span="1">
        {{ statement.orderAmount }}
      </a-descriptions-item>
      <a-descriptions-item label="支付交易金额(通道)" :span="1">
        {{ statement.channelOrderAmount }}
      </a-descriptions-item>
      <a-descriptions-item label="退款订单数(平台)" :span="1">
        {{ statement.refundCount }}
      </a-descriptions-item>
      <a-descriptions-item label="退款订单数(通道)" :span="1">
        {{ statement.channelRefundCount }}
      </a-descriptions-item>
      <a-descriptions-item label="退款交易金额(平台)" :span="1">
        {{ statement.refundAmount }}
      </a-descriptions-item>
      <a-descriptions-item label="退款交易金额(通道)" :span="1">
        {{ statement.channelRefundAmount }}
      </a-descriptions-item>

      <a-descriptions-item v-if="statement.errorCode" label="错误码" :span="1">
        {{ statement.errorCode }}
      </a-descriptions-item>
      <a-descriptions-item v-if="statement.errorMsg" label="错误信息" :span="1">
        {{ statement.errorMsg }}
      </a-descriptions-item>
      <a-descriptions-item label="商户号" :span="1">
        {{ statement.mchNo }}
      </a-descriptions-item>
      <a-descriptions-item label="应用AppId" :span="1">
        {{ statement.appId }}
      </a-descriptions-item>
    </a-descriptions>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { get, ReconcileStatement } from './ReconcileStatement.api'
  import { BasicModal } from '@/components/Modal'
  import { useDict } from '@/hooks/bootx/useDict'
  import { ref } from 'vue'

  const { handleCancel, confirmLoading, visible, showable } = useFormEdit()
  const { dictConvert } = useDict()
  // 表单
  const statement = ref<ReconcileStatement>({})

  // 入口
  async function init(id) {
    visible.value = true
    confirmLoading.value = true
    get(id).then(({ data }) => {
      statement.value = data
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
