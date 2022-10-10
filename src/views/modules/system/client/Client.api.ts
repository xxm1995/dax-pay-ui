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
export const add = (obj) => {
  return defHttp.post({
    url: '/client/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj) => {
  return defHttp.post({
    url: '/client/update',
    data: obj,
  })
}

/**
 * 实体类接口
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
  // 关联登录方式
  loginTypeIdList: Array<string> | undefined | null
  // 描述
  description: string
}
