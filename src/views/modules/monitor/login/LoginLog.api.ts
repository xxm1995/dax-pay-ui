import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<LoginLog>>>({
    url: '/log/login/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<LoginLog>>({
    url: '/log/login/findById',
    params: { id },
  })
}
/**
 * 清除指定天数之前的日志
 */
export const deleteByDay = (deleteDay) => {
  return defHttp.delete<Result>({
    url: '/log/login/deleteByDay',
    params: { deleteDay },
  })
}

/**
 * 登陆日志
 */
export interface LoginLog extends BaseEntity {
  // 用户id
  userId: number
  // 用户名称
  account: string
  // 登录成功状态
  login: boolean
  // 终端
  client: string
  // 登录方式
  loginType: string
  // 登录IP地址
  ip: string
  // 登录地点
  loginLocation: string
  // 操作系统
  os: string
  // 浏览器类型
  browser: string
  // 提示消息
  msg: string
  // 访问时间
  loginTime: string
}
