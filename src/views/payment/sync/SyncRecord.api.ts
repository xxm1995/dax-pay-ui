import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<SyncRecord>>>({
    url: '/pay/sync/page',
    params,
  })
}


/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<SyncRecord>>({
    url: '/pay/sync/findById',
    params: { id },
  })
}

/**
 * 支付同步记录
 */
export interface SyncRecord extends BaseEntity {
  // 支付记录id
  paymentId?: string
  // 商户编码
  mchCode?: string
  // 商户应用编码
  mchAppCode?: string
  // 支付通道
  payChannel?: string
  // 通知消息
  syncInfo?: string
  // 同步状态
  status?: string
  // 同步时间
  syncTime?: string
}
