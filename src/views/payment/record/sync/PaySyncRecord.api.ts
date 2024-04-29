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
  // 本地订单id
  orderId?: string
  // 本地业务号
  orderNo?: string
  // 网关订单号
  gatewayOrderNo?: string
  // 同步类型
  syncType?: string
  // 同步通道
  asyncChannel?: string
  // 通知消息
  syncInfo?: string
  // 网关返回状态
  gatewayStatus?: string
  // 是否进行修复
  repairOrder?: boolean
  // 修复号
  repairOrderNo?: boolean
  // 错误消息
  errorMsg?: string
  // 同步时间
  createTime?: string
  // 终端ip
  clientIp?: string
  // 请求链路ID
  reqId?: string
}
