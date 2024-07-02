import type { AppRouteModule } from '@/router/types'

import { LAYOUT } from '@/router/constant'

const Dashboard: AppRouteModule = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/analysis',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: 'dashboard',
  },
  children: [
    {
      path: 'analysis',
      name: 'Analysis',
      component: () => import('@/views/dashboard/analysis/index.vue'),
      meta: {
        // affix: true,
        title: '分析页',
      },
    },
  ],
}

export default Dashboard
