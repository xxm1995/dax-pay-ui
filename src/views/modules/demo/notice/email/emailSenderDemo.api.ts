import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'
/**
 * 简单邮件发送
 */
export function sentSimpleMail(obj) {
  return defHttp.post({
    url: '/demo/notice/email/sentSimpleMail',
    data: obj,
  })
}
/**
 * 标准邮件发送
 */
export function sentMail(obj) {
  return defHttp.post({
    url: '/demo/notice/email/sentMail',
    data: obj,
  })
}
