import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<Wallet>>>({
    url: '/wallet/admin/page',
    params,
  })
}

/**
 * 分页(未开通钱包的用户)
 */
export function pageByNotWallet(params) {
  return defHttp.get<Result<PageResult<Wallet>>>({
    url: '/wallet/admin/pageByNotWallet',
    params: params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<Wallet[]>>({
    url: '/wallet/admin/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<Wallet>>({
    url: '/wallet/admin/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: Wallet) {
  return defHttp.post({
    url: '/wallet/admin/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: Wallet) {
  return defHttp.post({
    url: '/wallet/admin/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/wallet/admin/delete',
    params: { id },
  })
}

/**
 * 获取钱包详情
 */
export function getWalletInfo(walletId) {
  return defHttp.get<Result<Wallet>>({
    url: '/wallet/admin/getWalletInfo',
    params: { walletId },
  })
}

/**
 * 批量开通钱包
 */
export function createWalletBatch(params, data) {
  return defHttp.post({
    url: '/wallet/admin/createWalletBatch',
    params: params,
    data: data,
  })
}

/**
 * 锁定钱包
 */
export function lock(walletId) {
  return defHttp.post({
    url: '/wallet/admin/lock',
    params: { walletId },
  })
}

/**
 * 解锁钱包
 */
export function unlock(walletId) {
  return defHttp.post({
    url: '/wallet/admin/unlock',
    params: { walletId },
  })
}

/**
 * 钱包余额变动
 */
export function changerBalance(obj) {
  return defHttp.post({
    url: '/wallet/admin/changerBalance',
    data: obj,
  })
}

/**
 * 查询用户钱包
 */
export function findByUser() {
  return defHttp.get<Result<Wallet>>({
    url: '/wallet/findByUser',
  })
}

/**
 * 开通钱包
 */
export function createWallet() {
  return defHttp.post<Result<void>>({
    url: '/wallet/createWallet',
  })
}

/**
 * 钱包
 */
export interface Wallet extends BaseEntity {
  // 关联用户id
  userId?: string
  // 关联用户名称
  userName?: string
  // 余额
  balance?: number
  // 预冻结额度
  freezeBalance?: number
  // 状态
  status?: string
}
