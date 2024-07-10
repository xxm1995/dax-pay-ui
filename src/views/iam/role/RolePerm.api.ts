import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { unref } from 'vue'
import { MenuTree } from '@/views/iam/perm/menu/Menu.api'
import { PermPathTree } from '@/views/iam/perm/path/PermPath.api'
import { PermCodeTree } from '@/views/iam/perm/code/PermCode.api'

/**
 * 添加角色菜单关联关系
 */
export function saveRoleMenu(obj) {
  return defHttp.post<Result<void>>({
    url: '/role/menu/save',
    data: unref(obj),
  })
}

/**
 * 指定角色下的菜单权限树
 */
export function treeByRoleMenu(roleId, clientCode) {
  return defHttp.get<Result<MenuTree[]>>({
    url: '/role/menu/treeByRole',
    params: {
      roleId: unref(roleId),
      clientCode: unref(clientCode),
    },
  })
}

/**
 * 查询当前角色已经选择的菜单id
 */
export function findIdsByRoleMenu(roleId, clientCode) {
  return defHttp.get<Result<string[]>>({
    url: '/role/menu/findIdsByRole',
    params: {
      roleId: unref(roleId),
      clientCode: unref(clientCode),
    },
  })
}

/**
 * 添加角色请求路径关联关系
 */
export function saveRolePath(obj) {
  return defHttp.post<Result<void>>({
    url: '/role/path/save',
    data: unref(obj),
  })
}

/**
 * 指定角色下的请求路径权限树
 */
export function treeByRolePath(roleId, clientCode) {
  return defHttp.get<Result<PermPathTree[]>>({
    url: '/role/path/treeByRole',
    params: {
      roleId: unref(roleId),
      clientCode: unref(clientCode),
    },
  })
}

/**
 * 查询当前角色已经选择的请求路径id
 */
export function findIdsByRolePath(roleId, clientCode) {
  return defHttp.get<Result<string[]>>({
    url: '/role/path/findIdsByRole',
    params: {
      roleId: unref(roleId),
      clientCode: unref(clientCode),
    },
  })
}

/**
 * 添加角色权限码关联关系
 */
export function saveRoleCode(obj) {
  return defHttp.post<Result<void>>({
    url: '/role/code/save',
    data: unref(obj),
  })
}

/**
 * 指定角色下的角色权限码树
 */
export function treeByRoleCode(roleId) {
  return defHttp.get<Result<PermCodeTree[]>>({
    url: '/role/code/treeByRole',
    params: {
      roleId: unref(roleId),
    },
  })
}

/**
 * 查询当前角色已经选择的角色权限码id
 */
export function findIdsByRoleCode(roleId) {
  return defHttp.get<Result<string[]>>({
    url: '/role/code/findIdsByRole',
    params: {
      roleId: unref(roleId),
    },
  })
}
