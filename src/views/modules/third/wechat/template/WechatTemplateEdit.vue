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
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="编码" name="code">
        <a-input v-model:value="form.code" :disabled="showable" placeholder="请输入编码" />
      </a-form-item>
      <a-form-item label="是否启用" name="enable">
        <a-input v-model:value="form.enable" :disabled="showable" placeholder="请输入是否启用" />
      </a-form-item>
      <a-form-item label="模板ID" name="templateId">
        <a-input v-model:value="form.templateId" :disabled="showable" placeholder="请输入模板ID" />
      </a-form-item>
      <a-form-item label="模板标题" name="title">
        <a-input v-model:value="form.title" :disabled="showable" placeholder="请输入模板标题" />
      </a-form-item>
      <a-form-item label="模板所属行业的一级行业" name="primaryIndustry">
        <a-input v-model:value="form.primaryIndustry" :disabled="showable" placeholder="请输入模板所属行业的一级行业" />
      </a-form-item>
      <a-form-item label="模板所属行业的二级行业" name="deputyIndustry">
        <a-input v-model:value="form.deputyIndustry" :disabled="showable" placeholder="请输入模板所属行业的二级行业" />
      </a-form-item>
      <a-form-item label="模板内容" name="content">
        <a-input v-model:value="form.content" :disabled="showable" placeholder="请输入模板内容" />
      </a-form-item>
      <a-form-item label="示例" name="example">
        <a-input v-model:value="form.example" :disabled="showable" placeholder="请输入示例" />
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
  import { add, get, update, WechatTemplate } from './WechatTemplate.api'
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
    name: null,
    code: null,
    enable: null,
    templateId: null,
    title: null,
    primaryIndustry: null,
    deputyIndustry: null,
    content: null,
    example: null,
  } as WechatTemplate)
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
