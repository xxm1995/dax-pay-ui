<template>
  <basic-modal
    title="查看"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1200"
    :open="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions bordered title="">
        <a-descriptions-item label="本地交易号" :span="2">
          {{ form.tradeNo }}
        </a-descriptions-item>
        <a-descriptions-item label="通道交易号" :span="2">
          {{ form.outTradeNo }}
        </a-descriptions-item>
        <a-descriptions-item label="支付通道" :span="2">
          <a-tag>{{ dictConvert('PayChannel', form.channel) || '无' }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="回调类型" :span="2">
          <a-tag>{{ dictConvert('PaymentType', form.callbackType) || '无' }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="状态" :span="2">
          {{ dictConvert('PayCallbackStatus', form.status) || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="通知时间">
          {{ form.createTime }}
        </a-descriptions-item>
        <a-descriptions-item label="提示消息" v-if="form.errorMsg" :span="4">
          {{ form.errorMsg }}
        </a-descriptions-item>
        <a-descriptions-item label="通知消息" :span="4">
          <json-preview :data="JSON.parse(form.notifyInfo || '{}')" />
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { get, TradeCallbackRecord } from './TradeCallbackRecord.api'
  import { BasicModal } from '@/components/Modal'
  import { useDict } from '@/hooks/bootx/useDict'
  import JsonPreview from '@/components/CodeEditor/src/json-preview/JsonPreview.vue'
  import { ref } from 'vue'

  const { handleCancel, confirmLoading, visible, showable } = useFormEdit()
  const { dictConvert } = useDict()

  // 表单
  let form = ref<TradeCallbackRecord>({})
  // 入口
  function init(id) {
    visible.value = true
    confirmLoading.value = true
    get(id).then(({ data }) => {
      form.value = data
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
