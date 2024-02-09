import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'

/**
 * 单独支付
 */
export function simplePayCashier(obj) {
  return defHttp.post<Result<PayOrderResult>>({
    url: '/demo/cashier/simplePayCashier',
    method: 'POST',
    data: obj,
  })
}

/**
 * 根据业务ID获取支付状态
 */
export function findStatusByBusinessId(businessNo) {
  return defHttp.get<Result<boolean>>({
    url: '/demo/cashier/queryPayOrderSuccess',
    method: 'GET',
    params: { businessNo },
  })
}

/**
 * 发起支付后响应对象
 */
export interface PayOrderResult {
  // 支付ID
  paymentId: string
  // 是否是异步支付
  asyncPay: boolean
  // 异步支付通道
  asyncChannel: string
  // 支付参数体(通常用于发起异步支付的参数)
  payBody: string
}
