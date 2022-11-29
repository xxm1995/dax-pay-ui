import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<RefundRecord>>>({
    url: '/pay/refund/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<RefundRecord[]>>({
    url: '/pay/refund/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<RefundRecord>>({
    url: '/pay/refund/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: RefundRecord) {
  return defHttp.post({
    url: '/pay/refund/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: RefundRecord) {
  return defHttp.post({
    url: '/pay/refund/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/pay/refund/delete',
    params: { id },
  })
}

/**
 * 退款记录
 */
export interface RefundRecord extends BaseEntity {
  // 支付记录id
  paymentId?: string
  // 关联业务id
  businessId?: string
  // 异步方式关联退款请求号
  refundRequestNo?: string
  // 用户id
  userId?: string
  // 标题
  title?: string
  // 金额
  amount?: number
  // 剩余可退款金额
  refundableBalance?: number
  // 可退款信息
  refundableInfo?: string
  // 退款状态
  refundStatus?: number
  // 支付时间
  refundTime?: string
  // 客户ip
  clientIp?: string
  // 错误码
  errorCode?: string
  // 错误信息
  errorMsg?: string
}
