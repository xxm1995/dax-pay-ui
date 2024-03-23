import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity, KeyValue } from '/#/web'

/**
 * 获取单条
 */
export function getConfig() {
  return defHttp.get<Result<AlipayConfig>>({
    url: '/alipay/config/getConfig',
  })
}

/**
 * 更新
 */
export function update(obj: AlipayConfig) {
  return defHttp.post({
    url: '/alipay/config/update',
    data: obj,
  })
}

/**
 * 获取支付宝支持支付方式
 */
export function findPayWays() {
  return defHttp.get<Result<KeyValue[]>>({
    url: '/alipay/config/findPayWays',
  })
}

/**
 * 支付宝配置
 */
export interface AlipayConfig extends BaseEntity {
  // 支付宝商户appId
  appId?: string
  // 是否启用
  enable: boolean
  // 支付限额
  limitAmount: number
  // 商户账号ID
  alipayUserId?: string
  // 服务器异步通知页面路径
  notifyUrl?: string
  // 页面跳转同步通知页面路径
  returnUrl?: string
  // 请求网关地址
  serverUrl?: string
  // 认证方式
  authType?: string
  // 签名类型
  signType?: string
  // 支付宝公钥
  alipayPublicKey?: string
  // 私钥
  privateKey?: string
  // 应用公钥
  appCert?: string
  // 支付宝公钥证书
  alipayCert?: string
  // 支付宝CA根证书
  alipayRootCert?: string
  // 是否沙箱环境
  sandbox?: boolean
  // 支持的支付类型
  payWays?: string[]
  // 备注
  remark?: string
}
