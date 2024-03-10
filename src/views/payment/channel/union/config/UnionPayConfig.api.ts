import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity, KeyValue } from '/#/web'

/**
 * 获取单条
 */
export function getConfig() {
  return defHttp.get<Result<UnionPayConfig>>({
    url: '/union/pay/config/getConfig',
  })
}

/**
 * 更新
 */
export function update(obj: UnionPayConfig) {
  return defHttp.post({
    url: '/union/pay/config/update',
    data: obj,
  })
}

/**
 * 获取云闪付支持支付方式
 */
export function findPayWayList() {
  return defHttp.get<Result<KeyValue[]>>({
    url: '/union/pay/config/findPayWays',
  })
}

/**
 * 微信支付配置
 */
export interface UnionPayConfig extends BaseEntity {
  // 商户号
  machId?: string
  // 商户收款账号
  seller?: string
  // 是否启用
  enable: boolean
  // 签名类型
  signType?: string
  // 是否为证书签名
  certSign?: boolean
  // 应用私钥证书
  keyPrivateCert?: string | null
  // 私钥证书对应的密码
  keyPrivateCertPwd?: string | null
  // 中级证书
  acpMiddleCert?: string | null
  // 根证书
  acpRootCert?: string | null
  // 异步通知页面路径
  notifyUrl?: string
  // 页面跳转同步通知页面路径
  returnUrl?: string
  // 是否沙箱环境
  sandbox?: boolean
  // 支持的支付类型
  payWays?: string[]
}
