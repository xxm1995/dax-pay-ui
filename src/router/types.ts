import type { RouteRecordRaw, RouteMeta } from 'vue-router'
import { defineComponent } from 'vue'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

// @ts-ignore
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string
  meta: RouteMeta
  targetOutside?: boolean
  fullScreen?: boolean
  redirect?: string
  iframeUrl?: string
  component?: Component | string
  components?: Component
  children?: AppRouteRecordRaw[]
  props?: Recordable
  fullPath?: string
}

export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success'
  content?: string
  dot?: boolean
}

export interface Menu {
  name: string

  icon?: string

  img?: string

  path: string

  paramPath?: string

  disabled?: boolean

  children?: Menu[]

  orderNo?: number

  meta?: Partial<RouteMeta>

  tag?: MenuTag

  targetOutside?: boolean

  fullScreen?: boolean

  hideMenu?: boolean
}

export type MenuModule = {
  orderNo?: number
  menu: Menu
}

// export type AppRouteModule = RouteModule | AppRouteRecordRaw;
export type AppRouteModule = AppRouteRecordRaw
