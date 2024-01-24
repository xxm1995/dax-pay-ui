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
export function get(paymentId) {
  return defHttp.get<Result<RefundOrder>>({
    url: '/order/refund/findById',
    params: { paymentId },
  })
}

/**
 * 通道退款订单列表查询
 */
export function listByChannel(refundId) {
  return defHttp.get<Result<RefundChannelOrder[]>>({
    url: '/order/refund/listByChannel',
    params: { refundId },
  })
}

/**
 * 通道对款订单详情查询
 */
export function getDetail(id) {
  return defHttp.get<Result<RefundChannelOrder>>({
    url: '/order/refund/findChannelById',
    params: { id },
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
 * 退款记录
 */
export interface RefundOrder extends BaseEntity {
  // 原支付记录id
  paymentId?: string
  // 原业务号
  businessNo?: string
  // 异步方式关联退款请求号
  refundNo?: string
  // 标题
  title?: string
  // 金额
  amount?: number
  // 剩余可退款金额
  refundableBalance?: number
  // 退款状态
  status?: number
  // 退款时间
  refundTime?: string
  // 客户ip
  clientIp?: string
  // 错误码
  errorCode?: string
  // 错误信息
  errorMsg?: string
}

/**
 * 通道退款订单
 */
export interface RefundChannelOrder extends BaseEntity {
  // 支付通道
  refundId?: string
  // 通道支付单id
  payChannelId?: string
  // 关联网关退款号
  gatewayOrderNo?: string
  // 通道支付单id
  async?: boolean
  // 通道
  channel?: string
  // 订单金额
  orderAmount?: number
  // 退款金额
  amount?: number
}

/**
 * 可退款信息
 */
export interface RefundableInfo {
  // 支付通道
  channel?: number
  // 金额
  amount?: number
}
