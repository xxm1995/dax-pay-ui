import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'

/**
 * 支付金额
 */
export function getPayAmount(params: CockpitReportQuery) {
  return defHttp.get<Result<number>>({
    url: '/report/cockpit//getPayAmount',
    method: 'post',
    params: params,
  })
}
/**
 * 退款金额
 */
export function getRefundAmount(params: CockpitReportQuery) {
  return defHttp.get<Result<number>>({
    url: '/report/cockpit/getRefundAmount',
    method: 'post',
    params: params,
  })
}
/**
 * 退款金额
 */
export function getPayOrderCount(params: CockpitReportQuery) {
  return defHttp.get<Result<number>>({
    url: '/report/cockpit/getPayOrderCount',
    method: 'post',
    params: params,
  })
}
/**
 * 退款金额
 */
export function getRefundOrderCount(params: CockpitReportQuery) {
  return defHttp.get<Result<number>>({
    url: '/report/cockpit/getRefundOrderCount',
    method: 'post',
    params: params,
  })
}
/**
 * 退款金额
 */
export function getPayChannelInfo(params: CockpitReportQuery) {
  return defHttp.get<Result<ChannelLineReport[]>>({
    url: '/report/cockpit/getPayChannelInfo',
    method: 'post',
    params: params,
  })
}
/**
 * 退款金额
 */
export function getRefundChannelInfo(params: CockpitReportQuery) {
  return defHttp.get<Result<ChannelLineReport[]>>({
    url: '/report/cockpit/getRefundChannelInfo',
    method: 'post',
    params: params,
  })
}

/**
 * 支付通道折线图报表
 */
export interface ChannelLineReport {
  // 支付通道编码
  channelCode: string
  // 支付通道名称
  channelName: string
  // 订单金额
  orderAmount: number
  // 订单数量
  orderCount: number
}

/**
 * 查询条件
 */
export interface CockpitReportQuery {
  // 开始时间
  startTime: string
  // 结束时间
  endTime: string
}
