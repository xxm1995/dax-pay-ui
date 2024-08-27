import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<TradeFlowRecord>>>({
    url: '/record/flow/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<TradeFlowRecord>>({
    url: '/record/flow/findById',
    params: { id },
  })
}

/**
 * 金额汇总
 */
export function amountSummary(params) {
  return defHttp.get<Result<any>>({
    url: '/record/flow/summary',
    params,
  })
}

/**
 * 支付同步记录
 */
export interface TradeFlowRecord extends MchEntity {
  // 订单标题
  title?: string
  // 金额
  amount?: number
  // 业务类型
  type?: string
  // 同步通道
  channel?: string
  // 修复号
  tradeNo?: string
  // 商户交易号
  bizTradeNo?: string
  // 通道交易号
  outTradeNo?: string
}
