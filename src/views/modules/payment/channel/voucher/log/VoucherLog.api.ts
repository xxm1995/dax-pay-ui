import { PageResult, Result } from '/#/axios'
import { defHttp } from '/@/utils/http/axios'
import { BaseEntity } from '/#/web'

/**
 * 根据储值卡Id查询日志分页
 */
export function pageByVoucherId(params) {
  return defHttp.get<Result<PageResult<VoucherLog>>>({
    url: '/voucher/log/pageByVoucherId',
    params,
  })
}

/**
 * 储值卡日志
 */
export interface VoucherLog extends BaseEntity {
  /** 储值卡id */
  voucherId: string
  /** 储值卡号 */
  voucherNo: string
  /** 金额 */
  amount: number
  /** 类型 */
  type: string
  /** 交易记录ID */
  paymentId: string
  /** 业务ID */
  businessId: string
  /** 备注 */
  remark: string
}
