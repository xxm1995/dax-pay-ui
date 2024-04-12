import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 获取可以分账的通道
 */
export function findChannels() {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/order/allocation/findChannels',
  })
}

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<AllocationOrder>>>({
    url: '/order/allocation/page',
    params,
  })
}

/**
 * 查询详情
 */
export function get(id) {
  return defHttp.get<Result<AllocationOrder>>({
    url: '/order/allocation/findById',
    params: { id },
  })
}

/**
 * 明细列表
 */
export function detailList(orderId) {
  return defHttp.get<Result<AllocationOrderDetail[]>>({
    url: '/order/allocation/detail/findAll',
    params: { orderId },
  })
}

/**
 * 明细详情
 */
export function detail(id) {
  return defHttp.get<Result<AllocationOrderDetail>>({
    url: '/order/allocation/detail/findById',
    params: { id },
  })
}

/**
 * 查询分账结果
 */
export function sync(id){
  return defHttp.post<Result<AllocationOrder>>({
    url: '/order/allocation/sync',
    params: { id },
  })
}

/**
 * 分账订单
 */
export interface AllocationOrder extends BaseEntity {
  // 支付订单ID
  paymentId?: string
  // 分账订单号
  orderNo?: string
  // 支付标题
  title?: string
  // 网关支付订单号
  gatewayPayOrderNo?: string
  // 网关分账单号
  gatewayAllocationNo?: string
  // 分账单号
  allocationNo?: string
  // 外部请求号
  outReqNo?: string
  // 所属通道
  channel?: string
  // 总分账金额
  amount?: number
  // 分账描述
  description?: string
  // 状态
  status?: string
  // 错误原因
  errorMsg?: string
  // 完成时间
  finishTime?: string
}

/**
 * 分账订单明细
 */
export interface AllocationOrderDetail extends BaseEntity {
  // 分账订单ID
  orderId?: string
  // 分账明细单号
  receiverId?: string
  // 比例
  rate: number
  // 金额
  amount: number
  // 分账接收方类型
  receiverType?: string
  // 接收方账号
  receiverAccount?: string
  // 接收方姓名
  receiverName?: string
}
