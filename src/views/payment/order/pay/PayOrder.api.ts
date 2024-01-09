import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'
import { RefundableInfo } from '/@/views/payment/order/refund/RefundRecord.api'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<PayOrder>>>({
    url: '/order/pay/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<PayOrder>>({
    url: '/order/pay/findById',
    params: { id },
  })
}

/**
 * 支付记录
 */
export interface PayOrder extends BaseEntity {
  // 关联的业务号
  businessNo?: string
  // 标题
  title?: string
  // 是否是异步支付
  asyncPay: boolean
  // 是否是组合支付
  combinationPay: boolean
  // 异步支付通道
  asyncChannel?: boolean
  // 金额
  amount?: number
  // 可退款余额
  refundableBalance?: number
  // 可退款信息
  refundableInfo?: RefundableInfo[]
  // 支付状态
  payStatus?: number
  // 支付时间
  payTime?: string
  // 过期时间
  expiredTime?: string
}

/**
 * 支付扩展信息
 */
export interface PayOrderExtra {
  // 描述
  description?: string
  // 支付终端ip
  clientIp?: string
  // 是否不需要异步通知
  notNotify?: string
  // 异步通知地址
  notifyUrl?: string
  // 签名类型
  signType?: string
  // 支付终端ip
  sign?: string
  // 商户扩展参数
  attach?: string
  // API版本号
  apiVersion?: string
  // 请求时间
  reqTime?: string
  // 错误码
  errorCode?: string
  // 错误信息
  errorMsg?: string
}

/**
 * 支付通道信息
 */
export interface PayOrderChannel {
  // 支付通道
  payChannel?: number
  // 支付方式
  payWay?: number
  // 金额
  amount?: number
  // 扩展参数的json字符串
  extraParamsJson?: string
}
