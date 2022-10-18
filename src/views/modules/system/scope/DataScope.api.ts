import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<DataScope>>>({
    url: '/data/scope/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<DataScope>>({
    url: '/data/scope/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: DataScope) => {
  return defHttp.post({
    url: '/data/scope/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: DataScope) => {
  return defHttp.post({
    url: '/data/scope/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/data/scope/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<DataScope>>>({
    url: '/data/scope/findAll',
  })
}

/**
 * 编码是否被使用
 */
export function existsByCode(code: string) {
  return defHttp.get<Result<boolean>>({
    url: '/data/scope/existsByCode',
    params: { code },
  })
}
export function existsByCodeNotId(code, id) {
  return defHttp.get<Result<boolean>>({
    url: '/data/scope/existsByCodeNotId',
    params: { code, id },
  })
}

/**
 * 名称是否被使用
 */
export function existsByName(name: string) {
  return defHttp.get<Result<boolean>>({
    url: '/data/scope/existsByName',
    params: { name },
  })
}
export function existsByNameNotId(name: string, id) {
  return defHttp.get<Result<boolean>>({
    url: '/data/scope/existsByNameNotId',
    params: { name, id },
  })
}

/**
 * 数据范围权限
 */
export interface DataScope extends BaseEntity {
  // 编码
  code: string
  // 名称
  name: string
  // 类型
  type: number
  // 说明
  remark: string
}
