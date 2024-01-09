import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<PayCloseRecord>>>({
    url: '/record/close/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<PayCloseRecord>>({
    url: '/record/close/findById',
    params: { id },
  })
}

/**
 * 支付回调记录
 */
export interface PayCloseRecord extends BaseEntity {
  // 支付号
  paymentId?: string
  // 业务号
  businessNo?: string
  // 修复来源
  repairSource?: string
  // 修复类型
  repairType?: string
  // 修复的异步支付通道
  asyncChannel?: string
  // 修复前状态
  beforeStatus?: string
  // 修复后状态
  afterStatus?: string
  // 金额变动
  amount?: string
}
