import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<Wallet>>>({
    url: '/wallet/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<Wallet>>({
    url: '/wallet/findById',
    params: { id },
  })
}

/**
 * 判断用户是否开通了钱包
 */
export function existsByUserId(userId: string){
  return defHttp.get<Result<boolean>>({
    url: '/wallet/existsByUserId',
    params: { userId },
  })
}

/**
 * 开通钱包
 */
export function create(params) {
  return defHttp.post<Result<Wallet>>({
    url: '/wallet/create',
    data: params,
  })
}

/**
 * 充值
 */
export function recharge(params) {
  return defHttp.post<Result<Wallet>>({
    url: '/wallet/recharge',
    data: params,
  })
}

/**
 * 扣减
 */
export function deduct(params) {
  return defHttp.post<Result<Wallet>>({
    url: '/wallet/deduct',
    data: params,
  })
}

/**
 * 钱包
 */
export interface Wallet extends BaseEntity {
  // 钱包关联的账号ID
  userId?: string
  // 钱包名称
  name?: string
  // 钱包余额
  balance?: string
  // 状态
  status?: string
}
