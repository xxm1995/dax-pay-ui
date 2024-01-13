import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 获取平台配置项
 */
export function getConfig() {
  return defHttp.get<Result<PayPlatformConfig>>({
    url: '/platform/config/getConfig',
  })
}

/**
 * 更新平台配置
 */
export function update(param: PayPlatformConfig) {
  return defHttp.post<Result<PayPlatformConfig>>({
    url: '/platform/config/update',
    data: param,
  })
}

/**
 * 支付平台配置
 */
export interface PayPlatformConfig extends BaseEntity {
  // 网站地址
  websiteUrl?: string
  // 签名方式
  signType?: string
  // 签名秘钥
  signSecret?: string
  // 异步支付通知地址
  notifyUrl?: string
  // 同步支付通知地址
  returnUrl?: string
  // 订单默认超时时间(分钟)
  orderTimeout?: number
}
