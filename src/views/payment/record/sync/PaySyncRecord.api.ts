import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<SyncRecord>>>({
    url: '/record/sync/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<SyncRecord>>({
    url: '/record/sync/findById',
    params: { id },
  })
}

/**
 * 支付同步记录
 */
export interface SyncRecord extends BaseEntity {
  // 本地交易号
  tradeNo?: string
  // 商户交易号
  bizTradeNo?: string
  // 三方交易号
  outTradeNo?: string
  // 同步类型
  syncType?: string
  // 同步通道
  channel?: string
  // 通知消息
  syncInfo?: string
  // 三方支付返回状态
  outTradeStatus?: string
  // 是否进行修复
  repair?: boolean
  // 修复号
  repairNo?: string
  // 错误消息
  errorCode?: string
  // 错误消息
  errorMsg?: string
  // 同步时间
  createTime?: string
  // 终端ip
  clientIp?: string
}
