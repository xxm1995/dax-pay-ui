<template>
  <basic-modal
    title="查看通知任务"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1200"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions title="" bordered>
        <a-descriptions-item label="本地订单ID" :span="2">
          <a-tag>{{ task.tradeNo }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="回调类型" :span="2">
          <a-tag>{{ dictConvert('ClientNoticeType', task.noticeType) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="交易状态" :span="2">
          <a-tag v-if="task.noticeType === 'pay'">{{ dictConvert('PayStatus', task.tradeStatus) || '未知' }}</a-tag>
          <a-tag v-else>{{ dictConvert('RefundStatus', task.tradeStatus) || '未知' }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="是否发送成功" :span="2">
          <a-tag v-if="task.success" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="发送次数" :span="2">
          {{ task.sendCount }}
        </a-descriptions-item>
        <a-descriptions-item label="发送地址" :span="2">
          {{ task.url }}
        </a-descriptions-item>
        <a-descriptions-item label="最后发送时间" :span="2">
          {{ task.latestTime }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">
          {{ task.createTime }}
        </a-descriptions-item>
        <a-descriptions-item label="消息内容" :span="4">
          <json-preview :data="JSON.parse(task.content || '{}')" />
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { get, ClientNoticeTask } from './ClientNoticeTask.api'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  import JsonPreview from '/@/components/CodeEditor/src/json-preview/JsonPreview.vue'
  const {
    handleCancel,
    confirmLoading,
    visible,
    showable,
  } = useFormEdit()
  const { dictConvert } = useDict()

  let task = $ref<ClientNoticeTask>({})
  /**
   *
   */
  async function init(record: ClientNoticeTask) {
    task = record
    visible.value = true
    confirmLoading.value = true
    await get(record.id).then(({ data }) => {
      task = data
    })
    confirmLoading.value = false
  }
  // 获取信息
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
