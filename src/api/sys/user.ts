import { defHttp } from '/@/utils/http/axios'
import { LoginParams, GetUserInfoModel, UserBaseInfo, UserDetails } from './model/userModel'
import { Result } from '/#/axios'

/**
 * 登录接口 返回token
 */
export function loginApi(params: LoginParams) {
  return defHttp.post<Result<string>>({
    url: '/token/login',
    params,
  })
}

/**
 * 登录后获取用户信息
 */
export function getUserInfo() {
  return defHttp.get<Result<GetUserInfoModel>>({ url: '/user/getLoginAfterUserInfo' })
}

/**
 * 获取用户安全信息
 */
export function getUserSecurityInfo() {
  return defHttp.get<Result<UserDetails>>({
    url: `/user/getUserSecurityInfo`,
  })
}

/**
 * 获取用户基础信息
 */
export function getUserBaseInfo() {
  return defHttp.get<Result<UserBaseInfo>>({
    url: `/user/getUserBaseInfo`,
  })
}

/**
 * 更新用户基础信息
 */
export function updateBaseInfo(data) {
  return defHttp.post({
    url: '/user/updateBaseInfo',
    data: data,
  })
}

/**
 * 退出
 */
export function doLogout() {
  return defHttp.post({ url: '/token/logout' })
}
