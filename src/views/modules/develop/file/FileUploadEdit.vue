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
    <a-form class="small-from-item" ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="主键" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item label="存储位置" name="filePath">
        <a-input v-model:value="form.filePath" :disabled="showable" placeholder="请输入存储位置" />
      </a-form-item>
      <a-form-item label="文件名称" name="fileName">
        <a-input v-model:value="form.fileName" :disabled="showable" placeholder="请输入文件名称" />
      </a-form-item>
      <a-form-item label="文件类型" name="fileType">
        <a-input v-model:value="form.fileType" :disabled="showable" placeholder="请输入文件类型" />
      </a-form-item>
      <a-form-item label="文件后缀" name="fileSuffix">
        <a-input v-model:value="form.fileSuffix" :disabled="showable" placeholder="请输入文件后缀" />
      </a-form-item>
      <a-form-item label="文件大小" name="fileSize">
        <a-input v-model:value="form.fileSize" :disabled="showable" placeholder="请输入文件大小" />
      </a-form-item>
      <a-form-item label="外部关联id" name="externalStorageId">
        <a-input v-model:value="form.externalStorageId" :disabled="showable" placeholder="请输入外部关联id" />
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
  import { add, get, update, FileUpload } from './FileUpload.api'
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
    filePath: null,
    fileName: null,
    fileType: null,
    fileSuffix: null,
    fileSize: null,
    externalStorageId: null,
  } as FileUpload)
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
