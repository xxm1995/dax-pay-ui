import { useUserStoreWithOut } from '@/store/modules/user'
import { computed } from 'vue'
import { getAppEnvConfig } from '@/utils/env'

const useUserStore = useUserStoreWithOut()
const { VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX } = getAppEnvConfig()

export function useUpload(uploadUrl: string) {
  /**
   * 从 localstorage 获取 token
   */
  const tokenHeader = computed(() => {
    const token = useUserStore.getToken
    return {
      AccessToken: token,
    }
  })
  /**
   * 上传地址
   */
  const uploadAction = computed(() => {
    return VITE_GLOB_API_URL + VITE_GLOB_API_URL_PREFIX + uploadUrl
  })
  return {
    tokenHeader,
    uploadAction,
  }
}
