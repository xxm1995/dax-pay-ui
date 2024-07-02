import type { RouteRecordRaw } from 'vue-router'

import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'

import { useTabs } from './useTabs'

import { RoleEnum } from '@/enums/roleEnum'

import { intersection } from 'lodash-es'
import { isArray } from '@/utils/is'

// User permissions related operations
export function usePermission() {
  const permissionStore = usePermissionStore()

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

  return { hasPermission }
}
