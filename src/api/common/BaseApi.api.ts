import { defHttp } from '/@/utils/http/axios'

/**
 * 回声测试
 */
export function echo(msg: string) {
  return defHttp.get<string>({
    url: '/echo',
    params: { msg },
  })
}

/**
 * 回声测试(必须要进行登录)
 */
export function authEcho(msg: string) {
  return defHttp.get<string>({
    url: '/auth/echo',
    params: { msg },
  })
}
