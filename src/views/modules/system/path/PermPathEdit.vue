<template>
  <basic-modal
    v-bind="$attrs"
    :width="modalWidth"
    :loading="confirmLoading"
    :title="title"
    :visible="visible"
    :mask-closable="false"
    @cancel="handleCancel"
  >
    <a-form class="small-from-item" ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="主键" name="id" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item name="generate" :hidden="true">
        <a-switch v-model:checked="form.generate" />
      </a-form-item>
      <a-form-item label="请求路径" name="path">
        <a-input v-model:value="form.path" :disabled="showable" placeholder="请输入请求路径" />
      </a-form-item>
      <a-form-item label="请求类型" name="requestType">
        <a-select v-model:value="form.requestType" :disabled="showable || form.generate">
          <a-select-option value="GET">GET</a-select-option>
          <a-select-option value="POST">POST</a-select-option>
          <a-select-option value="DELETE">DELETE</a-select-option>
          <a-select-option value="PUT">PUT</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="权限名称" name="name">
        <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入权限名称" />
      </a-form-item>
      <a-form-item label="权限标识" name="code">
        <a-input v-model:value="form.code" :disabled="showable" placeholder="请输入权限标识" />
      </a-form-item>
      <a-form-item label="分组名称" name="groupName">
        <a-input v-model:value="form.groupName" :disabled="showable" placeholder="请输入分组名称" />
      </a-form-item>
      <a-form-item label="启用鉴权" name="enable">
        <a-switch checked-children="开" un-checked-children="关" v-model:checked="form.enable" :disabled="showable" />
      </a-form-item>
      <a-form-item label="描述" name="remark">
        <a-textarea v-model:value="form.remark" :disabled="showable" placeholder="请输入描述" />
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
  import { add, get, update, PermPath } from './PermPath.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'

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
  let form = $ref({
    id: null,
    code: '',
    name: '',
    requestType: 'GET',
    path: '',
    groupName: '',
    enable: true,
    generate: false,
    remark: '',
  } as PermPath)
  // 校验
  const rules = reactive({
    code: [{ required: true, message: '请求权限编码必填', trigger: ['blur', 'change'] }],
    name: [{ required: true, message: '请求权限名称必填', trigger: ['blur', 'change'] }],
    requestType: [{ required: true, message: '请求类型必填', trigger: ['blur', 'change'] }],
    path: [{ required: true, message: '请求路径必填', trigger: ['blur', 'change'] }],
    enable: [{ required: true, message: '启用鉴权必选', trigger: ['blur', 'change'] }],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    console.log(form.generate)
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
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
