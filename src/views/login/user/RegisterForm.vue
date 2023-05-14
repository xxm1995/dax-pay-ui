<template>
  <template v-if="getShow">
    <login-form-title class="enter-x" />
    <a-spin :spinning="loading">
      <a-form class="p-4 enter-x" :model="form" :validate-trigger="['blur', 'change']" :rules="rules" ref="formRef">
        <a-form-item validate-first name="username" class="enter-x">
          <a-input class="fix-auto-fill" size="large" v-model:value="form.username" placeholder="账号" />
        </a-form-item>
        <a-form-item validate-first name="password" class="enter-x">
          <strength-meter size="large" v-model:value="form.password" placeholder="密码" @change="validateToNextPassword" />
        </a-form-item>
        <a-form-item validate-first name="confirmPassword" class="enter-x">
          <a-input-password size="large" visibilityToggle v-model:value="form.confirmPassword" placeholder="确认密码" />
        </a-form-item>
        <a-row :span="12" class="enter-x">
          <a-col :span="16">
            <a-form-item name="captcha" class="enter-x">
              <a-input size="large" placeholder="验证码" v-model:value="form.captcha" style="min-width: 100px" />
            </a-form-item>
          </a-col>
          <a-col :span="8" style="text-align: right">
            <a-form-item :style="{ 'text-align': 'right', 'margin-left': '20px' }" class="enter-x">
              <img style="margin-top: 2px" :src="captchaData" @click="getCaptcha" alt="验证码" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <a-button type="primary" class="enter-x" size="large" block @click="handleSubmit" :loading="loading"> 注册 </a-button>
    <a-button size="large" block class="mt-4 enter-x" @click="handleBackLogin"> 返回 </a-button>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed, onMounted, watch } from 'vue'
  import LoginFormTitle from '../LoginFormTitle.vue'
  import { StrengthMeter } from '/@/components/StrengthMeter'
  import { useLoginState, LoginStateEnum } from '../useLogin'
  import { $ref } from 'vue/macros'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { imgCaptcha } from '/@/api/common/Captcha'
  import { existsUsername } from '/@/api/sys/userAssist'
  import { register } from '/@/api/sys/user'
  import { useMessage } from '/@/hooks/web/useMessage'

  const { handleBackLogin, getLoginState } = useLoginState()
  const getShow = computed(() => {
    const f = unref(getLoginState) === LoginStateEnum.REGISTER
    if (f) {
      getCaptcha()
    }
    return f
  })
  watch(
    () => getShow,
    (value) => {
      console.log(value)
    },
  )

  const { createMessage } = useMessage()

  const formRef = $ref<FormInstance>()
  let loading = $ref(false)
  let captchaData = $ref('')
  let confirmDirty = $ref(false)
  const form = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    captchaKey: '',
    captcha: '',
  })

  const rules = {
    username: [{ required: true, message: '请输入登录账号!' }, { validator: checkUsername }],
    password: [{ required: true, message: '请输入登录密码!' }],
    confirmPassword: [{ required: true, message: '请重新输入登录密码!' }, { validator: compareToFirstPassword }],
    captcha: [{ required: true, message: '请输入验证码!' }],
  } as Record<string, Rule[]>

  /**
   * 获取验证码
   */
  function getCaptcha() {
    imgCaptcha().then(({ data }) => {
      captchaData = data.captchaData
      form.captchaKey = data.captchaKey
    })
  }
  /**
   * 用户名检查
   */
  async function checkUsername() {
    const { data } = await existsUsername(form.username)
    return data ? Promise.reject('用户名已存在!') : Promise.resolve()
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
   * 注册
   */
  async function handleSubmit() {
    await formRef?.validate().catch()
    loading = true
    try {
      await register(form).then(() => {
        createMessage.success('注册成功')
        handleBackLogin()
      })
      formRef?.resetFields()
    } finally {
      loading = false
    }
  }
</script>
