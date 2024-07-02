import type { Router } from 'vue-router'
import { configureDynamicParamsMenu } from '../helper/menuHelper'

import { usePermissionStoreWithOut } from '@/store/modules/permission'

export function createParamMenuGuard(router: Router) {
  const permissionStore = usePermissionStoreWithOut()
  router.beforeEach(async (to, _, next) => {
    // filter no name route
    if (!to.name) {
      next()
      return
    }

    // menu has been built.
    if (!permissionStore.getIsDynamicAddedRoute) {
      next()
      return
    }

    const menus = permissionStore.getBackMenuList
    menus.forEach((item) => configureDynamicParamsMenu(item, to.params))

    next()
  })
}
