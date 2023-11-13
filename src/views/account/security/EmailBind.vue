<template>
  <basic-modal
    title="邮箱绑定"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="640"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :validate-trigger="['blur', 'change']"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item validateFirst label="邮箱号" name="email">
          <a-input v-model:value="form.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item validateFirst label="验证码" name="captcha">
          <count-down-input v-model:value="form.captcha" :send-code-api="sendEmailCaptcha" :count="120">获取验证码</count-down-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </basic-modal>
</template>

<script lang="ts" setup>
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { $ref } from 'vue/macros'
  import { nextTick, reactive } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { existsEmail, sendEmailChangeCaptcha, validateEmailChangeCaptcha } from '/@/api/sys/userAssist'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { validateEmail } from '/@/utils/validate'
  import { bindEmail } from '/@/views/account/account.api'
  import CountDownInput from '/@/components/CountDown/src/CountdownInput.vue'
  import { useIntervalFn } from '@vueuse/core'

  const emits = defineEmits(['ok'])
  const { visible, confirmLoading, modalWidth, labelCol, wrapperCol, handleCancel } = useFormEdit()
  const { createMessage, createConfirm } = useMessage()
  let form = $ref({
    email: '',
    captcha: '',
  })
  const rules = {
    email: [
      { required: true, message: '请输入新邮箱号!' },
      { validator: validateEmailRule },
      { validator: validateBindEmail, trigger: 'blur' },
    ],
    captcha: [
      { required: true, message: '请输入验证码!' },
      { validator: validateCaptcha, trigger: 'blur' },
    ],
  } as Record<string, Rule[]>

  const state = reactive({
    captcha: false,
    captchaTime: 120,
  })
  const formRef = $ref<FormInstance>()

  /**
   * 初始化
   */
  function init() {
    visible.value = true
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  /**
   * 保存
   */
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      bindEmail(form.email, form.captcha).then(() => {
        confirmLoading.value = false
        emits('ok')
        visible.value = false
      })
    })
  }

  /**
   * 校验邮箱号
   */
  function validateEmailRule() {
    const { email } = form
    const { msg, result } = validateEmail(email)
    return result ? Promise.resolve() : Promise.reject(msg)
  }
  /**
   * 后台校验邮箱号是否被使用
   */
  async function validateBindEmail() {
    const { email } = form
    const { data } = await existsEmail(email)
    return data ? Promise.reject('邮箱已被使用') : Promise.resolve()
  }
  /**
   * 验证码校验 新
   */
  async function validateCaptcha() {
    const { captcha } = form
    const { data } = await validateEmailChangeCaptcha(form.email, captcha)
    return data ? Promise.resolve() : Promise.reject('验证码错误')
  }
  /**
   * 发送验证码 绑定邮箱
   */
  function sendEmailCaptcha() {
    formRef?.validateFields('email').then(async () => {
      sendEmailChangeCaptcha(form.email).then(() => {
        createMessage.success('发送验证码成功')
        state.captcha = true
      })
    })
  }
  defineExpose({ init })
</script>

<style scoped></style>
