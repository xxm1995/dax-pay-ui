import { AppRouteModule } from '@/router/types'
import { LAYOUT } from '@/router/constant'

const IFrame = () => import('@/views/sys/iframe/FrameBlank.vue')
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
    //   component: () => import('@/views/account/setting/index.vue'),
    //   meta: { title: '个人设置' },
    // },
    {
      path: '/antv',
      name: 'Antv',
      component: IFrame,
      meta: {
        frameSrc: 'https://www.antdv.com/docs/vue/introduce-cn/',
        title: 'antv',
      },
    },
    {
      path: '/about',
      name: 'AboutPage',
      component: () => import('@/views/sys/about/index.vue'),
      meta: { title: '关于' },
    },
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
    //   component: () => import('@/views/demo/cashier/Cashier.vue'),
    //   meta: { title: '收银台演示', ignoreAuth: true },
    // },
  ],
}

/**
 * 项目基础路由
 */
export const PROJECT_BASE = [INTERNAL, OUTSIDE]
