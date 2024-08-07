import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

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
 * 支付同步记录
 */
export interface TradeFlowRecord extends BaseEntity {
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
