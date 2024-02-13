import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'
import { MenuTree } from '/@/views/modules/system/menu/Menu.api'
import { PermPath } from '/@/views/modules/system/path/PermPath.api'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<Role>>>({
    url: '/role/page',
    params,
  })
}
/**
 * 分页
 */
export const tree = () => {
  return defHttp.get<Result<RoleTree[]>>({
    url: '/role/tree',
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<Role>>({
    url: '/role/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: Role) => {
  return defHttp.post({
    url: '/role/add',
    data: obj,
  })
}

/**
 * 保存 角色分配菜单关系
 */
export function saveRoleMenu(obj) {
  return defHttp.post({
    url: `/role/menu/save`,
    data: obj,
  })
}

/**
 * 保存 角色请求权限关系
 */
export function saveRolePath(obj) {
  return defHttp.post({
    url: `/role/path/save`,
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: Role) => {
  return defHttp.post({
    url: '/role/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/role/delete',
    params: { id },
  })
}

/**
 * 编码是否被使用
 */
export const existsByCode = (code: string) => {
  return defHttp.get<Result<boolean>>({
    url: '/role/existsByCode',
    params: { code },
  })
}
export const existsByCodeNotId = (code: string, id) => {
  return defHttp.get<Result<boolean>>({
    url: '/role/existsByCodeNotId',
    params: { code, id },
  })
}

/**
 * 编码是否被使用
 */
export const existsByName = (name: string) => {
  return defHttp.get<Result<boolean>>({
    url: '/role/existsByName',
    params: { name },
  })
}
export const existsByNameNotId = (name: string, id) => {
  return defHttp.get<Result<boolean>>({
    url: '/role/existsByNameNotId',
    params: { name, id },
  })
}

/**
 * 查询全部角色
 */
export const findAll = () => {
  return defHttp.get<Result<Array<Role>>>({
    url: '/role/findAll',
  })
}

/**
 * 根据角色获取拥有的权限
 */
export function findPermissionIdsByRole(roleId, clientCode) {
  return defHttp.get<Result<string[]>>({
    url: `/role/menu/findPermissionIdsByRole`,
    params: { roleId, clientCode },
  })
}

/**
 * 获取当前用户角色下可见的菜单树(分配时用)
 */
export function findTreeByRole(roleId, clientCode) {
  return defHttp.get<Result<MenuTree[]>>({
    url: '/role/menu/findTreeByRole',
    params: { roleId, clientCode },
  })
}

/**
 * 根据角色id获取关联请求权限id
 */
export function findPathIdsByRole(roleId) {
  return defHttp.get<Result<string[]>>({
    url: `/role/path/findIdsByRole`,
    params: { roleId },
  })
}

/**
 * 获取当前用户角色下可见的请求权限列表(分配时用)
 */
export function findPathsByRole(roleId) {
  return defHttp.get<Result<PermPath[]>>({
    url: `/role/path/findPathsByRole`,
    params: { roleId },
  })
}

/**
 * 角色
 */
export interface Role extends BaseEntity {
  // 编码
  code?: string
  // 父ID
  pid?: number
  // 名称
  name?: string
  // 是否系统内置
  internal?: boolean
  // 说明
  remark?: string
}

/**
 * 角色树
 */
export interface RoleTree extends Role {
  children?: RoleTree[]
}
