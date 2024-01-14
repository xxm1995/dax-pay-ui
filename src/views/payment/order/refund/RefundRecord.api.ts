import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<RefundRecord>>>({
    url: '/order/refund/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(paymentId) {
  return defHttp.get<Result<RefundRecord>>({
    url: '/order/refund/findById',
    params: { paymentId },
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
export interface RefundRecord extends BaseEntity {
  // 原支付记录id
  paymentId?: string
  // 原业务号
  businessNo?: string
  // 异步方式关联退款请求号
  refundRequestNo?: string
  // 用户id
  userId?: string
  // 标题
  title?: string
  // 金额
  amount?: number
  // 剩余可退款金额
  refundableBalance?: number
  // 可退款信息
  refundableInfo?: RefundableInfo[]
  // 退款状态
  status?: number
  // 支付时间
  refundTime?: string
  // 客户ip
  clientIp?: string
  // 错误码
  errorCode?: string
  // 错误信息
  errorMsg?: string
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
