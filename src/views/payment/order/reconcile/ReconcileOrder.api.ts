import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params: any) {
  return defHttp.get<PageResult<ReconcileOrder>>({
    url: '/reconcile/page',
    params,
  })
}

/**
 * 查看单条
 */
export function get(id: string) {
  return defHttp.get<ReconcileOrder>({
    url: '/reconcile/get',
    params: { id },
  })
}

/**
 * 支付对账订单
 */
export interface ReconcileOrder extends BaseEntity {
  // 批次号
  batchNo?: string
  // 日期
  date?: string
  // 通道
  channel?: string
  // 是否下载成功
  down?: boolean
  // 是否比对完成
  compare?: boolean
  // 错误信息
  errorMsg?: string
}

/**
 * 通用支付对账记录
 */
export interface ReconcileDetail extends BaseEntity {
  // 关联对账订单ID
  recordOrderId?: string
  // 交易状态
  status?: string
  // 交易类型
  type?: string
  // 订单id
  orderId?: string
  // 网关订单号
  gatewayOrderNo?: string
  // 交易金额
  amount?: string
  // 商品名称
  title?: string
}
