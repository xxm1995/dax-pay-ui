<template>
  <basic-modal
    title="查看"
    :loading="confirmLoading"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions title="" :column="{ md: 1, sm: 1, xs: 1 }">
        <a-descriptions-item label="支付记录id">
          {{ form.paymentId }}
        </a-descriptions-item>
        <a-descriptions-item label="支付通道">
          {{ dictConvert('PayChannel', form.payChannel) }}
        </a-descriptions-item>
        <a-descriptions-item label="商户编码">
          {{ form.mchCode }}
        </a-descriptions-item>
        <a-descriptions-item label="应用编码">
          {{ form.mchAppCode }}
        </a-descriptions-item>
        <a-descriptions-item label="通知消息">
          <json-preview :data="JSON.parse(form.syncInfo || '{}')" />
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          {{ dictConvert('PaySyncStatus', form.status) }}
        </a-descriptions-item>
        <a-descriptions-item label="错误消息" v-show="form.msg">
          {{ form.msg }}
        </a-descriptions-item>
        <a-descriptions-item label="同步时间">
          {{ form.syncTime }}
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
  import { get, SyncRecord } from './SyncRecord.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { BasicModal } from '/@/components/Modal'
  import JsonPreview from '/@/components/CodeEditor/src/json-preview/JsonPreview.vue'
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
  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref<SyncRecord>({})
  const { dictConvert } = useDict()

  /**
   * 入口 获取信息
   */
  function init(id) {
    visible.value = true
    console.log(123)
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

<style lang="less" scoped></style>
