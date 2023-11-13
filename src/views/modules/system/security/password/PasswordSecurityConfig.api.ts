import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 获取配置
 */
export function getDefault(){
  return defHttp.get<Result<PasswordSecurityConfig>>({
    url: '/security/password/getDefault',
  })
}

/**
 * 添加
 */
export function addOrUpdate(obj: PasswordSecurityConfig) {
  return defHttp.post({
    url: '/security/password/addOrUpdate',
    data: obj,
  })
}

/**
 * 密码安全策略
 */
export interface PasswordSecurityConfig extends BaseEntity {
  // 最大密码错误数
  maxPwdErrorCount?: number
  // 密码错误锁定时间(分钟)
  errorLockTime?: number
  // 强制修改初始密码
  requireChangePwd?: boolean
  // 强制修改初始密码
  defaultPassword?: string
  // 更新频率
  updateFrequency?: number
  // 到期提醒(天数)
  expireRemind?: number
  // 与登录名相同
  sameAsLoginName?: boolean
  // 不能与近期多少次密码相同
  recentPassword?: number
}
