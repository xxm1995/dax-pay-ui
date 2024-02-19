import { defHttp } from '/@/utils/http/axios'
import { Result, PageResult } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<WalletRecord>>>({
    url: '/wallet/record/page',
    params,
  })
}

/**
 * 获取详情
 */
export function get(id) {
  return defHttp.get<Result<WalletRecord>>({
    url: '/wallet/record/findById',
    params: { id },
  })
}

/**
 * 钱包记录
 */
export interface WalletRecord extends BaseEntity {
  // 钱包id
  walletId?: string
  // 标题
  title?: string
  // 业务类型
  type?: string
  // 金额
  amount?: string
  // 变动之前的金额
  oldAmount?: string
  // 变动之后的金额
  newAmount?: string
  // 交易订单号
  orderId?: string
  // 终端ip
  ip?: string
}
