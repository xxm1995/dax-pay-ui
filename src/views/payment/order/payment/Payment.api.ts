import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'
import { RefundableInfo } from '/@/views/modules/payment/order/refund/RefundRecord.api'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<Payment>>>({
    url: '/payment/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<Payment[]>>({
    url: '/payment/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<Payment>>({
    url: '/payment/findById',
    params: { id },
  })
}

/**
 * 超级查询
 */
export function superPage(params, queryParams) {
  return defHttp.post<Result<PageResult<Payment>>>({
    url: '/payment/superPage',
    params: params,
    data: queryParams,
  })
}

/**
 * 支付记录
 */
export interface Payment extends BaseEntity {
  // 用户id
  userId?: string
  // 业务id
  businessId?: string
  // 标题
  title?: string
  // 描述
  description?: string
  // 金额
  amount?: number
  // 可退款余额
  refundableBalance?: number
  // 支付状态
  payStatus?: number
  // 错误码
  errorCode?: string
  // 错误信息
  errorMsg?: string
  // 支付信息
  payTypeInfo?: string
  // 是否是异步支付
  asyncPayMode?: boolean
  // 是否是组合支付
  combinationPayMode?: boolean
  // 异步支付方式
  asyncPayChannel?: number
  // 支付通道信息列表
  payChannelInfo?: PayChannelInfo[]
  // 可退款信息
  refundableInfo?: RefundableInfo[]
  // 支付时间
  payTime?: string
  // 过期时间
  expiredTime?: string
  // 客户ip
  clientIp?: string
}

/**
 * 支付通道信息
 */
export interface PayChannelInfo {
  // 支付通道
  payChannel?: number
  // 支付方式
  payWay?: number
  // 金额
  amount?: number
  // 扩展参数的json字符串
  extraParamsJson?: string
}
