import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<Client>>>({
    url: '/client/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<Client>>({
    url: '/client/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: Client) => {
  return defHttp.post({
    url: '/client/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: Client) => {
  return defHttp.post({
    url: '/client/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/client/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<Client>>>({
    url: '/client/findAll',
  })
}

/**
 * 编码是否被使用
 */
export const existsByCode = (code: string) => {
  return defHttp.get<Result<boolean>>({
    url: '/client/existsByCode',
    method: 'GET',
    params: { code },
  })
}
export const existsByCodeNotId = (code: string, id) => {
  return defHttp.get<Result<boolean>>({
    url: '/client/existsByCodeNotId',
    params: { code, id },
  })
}

/**
 * 终端
 */
export interface Client extends BaseEntity {
  // 编码
  code: string
  // 名称
  name: string
  // 是否系统内置
  system: boolean
  // 是否可用
  enable: boolean
  // 新注册的用户是否默认赋予该终端
  defaultEndow: boolean
  // 关联登录方式
  loginTypeIdList: Array<string> | undefined | null
  // 描述
  description: string
}
