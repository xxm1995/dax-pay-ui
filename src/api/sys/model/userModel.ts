/**
 * 账密登录参数
 */
export interface LoginParams {
  // 账号/手机号/邮箱
  account: string
  // 密码
  password: string
  // 终端
  client: string
  // 登录方式
  loginType: string
  // 验证码key
  captchaKey: string
  // 验证码
  captcha: string
}

/**
 * 用户信息(用户详情)
 */
export interface UserDetails {
  // 用户id
  id?: number
  // 名称
  name?: string
  // 账号
  username?: string
  // 手机号
  phone?: string
  // 邮箱
  email?: string
  // 是否管理员
  admin?: boolean
  // 终端id列表
  clientIdList?: string[]
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

/**
 * 用户基础消息
 */
export interface UserBaseInfo {
  // 用户id
  id: number
  // 名称
  name: string
  // 性别
  sex: number
  // 头像
  avatar: string
  // 生日
  birthday: string
}
