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
 * 修改密码
 */
export function updatePassword(password, newPassword) {
  return defHttp.post({
    url: '/user/updatePassword',
    params: { password, newPassword },
  })
}

/**
 * 绑定手机
 */
export function bindPhone(phone, captcha) {
  return defHttp.post({
    url: '/user/bindPhone',
    params: { phone, captcha },
  })
}

/**
 * 更新手机号
 */
export function updatePhone(obj) {
  return defHttp.post({
    url: '/user/updatePhone',
    data: obj,
  })
}

/**
 * 绑定邮箱
 */
export function bindEmail(email, captcha) {
  return defHttp.post({
    url: '/user/bindEmail',
    params: { email, captcha },
  })
}

/**
 * 更新邮箱
 */
export function updateEmail(obj) {
  return defHttp.post({
    url: '/user/updateEmail',
    data: obj,
  })
}

/**
 * 退出
 */
export function doLogout() {
  return defHttp.post({ url: '/token/logout' })
}
