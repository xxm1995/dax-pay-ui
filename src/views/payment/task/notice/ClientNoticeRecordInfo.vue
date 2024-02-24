<template>
  <basic-modal
    title="查看记录"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions bordered title="" :column="{ md: 1, sm: 1, xs: 1 }">
        <a-descriptions-item label="主键">
          {{ info.id }}
        </a-descriptions-item>
        <a-descriptions-item label="请求次数">
          {{ info.reqCount }}
        </a-descriptions-item>
        <a-descriptions-item label="发送类型">
          <a-tag>{{ dictConvert('ClientNoticeSendType', info.type) }}</a-tag>
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
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { ClientNoticeRecord, getRecord } from './ClientNoticeTask.api'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'

  const {
    initFormEditType,
    handleCancel,
    search,
    labelCol,
    wrapperCol,
    modalWidth,
    title,
    confirmLoading,
    visible,
    editable,
    showable,
    formEditType,
  } = useFormEdit()
  const { dictConvert } = useDict()

  let info = $ref<ClientNoticeRecord>({})
  /**
   *
   */
  async function init(record: ClientNoticeRecord) {
    info = record
    visible.value = true
    confirmLoading.value = true
    await getRecord(record.id).then(({ data }) => {
      info = data
    })
    confirmLoading.value = false
  }
  // 获取信息
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
