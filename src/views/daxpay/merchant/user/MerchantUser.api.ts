import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { UserInfo } from '@/views/iam/user/User.api'

/**
 * 用户列表
 */
export function findAll(params) {
  return defHttp.get<Result<PageResult<UserInfo[]>>>({
    url: '/merchant/user/page',
    params,
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
 * 修根用户
 */
export function edit(params) {
  return defHttp.post<Result>({
    url: '/merchant/user/update',
    data: params,
  })
}

/**
 * 分配角色
 */
export function assignRole(params) {
  return defHttp.post<Result>({
    url: '/merchant/user/assignRole',
    data: params,
  })
}
