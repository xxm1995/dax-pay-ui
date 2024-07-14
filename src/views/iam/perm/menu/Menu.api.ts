import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'
import { unref } from 'vue'

/**
 * 菜单树列表
 */
export const menuTree = (clientCode: string) => {
  return defHttp.get<Result<Array<Menu>>>({
    url: '/perm/menu/tree',
    params: { clientCode },
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<Menu>>({
    url: '/perm/menu/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: Menu) => {
  return defHttp.post({
    url: '/perm/menu/add',
    data: unref(obj),
  })
}

/**
 * 更新
 */
export const update = (obj: Menu) => {
  return defHttp.post({
    url: '/perm/menu/update',
    data: unref(obj),
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.post({
    url: '/perm/menu/delete',
    params: { id },
  })
}

/**
 * 权限_菜单
 */
export interface Menu extends BaseEntity {
  // 终端code
  clientCode?: string
  // 是否是一级菜单
  root: boolean
  // 父id
  pid: number | null | string
  // 菜单名称
  title: string
  // 路由名称
  name: string
  // 菜单图标
  icon: string
  // 是否隐藏
  hidden: boolean
  // 是否隐藏子菜单
  hideChildrenMenu: boolean
  // 组件
  component: string
  // 组件名字
  componentName: string
  // 路径
  path: string
  // 菜单跳转地址(重定向)
  redirect: string
  // 菜单排序
  sortNo: number
  // 是否缓存页面
  keepAlive: boolean
  // 是否外部打开方式
  targetOutside: boolean
  // 是否外部打开方式
  fullScreen: boolean
  // 系统菜单
  admin?: boolean
  // 描述
  remark?: string
}

/**
 * 菜单树
 */
export interface MenuTree extends Menu {
  children: MenuTree[]
}
