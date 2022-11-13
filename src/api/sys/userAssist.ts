import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'

/**
 * 账号是否被使用
 */
export function existsUsername(username) {
  return defHttp.get<Result<boolean>>({
    url: `/user/existsUsername`,
    params: { username },
  })
}
export function existsUsernameNotId(username, id) {
  return defHttp.get<Result<boolean>>({
    url: `/user/existsUsernameNotId`,
    params: { username, id },
  })
}

/**
 * 手机号是否被使用
 */
export function existsPhone(phone) {
  return defHttp.get<Result<boolean>>({
    url: `/user/existsPhone`,
    params: { phone },
  })
}
export function existsPhoneNotId(phone, id) {
  return defHttp.get<Result<boolean>>({
    url: `/user/existsPhoneNotId`,
    params: { phone, id },
  })
}

/**
 * 邮箱是否被使用
 */
export function existsEmail(email) {
  return defHttp.get<Result<boolean>>({
    url: `/user/existsEmail`,
    params: { email },
  })
}
export function existsEmailNotId(email, id) {
  return defHttp.get<Result<boolean>>({
    url: `/user/existsEmailNotId`,
    params: { email, id },
  })
}

/**
 * 发送更改手机验证码
 */
export function sendCurrentPhoneChangeCaptcha() {
  return defHttp.post<Result<boolean>>({
    url: `/user/sendCurrentPhoneChangeCaptcha`,
  })
}

/**
 * 校验发送更改手机验证码
 */
export function validateCurrentPhoneChangeCaptcha(captcha) {
  return defHttp.get<Result<boolean>>({
    url: `/user/validateCurrentPhoneChangeCaptcha`,
    params: { captcha },
  })
}

/**
 * 发送更改手机号验证码
 */
export function sendPhoneChangeCaptcha(phone) {
  return defHttp.post<Result<boolean>>({
    url: `/user/sendPhoneChangeCaptcha`,
    params: { phone },
  })
}

/**
 * 校验发送更改手机验证码
 */
export function validatePhoneChangeCaptcha(phone, captcha) {
  return defHttp.get<Result<boolean>>({
    url: `/user/validatePhoneChangeCaptcha`,
    params: { phone, captcha },
  })
}

/**
 * 发送更改邮箱验证码
 */
export function sendCurrentEmailChangeCaptcha() {
  return defHttp.post({
    url: `/user/sendCurrentEmailChangeCaptcha`,
  })
}

/**
 * 验证当前用户发送更改邮箱验证码
 */
export function validateCurrentEmailChangeCaptcha(captcha) {
  return defHttp.get<Result<boolean>>({
    url: `/user/validateCurrentChangeEmailCaptcha`,
    params: { captcha },
  })
}

/**
 * 发送更改/绑定邮箱验证码
 */
export function sendEmailChangeCaptcha(email) {
  return defHttp.post({
    url: `/user/sendEmailChangeCaptcha`,
    params: { email },
  })
}

/**
 * 验证更改/绑定邮箱验证码
 */
export function validateEmailChangeCaptcha(email, captcha) {
  return defHttp.get<Result<boolean>>({
    url: `/user/validateEmailChangeCaptcha`,
    params: { email, captcha },
  })
}

/**
 * 发送找回密码手机验证码
 */
export function sendPhoneForgetCaptcha(phone) {
  return defHttp.post<Result>({
    url: `/user/sendPhoneForgetCaptcha`,
    method: 'post',
    params: { phone },
  })
}

/**
 * 验证找回密码手机验证码
 */
export function validatePhoneForgetCaptcha(phone, captcha) {
  return defHttp.get<Result<boolean>>({
    url: `/user/validatePhoneForgetCaptcha`,
    params: { phone, captcha },
  })
}

/**
 * 根据手机验证码查询账号
 */
export function findUsernameByPhoneCaptcha(phone, captcha) {
  return defHttp.get<Result<string>>({
    url: `/user/findUsernameByPhoneCaptcha`,
    params: { phone, captcha },
  })
}

/**
 * 发送短信登录验证码
 */
export function sendLoginSmsCode(phone) {
  return defHttp.post<Result>({
    url: `/auth/sendSmsCaptcha`,
    params: { phone },
  })
}
