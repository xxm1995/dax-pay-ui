<template>
  <basic-modal v-bind="$attrs" :loading="confirmLoading" :width="640" title="密码修改" :visible="visible" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-steps class="steps" :current="currentTab">
        <a-step title="验证邮箱" />
        <a-step title="绑定新邮箱" />
      </a-steps>
      <a-form ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="邮箱" v-show="currentTab === 0">
          <span>{{ email }}</span>
        </a-form-item>
        <a-form-item label="验证码" name="oldCaptcha" v-show="currentTab === 0">
          <a-input :maxLength="8" placeholder="验证码" v-model:value="form.oldCaptcha">
            <template #addonAfter>
              <a-button size="small" type="link" :disabled="state.oldCaptcha" href="javascript:" @click="sendOldEmailCaptcha">
                {{ (!state.oldCaptcha && '获取验证码') || '请等待 ' + (state.oldCaptchaTime + ' s') }}
              </a-button>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="邮箱" name="email" v-show="currentTab === 1">
          <a-input v-model:value="form.email" placeholder="邮箱" />
        </a-form-item>
        <a-form-item label="验证码" name="newCaptcha" v-show="currentTab === 1">
          <a-input :maxLength="8" placeholder="验证码" v-model:value="form.newCaptcha">
            <template #addonAfter>
              <a-button size="small" type="link" :disabled="state.newCaptcha" href="javascript:" @click="sendNewEmailCaptcha">
                {{ (!state.newCaptcha && '获取验证码') || '请等待 ' + (state.newCaptchaTime + ' s') }}
              </a-button>
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-button v-show="currentTab === 0" :loading="confirmLoading" @click="handleCancel">取消</a-button>
      <a-button v-show="currentTab === 0" :loading="confirmLoading" type="primary" @click="nextStep">下一步</a-button>
      <a-button v-show="currentTab === 1" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { $ref } from 'vue/macros'
  import { computed, nextTick, reactive } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { validateEmail, validateMobile } from '/@/utils/validate'
  import {
    existsEmail,
    sendCurrentEmailChangeCaptcha,
    sendEmailChangeCaptcha,
    validateCurrentEmailChangeCaptcha,
    validateEmailChangeCaptcha,
  } from '/@/api/sys/userAssist'
  import { updateEmail } from '/@/views/account/account.api'

  const props = defineProps({
    email: String,
  })

  const emits = defineEmits(['ok'])
  const { visible, confirmLoading, modalWidth, labelCol, wrapperCol, handleCancel } = useFormEdit()
  const { createMessage, createConfirm } = useMessage()
  let currentTab = $ref(0)
  let form = $ref({
    email: '',
    oldCaptcha: '',
    newCaptcha: '',
  })
  const rules = computed(() => {
    return {
      email: [
        { required: currentTab === 1, message: '请输入新邮箱!' },
        { validator: validateEmailRule, trigger: 'change' },
        { validator: validateNewEmail, trigger: 'blur' },
      ],
      oldCaptcha: [
        { required: true, message: '请输入验证码!' },
        { validator: validateOldCaptcha, trigger: 'blur' },
      ],
      newCaptcha: [
        { required: currentTab === 1, message: '请输入验证码!' },
        { validator: validateNewCaptcha, trigger: 'blur' },
      ],
    } as Record<string, Rule[]>
  })
  const state = reactive({
    oldCaptcha: false,
    newCaptcha: false,
    oldCaptchaTime: 120,
    newCaptchaTime: 120,
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
      updateEmail(form).then(() => {
        confirmLoading.value = false
        emits('ok')
        visible.value = false
      })
    })
  }

  /**
   * 校验邮箱
   */
  function validateEmailRule() {
    const { email } = form
    if (currentTab !== 1 || !email) {
      return Promise.resolve()
    }
    const { msg, result } = validateEmail(email)
    return result ? Promise.resolve() : Promise.reject(msg)
  }
  /**
   * 后台校验邮箱是否被使用
   */
  async function validateNewEmail() {
    const { email } = form
    if (currentTab !== 1) {
      return Promise.resolve()
    }
    const { msg, result } = validateMobile(email)
    // 邮箱验证
    if (!result) {
      return Promise.reject(msg)
    }
    const { data } = await existsEmail(email)
    return data ? Promise.reject('邮箱已被使用') : Promise.resolve()
  }
  /**
   * 验证码校验 旧
   */
  async function validateOldCaptcha() {
    const { oldCaptcha } = form
    if (!oldCaptcha) {
      return Promise.resolve()
    }
    const { data } = await validateCurrentEmailChangeCaptcha(oldCaptcha)
    return data ? Promise.resolve() : Promise.reject('验证码错误')
  }
  /**
   * 验证码校验 新
   */
  async function validateNewCaptcha() {
    const { newCaptcha } = form
    if (!(currentTab === 1 && newCaptcha)) {
      return Promise.resolve()
    }
    const { data } = await validateEmailChangeCaptcha(form.email, newCaptcha)
    return data ? Promise.resolve() : Promise.reject('验证码错误')
  }
  /**
   *  发送验证码 旧
   */
  function sendOldEmailCaptcha() {
    sendCurrentEmailChangeCaptcha().then(() => {
      createMessage.success('发送验证码成功')
      state.oldCaptcha = true
      const interval = window.setInterval(() => {
        if (state.oldCaptchaTime-- <= 0) {
          state.oldCaptchaTime = 120
          state.oldCaptcha = false
          window.clearInterval(interval)
        }
      }, 1000)
    })
  }
  /**
   * 发送验证码 新手机
   */
  function sendNewEmailCaptcha() {
    formRef.validateFields('email').then(async () => {
      sendEmailChangeCaptcha(form.email).then(() => {
        createMessage.success('发送验证码成功')
        state.newCaptcha = true
        const interval = window.setInterval(() => {
          if (state.newCaptchaTime-- <= 0) {
            state.newCaptchaTime = 120
            state.newCaptcha = false
            window.clearInterval(interval)
          }
        }, 1000)
      })
    })
  }

  /**
   * 下一步
   */
  function nextStep() {
    formRef.validate().then(() => {
      currentTab = 1
    })
  }
  defineExpose({ init })
</script>

<style lang="less" scoped>
  .steps {
    max-width: 360px;
    margin: 10px auto 30px;
  }
</style>
