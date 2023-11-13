import type { UserInfo } from '/#/store'
import { defineStore } from 'pinia'
import { store } from '/@/store'
import { clearAuthCache, getAuthCache, setAuthCache } from '/@/utils/auth'
import { PageEnum } from '/@/enums/pageEnum'
import { LoginParams } from '/@/api/sys/model/userModel'
import { doLogout, login } from '/@/api/sys/login'
import { useMessage } from '/@/hooks/web/useMessage'
import { router } from '/@/router'
import { h } from 'vue'
import { getFilePreviewUrlPrefix } from '/@/api/common/FileUpload'
import { getUserInfo } from '/@/api/sys/user'
import { userLogoutAction } from '/@/store/action/userAction'
import { TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum'

interface UserState {
  userInfo: Nullable<UserInfo>
  token?: string
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // 用户信息
    userInfo: null,
    // token
    token: undefined,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {}
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY)
    },
  },
  actions: {
    /**
     * 设置token
     */
    setToken(info: string | undefined) {
      this.token = info ? info : ''
      setAuthCache(TOKEN_KEY, info)
    },
    /**
     * 保存用户信息, 不要直接使用
     * 使用 UserStoreUtil 中的包装方法来处理
     */
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info
      setAuthCache(USER_INFO_KEY, info)
    },
    /**
     * 重置 Token和用户状态
     */
    resetState() {
      this.userInfo = null
      this.token = ''
      clearAuthCache()
    },
    /**
     * 登录方法
     */
    async login(params: LoginParams) {
      try {
        const to = router.currentRoute.value
        const { data: token } = await login(params)
        // 保存token
        this.setToken(token)
        // 跳转路由
        await router.replace((to.query?.redirect as string) || '/')
        return token
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * 刷新登陆后用户信息
     */
    async refreshUserInfoAction() {
      if (!this.getToken) return null
      const { data: userInfo } = await getUserInfo()
      // 设置头像
      const { data: urlPrefix } = await getFilePreviewUrlPrefix()
      userInfo.avatar = userInfo.avatar ? urlPrefix + userInfo.avatar : ''
      this.setUserInfo(userInfo)
    },
    /**
     * 退出操作
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          // 服务端退出
          await doLogout()
        } catch {
          console.warn('注销Token失败')
        }
      }
      // 重置状态
      userLogoutAction()
      // 跳转到登录页
      goLogin && (await router.push(PageEnum.BASE_LOGIN))
    },

    /**
     * 是否进行退出弹窗
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage()
      createConfirm({
        iconType: 'warning',
        title: () => h('span', '温馨提醒'),
        content: () => h('span', '是否确认退出系统?'),
        onOk: async () => {
          await this.logout(true)
        },
      })
    },
  },
})

// setup 之外使用
export function useUserStoreWithOut() {
  return useUserStore(store)
}
