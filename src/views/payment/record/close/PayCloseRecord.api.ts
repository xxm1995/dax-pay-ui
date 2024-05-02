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
export function get(id) {
  return defHttp.get<Result<PayCloseRecord>>({
    url: '/record/close/findById',
    params: { id },
  })
}

/**
 * 支付回调记录
 */
export interface PayCloseRecord extends BaseEntity {
  // 订单号
  orderNo?: string
  // 商户订单号
  bizOrderNo?: string
  // 关闭的支付通道
  channel?: string
  // 是否关闭成功
  closed?: boolean
  // 错误编码
  errorCode?: string
  // 错误消息
  errorMsg?: string
  // 客户端IP
  clientIp?: string
}
