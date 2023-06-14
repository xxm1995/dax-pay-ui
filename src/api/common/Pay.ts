import { defHttp } from '/@/utils/http/axios'

/**
 * 取消支付(支付id)
 */
export function cancelByPaymentId(paymentId) {
  return defHttp.post({
    url: '/uniPay/cancelByPaymentId',
    params: { paymentId },
  })
}

/**
 * 退款
 */
export function refund(obj) {
  return defHttp.post({
    url: '/uniPay/refund',
    data: obj,
  })
}

/**
 * 刷新指定业务id的支付单状态
 */
export function syncByBusinessId(businessId) {
  return defHttp.post({
    url: '/uniPay/syncByBusinessId',
    method: 'POST',
    params: { businessId },
  })
}
