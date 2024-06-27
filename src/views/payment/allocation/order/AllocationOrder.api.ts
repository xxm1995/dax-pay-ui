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
 * 获取订单详细信息
 */
export function getOrderByAllocNo(allocNo: string) {
  return defHttp.get<Result>({
    url: '/order/allocation/findByAllocNo',
    params: { allocNo },
  })
}

/**
 * 扩展信息
 */
export function getExtra(id) {
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
 * 分账完结
 */
export function finish(allocNo) {
  return defHttp.post<Result<AllocationOrder>>({
    url: '/order/allocation/finish',
    params: { allocNo },
  })
}

/**
 * 分账完结
 */
export function retry(bizAllocNo) {
  return defHttp.post<Result<AllocationOrder>>({
    url: '/order/allocation/retry',
    params: { bizAllocNo },
  })
}

/**
 * 查询分账结果
 */
export function sync(allocNo) {
  return defHttp.post<Result<AllocationOrder>>({
    url: '/order/allocation/sync',
    params: { allocNo },
  })
}

/**
 * 分账订单
 */
export interface AllocationOrder extends BaseEntity {
  // 分账单号
  allocNo?: string
  // 商户分账单号
  bizAllocNo?: string
  // 通道分账号
  outAllocNo?: string
  // 支付订单ID
  orderId?: string
  // 支付订单号
  orderNo?: string
  // 商户支付订单号
  bizOrderNo?: string
  // 外部系统支付订单号
  outOrderNo?: string
  // 支付订单标题
  title?: string
  // 所属通道
  channel?: string
  // 总分账金额
  amount?: number
  // 分账描述
  description?: string
  // 状态
  status?: string
  // 处理结果
  result?: string
  // 完成时间
  finishTime?: string
  // 异步通知地址
  notifyUrl?: string
  // 商户扩展参数
  attach?: string
  // 附加参数
  extraParam?: string
  // 请求时间
  reqTime?: string
  // 支付终端ip
  clientIp?: string
  // 错误码
  errorCode?: string
  // 错误原因
  errorMsg?: string
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
  // 接收方编号
  receiverNo?: string
  // 分账结果
  result?: string
  // 错误代码
  errorCode?: string
  // 错误原因
  errorMsg?: string
  // 完成时间
  finishTime?: string
}
