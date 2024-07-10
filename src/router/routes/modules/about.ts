import type { AppRouteModule } from '@/router/types'

import { LAYOUT } from '@/router/constant'

const about: AppRouteModule = {
  path: '/about',
  name: 'About',
  component: LAYOUT,
  redirect: '/about/index',
  meta: {
    hideChildrenMenu: true,
    icon: 'simple-icons:aboutdotme',
    title: '关于',
    orderNo: 100000,
  },
  children: [
    {
      path: 'index',
      name: 'AboutPage',
      component: () => import('@/views/sys/about/index.vue'),
      meta: {
        title: '关于',
        icon: 'simple-icons:aboutdotme',
        hideMenu: true,
      },
    },
  ],
}

export default about
