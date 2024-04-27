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
export function get(id) {
  return defHttp.get<Result<PayCallbackRecord>>({
    url: '/record/callback/findById',
    params: { id },
  })
}

/**
 * 支付回调记录
 */
export interface PayCallbackRecord extends BaseEntity {
  // 交易号
  tradeNo?: string
  // 外部交易号
  outTradeNo?: string
  // 支付通道
  channel?: string
  // 回调类型
  callbackType?: string
  // 通知消息
  notifyInfo?: string
  // 回调处理状态
  status?: string
  // 修复号
  repairNo?: string
  // 提示信息
  msg?: string
}
