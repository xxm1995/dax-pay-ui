import { defHttp } from '/@/utils/http/axios'

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
 * 根据业务ID获取支付状态
 */
export function findStatusByBusinessId(businessId) {
  return defHttp.get({
    url: '/payment/findStatusByBusinessId',
    method: 'GET',
    params: { businessId },
  })
}

/**
 * 根据键名获取键值
 */
export function findByParamKey(key) {
  return defHttp.get({
    url: `/system/param/findByParamKey`,
    method: 'GET',
    params: { key },
  })
}
