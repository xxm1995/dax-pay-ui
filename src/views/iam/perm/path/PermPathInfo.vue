<template></template>

<script lang="ts" setup>
  import { nextTick, reactive, ref } from 'vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { add, get, update, PermPath } from './PermPath.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '@/enums/formTypeEnum'

  const {
    initFormEditType,
    handleCancel,
    labelCol,
    wrapperCol,
    modalWidth,
    title,
    confirmLoading,
    visible,
    showable,
    formEditType,
  } = useFormEdit()
  // 表单
  const formRef = ref<FormInstance>()

  function show(id) {}
  defineExpose({
    show,
  })
</script>

<style lang="less" scoped></style>
