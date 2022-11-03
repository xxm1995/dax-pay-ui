import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<UserInfo>>>({
    url: '/user/admin/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<UserInfo>>({
    url: '/user/admin/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: UserInfo) {
  return defHttp.post({
    url: '/user/admin/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: UserInfo) {
  return defHttp.post({
    url: '/user/admin/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/user/admin/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<Array<UserInfo>>>({
    url: '/user/admin/findAll',
  })
}
/**
 * 重置密码
 */
export function restartPassword(userId, newPassword) {
  return defHttp.post({
    url: '/user/admin/restartPassword',
    params: { userId, newPassword },
  })
}

/**
 * 锁定用户
 */
export function lockUser(userId) {
  return defHttp.post({
    url: '/user/admin/lock',
    params: { userId },
  })
}

/**
 * 锁定用户 批量
 */
export function lockUserBatch(userIds) {
  return defHttp.post({
    url: '/user/admin/lockBatch',
    data: userIds,
  })
}

/**
 * 解锁用户
 */
export function unlockUser(userId) {
  return defHttp.post({
    url: '/user/admin/unlock',
    params: { userId },
  })
}

/**
 * 解锁用户
 */
export function unlockUserBatch(userIds) {
  return defHttp.post({
    url: '/user/admin/unlockBatch',
    method: 'POST',
    data: userIds,
  })
}

/**
 * 用户信息
 */
export interface UserInfo extends BaseEntity {
  // 名称
  name: string
  // 账号
  username: string
  // 密码
  password: string
  // 手机号
  phone: string
  // 邮箱
  email: string
  // 关联终端ds
  clientIds: string
  // 头像
  avatar: string
  // 注册来源
  source: string
  // 是否超级管理员
  admin: boolean
  // 注册时间
  registerTime: string
  // 账号状态
  status: number
}
