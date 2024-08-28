import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { UserInfo } from '@/views/iam/user/User.api'
import { Role } from '@/views/iam/role/Role.api'

/**
 * 用户列表
 */
export function page(params) {
  return defHttp.get<Result<PageResult<UserInfo[]>>>({
    url: '/merchant/user/page',
    params,
  })
}

/**
 * 用户详情
 */
export function get(id) {
  return defHttp.get<Result<UserInfo>>({
    url: '/merchant/user/findById',
    params: { id },
  })
}

/**
 * 添加用户
 */
export function add(params) {
  return defHttp.post<Result>({
    url: '/merchant/user/add',
    data: params,
  })
}

/**
 * 修改用户
 */
export function update(params) {
  return defHttp.post<Result>({
    url: '/merchant/user/update',
    data: params,
  })
}

/**
 * 重置密码
 */
export function restartPassword(userId, newPassword) {
  return defHttp.post({
    url: '/merchant/user/restartPassword',
    data: { userId, newPassword },
  })
}

/**
 * 批量重置密码
 */
export function restartPasswordBatch(userIds, newPassword) {
  return defHttp.post({
    url: '/merchant/user/restartPasswordBatch',
    data: { userIds, newPassword },
  })
}

/**
 * 分配角色
 */
export function addUserRole(params) {
  return defHttp.post<Result>({
    url: '/merchant/user/assignRole',
    data: params,
  })
}

/**
 * 分配角色 批量
 */
export function addUserRoleBatch(data) {
  return defHttp.post({
    url: `/merchant/user/assignRoleBatch`,
    data: data,
  })
}

/**
 * 获取用户拥有角色id集合
 */
export function getRoleIds(userId) {
  return defHttp.get<Result<string[]>>({
    url: `/merchant/user/findRoleIdsByUser`,
    params: { userId },
  })
}

/**
 * 获取用户拥有角色集合
 */
export function getRoles(userId) {
  return defHttp.get<Result<Role[]>>({
    url: `/merchant/user/findRolesByUser`,
    params: { userId },
  })
}
