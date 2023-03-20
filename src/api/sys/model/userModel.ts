/**
 * 账密登录参数
 */
export interface LoginParams {
  // 账号/手机号/邮箱
  account?: string
  // 密码
  password?: string
  // 终端
  client: string
  // 登录方式
  loginType: string
  // 验证码key
  captchaKey?: string
  // 验证码
  captcha?: string
  // 授权码登录
  authCode?: string
}

/**
 * 登录后用户信息
 */
export interface GetUserInfoModel {
  // 用户id
  userId: number
  // 名称
  name: string
  // 账号
  username: string
  // 头像
  avatar: string
}
