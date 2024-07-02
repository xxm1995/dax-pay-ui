import type { RouteRecordRaw } from 'vue-router'

import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'

import { useTabs } from './useTabs'

import { router, resetRouter } from '@/router'

import projectSetting from '@/settings/projectSetting'
import { PermissionModeEnum } from '@/enums/appEnum'
import { RoleEnum } from '@/enums/roleEnum'

import { intersection } from 'lodash-es'
import { isArray } from '@/utils/is'
import { useMultipleTabStore } from '@/store/modules/multipleTab'

// User permissions related operations
export function usePermission() {
  const appStore = useAppStore()
  const permissionStore = usePermissionStore()
  const { closeAll } = useTabs(router)

  /**
   * Change permission mode
   */
  async function togglePermissionMode() {
    appStore.setProjectConfig({
      permissionMode:
        projectSetting.permissionMode === PermissionModeEnum.BACK ? PermissionModeEnum.ROUTE_MAPPING : PermissionModeEnum.BACK,
    })
    location.reload()
  }

  /**
   * Reset and regain authority resource information
   * 重置和重新获得权限资源信息
   * @param id
   */
  async function resume() {
    console.log('重置和重新获得权限资源信息')
    const tabStore = useMultipleTabStore()
    tabStore.clearCacheTabs()
    resetRouter()
    const routes = await permissionStore.buildRoutesAction()
    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw)
    })
    permissionStore.setLastBuildMenuTime()
    closeAll()
  }

  /**
   * Determine whether there is permission
   */
  function hasPermission(value?: RoleEnum | RoleEnum[] | string | string[], def = true): boolean {
    // Visible by default
    if (!value) {
      return def
    }

    const allCodeList = permissionStore.getPermCodeList as string[]
    if (!isArray(value)) {
      return allCodeList.includes(value)
    }
    return (intersection(value, allCodeList) as string[]).length > 0
  }

  /**
   * refresh menu data
   */
  async function refreshMenu() {
    resume()
  }

  return { hasPermission, togglePermissionMode, refreshMenu }
}
