import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'
import { WalletOperationEnum } from '/@/enums/payment/walletEnum'

/**
 * 分页
 */
export function pageByWalletId(params) {
  return defHttp.get<Result<PageResult<WalletLog>>>({
    url: '/wallet/log/pageByWalletId',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<WalletLog>>({
    url: '/wallet/log/findById',
    params: { id },
  })
}

/**
 * 钱包日志
 */
export interface WalletLog extends BaseEntity {
  // 钱包id
  walletId?: string
  // 用户id
  userId?: string
  // 类型
  type?: string
  // 交易记录ID
  paymentId?: string
  // 操作终端ip
  clientIp?: string
  // 备注
  remark?: string
  // 业务ID
  businessId?: string
  // 操作源
  operationSource?: WalletOperationEnum
  // 金额
  amount?: number
}
