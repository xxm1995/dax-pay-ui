import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 树列表
 */
export const menuTree = (clientCode: string) => {
  return defHttp.get<Result<Array<Menu>>>({
    url: '/perm/menu/menuTree',
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
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: Menu) => {
  return defHttp.post({
    url: '/perm/menu/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/perm/menu/delete',
    params: { id },
  })
}

/**
 * 资源列表
 */
export const resourceList = (menuId) => {
  return defHttp.get<Result<Array<Resource>>>({
    url: '/perm/menu/resourceList',
    params: { menuId },
  })
}

/**
 * 权限码是否重复
 */
export const existsByPermCode = (permCode) => {
  return defHttp.get<Result<boolean>>({
    url: '/perm/menu/existsByPermCode',
    params: { permCode },
  })
}
export const existsByPermCodeNotId = (permCode, id) => {
  return defHttp.get<Result<boolean>>({
    url: '/perm/menu/existsByPermCodeNotId',
    params: { permCode, id },
  })
}

/**
 * 权限_菜单
 */
export interface Menu extends BaseEntity {
  // 终端code
  clientCode?: string
  // 父id
  parentId: number | null
  // 菜单名称
  title: string
  // 路由名称
  name: string
  // 菜单图标
  icon: string
  // 是否隐藏
  hidden: boolean
  // 是否隐藏子菜单
  hideChildrenInMenu: boolean
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
  // 类型（0：一级菜单；1：子菜单 ；2：按钮权限）
  menuType: number
  // 是否缓存页面
  keepAlive: boolean
  // 是否外部打开方式
  targetOutside: boolean
  // 隐藏的标题内容
  hiddenHeaderContent: boolean
  // 系统菜单
  admin?: boolean
  // 描述
  remark?: string
}

/**
 * 权限_资源(码)
 */
export interface Resource extends BaseEntity {
  // 菜单权限编码
  permCode: string
  // 菜单名称
  title: string
  // 终端code
  clientCode?: string
  //是否有效
  effect: boolean
  // 父id
  parentId?: number | null
  // 描述
  remark?: string
}
