import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { UserThirdBindInfo, UserBaseInfo, UserDetails } from './accountModel'

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
 * 要修改的密码是否重复
 */
export function isRecentlyUsed(password) {
  return defHttp.get<Result<boolean>>({
    url: '/security/password/isRecentlyUsed',
    params: { password },
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
 * 获取用户三方绑定信息
 */
export function getThirdBindInfo() {
  return defHttp.get<Result<UserThirdBindInfo>>({
    url: `/user/third/getThirdBindInfo`,
  })
}

/**
 * 用户绑定三方开放平台
 */
export function bindThird(obj) {
  return defHttp.post({
    url: `/user/third/bind`,
    data: obj,
  })
}
/**
 * 解除用户绑定三方开放平台
 */
export function unbindThird(clientCode) {
  return defHttp.post({
    url: `/user/third/unbind`,
    params: { clientCode },
  })
}
