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
export function findStatusByBizOrderNoeNo(bizOrderNoeNo) {
  return defHttp.get<Result<boolean>>({
    url: '/demo/cashier/queryPayOrderSuccess',
    params: { bizOrderNoeNo },
  })
}

/**
 * 获取手机收银台链接
 */
export function getUniCashierUrl() {
  return defHttp.get<Result<string>>({
    url: '/demo/cashier/getUniCashierUrl',
  })
}

/**
 * 创建聚合支付码连接
 */
export function createAggregatePayUrl(obj) {
  return defHttp.post<Result<PayOrderResult>>({
    url: '/demo/aggregate/createUrl',
    data: obj,
  })
}

/**
 * 聚合条码支付
 */
export function aggregateBarCodePay(obj) {
  return defHttp.post<Result<PayOrderResult>>({
    url: '/demo/aggregate/barCodePay',
    method: 'POST',
    data: obj,
  })
}

/**
 * 发起支付后响应对象
 */
export interface PayOrderResult {
  // 商户订单号
  bizOrderNo: string
  // 订单号
  orderNo: string
  // 支付状态
  status: string
  // 支付参数体(通常用于发起异步支付的参数)
  payBody: string
}
