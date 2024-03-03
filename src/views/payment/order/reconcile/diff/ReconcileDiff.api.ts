import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 对账差异分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<ReconcileDetail>>>({
    url: '/order/reconcile/diff/page',
    params,
  })
}

/**
 * 对账差异详情
 */
export function get(id: string) {
  return defHttp.get<Result<ReconcileDetail>>({
    url: '/order/reconcile/diff/findById',
    params: { id },
  })
}

/**
 * 通用支付对账记录
 */
export interface ReconcileDetail extends BaseEntity {
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
}
