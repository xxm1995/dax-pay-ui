import type { RouteMeta } from 'vue-router'

export interface RouteItem {
  path: string
  component: any
  meta: RouteMeta
  name?: string
  alias?: string | string[]
  redirect?: string
  caseSensitive?: boolean
  children?: RouteItem[]
}

/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[]

/**
 * 用户菜单及资源权限返回类
 */
export interface MenuAndResource {
  // 权限码
  resourcePerms: Array<string>
  // 菜单
  menus: Array<PermMenu>
}

/**
 * 权限菜单
 */
export interface PermMenu {
  parentId: number | null
  title: string
  name: string
  effect: boolean
  icon: string
  hidden: boolean
  hideChildrenInMenu: boolean
  component: string
  path: string
  iframeUrl: string
  redirect: string
  sortNo: number
  keepAlive: boolean
  targetOutside: boolean
  children: Array<PermMenu>
}
