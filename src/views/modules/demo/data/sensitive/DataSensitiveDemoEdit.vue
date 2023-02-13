<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-form
      class="small-from-item"
      ref="formRef"
      :model="form"
      :rules="rules"
      :validate-trigger="['blur', 'change']"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="主键" name="id" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item label="中文名字" name="chineseName">
        <a-input v-model:value="form.chineseName" :disabled="showable" placeholder="请输入中文名字" />
      </a-form-item>
      <a-form-item label="密码" name="password">
        <a-input v-model:value="form.password" :disabled="showable" placeholder="请输入密码" />
      </a-form-item>
      <a-form-item label="身份证号" name="idCard">
        <a-input v-model:value="form.idCard" :disabled="showable" placeholder="请输入身份证号" />
      </a-form-item>
      <a-form-item label="手机号" name="mobilePhone">
        <a-input v-model:value="form.mobilePhone" :disabled="showable" placeholder="请输入手机号" />
      </a-form-item>
      <a-form-item label="车牌号" name="carLicense">
        <a-input v-model:value="form.carLicense" :disabled="showable" placeholder="请输入车牌号" />
      </a-form-item>
      <a-form-item label="电子邮件" name="email">
        <a-input v-model:value="form.email" :disabled="showable" placeholder="请输入电子邮件" />
      </a-form-item>
      <a-form-item label="其他" name="other">
        <a-input v-model:value="form.other" :disabled="showable" placeholder="请输入其他" />
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
  import { add, get, update, DataSensitiveDemo } from './DataSensitiveDemo.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
  const {
    initFormEditType,
    handleCancel,
    search,
    diffForm,
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
  let form = $ref<DataSensitiveDemo>({
    id: null,
    chineseName: '',
    password: '',
    idCard: '',
    mobilePhone: '',
    carLicense: '',
    email: '',
    other: '',
  })
  let rawForm
  // 校验
  const rules = reactive({} as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
  }
  // 获取信息
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        rawForm = { ...data }
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
        await update({
          ...form,
          ...diffForm(rawForm, form, 'chineseName', 'password', 'idCard', 'mobilePhone', 'carLicense', 'email', 'other'),
        })
      }
      confirmLoading.value = false
      handleCancel()
      emits('ok')
    })
  }

  // 重置表单
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
