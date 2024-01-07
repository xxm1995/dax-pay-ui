import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'

/**
 * 获取用户安全信息
 */
export function checkPasswordSecurity() {
  return defHttp.get<Result<passwordSecurityCheckResult>>({
    url: `/security/password/check`,
  })
}

/**
 * 用户密码各种状态的检查
 */
export interface passwordSecurityCheckResult {
  defaultPwd: boolean
  expirePwd: boolean
  expireRemind: boolean
  expireRemindNum?: number
}
