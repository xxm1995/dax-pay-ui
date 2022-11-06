import type { ValidationRule } from 'ant-design-vue/lib/form/Form'
import type { RuleObject } from 'ant-design-vue/lib/form/interface'
import { ref, computed, unref, Ref } from 'vue'
import { useI18n } from '/@/hooks/web/useI18n'

export enum LoginStateEnum {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  MOBILE,
  QR_CODE,
}

const currentState = ref(LoginStateEnum.LOGIN)

/**
 * 登录类型状态
 */
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
