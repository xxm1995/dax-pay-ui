import { defHttp } from '/@/utils/http/axios'
import { Result, PageResult } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<CashRecord[]>>>({
    url: '/cash/record/page',
    params,
  })
}

/**
 * 详情
 */
export function get(id) {
  return defHttp.get<Result<CashRecord>>({
    url: '/cash/record/findById',
    params: { id },
  })
}

/**
 * 现金记录
 */
export interface CashRecord extends BaseEntity {
  // 类型
  type: string
  // 金额
  amount: string
  // 交易订单号
  orderId: string
  // 地址
  ip: string
  // 备注
  remark: string
}
