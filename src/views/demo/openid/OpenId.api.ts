import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 微信 返回获取OpenId授权页面地址和标识码
 */
export function wxGenerateAuthUrl() {
  return defHttp.post<Result<AuthUrlResult>>({
    url: '/wechat/auth/generateAuthUrl',
  })
}

/**
 * 根据标识码查询OpenId
 */
export function wxGetOpenId(code) {
  return defHttp.get<Result<OpenIdResult>>({
    url: '/wechat/auth/queryOpenId',
    params: { code },
  })
}

/**
 * 支付宝 返回获取OpenId授权页面地址和标识码
 */
export function aliGenerateAuthUrl() {
  return defHttp.post<Result<AuthUrlResult>>({
    url: '/alipay/auth/generateAuthUrl',
  })
}

/**
 * 支付宝 根据标识码查询OpenId
 */
export function aliGetOpenId(code) {
  return defHttp.get<Result<OpenIdResult>>({
    url: '/alipay/auth/queryOpenId',
    params: { code },
  })
}

/**
 * 获取授权访问链接和标识码
 */
export interface AuthUrlResult {
  // 授权访问链接
  authUrl: string
  // 标识码, 用于查询是否获取到了OpenId
  code: string
}

/**
 * OpenId结果类
 */
export interface OpenIdResult {
  // OpenId
  openId: string
  /**
   * 状态
   * pending:查询中
   * success:查询成功
   * fail:查询失败
   */
  status: string
}
