<template>
  <basic-modal :loading="confirmLoading" v-bind="$attrs" :title="title" :visible="visible" :mask-closable="showable" @cancel="handleCancel">
    <a-form class="small-from-item" :model="form" ref="formRef" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="主键" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item label="编码" name="permCode">
        <a-input v-model:value="form.permCode" :disabled="showable" placeholder="请输入编码" />
      </a-form-item>
      <a-form-item label="名称" name="title">
        <a-input v-model:value="form.title" :disabled="showable" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="是否有效" name="effect">
        <a-switch :disabled="showable" checkedChildren="是" unCheckedChildren="否" v-model:checked="form.effect" />
      </a-form-item>
      <a-form-item label="说明" name="remark">
        <a-textarea v-model:value="form.remark" :disabled="showable" placeholder="请输入说明" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { $ref } from 'vue/macros'
  import { nextTick } from 'vue'
  import { add, get, Resource, update } from './Menu.api'
  import { BasicModal } from '/@/components/Modal/'

  const { initFormModel, handleCancel, search, labelCol, wrapperCol, title, confirmLoading, visible, editable, showable, formEditType } =
    useFormEdit()

  let form = $ref({
    id: null,
    parentId: null,
    title: '',
    permCode: '',
    effect: true,
    menuType: 2,
    sortNo: 0,
    remark: '',
  } as Resource)
  const rules = {
    title: [{ required: true, message: '请输入权限名称', trigger: ['blur', 'change'] }],
    permCode: [{ required: true, message: '请输入权限编码', trigger: ['blur', 'change'] }],
    effect: [{ required: true, message: '' }],
  } as Record<string, Rule[]>
  const formRef: FormInstance = $ref()

  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType, clientCode) {
    initFormModel(id, editType)
    resetForm()
    form.clientCode = clientCode
    getInfo(id, editType)
  }

  // 获取信息
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form = data as Resource
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

<style scoped></style>
