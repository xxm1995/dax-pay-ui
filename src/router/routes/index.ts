import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types'

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic'

import { mainOutRoutes } from './mainOut'
import { PageEnum } from '/@/enums/pageEnum'

// import.meta.glob() 直接引入所有的模块 Vite 独有的功能
const modules: Recordable = import.meta.glob('./modules/**/*.ts', { eager: true })
const routeModuleList: AppRouteModule[] = []

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

/**
 * 根路由
 */
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
}

/**
 * 登录路由
 */
export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/login/Login.vue'),
  meta: {
    title: '登录',
  },
}

// 无需鉴权的基本路由
export const BASIC_ROUTES = [LoginRoute, RootRoute, ...mainOutRoutes, REDIRECT_ROUTE, PAGE_NOT_FOUND_ROUTE]
