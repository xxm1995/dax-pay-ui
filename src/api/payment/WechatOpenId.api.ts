import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'

/**
 * 获取微信授权认证地址
 */
export function generateWxAuthUrl() {
  return defHttp.post<Result<AuthUrlResult>>({
    url: '/wechat/auth/generateAuthUrl',
  })
}

/**
 * 查询微信OpenId数据
 */
export function queryWxOpenId(code: string) {
  return defHttp.get<Result<OpenIdResult>>({
    url: '/wechat/auth/queryOpenId',
    params: { code },
  })
}

/**
 * 获取支付宝授权认证地址
 */
export function generateAliAuthUrl() {
  return defHttp.post<Result<AuthUrlResult>>({
    url: '/alipay/auth/generateAuthUrl',
  })
}

/**
 * 查询支付宝OpenId
 */
export function queryAliOpenId(code: string) {
  return defHttp.get<Result<OpenIdResult>>({
    url: '/alipay/auth/queryOpenId',
    params: { code },
  })
}

/**
 * 微信获取OpenId授权链接和查询标识返回类
 */
export interface AuthUrlResult {
  /** 授权访问链接 */
  authUrl: string
  /** 标识码, 用于查询是否获取到了OpenId */
  code: string
}

/**
 * 微信OpenId查询结果
 */
export interface OpenIdResult {
  /** OpenId */
  openId: string
  /**
   * 状态
   * pending:查询中
   * success:查询成功
   * fail:查询失败
   */
  status: string
}
