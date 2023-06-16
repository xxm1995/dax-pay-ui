import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity, KeyValue } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<AlipayConfig>>>({
    url: '/alipay/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<AlipayConfig[]>>({
    url: '/alipay/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<AlipayConfig>>({
    url: '/alipay/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: AlipayConfig) {
  return defHttp.post({
    url: '/alipay/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: AlipayConfig) {
  return defHttp.post({
    url: '/alipay/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/alipay/delete',
    params: { id },
  })
}

/**
 * 获取支付宝支持支付方式
 */
export function findPayWayList() {
  return defHttp.get<Result<KeyValue[]>>({
    url: '/alipay/findPayWayList',
  })
}

/**
 * 启用指定的支付宝配置
 */
export function setUpActivity(id) {
  return defHttp.post({
    url: '/alipay/setUpActivity',
    params: { id },
  })
}

/**
 * 清除指定的支付宝配置
 */
export function clearActivity(id) {
  return defHttp.post({
    url: '/alipay/clearActivity',
    params: { id },
  })
}

/**
 * 支付宝配置
 */
export interface AlipayConfig extends BaseEntity {
  // 名称
  name?: string
  // 商户编码
  mchCode?: string
  // 商户应用编码
  mchAppCode?: string
  // 支付宝商户appId
  appId?: string
  // 服务器异步通知页面路径
  notifyUrl?: string
  // 页面跳转同步通知页面路径
  returnUrl?: string
  // 请求网关地址
  serverUrl?: string
  // 认证方式
  authType?: number
  // 签名类型
  signType?: string
  // 支付宝公钥
  alipayPublicKey?: string
  // 私钥
  privateKey?: string
  // 应用公钥
  appCert?: string
  // 支付宝公钥证书
  alipayCert?: string
  // 支付宝CA根证书
  alipayRootCert?: string
  // 是否沙箱环境
  sandbox?: boolean
  // 超时配置
  expireTime?: number
  // 支持的支付类型
  payWayList?: KeyValue[]
  // 备注
  remark?: string
  // 是否启用
  activity?: boolean
  // 状态
  state?: number
}
