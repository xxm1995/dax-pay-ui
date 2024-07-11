import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { Role } from '@/views/iam/role/Role.api'

/**
 * 获取用户拥有角色id集合
 */
export function getRoleIds(id) {
  return defHttp.get<Result<string[]>>({
    url: `/user/role/findRoleIdsByUser`,
    params: { id },
  })
}

/**
 * 获取用户拥有角色集合
 */
export function getRoles(id) {
  return defHttp.get<Result<Role[]>>({
    url: `/user/role/findRolesByUser`,
    params: { id },
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
