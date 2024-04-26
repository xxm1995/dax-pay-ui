import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'
import { PaySyncResult } from '/@/views/payment/record/sync/PaySyncRecord.api'

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
 * 获取订单
 */
export function getOrder(id: number) {
  return defHttp.get<Result<PayOrder>>({
    url: '/order/pay/findById',
    params: { id },
  })
}

/**
 * 获取订单
 */
export function getOrderByOrderNo(orderNo: string) {
  return defHttp.get<Result>({
    url: '/order/pay/findByOrderNo',
    params: { orderNo },
  })
}

/**
 * 获取订单扩展信息
 */
export function getOrderExtra(id) {
  return defHttp.get<Result<PayOrderExtra>>({
    url: '/order/pay/getExtraById',
    params: { id },
  })
}

/**
 * 根据订单号同步支付状态
 */
export function syncByOrderNo(orderNo: string) {
  return defHttp.post<Result<PaySyncResult>>({
    url: '/order/pay/syncByOrderNo',
    params: { orderNo },
  })
}

/**
 * 关闭支付记录
 */
export function close(id) {
  return defHttp.post<Result<void>>({
    url: '/order/pay/close',
    params: { id },
  })
}

/**
 * 触发分账
 */
export function allocationById(id) {
  return defHttp.post<Result<void>>({
    url: '/order/pay/allocation',
    params: { id },
  })
}

/**
 * 支付记录
 */
export interface PayOrder extends BaseEntity {
  // 标题
  title?: string
  // 商户订单号
  bizOrderNo?: string
  // 支付订单号
  orderNo?: string
  // 三方系统交易号
  outOrderNo?: string
  // 描述
  description?: any
  // 是否支持分账
  allocation?: boolean
  // 支付通道
  channel?: string
  // 支付方式
  method?: string
  // 金额
  amount?: number
  // 可退款余额
  refundableBalance?: number
  // 支付状态
  status?: string
  // 分账状态
  allocationStatus?: string
  // 支付时间
  payTime?: string
  // 过期时间
  expiredTime?: string
  // 关闭时间
  closeTime?: string
  // 错误码
  errorCode?: string
  // 错误信息
  errorMsg?: string
}

/**
 * 支付扩展信息
 */
export interface PayOrderExtra {
  // 是否不需要异步通知
  notNotify?: string
  // 异步通知地址
  notifyUrl?: string
  // 商户扩展参数
  attach?: string
  // 附加参数
  extraParam?: string
  // 请求时间
  reqTime?: string
  // 支付终端ip
  clientIp?: string
}
