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
export function get(paymentId) {
  return defHttp.get<Result<SyncRecord>>({
    url: '/record/sync/findById',
    params: { paymentId },
  })
}

/**
 * 支付同步记录
 */
export interface SyncRecord extends BaseEntity {
  // 支付记录id
  paymentId?: string
  // 业务号
  businessNo?: string
  // 同步通道
  asyncChannel?: string
  // 通知消息
  syncInfo?: string
  // 同步状态
  status?: string
  // 是否进行修复
  repairOrder?: boolean
  // 错误消息
  errorMsg?: string
  // 同步时间
  syncTime?: string
}
