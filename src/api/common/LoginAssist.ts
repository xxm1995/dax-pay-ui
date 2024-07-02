import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'

/**
 * 根据code获取登录方式
 */
export function findLoginTypeByCode(code) {
  return defHttp.get<Result<LoginType>>({
    url: '/loginType/findByCode',
    params: { code },
  })
}

/**
 * 登录方式
 */
export interface LoginType {
  // 启用验证码
  captcha: boolean
  // 是否可用
  enable: boolean
}
