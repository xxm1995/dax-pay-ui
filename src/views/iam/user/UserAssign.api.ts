import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { Role } from '@/views/iam/role/Role.api'

/**
 * 获取用户拥有角色id集合
 */
export function getRoleIds(userId) {
  return defHttp.get<Result<string[]>>({
    url: `/user/role/findRoleIdsByUser`,
    params: { userId },
  })
}

/**
 * 获取用户拥有角色集合
 */
export function getRoles(userId) {
  return defHttp.get<Result<Role[]>>({
    url: `/user/role/findRolesByUser`,
    params: { userId },
  })
}

/**
 * 添加用户角色关联关系
 */
export function addUserRole(data) {
  return defHttp.post({
    url: `/user/role/saveAssign`,
    data: data,
  })
}

/**
 * 添加用户角色关联关系 批量
 */
export function addUserRoleBatch(data) {
  return defHttp.post({
    url: `/user/role/saveAssignBatch`,
    data: data,
  })
}
