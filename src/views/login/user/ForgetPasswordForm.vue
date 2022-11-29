<template>
  <template v-if="getShow">
    <login-form-title class="enter-x" />
    <a-steps class="steps" :current="currentTab">
      <a-step title="手机验证" />
      <a-step title="更改密码" />
    </a-steps>
    <a-form class="p-4 enter-x" :model="form" :rules="rules" :validate-trigger="['blur', 'change']" ref="formRef">
      <a-form-item validate-first name="phone" v-show="currentTab === 0" class="enter-x">
        <a-input size="large" v-model:value="form.phone" placeholder="手机号码" />
      </a-form-item>
      <a-form-item validate-first name="captcha" v-show="currentTab === 0">
        <count-down-input size="large" v-model:value="form.captcha" :send-code-api="sendCaptcha" :count="120" placeholder="短信验证码" />
      </a-form-item>
      <a-form-item class="enter-x" name="username" v-show="currentTab === 1">
        <a-input disabled size="large" v-model:value="form.username" />
      </a-form-item>
      <a-form-item validate-first class="enter-x" name="password" v-show="currentTab === 1">
        <strength-meter v-model:value="form.password" placeholder="请输入新的登录密码" @change="validateToNextPassword" />
      </a-form-item>
      <a-form-item validate-first class="enter-x" name="confirmPassword" v-show="currentTab === 1">
        <a-input-password v-model:value="form.confirmPassword" placeholder="请重复输入新密码" />
      </a-form-item>

      <a-form-item class="enter-x">
        <a-button v-show="currentTab === 0" type="primary" size="large" block @click="nextStep" :loading="loading"> 下一步 </a-button>
        <a-button v-show="currentTab === 1" type="primary" size="large" block @click="handleOk" :loading="loading"> 重置密码 </a-button>
        <a-button size="large" block class="mt-4" @click="handleBackLogin"> 返回登录 </a-button>
      </a-form-item>
    </a-form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, computed, unref } from 'vue'
  import LoginFormTitle from '../LoginFormTitle.vue'
  import { useLoginState, LoginStateEnum } from '../useLogin'
  import { $ref } from 'vue/macros'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { findUsernameByPhoneCaptcha, sendPhoneForgetCaptcha, validatePhoneForgetCaptcha } from '/@/api/sys/userAssist'
  import CountDownInput from '/@/components/CountDown/src/CountdownInput.vue'
  import StrengthMeter from '/@/components/StrengthMeter/src/StrengthMeter.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { validateMobile } from '/@/utils/validate'
  import { forgetPasswordByPhone } from '/@/api/sys/user'

  const { handleBackLogin, getLoginState } = useLoginState()
  const { createMessage } = useMessage()
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD)

  const formRef = $ref<FormInstance>()
  let loading = $ref(false)
  let confirmDirty = $ref(false)
  let currentTab = $ref(0)

  const form = reactive({
    username: '',
    phone: '',
    captcha: '',
    password: '',
    confirmPassword: '',
  })

  const rules = computed(() => {
    return {
      phone: [
        { required: true, message: '请输入手机号!' },
        { validator: validatePhone, trigger: 'change' },
      ],
      captcha: [
        { required: currentTab === 0, message: '请输入验证码!' },
        { validator: currentTab === 0 ? validatePhoneForgetCaptchaRule : null, trigger: 'blur' },
      ],
      password: [{ required: currentTab === 1, message: '请输入新密码!' }],
      confirmPassword: [
        { required: currentTab === 1, message: '请重新输入新密码!' },
        { validator: currentTab === 1 ? compareToFirstPassword : null },
      ],
    } as Record<string, Rule[]>
  })

  /**
   * 校验手机号
   */
  function validatePhone() {
    const { msg, result } = validateMobile(form.phone)
    return result ? Promise.resolve() : Promise.reject(msg)
  }

  /**
   * 校验验证码
   */
  async function validatePhoneForgetCaptchaRule() {
    const { data } = await validatePhoneForgetCaptcha(form.phone, form.captcha)
    return data ? Promise.resolve() : Promise.reject('短信验证码不正确')
  }

  /**
   * 密码检查
   */
  function validateToNextPassword() {
    if (confirmDirty) {
      formRef?.validateFields(['confirmPassword'])
    }
  }
  function compareToFirstPassword() {
    if (form.confirmPassword !== form.password) {
      confirmDirty = true
      return Promise.reject('密码不一致')
    } else {
      return Promise.resolve()
    }
  }

  /**
   * 获取验证码
   */
  async function sendCaptcha() {
    try {
      await formRef?.validateFields(['phone'])
      const { code } = await sendPhoneForgetCaptcha(form.phone)
      if (!code) {
        createMessage.success('发送验证码成功')
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  /**
   * 根据手机号和验证码获取用户
   */
  function getUsernameByCaptcha() {
    findUsernameByPhoneCaptcha(form.phone, form.captcha).then(({ data }) => {
      form.username = data
    })
  }

  /**
   * 下一步
   */
  function nextStep() {
    formRef?.validate().then(async () => {
      loading = true
      await getUsernameByCaptcha()
      currentTab = 1
      loading = false
    })
  }

  /**
   * 提交
   */
  async function handleOk() {
    await formRef?.validate()
    loading = true
    forgetPasswordByPhone({
      phone: form.phone,
      captcha: form.captcha,
      password: form.password,
    }).then(() => {
      loading = false
      createMessage.success('密码修改成功')
      formRef?.resetFields()
      currentTab = 0
      handleBackLogin()
    })
  }
</script>
<style lang="less" scoped>
  .steps {
    max-width: 360px;
    margin: 10px auto 30px;
  }
</style>
