import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'
import { Role } from "/@/views/modules/system/role/Role.api";
import { DataScope } from "/@/views/modules/system/scope/DataScope.api";
import { Dept } from "/@/views/modules/system/dept/Dept.api";

/**
 * 获取用户拥有部门id集合
 */
export function findDeptIdsByUser(id) {
  return defHttp.get<Result<string[]>>({
    url: `/user/dept/findIdsByUser`,
    params: { id },
  })
}

/**
 * 获取用户拥有部门集合
 */
export function getDeptList(id) {
  return defHttp.get<Result<Dept[]>>({
    url: `/user/dept/findAllByUser`,
    params: { id },
  })
}

/**
 * 添加用户部门关联关系
 */
export function addUserDept(data) {
  return defHttp.post({
    url: `/user/dept/saveAssign`,
    data: data,
  })
}

/**
 * 添加用户部门关联关系 批量
 */
export function addUserDeptBatch(data) {
  return defHttp.post({
    url: `/user/dept/saveAssignBatch`,
    data: data,
  })
}

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

/**
 * 获取用户拥有数据权限id集合
 */
export function getDataScopeIdByUser(id) {
  return defHttp.get<Result<string>>({
    url: `/user/data/scope/findDataScopeIdByUser`,
    params: { id },
  })
}

/**
 * 获取用户拥有数据权限集合
 */
export function getDataScopeByUser(id) {
  return defHttp.get<Result<DataScope>>({
    url: `/user/data/scope/findDataScopeByUser`,
    params: { id },
  })
}

/**
 * 添加用户数据权限关联关系
 */
export function addUserDataScope(data) {
  return defHttp.post({
    url: `/user/data/scope/saveAssign`,
    data: data,
  })
}

/**
 * 添加用户数据权限关联关系 批量
 */
export function addUserDataScopeBatch(data) {
  return defHttp.post({
    url: `/user/data/scope/saveAssignBatch`,
    data: data,
  })
}
