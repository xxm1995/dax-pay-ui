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
  administrator?: boolean
  // 终端id列表
  clients?: string[]
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

/**
 * 用户三方绑定信息
 */
export interface UserThirdBindInfo {
  weChat: BindInfo
  weChatOpen: BindInfo
  weCom: BindInfo
  dingTalk: BindInfo
}

/**
 * 用户信息
 */
interface BindInfo {
  bind?: boolean
  username?: string
}
