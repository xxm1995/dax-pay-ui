import { defHttp } from '/@/utils/http/axios'

/**
 * 幂等演示
 */
export function idempotentDemo(IdempotentToken: string) {
  return defHttp.post({
    url: '/demo/lock/idempotency',
    params: { IdempotentToken },
  })
}
