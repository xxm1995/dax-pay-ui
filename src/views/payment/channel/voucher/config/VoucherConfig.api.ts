import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity, KeyValue } from '/#/web'

/**
 * 获取单条
 */
export function getConfig() {
  return defHttp.get<Result<VoucherConfig>>({
    url: '/voucher/config/getConfig',
  })
}

/**
 * 更新
 */
export function update(obj: VoucherConfig) {
  return defHttp.post({
    url: '/voucher/config/update',
    data: obj,
  })
}

/**
 * 获取支持的支付方式
 */
export function findPayWays() {
  return defHttp.get<Result<KeyValue[]>>({
    url: '/voucher/config/findPayWays',
  })
}

/**
 * 储值卡配置
 */
export interface VoucherConfig extends BaseEntity {
  // 是否启用
  enable?: boolean
  // 单次支持支持多少钱
  singleLimit?: number
  // 支持的支付类型
  payWays?: string[]
  // 备注
  remark?: string
}
