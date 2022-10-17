<template>
  <a-modal :title="title" :width="720" :visible="visible" :maskClosable="false" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading" />
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { $ref } from 'vue/macros'
  import { nextTick } from 'vue'
  import { add, get, update } from '/@/views/modules/system/loginType/LoginType.api'

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
  })
  const formRef: FormInstance = $ref()

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
        form.value = data
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
        await add(form.value)
      } else if (formEditType.value === FormEditType.Edit) {
        await update(form.value)
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
