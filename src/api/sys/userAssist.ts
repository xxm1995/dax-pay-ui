import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'

/**
 * 账号是否被使用
 */
export function existsAccount(account) {
  return defHttp.get<Result<boolean>>({
    url: `/user/existsAccount`,
    params: { account },
  })
}
export function existsAccountNotId(account, id) {
  return defHttp.get<Result<boolean>>({
    url: `/user/existsAccountNotId`,
    params: { account, id },
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
