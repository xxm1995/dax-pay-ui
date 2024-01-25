import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<PayCallbackRecord>>>({
    url: '/record/callback/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(paymentId) {
  return defHttp.get<Result<PayCallbackRecord>>({
    url: '/record/callback/findById',
    params: { paymentId },
  })
}

/**
 * 支付回调记录
 */
export interface PayCallbackRecord extends BaseEntity {
  // 支付号
  paymentId?: string
  // 支付通道
  payChannel?: string
  // 通知消息
  notifyInfo?: string
  // 处理状态
  status?: string
  // 提示信息
  msg?: string
  // 回调时间
  notifyTime?: string
}
