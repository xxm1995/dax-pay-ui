import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<MailConfig>>>({
    url: '/mail/config/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<MailConfig>>({
    url: '/mail/config/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: MailConfig) => {
  return defHttp.post({
    url: '/mail/config/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: MailConfig) => {
  return defHttp.post({
    url: '/mail/config/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/mail/config/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<MailConfig>>>({
    url: '/mail/config/findAll',
  })
}

/**
 * 设置启用的邮箱配置
 */
export const setUpActivity = (id) => {
  return defHttp.post({
    url: '/mail/config/setUpActivity',
    params: { id },
  })
}

/**
 * 编码是否被使用
 */
export const existsByCode = (code) => {
  return defHttp.get<Result<boolean>>({
    url: '/mail/config/existsByCode',
    params: { code },
  })
}
export const existsByCodeNotId = (code, id) => {
  return defHttp.get<Result<boolean>>({
    url: '/mail/config/existsByCodeNotId',
    params: { code, id },
  })
}

/**
 * 邮件配置
 */
export interface MailConfig extends BaseEntity {
  // 编号
  code: string
  // 名称
  name: string
  // 邮箱服务器host
  host: string
  // 邮箱服务器 port
  port: number
  // 邮箱服务器 username
  username: string
  // 邮箱服务器 password
  password: string
  // 邮箱服务器 sender
  sender: string
  // 邮箱服务器 from
  from: string
  // 是否默认配置，0:否。1:是
  activity: number
  // 安全传输方式 1:plain 2:tls 3:ssl
  securityType: number
}
