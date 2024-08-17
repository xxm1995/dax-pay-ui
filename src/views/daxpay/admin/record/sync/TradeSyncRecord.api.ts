import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<TradeSyncRecord>>>({
    url: '/record/sync/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<TradeSyncRecord>>({
    url: '/record/sync/findById',
    params: { id },
  })
}

/**
 * 支付同步记录
 */
export interface TradeSyncRecord extends MchEntity {
  // 平台交易号
  tradeNo?: string
  // 商户交易号
  bizTradeNo?: string
  // 通道交易号
  outTradeNo?: string
  // 通道返回的状态
  outTradeStatus?: string
  // 同步类型
  tradeType?: string
  // 同步通道
  channel?: string
  // 通知消息
  syncInfo?: string
  // 是否进行调整
  adjust?: boolean
  // 错误消息
  errorCode?: string
  // 错误消息
  errorMsg?: string
  // 同步时间
  createTime?: string
  // 终端ip
  clientIp?: string
}
