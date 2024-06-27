import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<RefundOrder>>>({
    url: '/order/refund/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<RefundOrder>>({
    url: '/order/refund/findById',
    params: { id },
  })
}

/**
 * 获取单条
 */
export function getByRefundNo(refundNo) {
  return defHttp.get<Result<any>>({
    url: '/order/refund/findByRefundNo',
    params: { refundNo },
  })
}

/**
 * 发起退款
 */
export function refund(params) {
  return defHttp.post<Result<void>>({
    url: '/order/refund/refund',
    data: params,
  })
}

/**
 * 退款信息同步
 */
export function syncByRefundNo(refundNo) {
  return defHttp.post<Result<void>>({
    url: '/order/refund/syncByRefundNo',
    params: { refundNo },
  })
}

/**
 * 退款重试
 */
export function resetRefund(id) {
  return defHttp.post<Result<void>>({
    url: '/order/refund/resetRefund',
    params: { id },
  })
}

/**
 * 获取汇总金额
 */
export function getTotalAmount(param) {
  return defHttp.get<Result<number>>({
    url: '/order/refund/getTotalAmount',
    params: param,
  })
}

/**
 * 退款记录
 */
export interface RefundOrder extends BaseEntity {
  // 支付订单ID
  orderId?: string
  // 支付订单号
  orderNo?: string
  // 商户支付订单号
  bizOrderNo?: string
  // 支付标题
  title?: string
  // 退款号
  refundNo?: string
  // 商户退款号
  bizRefundNo?: string
  // 通道退款号
  outRefundNo?: string
  // 订单金额
  orderAmount?: number
  // 退款金额
  amount?: number
  // 退款通道
  channel?: string
  // 退款状态
  status?: string
  // 退款结束时间
  finishTime?: string
  // 退款原因
  reason?: string
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
  // 错误码
  errorCode?: string
  // 错误信息
  errorMsg?: string
}
