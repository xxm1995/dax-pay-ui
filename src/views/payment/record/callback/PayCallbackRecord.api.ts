import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<PayNotifyRecord>>>({
    url: '/record/callback/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(paymentId) {
  return defHttp.get<Result<PayNotifyRecord>>({
    url: '/record/callback/findById',
    params: { paymentId },
  })
}

/**
 * 支付回调记录
 */
export interface PayNotifyRecord extends BaseEntity {
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
