import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 创建对账订单
 */
export function create(params: any) {
  return defHttp.post<ReconcileOrder>({
    url: '/order/reconcile/create',
    data: params,
  })
}

/**
 * 分页
 */
export function page(params: any) {
  return defHttp.get<Result<PageResult<ReconcileOrder>>>({
    url: '/order/reconcile/page',
    params,
  })
}

/**
 * 查看单条
 */
export function get(id: string) {
  return defHttp.get<Result<ReconcileOrder>>({
    url: '/order/reconcile/findById',
    params: { id },
  })
}

/**
 * 明细分页
 */
export function pageDetail(params) {
  return defHttp.get<Result<PageResult<ReconcileDetail>>>({
    url: '/order/reconcile/pageDetail',
    params,
  })
}

/**
 * 明细详情
 */
export function getDetail(id: string) {
  return defHttp.get<Result<ReconcileDetail>>({
    url: '/order/reconcile/findDetailById',
    params: { id },
  })
}

/**
 * 下载对账单
 */
export function downAndSave(id: any) {
  return defHttp.post<any>({
    url: '/order/reconcile/downAndSave',
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
