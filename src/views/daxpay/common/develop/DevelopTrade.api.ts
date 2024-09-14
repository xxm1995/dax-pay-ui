import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'

/**
 * 支付
 */
export function tradePay(params) {
  return defHttp.post<Result<PayResult>>({ url: '/develop/trade/pay', params })
}


/**
 * 支付返回结果
 */
export interface PayResult {
}

/**
 *
 */
