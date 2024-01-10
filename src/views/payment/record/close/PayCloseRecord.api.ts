import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<PayCloseRecord>>>({
    url: '/record/close/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(paymentId) {
  return defHttp.get<Result<PayCloseRecord>>({
    url: '/record/close/findById',
    params: { paymentId },
  })
}

/**
 * 支付回调记录
 */
export interface PayCloseRecord extends BaseEntity {
  // 支付号
  paymentId?: string
  // 业务号
  businessNo?: string
  // 关闭的异步支付通道
  asyncChannel?: string
  // 是否关闭成功
  closed?: boolean
  // 错误消息
  errorMsg?: string
  // 客户端IP
  clientIp?: string
  // 请求链路ID
  reqId?: string
}
