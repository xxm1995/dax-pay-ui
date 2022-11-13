import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

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
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<Role>>>({
    url: '/role/findAll',
  })
}

/**
 * 根据用户获取拥有的权限
 */
export function findPermissionIdsByRole(roleId, clientCode) {
  return defHttp.get<Result<string[]>>({
    url: `/role/menu/findPermissionIdsByRole`,
    params: { roleId, clientCode },
  })
}

/**
 * 根据用户id获取角色授权(请求权限列表)
 */
export function findPathsByUser() {
  return defHttp.get<Result<string[]>>({
    url: `/role/path/findPathsByUser`,
  })
}

/**
 * 根据角色id获取关联请求权限id
 */
export function findPathIdsByRole(roleId) {
  return defHttp.get<Result>({
    url: `/role/path/findIdsByRole`,
    params: { roleId },
  })
}

/**
 * 角色
 */
export interface Role extends BaseEntity {
  // 编码
  code: string
  // 名称
  name: string
  // 是否系统内置
  internal?: boolean
  // 说明
  remark: string
}
