<template>
  <basic-modal
    title="对账订单详情"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="750"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-descriptions bordered title="" :column="{ md: 1, sm: 1, xs: 1 }">
      <a-descriptions-item label="订单标题">
        {{ form.title }}
      </a-descriptions-item>
      <a-descriptions-item label="对账号">
        {{ form.reconcileNo }}
      </a-descriptions-item>
      <a-descriptions-item label="对账日期">
        {{ form.reconcileDate }}
      </a-descriptions-item>
      <a-descriptions-item label="本地交易号">
        {{ form.tradeNo }}
      </a-descriptions-item>
      <a-descriptions-item label="通道交易号">
        {{ form.outTradeNo }}
      </a-descriptions-item>
      <a-descriptions-item label="通道交易号">
        {{ form.tradeTime }}
      </a-descriptions-item>
      <a-descriptions-item label="交易金额">
        {{ form.amount ? (form.amount / 100).toFixed(2) : '无' }}
      </a-descriptions-item>
      <a-descriptions-item label="通道交易金额">
        {{ form.outAmount ? (form.outAmount / 100).toFixed(2) : '无' }}
      </a-descriptions-item>
      <a-descriptions-item label="交易类型">
        <a-tag>{{ dictConvert('ReconcileTrade', form.tradeType) }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="差异类型">
        <a-tag>{{ dictConvert('ReconcileDiffType', form.diffType) }}</a-tag>
      </a-descriptions-item>
      <template v-if="form.diffs">
        <a-descriptions-item :label="`${item.fieldName}[差异]`" :key="item" v-for="item in form.diffs">
          <a-tag>本地</a-tag> : {{ item.localValue }}<br /><a-tag>远程</a-tag> : {{ item.gatewayValue }}
        </a-descriptions-item>
      </template>
    </a-descriptions>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { get, ReconcileDiff } from './ReconcileDiff.api'
  const { handleCancel, confirmLoading, visible, showable } = useFormEdit()
  const { dictConvert } = useDict()
  // 表单
  let form = $ref<ReconcileDiff>({})

  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(record) {
    visible.value = true
    confirmLoading.value = true
    get(record.id).then(({ data }) => {
      form = data
      confirmLoading.value = false
    })
  }
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
