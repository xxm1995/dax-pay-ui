<template>
  <basic-modal
    title="查看"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions title="" :column="{ md: 1, sm: 1, xs: 1 }">
        <a-descriptions-item label="业务id">
          {{ form.paymentId }}
        </a-descriptions-item>
        <a-descriptions-item label="支付通道">
          {{ dictConvert('PayChannel', form.payChannel) }}
        </a-descriptions-item>
        <a-descriptions-item label="通知消息">
          <json-preview :data="JSON.parse(form.notifyInfo || '{}')" />
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          {{ form.status === 1 ? '成功' : '失败' }}
        </a-descriptions-item>
        <a-descriptions-item label="提示消息">
          {{ form.msg }}
        </a-descriptions-item>
        <a-descriptions-item label="通知时间">
          {{ form.notifyTime }}
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
  import { get, PayNotifyRecord } from './PayNotifyRecord.api'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  import JsonPreview from '/@/components/CodeEditor/src/json-preview/JsonPreview.vue'
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

  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref<PayNotifyRecord>({
    id: null,
    paymentId: '',
    notifyInfo: '',
    payChannel: 1,
    status: 1,
    msg: '',
    notifyTime: '',
  })
  // 入口
  function init(id, editType: FormEditType) {
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

<style lang="less" scoped></style>
