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
    <a-form layout="vertical" ref="formRef" :validate-trigger="['blur', 'change']" :model="form" :rules="rules">
      <a-form-item label="主键" name="id" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item label="编码" name="code">
        <a-input v-model:value="form.code" :disabled="showable" placeholder="请输入编码" />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="模板类型" name="type">
        <a-select
          :disabled="showable"
          :options="messageTemplateTypes"
          allowClear
          v-model:value="form.type"
          style="width: 100%"
          placeholder="选择消息模板类型"
        />
      </a-form-item>
      <a-form-item label="模板内容" name="data">
        <div style="border: 1px solid #ccc">
          <code-editor style="height: 400px" v-model:value="form.data" :mode="MODE.HTML" />
        </div>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="form.remark" :disabled="showable" placeholder="请输入备注" />
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
  import { add, get, update, existsByCode, existsByCodeNotId, MessageTemplate } from './MessageTemplate.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useValidate } from '/@/hooks/bootx/useValidate'
  import CodeEditor from '/@/components/CodeEditor/src/CodeEditor.vue'
  import { MODE } from '/@/components/CodeEditor'

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
  const { dictDropDownNumber } = useDict()
  const { existsByServer } = useValidate()
  // 表单
  const formRef = $ref<FormInstance>()
  let messageTemplateTypes = $ref<LabeledValue[]>()
  let form = $ref<MessageTemplate>({
    id: null,
    code: '',
    name: '',
    data: '',
    type: 0,
    remark: '',
  })
  // 校验
  const rules = reactive({
    code: [
      { required: true, message: '请输入模板编码' },
      { validator: validateCode, trigger: 'blur' },
    ],
    name: [{ required: true, message: '请输入模板名称' }],
    date: [{ required: true, message: '请数据模板数据' }],
    type: [{ required: true, message: '请选择模板类型' }],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType) {
    initData()
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
  }
  async function initData() {
    messageTemplateTypes = await dictDropDownNumber('MessageTemplateCode')
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
    formRef?.validate().then(async () => {
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
      formRef?.resetFields()
    })
  }
  // 校验编码重复
  async function validateCode() {
    const { code, id } = form
    return existsByServer(code, id, formEditType, existsByCode, existsByCodeNotId)
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
