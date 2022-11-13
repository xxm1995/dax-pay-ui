import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<LoginType>>>({
    url: '/loginType/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<LoginType>>({
    url: '/loginType/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: LoginType) => {
  return defHttp.post({
    url: '/loginType/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: LoginType) => {
  return defHttp.post({
    url: '/loginType/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/loginType/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<LoginType>>>({
    url: '/loginType/findAll',
  })
}

/**
 * 编码是否被使用
 */
export const existsByCode = (code: string) => {
  return defHttp.get<Result<boolean>>({
    url: '/loginType/existsByCode',
    params: { code },
  })
}
export const existsByCodeNotId = (code: string, id) => {
  return defHttp.get<Result<boolean>>({
    url: '/loginType/existsByCodeNotId',
    params: { code, id },
  })
}

/**
 * 登录方式
 */
export interface LoginType extends BaseEntity {
  // 编码
  code: string
  // 名称
  name: string
  // 类型
  type: string
  // 是否系统内置
  system: boolean
  // 在线时长 秒
  timeout: number
  // 启用验证码
  captcha: boolean
  // 密码错误次数
  pwdErrNum: number
  // 是否可用
  enable: boolean
  // 描述
  description: string
}
// 类型
export const OPEN_ID = 'openId'
export const PASSWORD = 'password'
