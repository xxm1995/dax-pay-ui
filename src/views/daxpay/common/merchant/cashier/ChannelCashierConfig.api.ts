import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 配置列表
 */
export function findAll(appId) {
  return defHttp.get<Result<ChannelCashierConfig[]>>({
    url: '/channel/cashier/config/findByAppId',
    params: { appId },
  })
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
 * 配置是否存在
 */
export function existsByType(appId, type) {
  return defHttp.get<Result<boolean>>({
    url: '/channel/cashier/config/existsByType',
    params: { appId, type },
  })
}

/**
 * 配置是否存在
 */
export function existsByTypeNotId(appId, type, id) {
  return defHttp.get<Result<boolean>>({
    url: '/channel/cashier/config/existsByTypeNotId',
    params: { appId, type, id },
  })
}

/**
 * 配置保存
 */
export function add(data: ChannelCashierConfig) {
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
    url: '/channel/cashier/config/delete',
    params: { id },
  })
}

/**
 * 获取码牌地址
 */
export function getQrCodeUrl(appId) {
  return defHttp.get<Result<string>>({
    url: '/channel/cashier/config/qrCodeUrl',
    params: { appId },
  })
}

/**
 * 通道收银台配置
 */
export interface ChannelCashierConfig extends MchEntity {
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
  // 备注
  remark?: string
}
