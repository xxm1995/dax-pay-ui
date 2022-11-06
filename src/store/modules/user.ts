import type { UserInfo } from '/#/store'
import { defineStore } from 'pinia'
import { store } from '/@/store'
import { RoleEnum } from '/@/enums/roleEnum'
import { PageEnum } from '/@/enums/pageEnum'
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum'
import { getAuthCache, setAuthCache } from '/@/utils/auth'
import { LoginParams } from '/@/api/sys/model/userModel'
import { doLogout, login } from '/@/api/sys/login'
import { useMessage } from '/@/hooks/web/useMessage'
import { router } from '/@/router'
import { usePermissionStore } from '/@/store/modules/permission'
import { RouteRecordRaw } from 'vue-router'
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic'
import { h } from 'vue'
import { getFilePreviewUrlPrefix } from '/@/api/common/FileUpload'
// @ts-ignore
import { getUserInfo } from '/@/api/sys/user'

interface UserState {
  userInfo: Nullable<UserInfo>
  token?: string
  roleList: RoleEnum[]
  sessionTimeout?: boolean
  lastUpdateTime: number
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {}
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY)
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY)
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime
    },
  },
  actions: {
    // token信息
    setToken(info: string | undefined) {
      this.token = info ? info : '' // for null or undefined value
      setAuthCache(TOKEN_KEY, info)
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList
      setAuthCache(ROLES_KEY, roleList)
    },
    /**
     * 保存用户信息, 不要直接使用
     * 使用 UserStoreUtil 中的包装方法来处理
     */
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info
      this.lastUpdateTime = new Date().getTime()
      setAuthCache(USER_INFO_KEY, info)
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag
    },
    resetState() {
      this.userInfo = null
      this.token = ''
      this.roleList = []
      this.sessionTimeout = false
    },
    /**
     * 登录方法
     */
    async login(params: LoginParams) {
      try {
        const { data: token } = await login(params)
        // 保存token
        this.setToken(token)
        await this.afterLoginAction(true)
        return token
      } catch (error) {
        return Promise.reject(error)
      }
    },
    /**
     * 登录后操作
     */
    async afterLoginAction(goHome?: boolean) {
      if (!this.getToken) return null
      // 获取用户信息
      await this.refreshUserInfoAction()
      const sessionTimeout = this.sessionTimeout
      // 超时
      if (sessionTimeout) {
        this.setSessionTimeout(false)
      } else {
        const permissionStore = usePermissionStore()
        if (!permissionStore.isDynamicAddedRoute) {
          // 构建路由
          const routes = await permissionStore.buildRoutesAction()
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw)
          })
          // 404路由
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw)
          permissionStore.setDynamicAddedRoute(true)
        }
        goHome && (await router.replace(PageEnum.BASE_HOME))
      }
    },
    // 刷新登陆后用户信息
    async refreshUserInfoAction() {
      if (!this.getToken) return null
      const { data: userInfo } = await getUserInfo()
      // 设置头像
      const { data: urlPrefix } = await getFilePreviewUrlPrefix()
      userInfo.avatar = userInfo.avatar ? urlPrefix + userInfo.avatar : ''
      this.setUserInfo(userInfo)
    },
    /**
     * 退出
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout()
        } catch {
          console.log('注销Token失败')
        }
      }
      this.setToken(undefined)
      this.setSessionTimeout(false)
      this.setUserInfo(null)
      goLogin && router.push(PageEnum.BASE_LOGIN)
    },

    /**
     * @description: Confirm before logging out
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

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store)
}
