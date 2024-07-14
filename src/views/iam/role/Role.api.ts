import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * tree
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
 * 添加角色
 */
export const add = (obj: Role) => {
  return defHttp.post({
    url: '/role/add',
    data: obj,
  })
}

/**
 * 修改角色
 */
export const update = (obj: Role) => {
  return defHttp.post({
    url: '/role/update',
    data: obj,
  })
}

/**
 * 删除角色
 */
export const del = (id) => {
  return defHttp.post({
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
 * 角色
 */
export interface Role extends BaseEntity {
  // 编码
  code?: string
  // 父ID
  pid?: string
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
