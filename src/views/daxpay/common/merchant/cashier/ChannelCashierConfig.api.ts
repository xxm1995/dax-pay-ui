import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 配置列表
 */
export function findAll() {
  return defHttp.get<Result<MchEntity>>({ url: '/channel/cashier/config/list' })
}

/**
 * 配置详情
 */
export function get(id) {
  return defHttp.get<Result<ChannelCashierConfig>>({
    url: '/channel/cashier/config/findById',
    params: { id },
  })
}

/**
 * 配置保存
 */
export function save(data: ChannelCashierConfig) {
  return defHttp.post<Result<ChannelCashierConfig>>({
    url: '/channel/cashier/config/save',
    data,
  })
}

/**
 * 配置更新
 */
export function update(data: ChannelCashierConfig) {
  return defHttp.post<Result<ChannelCashierConfig>>({
    url: '/channel/cashier/config/update',
    data,
  })
}

/**
 * 配置删除
 */
export function remove(id) {
  return defHttp.post<Result<ChannelCashierConfig>>({
    url: '/channel/cashier/config/remove',
    params: { id },
  })
}

/**
 * 通道收银台配置
 */
export interface ChannelCashierConfig {
  // 商户号
  mchNo?: string
  // 应用号
  appId?: string
  // 收银台类型
  cashierType?: string
  // 收银台名称
  cashierName?: string
  // 支付通道
  channel?: string
  // 支付方式
  payMethod?: string
  // 是否开启分账
  allocation?: boolean
  // 自动分账
  autoAllocation?: boolean
}
