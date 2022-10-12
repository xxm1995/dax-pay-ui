import { defHttp } from '/@/utils/http/axios'
import { LoginParams, GetUserInfoModel } from './model/userModel'

import { ErrorMessageMode, Result } from '/#/axios'

enum Api {
  Logout = '/logout',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}

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
 * 获取用户菜单和资源权限
 */
export function getPermissions(clientCode: string) {
  return defHttp.get<Result<GetUserInfoModel>>({ url: '/role/menu/getPermissions', params: { clientCode } })
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode })
}

/**
 * 退出
 */
export function doLogout() {
  return defHttp.post({ url: '/token/logout' })
}

/**
 * 测试重试
 */
export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  )
}
