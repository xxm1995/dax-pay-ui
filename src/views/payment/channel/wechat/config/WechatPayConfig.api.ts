import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity, KeyValue } from '/#/web'

/**
 * 获取单条
 */
export function getConfig() {
  return defHttp.get<Result<WechatPayConfig>>({
    url: '/wechat/pay/config/getConfig',
  })
}

/**
 * 更新
 */
export function update(obj: WechatPayConfig) {
  return defHttp.post({
    url: '/wechat/pay/config/update',
    data: obj,
  })
}

/**
 * 获取微信支持支付方式
 */
export function findPayWayList() {
  return defHttp.get<Result<KeyValue[]>>({
    url: '/wechat/pay/config/findPayWays',
  })
}

/**
 * 微信支付配置
 */
export interface WechatPayConfig extends BaseEntity {
  // 微信应用AppId
  wxAppId?: string
  // 微信商户号
  wxMchId?: string
  // 是否启用
  enable: boolean
  // 支付限额
  singleLimit: number
  // API 版本
  apiVersion: string
  // 商户平台「API安全」中的 APIv2 密钥
  apiKeyV2?: string
  // 商户平台「API安全」中的 APIv3 密钥
  apiKeyV3?: string
  // APPID对应的接口密码，用于获取接口调用凭证access_token时使用
  appSecret?: string
  // p12的文件id
  p12?: string | null
  // 应用域名，回调中会使用此参数
  domain?: string
  // 服务器异步通知页面路径
  notifyUrl?: string
  // 页面跳转同步通知页面路径
  returnUrl?: string
  // 是否沙箱环境
  sandbox?: boolean
  // 支持的支付类型
  payWays?: string[]
  // 备注
  remark?: string
}
