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
      <a-descriptions bordered title="" :column="{ lg: 2, md: 1 }">
        <a-descriptions-item label="订单号">
          {{ record.orderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="业务号">
          {{ record.bizOrderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="支付通道">
          {{ dictConvert('channel', record.channel) }}
        </a-descriptions-item>
        <a-descriptions-item label="关闭类型">
          <a-tag>{{ dictConvert('close_type', record.closeType) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="是否关闭成功">
          <a-tag>{{ record.closed ? '成功' : '失败' }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="错误编码" v-if="record.errorCode">
          {{ record.errorMsg }}
        </a-descriptions-item>
        <a-descriptions-item label="错误消息" v-if="record.errorMsg">
          {{ record.errorMsg }}
        </a-descriptions-item>
        <a-descriptions-item label="客户端IP">
          {{ record.clientIp || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="关闭时间">
          {{ record.createTime }}
        </a-descriptions-item>
        <a-descriptions-item label="商户号">
          {{ record.mchNo }}
        </a-descriptions-item>
        <a-descriptions-item label="应用AppId">
          {{ record.appId }}
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
  import { get, PayCloseRecord } from './PayCloseRecord.api'
  import { BasicModal } from '@/components/Modal'
  import { useDict } from '@/hooks/bootx/useDict'
  import { ref } from 'vue'

  const { handleCancel, confirmLoading, visible, showable } = useFormEdit()
  const { dictConvert } = useDict()

  // 表单
  const record = ref<PayCloseRecord>({})
  // 入口
  function init(id) {
    visible.value = true
    confirmLoading.value = true
    get(id).then(({ data }) => {
      record.value = data
      confirmLoading.value = false
    })
  }

  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
