import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'

/**
 * 微信OpenId服务类
 */
export function generateAuthUrl() {
  return defHttp.post<Result<WeChatAuthUrlResult>>({
    url: '/wechat/openId/generateAuthUrl',
  })
}

/**
 * 微信OpenId服务类
 */
export function queryOpenId(code: string) {
  return defHttp.get<Result<WeChatOpenIdResult>>({
    url: '/wechat/openId/queryOpenId',
    params: { code },
  })
}

/**
 * 微信获取OpenId授权链接和查询标识返回类
 */
export interface WeChatAuthUrlResult {
  /** 授权访问链接 */
  authUrl: string
  /** 标识码, 用于查询是否获取到了OpenId */
  code: string
}

/**
 * 微信OpenId查询结果
 */
export interface WeChatOpenIdResult {
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
