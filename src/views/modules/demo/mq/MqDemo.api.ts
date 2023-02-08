import { defHttp } from '/@/utils/http/axios'

export function sendRabbitMsg(msg) {
  return defHttp.post({
    url: '/demo/mq/sendRabbitMsg',
    params: { msg },
  })
}
export function sendRedisMsg(msg) {
  return defHttp.post({
    url: '/demo/mq/sendRedisMsg',
    params: { msg },
  })
}
export function sendKeyExpired(key) {
  return defHttp.post({
    url: '/demo/mq/sendKeyExpired',
    params: { key },
  })
}
