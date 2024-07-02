import type { FormInstance } from 'ant-design-vue/lib/form/Form'
import type {
  RuleObject,
  NamePath,
  Rule as ValidationRule,
} from 'ant-design-vue/lib/form/interface'
import { ref, computed, unref, Ref } from 'vue'

export enum LoginStateEnum {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  MOBILE,
  QR_CODE,
}

const currentState = ref(LoginStateEnum.LOGIN)

export function useLoginState() {
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state
  }

  const getLoginState = computed(() => currentState.value)

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN)
  }

  return { setLoginState, getLoginState, handleBackLogin }
}

export function useFormValid<T extends Object = any>(formRef: Ref<FormInstance>) {
  const validate = computed(() => {
    const form = unref(formRef)
    return form?.validate ?? ((_nameList?: NamePath) => Promise.resolve())
  })

  async function validForm() {
    const form = unref(formRef)
    if (!form) return
    const data = await form.validate()
    return data as T
  }

  return { validate, validForm }
}

export function useFormRules(formData?: Recordable) {
  const getAccountFormRule = computed(() => createRule('请输入账号'))
  const getPasswordFormRule = computed(() => createRule('请输入密码'))
  const getSmsFormRule = computed(() => createRule('请输入验证码'))
  const getMobileFormRule = computed(() => createRule('请输入手机号码'))

  const validatePolicy = async (_: RuleObject, value: boolean) => {
    return !value ? Promise.reject('勾选后才能注册') : Promise.resolve()
  }

  const validateConfirmPassword = (password: string) => {
    return async (_: RuleObject, value: string) => {
      if (!value) {
        return Promise.reject('请输入密码')
      }
      if (value !== password) {
        return Promise.reject('两次输入密码不一致')
      }
      return Promise.resolve()
    }
  }

  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    const accountFormRule = unref(getAccountFormRule)
    const passwordFormRule = unref(getPasswordFormRule)
    const smsFormRule = unref(getSmsFormRule)
    const mobileFormRule = unref(getMobileFormRule)

    const mobileRule = {
      sms: smsFormRule,
      mobile: mobileFormRule,
    }
    switch (unref(currentState)) {
      // register form rules
      case LoginStateEnum.REGISTER:
        return {
          account: accountFormRule,
          password: passwordFormRule,
          confirmPassword: [
            { validator: validateConfirmPassword(formData?.password), trigger: 'change' },
          ],
          policy: [{ validator: validatePolicy, trigger: 'change' }],
          ...mobileRule,
        }

      // reset password form rules
      case LoginStateEnum.RESET_PASSWORD:
        return {
          account: accountFormRule,
          ...mobileRule,
        }

      // mobile form rules
      case LoginStateEnum.MOBILE:
        return mobileRule

      // login form rules
      default:
        return {
          account: accountFormRule,
          password: passwordFormRule,
        }
    }
  })
  return { getFormRules }
}

function createRule(message: string): ValidationRule[] {
  return [
    {
      required: true,
      message,
      trigger: 'change',
    },
  ]
}
