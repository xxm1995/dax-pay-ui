import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 获取单条
 */
export function get(id: string) {
  return defHttp.get<Result<WalletConfig>>({
    url: '/alipay/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: WalletConfig) {
  return defHttp.post({
    url: '/alipay/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: WalletConfig) {
  return defHttp.post({
    url: '/alipay/update',
    data: obj,
  })
}

/**
 * 支付宝配置
 */
export interface WalletConfig extends BaseEntity {
  // 商户编码
  mchCode?: string
  // 商户应用编码
  mchAppCode?: string
  // 默认余额
  defaultBalance?: number
  // 备注
  remark?: string
}
