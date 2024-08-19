<template>
  <basic-modal
    title="查看同步信息"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1200"
    :open="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :column="{ lg: 4, md: 1 }" :spinning="confirmLoading">
      <a-descriptions title="" bordered>
        <a-descriptions-item label="平台交易号" :span="4">
          {{ form.tradeNo }}
        </a-descriptions-item>
        <a-descriptions-item label="商户交易号" :span="4">
          {{ form.bizTradeNo }}
        </a-descriptions-item>
        <a-descriptions-item label="通道交易号" :span="4">
          {{ form.outTradeNo || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="同步类型" :span="2">
          <a-tag>{{ dictConvert('trade_type', form.tradeType) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="通道状态" :span="2">
          <a-tag> {{ form.outTradeStatus }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="同步通道" :span="2">
          <a-tag> {{ dictConvert('channel', form.channel) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="客户端IP" :span="2">
          {{ form.clientIp }}
        </a-descriptions-item>
        <a-descriptions-item label="同步时间" :span="4">
          {{ form.createTime }}
        </a-descriptions-item>
        <a-descriptions-item label="错误编码" v-if="form.errorMsg" :span="2">
          {{ form.errorMsg }}
        </a-descriptions-item>
        <a-descriptions-item label="错误信息" v-if="form.errorMsg" :span="2">
          {{ form.errorMsg }}
        </a-descriptions-item>
        <a-descriptions-item label="商户号" :span="2">
          {{ form.mchNo }}
        </a-descriptions-item>
        <a-descriptions-item label="应用AppId" :span="2">
          {{ form.appId }}
        </a-descriptions-item>
        <a-descriptions-item label="同步消息" :span="4">
          <json-preview :data="XEUtils.toStringJSON(form.syncInfo || '{}')" />
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
  import { get, TradeSyncRecord } from './TradeSyncRecord.api'
  import { BasicModal } from '@/components/Modal'
  import { useDict } from '@/hooks/bootx/useDict'
  import JsonPreview from '/@/components/CodeEditor/src/json-preview/JsonPreview.vue'
  import XEUtils from 'xe-utils'
  import { ref } from 'vue'

  const { handleCancel, confirmLoading, visible, showable } = useFormEdit()
  const { dictConvert } = useDict()

  // 表单
  let form = ref<TradeSyncRecord>({})
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
  :deep(.ant-descriptions-item-label) {
    width: 170px;
  }
</style>
