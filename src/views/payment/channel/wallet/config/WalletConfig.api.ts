import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity, KeyValue } from '/#/web'

/**
 * 获取单条
 */
export function getConfig() {
  return defHttp.get<Result<WalletConfig>>({
    url: '/wallet/config/getConfig',
  })
}

/**
 * 更新
 */
export function update(obj: WalletConfig) {
  return defHttp.post({
    url: '/wallet/config/update',
    data: obj,
  })
}

/**
 * 获取支持的支付方式
 */
export function findPayWays() {
  return defHttp.get<Result<KeyValue[]>>({
    url: '/wallet/config/findPayWays',
  })
}

/**
 * 钱包配置
 */
export interface WalletConfig extends BaseEntity {
  // 是否启用
  enable?: boolean
  // 单次支持支持多少钱
  limitAmount?: number
  // 支持的支付类型
  payWays?: string[]
  // 备注
  remark?: string
}
