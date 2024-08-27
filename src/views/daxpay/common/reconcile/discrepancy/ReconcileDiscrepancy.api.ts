import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 任务分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<ReconcileDiscrepancy[]>>>({
    url: '/reconcile/discrepancy/page',
    method: 'get',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<ReconcileDiscrepancy>>({
    url: '/reconcile/discrepancy/findById',
    params: { id },
  })
}

/**
 * 对账差异记录
 */
export interface ReconcileDiscrepancy extends MchEntity {
  /** 对账名称 */
  name?: string

  /** 对账单ID */
  reconcileId?: string

  /** 对账号 */
  reconcileNo?: string

  /** 对账日期 */
  reconcileDate?: string

  /** 支付通道 */
  channel?: string

  /** 差异类型 */
  discrepancyType?: string

  /* 平台侧信息 */
  /** 平台交易号 */
  tradeNo?: string

  /** 商户订单号 */
  bizTradeNo?: string

  /** 商户关联平台订单号 */
  outTradeNo?: string

  /**
   * 交易类型
   * @see TradeTypeEnum
   */
  tradeType?: string

  /** 交易金额 */
  tradeAmount?: number

  /** 交易状态 */
  tradeStatus?: string

  /** 交易时间 */
  tradeTime?: string

  /* 通道侧信息 */
  /** 通道交易号 */
  channelTradeNo?: string

  /** 通道关联平台交易号 */
  channelOutTradeNo?: string

  /** 通道交易类型 */
  channelTradeType?: string

  /** 通道交易金额 */
  channelTradeAmount?: number

  /** 通道交易状态 */
  channelTradeStatus?: string

  /** 通道交易时间 */
  channelTradeTime?: string
}
