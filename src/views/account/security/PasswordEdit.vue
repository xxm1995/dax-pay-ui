<template>
  <basic-modal v-bind="$attrs" :loading="confirmLoading" :width="640" title="密码修改" :visible="visible" @cancel="handleCancel">
    <a-form
      ref="formRef"
      validateFirst
      :validate-trigger="['blur', 'change']"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="旧密码" name="oldPassword">
        <a-input-password v-model:value="form.oldPassword" placeholder="请输入原密码" />
      </a-form-item>
      <a-form-item label="新密码" name="newPassword">
        <strength-meter v-model:value="form.newPassword" placeholder="请输入新的登录密码" @change="validateNewPassword" />
      </a-form-item>
      <a-form-item label="重复密码" name="confirmPassword">
        <a-input-password v-model:value="form.confirmPassword" placeholder="请重复输入新密码" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { nextTick, reactive } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import StrengthMeter from '/@/components/StrengthMeter/src/StrengthMeter.vue'
  import { updatePassword } from '/@/views/account/account.api'

  const { visible, confirmLoading, modalWidth, labelCol, wrapperCol, handleCancel } = useFormEdit()

  let confirmDirty = $ref(false)

  let form = $ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const rules = reactive({
    oldPassword: [{ required: true, message: '请输入原密码!' }],
    newPassword: [{ required: true, message: '请输入新密码!' }],
    confirmPassword: [{ required: true, message: '请重新输入新密码!' }, { validator: validateConfirmPassword }],
  } as Record<string, Rule[]>)
  const formRef = $ref<FormInstance>()

  function init() {
    visible.value = true
    nextTick(() => {
      formRef?.resetFields()
    })
  }

  // 验证新密码
  function validateNewPassword() {
    if (confirmDirty) {
      formRef?.validateFields('confirmPassword')
    }
  }
  // 验证确认密码
  function validateConfirmPassword() {
    const { confirmPassword } = form
    if (!confirmPassword) {
      return Promise.resolve()
    }
    if (confirmPassword !== form.newPassword) {
      confirmDirty = true
      return Promise.reject('两次输入的密码不一样！')
    } else {
      return Promise.resolve()
    }
  }
  // 保存
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      await updatePassword(form.oldPassword, form.newPassword)
      confirmLoading.value = false
      handleCancel()
    })
  }

  defineExpose({
    init,
  })
</script>

<style scoped></style>
