import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<SystemParam>>>({
    url: '/system/param/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<SystemParam>>({
    url: '/system/param/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: SystemParam) => {
  return defHttp.post({
    url: '/system/param/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: SystemParam) => {
  return defHttp.post({
    url: '/system/param/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/system/param/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<SystemParam>>>({
    url: '/system/param/findAll',
  })
}

/**
 * 编码是否被使用
 */
export const existsByKey = (key: string) => {
  return defHttp.get<Result<boolean>>({
    url: '/system/param/existsByKey',
    params: { key },
  })
}
export const existsByKeyNotId = (key: string, id) => {
  return defHttp.get<Result<boolean>>({
    url: '/system/param/existsByKeyNotId',
    params: { key, id },
  })
}
/**
 * 系统参数配置
 */
export interface SystemParam extends BaseEntity {
  // 参数名称
  name?: string
  // 参数键名
  key?: string
  // 参数值
  value?: string
  // 参数类型
  type?: number
  // 是否启用
  enable?: boolean
  // 内置参数
  internal?: boolean
  // 备注
  remark?: string
}
