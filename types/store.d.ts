import { ErrorTypeEnum } from '/@/enums/exceptionEnum'
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum'
import { RoleInfo } from '/@/api/sys/model/userModel'

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined
  // Is it locked?
  isLock?: boolean
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum
  // Error file
  file: string
  // Error name
  name?: string
  // Error message
  message: string
  // Error stack
  stack?: string
  // Error detail
  detail: string
  // Error url
  url: string
  // Error time
  time?: string
}

/**
 * 用户信息
 */
export interface UserInfo {
  // 用户id
  userId: number
  // 名称
  name: string
  // 账号
  username: string
  // 头像图片地址
  avatar: string
}

export interface BeforeMiniState {
  menuCollapsed?: boolean
  menuSplit?: boolean
  menuMode?: MenuModeEnum
  menuType?: MenuTypeEnum
}

/**
 * 字典
 */
export interface Dict {
  dictCode: string
  code: string
  name: string
}
