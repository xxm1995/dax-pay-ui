import type { Router, RouteRecordRaw } from 'vue-router'

import { usePermissionStoreWithOut } from '/@/store/modules/permission'

import { PageEnum } from '/@/enums/pageEnum'
import { useUserStoreWithOut } from '/@/store/modules/user'

import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic'

import { initWebSocket } from "/@/logics/websocket/UserGlobalWebSocker";

const LOGIN_PATH = PageEnum.BASE_LOGIN

const whitePathList: PageEnum[] = [LOGIN_PATH]

/**
 * 路由守卫
 * @param router
 */
export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut()
  const permissionStore = usePermissionStoreWithOut()
  router.beforeEach(async (to, from, next) => {

    const token = userStore.getToken

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path as PageEnum)) {
      if (to.path === LOGIN_PATH && token) {
        const isSessionTimeout = userStore.getSessionTimeout
        try {
          await userStore.afterLoginAction()
          if (!isSessionTimeout) {
            next((to.query?.redirect as string) || '/')
            return
          }
        } catch {}
      }
      next()
      return
    }

    // token 不存在
    if (!token) {
      // 您可以在未经许可的情况下访问。您需要将路由元.忽略身份验证设置为 true
      console.log(to)
      if (to.meta.ignoreAuth) {
        next()
        return
      }

      // redirect login page
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      }
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        }
      }
      next(redirectData)
      return
    }

    // Jump to the 404 page after processing the login
    if (from.path === LOGIN_PATH && to.name === PAGE_NOT_FOUND_ROUTE.name && to.fullPath !== PageEnum.BASE_HOME) {
      next(PageEnum.BASE_HOME)
      return
    }

    // get userinfo while last fetch time is empty
    if (userStore.getLastUpdateTime === 0) {
      try {
        await userStore.refreshUserInfoAction()
      } catch (err) {
        next()
        return
      }
    }

    if (permissionStore.getIsDynamicAddedRoute) {
      next()
      return
    }
    // 初始化 websocket连接.
    initWebSocket()

    // 重载菜单
    console.log('重载菜单')
    const routes = await permissionStore.buildRoutesAction()

    routes.forEach((route) => {
      try {
        router.addRoute(route as unknown as RouteRecordRaw)
      } catch (e) {
        console.error(e)
      }
    })

    router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw)

    permissionStore.setDynamicAddedRoute(true)

    if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
      // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      next({ path: to.fullPath, replace: true, query: to.query })
    } else {
      const redirectPath = (from.query.redirect || to.path) as string
      const redirect = decodeURIComponent(redirectPath)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      next(nextData)
    }
  })
}
