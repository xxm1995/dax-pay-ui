import { defHttp } from '/@/utils/http/axios'
import { Result, PageResult } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<WechatPayRecord>>>({
    url: '/wechat/pay/record/page',
    params,
  })
}

/**
 * 获取详情
 */
export function get(id) {
  return defHttp.get<Result<WechatPayRecord>>({
    url: '/wechat/pay/record/findById',
    params: { id },
  })
}

/**
 * 记录
 */
export interface WechatPayRecord extends BaseEntity {
  // 标题
  title?: string
  // 业务类型
  type?: string
  // 金额
  amount?: string
  // 交易订单号
  orderId?: string
  // 交易订单号
  gatewayOrderNo?: string
  // 终端ip
  ip?: string
  // 网关时间
  gatewayTime?: string
}
