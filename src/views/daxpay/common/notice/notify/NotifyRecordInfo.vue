<template>
  <basic-modal
    title="查看记录"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :open="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions bordered title="" :column="1">
        <a-descriptions-item label="主键">
          {{ info.id }}
        </a-descriptions-item>
        <a-descriptions-item label="请求次数">
          {{ info.reqCount || '空' }}
        </a-descriptions-item>
        <a-descriptions-item label="发送类型">
          <a-tag>{{ dictConvert('notice_send_type', info.sendType) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="是否发送成功">
          <a-tag v-if="info.success" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="错误信息">
          {{ info.errorMsg }}
        </a-descriptions-item>
        <a-descriptions-item label="发送时间">
          {{ info.createTime }}
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
  import { BasicModal } from '@/components/Modal'
  import { NotifyRecord, getRecord } from './NotifyTask.api'
  import { useDict } from '@/hooks/bootx/useDict'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { ref } from 'vue'

  const { handleCancel, modalWidth, confirmLoading, visible, showable } = useFormEdit()
  const { dictConvert } = useDict()

  let info = ref<NotifyRecord>({})
  /**
   * 入口
   */
  async function init(record: NotifyRecord) {
    info.value = record
    visible.value = true
    confirmLoading.value = true
    await getRecord(record.id).then(({ data }) => {
      info.value = data
    })
    confirmLoading.value = false
  }
  // 获取信息
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
