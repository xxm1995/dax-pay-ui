import { AppRouteModule } from '@/router/types'
import { LAYOUT } from '@/router/constant'

/**
 * 位于主框架内的页面, 通常需要登录
 */
export const INTERNAL: AppRouteModule = {
  path: '/base/internal',
  name: 'PROJECT_INTERNAL',
  component: LAYOUT,
  redirect: '',
  meta: {
    title: '项目基础路由',
  },
  children: [
    // {
    //   path: '/account/setting',
    //   name: 'AccountSettingPage',
    //   component: () => import('/@/views/account/setting/index.vue'),
    //   meta: { title: '个人设置' },
    // },
    // {
    //   path: '/about/index',
    //   name: 'AboutPage',
    //   component: () => import('/@/views/sys/about/index.vue'),
    //   meta: { title: '关于' },
    // },
  ],
}

/**
 * 位于主框架外的页面
 */
export const OUTSIDE: AppRouteModule = {
  path: '/outside',
  name: 'PROJECT_OUTSIDE',
  meta: { title: '' },
  children: [
    // {
    //   path: '/cashier',
    //   name: 'cashier',
    //   component: () => import('/@/views/demo/cashier/Cashier.vue'),
    //   meta: { title: '收银台演示', ignoreAuth: true },
    // },
  ],
}

/**
 * 项目基础路由
 */
export const PROJECT_BASE = [INTERNAL, OUTSIDE]
