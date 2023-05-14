<template>
  <template v-if="getShow">
    <login-form-title class="enter-x" />
    <a-spin :spinning="loading">
      <a-form class="p-4 enter-x" :model="form" :rules="rules" :validate-trigger="['blur', 'change']" ref="formRef">
        <a-form-item name="phone" class="enter-x">
          <a-input size="large" v-model:value="form.phone" placeholder="手机号码" class="fix-auto-fill" />
        </a-form-item>
        <a-form-item name="smsCaptcha" class="enter-x">
          <count-down-input
            :send-code-api="getCaptcha"
            :count="120"
            size="large"
            class="fix-auto-fill"
            v-model:value="form.smsCaptcha"
            placeholder="短信验证码"
          />
        </a-form-item>
      </a-form>
    </a-spin>
    <a-button type="primary" size="large" block @click="handleOk" :loading="loading"> 登录 </a-button>
    <a-button size="large" block class="mt-4" @click="handleBackLogin"> 返回 </a-button>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, computed, unref, onMounted } from 'vue'
  import LoginFormTitle from './LoginFormTitle.vue'
  import { useLoginState, LoginStateEnum } from './useLogin'
  import { $ref } from 'vue/macros'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import CountDownInput from '/@/components/CountDown/src/CountdownInput.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { sendLoginSmsCode } from '/@/api/sys/userAssist'
  import { useUserStore } from '/@/store/modules/user'
  import { LoginParams } from '/@/api/sys/model/userModel'
  import { getAppEnvConfig } from '/@/utils/env'
  import { validateMobile } from '/@/utils/validate'

  const { handleBackLogin, getLoginState } = useLoginState()
  const { createMessage } = useMessage()
  const { notification } = useMessage()
  const userStore = useUserStore()

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.MOBILE)
  const formRef = $ref<FormInstance>()
  let loading = $ref(false)

  const form = reactive({
    client: '',
    loginType: 'phone',
    phone: '',
    smsCaptcha: '',
  })
  const rules = {
    phone: [{ required: true, message: '请输入手机号' }, { validator: validatePhone }],
    smsCaptcha: [{ required: true, message: '请输入验证码' }],
  } as Record<string, Rule[]>

  /**
   * 初始化
   */
  onMounted(() => {
    // 终端编码
    const { VITE_GLOB_APP_CLIENT } = getAppEnvConfig()
    form.client = VITE_GLOB_APP_CLIENT
  })

  /**
   * 校验手机号
   */
  function validatePhone() {
    const { msg, result } = validateMobile(form.phone)
    return result ? Promise.resolve() : Promise.reject(msg)
  }

  /**
   * 获取手机验证码
   */
  async function getCaptcha() {
    try {
      await formRef?.validateFields('phone')
      const { code } = await sendLoginSmsCode(form.phone)
      if (code) {
        return false
      } else {
        createMessage.success('验证码获取成功，请查看短信')
        return true
      }
    } catch (e) {
      return false
    }
  }

  /**
   * 登录
   */
  async function handleOk() {
    try {
      await formRef?.validate()
      loading = true
      const token = await userStore.login(form as LoginParams)
      if (token) {
        notification.success({
          message: '登录成功',
          description: '欢迎回来',
          duration: 3,
        })
      }
    } finally {
      loading = false
    }
  }
</script>
