import { defHttp } from '/@/utils/http/axios'
import { LoginParams, GetUserInfoModel } from './model/userModel'
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
 * 退出
 */
export function doLogout() {
  return defHttp.post({ url: '/token/logout' })
}
