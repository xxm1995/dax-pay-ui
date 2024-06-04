<template>
  <basic-modal
    title="查看同步信息"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1200"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions title="" bordered>
        <a-descriptions-item label="标题" :span="2">
          {{ form.title }}
        </a-descriptions-item>
        <a-descriptions-item label="交易金额(元)" :span="2">
          {{ form.amount ? (form.amount / 100).toFixed(2) : '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="本地交易号" :span="4">
          {{ form.tradeNo }}
        </a-descriptions-item>
        <a-descriptions-item label="商户交易号" :span="4">
          {{ form.bizTradeNo }}
        </a-descriptions-item>
        <a-descriptions-item label="通道交易号" :span="4">
          {{ form.outTradeNo || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="流水类型" :span="2">
          <a-tag>{{ dictConvert('TradeFlowRecordType', form.type) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="交易通道" :span="2">
          <a-tag> {{ dictConvert('PayChannel', form.channel) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="同步时间" :span="2">
          {{ form.createTime }}
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { get, TradeFlowRecord } from './TradeFlowRecord.api'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'

  const { handleCancel, confirmLoading, visible, showable } = useFormEdit()
  const { dictConvert } = useDict()

  // 表单
  let form = $ref<TradeFlowRecord>({})
  // 入口
  function init(id) {
    visible.value = true
    confirmLoading.value = true
    get(id).then(({ data }) => {
      form = data
      confirmLoading.value = false
    })
  }

  defineExpose({
    init,
  })
</script>

<style lang="less" scoped>
  /deep/ .ant-descriptions-item-label {
    width: 170px;
  }
</style>
