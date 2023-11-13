import type { Router, RouteRecordRaw } from 'vue-router'

import { usePermissionStoreWithOut } from '/@/store/modules/permission'
import { PageEnum } from '/@/enums/pageEnum'
import { useUserStoreWithOut } from '/@/store/modules/user'
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic'
import { userLoginInitAction } from '/@/store/action/userAction'

const LOGIN_PATH = PageEnum.BASE_LOGIN

const whitePathList: PageEnum[] = [LOGIN_PATH]

/**
 * 路由守卫: 处理下列情况
 * 1. 载入菜单
 * 2. 处理登录后用户提示
 * @param router
 */
export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut()
  const permissionStore = usePermissionStoreWithOut()
  router.beforeEach(async (to, from, next) => {
    const token = userStore.getToken
    // 可以访问输入白名单中的页面
    if (whitePathList.includes(to.path as PageEnum)) {
      // 如果在登录状态下访问登录页, 自动跳转到后续页面
      if (to.path === LOGIN_PATH && token) {
        try {
          // 如果参数未携带重定向路径则自动跳转到首页
          next((to.query?.redirect as string) || '/')
          return
        } catch {}
      }
      next()
      return
    }

    // token 不存在
    if (!token) {
      // 您可以在未经许可的情况下访问。您需要将路由meta中的 忽略身份验证设置为 true
      if (to.meta.ignoreAuth) {
        next()
        return
      }
      //重定向登录页面
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

    // 路由是否初始化完毕, 完毕后直接直接跳转, 不再向下执行初始化操作
    if (permissionStore.getIsDynamicAddedRoute) {
      next()
      return
    }
    // 用户初始化等操作.
    userLoginInitAction()

    // 重载菜单, 进行路由菜单的组装并进行跳转
    console.log('重载菜单')
    const routes = await permissionStore.buildRoutesAction()
    routes.forEach((route) => {
      try {
        router.addRoute(route as unknown as RouteRecordRaw)
      } catch (e) {
        console.error(e)
      }
    })

    // 40x 系列路由
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
