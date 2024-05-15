import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 对账差异分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<ReconcileDiff>>>({
    url: '/order/reconcile/diff/page',
    params,
  })
}

/**
 * 对账差异详情
 */
export function get(id: string) {
  return defHttp.get<Result<ReconcileDiff>>({
    url: '/order/reconcile/diff/findById',
    params: { id },
  })
}

/**
 * 通用支付对账记录
 */
export interface ReconcileDiff extends BaseEntity {
  // 商品名称
  title?: string
  // 关联对账订单ID
  recordOrderId?: string
  // 对账号
  reconcileNo?: string
  // 对账日期
  reconcileDate?: string
  // 交易类型
  tradeType?: string
  // 本地交易号
  tradeNo?: string
  // 通道交易号
  outTradeNo?: string
  // 交易时间
  tradeTime?: string
  // 交易金额
  amount?: number
  // 通道交易金额
  outAmount?: number
  // 差异类型
  diffType?: string
  // 差异内容
  diffs?: DiffInfo[]
}

/**
 * 差异内容
 */
export interface DiffInfo {
  // 字段名
  fieldName?: string
  // 本地订单字段值
  localValue?: string
  // 网关订单字段值
  gatewayValue?: string
}
