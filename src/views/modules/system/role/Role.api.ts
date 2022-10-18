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
    method: 'GET',
    params: { code },
  })
}
export const existsByCodeNotId = (code: string, id) => {
  return defHttp.get<Result<boolean>>({
    url: '/role/existsByCodeNotId',
    method: 'GET',
    params: { code, id },
  })
}

/**
 * 编码是否被使用
 */
export const existsByName = (name: string) => {
  return defHttp.get<Result<boolean>>({
    url: '/role/existsByName',
    method: 'GET',
    params: { name },
  })
}
export const existsByNameNotId = (name: string, id) => {
  return defHttp.get<Result<boolean>>({
    url: '/role/existsByNameNotId',
    method: 'GET',
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
