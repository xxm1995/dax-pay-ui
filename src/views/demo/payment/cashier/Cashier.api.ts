import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { PayStatus } from "/@/enums/payment/PayStatus";

/**
 * 单独支付
 */
export function singlePay(obj) {
  return defHttp.post({
    url: '/cashier/singlePay',
    method: 'POST',
    data: obj,
  })
}

/**
 * 创建聚合扫码支付
 */
export function createAggregatePay(obj) {
  return defHttp.post({
    url: '/aggregate/createAggregatePay',
    method: 'POST',
    data: obj,
  })
}

/**
 * 组合支付
 */
export function combinationPay (obj) {
  return defHttp.post({
    url: '/cashier/combinationPay',
    data: obj
  })
}

/**
 * 根据业务ID获取支付状态
 */
export function findStatusByBusinessId(businessId){
  return defHttp.get<Result<PayStatus>>({
    url: '/payment/findStatusByBusinessId',
    method: 'GET',
    params: { businessId },
  })
}

/**
 * 获取用户钱包
 */
export function findWalletByUser() {
  return defHttp.get<Result<any>>({
    url: '/wallet/findByUser',
  })
}
