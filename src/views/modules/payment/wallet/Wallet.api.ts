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
 * 分页(未开通钱包的用户)
 */
export function pageByNotWallet(params) {
  return defHttp.get<Result<PageResult<Wallet>>>({
    url: '/wallet/pageByNotWallet',
    params: params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<Wallet[]>>({
    url: '/wallet/findAll',
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
 * 添加
 */
export function add(obj: Wallet) {
  return defHttp.post({
    url: '/wallet/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: Wallet) {
  return defHttp.post({
    url: '/wallet/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/wallet/delete',
    params: { id },
  })
}

/**
 * 获取钱包详情
 */
export function getWalletInfo(walletId) {
  return defHttp.get<Result<Wallet>>({
    url: '/wallet/getWalletInfo',
    params: { walletId },
  })
}

/**
 * 批量开通钱包
 */
export function createWalletBatch(obj) {
  return defHttp.post({
    url: '/wallet/createWalletBatch',
    data: obj,
  })
}

/**
 * 锁定钱包
 */
export function lock(walletId) {
  return defHttp.post({
    url: '/wallet/lock',
    params: { walletId },
  })
}

/**
 * 解锁钱包
 */
export function unlock(walletId) {
  return defHttp.post({
    url: '/wallet/unlock',
    params: { walletId },
  })
}

/**
 * 钱包余额变动
 */
export function changerBalance(obj) {
  return defHttp.post({
    url: '/wallet/changerBalance',
    data: obj,
  })
}

/**
 * 根据用户查询钱包
 */
export function findByUser() {
  return defHttp.get({
    url: '/wallet/findByUser',
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
