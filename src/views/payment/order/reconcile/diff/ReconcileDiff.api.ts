import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 对账差异分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<ReconcileRecord>>>({
    url: '/order/reconcile/diff/page',
    params,
  })
}

/**
 * 对账差异详情
 */
export function get(id: string) {
  return defHttp.get<Result<ReconcileRecord>>({
    url: '/order/reconcile/diff/findById',
    params: { id },
  })
}

/**
 * 通用支付对账记录
 */
export interface ReconcileRecord extends BaseEntity {
  // 关联对账订单ID
  recordOrderId?: string
  // 交易类型
  type?: string
  // 订单id
  paymentId?: string
  // 订单id
  refundId?: string
  // 网关订单号
  gatewayOrderNo?: string
  // 交易金额
  amount?: string
  // 商品名称
  title?: string
  // 差异内容
  diffs?: ReconcileDiff[]
}

/**
 * 差异内容
 */
export interface ReconcileDiff {
  // 字段名
  fieldName?: string
  // 本地订单字段值
  localValue?: string
  // 网关订单字段值
  gatewayValue?: string
}
