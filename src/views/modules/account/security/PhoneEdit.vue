<template>
  <basic-modal v-bind="$attrs" :loading="confirmLoading" :width="640" title="密码修改" :visible="visible" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-steps class="steps" :current="currentTab">
        <a-step title="验证手机" />
        <a-step title="绑定新手机" />
      </a-steps>
      <a-form ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="手机号" v-show="currentTab === 0">
          <span>{{ phone }}</span>
        </a-form-item>
        <a-form-item label="验证码" name="oldCaptcha" v-show="currentTab === 0">
          <a-input :maxLength="8" placeholder="验证码" v-model:value="form.oldCaptcha">
            <template #addonAfter>
              <a-button size="small" type="link" :disabled="state.oldCaptcha" href="javascript:" @click="sendOldPhoneCaptcha">
                {{ (!state.oldCaptcha && '获取验证码') || '请等待 ' + (state.oldCaptchaTime + ' s') }}
              </a-button>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="手机号" name="phone" v-show="currentTab === 1">
          <a-input v-model:value="form.phone" placeholder="手机号" />
        </a-form-item>
        <a-form-item label="验证码" name="newCaptcha" v-show="currentTab === 1">
          <a-input :maxLength="8" placeholder="验证码" v-model:value="form.newCaptcha">
            <template #addonAfter>
              <a-button size="small" type="link" :disabled="state.newCaptcha" href="javascript:" @click="sendNewPhoneCaptcha">
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
  import {
    existsPhone,
    sendCurrentPhoneChangeCaptcha,
    sendPhoneChangeCaptcha,
    validateCurrentPhoneChangeCaptcha,
    validatePhoneChangeCaptcha,
  } from '/@/api/sys/userAssist'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { validateMobile } from '/@/utils/validate'
  import { updatePhone } from '/@/api/sys/user'

  const props = defineProps({
    phone: String,
  })

  const emits = defineEmits(['ok'])
  const { visible, confirmLoading, modalWidth, labelCol, wrapperCol, handleCancel } = useFormEdit()
  const { createMessage, createConfirm } = useMessage()
  let currentTab = $ref(0)
  let form = $ref({
    phone: '',
    oldCaptcha: '',
    newCaptcha: '',
  })
  const rules = computed(() => {
    return {
      phone: [
        { required: currentTab === 1, message: '请输入新手机号!' },
        { validator: validatePhone, trigger: 'change' },
        { validator: validateNewPhone, trigger: 'blur' },
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
      updatePhone(form).then(() => {
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
    if (currentTab !== 1 || !phone) {
      return Promise.resolve()
    }
    const { msg, result } = validateMobile(phone)
    result ? Promise.resolve() : Promise.reject(msg)
  }
  /**
   * 后台校验手机号是否被使用
   */
  async function validateNewPhone() {
    const { phone } = form
    if (currentTab !== 1) {
      return Promise.resolve()
    }
    const { msg, result } = validateMobile(phone)
    // 手机号验证
    if (result) {
      return Promise.reject(msg)
    }
    const { data } = await existsPhone(phone)
    return data ? Promise.reject('手机号已被使用') : Promise.resolve()
  }
  /**
   * 验证码校验 旧
   */
  async function validateOldCaptcha() {
    const { oldCaptcha } = form
    if (!oldCaptcha) {
      return Promise.resolve()
    }
    const { data } = await validateCurrentPhoneChangeCaptcha(oldCaptcha)
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
    const { data } = await validatePhoneChangeCaptcha(form.phone, newCaptcha)
    return data ? Promise.resolve() : Promise.reject('验证码错误')
  }
  /**
   *  发送验证码 旧
   */
  function sendOldPhoneCaptcha() {
    sendCurrentPhoneChangeCaptcha().then(() => {
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
  function sendNewPhoneCaptcha() {
    formRef.validateFields('phone').then(async () => {
      sendPhoneChangeCaptcha(form.phone).then(() => {
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
