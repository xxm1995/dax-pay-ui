<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="640"
    title="手机号绑定"
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
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="form.phone" placeholder="手机号" />
        </a-form-item>
        <a-form-item label="验证码" name="captcha">
          <a-input :maxLength="8" placeholder="验证码" v-model:value="form.captcha">
            <template #addonAfter>
              <a-button size="small" type="link" :disabled="state.captcha" href="javascript:" @click="sendPhoneCaptcha">
                {{ (!state.captcha && '获取验证码') || '请等待 ' + (state.captchaTime + ' s') }}
              </a-button>
            </template>
          </a-input>
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
  import { existsPhone, sendPhoneChangeCaptcha, validatePhoneChangeCaptcha } from '/@/api/sys/userAssist'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { validateMobile } from '/@/utils/validate'
  import { bindPhone } from '/@/views/account/account.api'

  const emits = defineEmits(['ok'])
  const { visible, confirmLoading, modalWidth, labelCol, wrapperCol, handleCancel } = useFormEdit()
  const { createMessage, createConfirm } = useMessage()
  let form = $ref({
    phone: '',
    captcha: '',
  })
  const rules = {
    phone: [
      { required: true, message: '请输入新手机号!' },
      { validator: validatePhone },
      { validator: validateBindPhone, trigger: 'blur' },
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
  function init() {
    visible.value = true
    nextTick(() => {
      formRef.resetFields()
    })
  }
  /**
   * 保存
   */
  function handleOk() {
    formRef.validate().then(async () => {
      confirmLoading.value = true
      bindPhone(form.phone, form.captcha).then(() => {
        confirmLoading.value = false
        emits('ok')
        visible.value = false
      })
    })
  }

  /**
   * 校验手机号
   */
  function validatePhone() {
    const { phone } = form
    if (!phone) {
      return Promise.resolve()
    }
    const { msg, result } = validateMobile(phone)
    return result ? Promise.resolve() : Promise.reject(msg)
  }
  /**
   * 后台校验手机号是否被使用
   */
  async function validateBindPhone() {
    const { phone } = form
    if (!phone) {
      return Promise.resolve()
    }
    const { msg, result } = validateMobile(phone)
    // 手机号验证
    if (!result) {
      return Promise.reject(msg)
    }
    const { data } = await existsPhone(phone)
    return data ? Promise.reject('手机号已被使用') : Promise.resolve()
  }
  /**
   * 验证码校验 新
   */
  async function validateCaptcha() {
    const { captcha } = form
    if (!captcha) {
      return Promise.resolve()
    }
    const { data } = await validatePhoneChangeCaptcha(form.phone, captcha)
    return data ? Promise.resolve() : Promise.reject('验证码错误')
  }
  /**
   * 发送验证码 绑定邮箱
   */
  function sendPhoneCaptcha() {
    formRef.validateFields('phone').then(async () => {
      sendPhoneChangeCaptcha(form.phone).then(() => {
        createMessage.success('发送验证码成功')
        state.captcha = true
        const interval = window.setInterval(() => {
          if (state.captchaTime-- <= 0) {
            state.captchaTime = 120
            state.captcha = false
            window.clearInterval(interval)
          }
        }, 1000)
      })
    })
  }
  defineExpose({ init })
</script>

<style scoped></style>
