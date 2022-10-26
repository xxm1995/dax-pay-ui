<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :title="title"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-form
      class="small-from-item"
      ref="formRef"
      :validate-trigger="['blur', 'change']"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="主键" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item label="消息标题" name="title">
        <a-input v-model:value="form.title" :disabled="showable" placeholder="请输入消息标题" />
      </a-form-item>
      <a-form-item label="消息内容" name="content">
        <a-input v-model:value="form.content" :disabled="showable" placeholder="请输入消息内容" />
      </a-form-item>
      <a-form-item label="发送者id" name="senderId">
        <a-input v-model:value="form.senderId" :disabled="showable" placeholder="请输入发送者id" />
      </a-form-item>
      <a-form-item label="发送者姓名" name="senderName">
        <a-input v-model:value="form.senderName" :disabled="showable" placeholder="请输入发送者姓名" />
      </a-form-item>
      <a-form-item label="发送时间" name="senderTime">
        <a-input v-model:value="form.senderTime" :disabled="showable" placeholder="请输入发送时间" />
      </a-form-item>
      <a-form-item label="消息类型" name="receiveType">
        <a-input v-model:value="form.receiveType" :disabled="showable" placeholder="请输入消息类型" />
      </a-form-item>
      <a-form-item label="发布状态" name="sendState">
        <a-input v-model:value="form.sendState" :disabled="showable" placeholder="请输入发布状态" />
      </a-form-item>
      <a-form-item label="截至有效期" name="efficientTime">
        <a-input v-model:value="form.efficientTime" :disabled="showable" placeholder="请输入截至有效期" />
      </a-form-item>
      <a-form-item label="撤回时间" name="cancelTime">
        <a-input v-model:value="form.cancelTime" :disabled="showable" placeholder="请输入撤回时间" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { nextTick, reactive } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, get, update, SiteMessage } from './SiteMessage.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'

  const {
    initFormModel,
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
  let form = $ref({
    id: null,
    title: null,
    content: null,
    senderId: null,
    senderName: null,
    senderTime: null,
    receiveType: null,
    sendState: null,
    efficientTime: null,
    cancelTime: null,
  } as SiteMessage)
  // 校验
  const rules = reactive({} as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType) {
    initFormModel(id, editType)
    resetForm()
    getInfo(id, editType)
  }
  // 获取信息
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form = data
        confirmLoading.value = false
      })
    } else {
      confirmLoading.value = false
    }
  }
  // 保存
  function handleOk() {
    formRef.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(form)
      } else if (formEditType.value === FormEditType.Edit) {
        await update(form)
      }
      confirmLoading.value = false
      handleCancel()
      emits('ok')
    })
  }

  // 重置表单的校验
  function resetForm() {
    nextTick(() => {
      formRef.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
