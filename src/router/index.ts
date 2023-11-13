import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'

import { createRouter, createWebHashHistory } from 'vue-router'
import { BASIC_ROUTES } from './routes'
import { PROJECT_BASE } from '/@/router/routes/project'

// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = []
const getRouteNames = (array: any[]) =>
  array.forEach((item) => {
    WHITE_NAME_LIST.push(item.name)
    getRouteNames(item.children || [])
  })
getRouteNames(BASIC_ROUTES)

// 创建未登录也可以访问的路由组
const routes = [...BASIC_ROUTES, ...PROJECT_BASE]

// 创建一个可以被 Vue 应用程序使用的路由实例
export const router = createRouter({
  // 创建一个 hash 历史记录。
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  // 应该添加到路由的初始路由列表。
  routes: routes as unknown as RouteRecordRaw[],
  // 是否应该禁止尾部斜杠。默认为否
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 重置路由
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

// 配置路由器
export function setupRouter(app: App<Element>) {
  app.use(router)
}
