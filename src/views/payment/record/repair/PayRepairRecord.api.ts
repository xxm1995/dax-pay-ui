import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<PayRepairRecord>>>({
    url: '/record/repair/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<PayRepairRecord>>({
    url: '/record/repair/findById',
    params: { id },
  })
}

/**
 * 支付回调记录
 */
export interface PayRepairRecord extends BaseEntity {
  // 修复号
  repairNo?: string
  // 本地订单ID
  tradeId?: string
  // 本地业务号
  tradeNo?: string
  // 类型  支付修复/退款修复
  repairType?: string
  // 修复来源
  repairSource?: string
  // 修复类型
  repairWay?: string
  // 修复的异步支付通道
  channel?: string
  // 修复前状态
  beforeStatus?: string
  // 修复后状态
  afterStatus?: string
}
