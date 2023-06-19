import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity, KeyValue } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<WechatPayConfig>>>({
    url: '/wechat/pay/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<WechatPayConfig[]>>({
    url: '/wechat/pay/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<WechatPayConfig>>({
    url: '/wechat/pay/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: WechatPayConfig) {
  return defHttp.post({
    url: '/wechat/pay/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: WechatPayConfig) {
  return defHttp.post({
    url: '/wechat/pay/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/wechat/pay/delete',
    params: { id },
  })
}

/**
 * 获取微信支持支付方式
 */
export function findPayWayList() {
  return defHttp.get<Result<KeyValue[]>>({
    url: '/wechat/pay/findPayWayList',
  })
}

/**
 * 启用指定的微信配置
 */
export function setUpActivity(id) {
  return defHttp.post({
    url: '/wechat/pay/setUpActivity',
    params: { id },
  })
}

/**
 * 清除指定的微信配置
 */
export function clearActivity(id) {
  return defHttp.post({
    url: '/wechat/pay/clearActivity',
    params: { id },
  })
}

/**
 * 微信支付配置
 */
export interface WechatPayConfig extends BaseEntity {
  // 名称
  name?: string
  // 商户编码
  mchCode?: string
  // 商户应用编码
  mchAppCode?: string
  // 微信应用AppId
  wxAppId?: string
  // 微信商户号
  wxMchId?: string
  // 服务商应用编号
  apiVersion?: string
  // 商户平台「API安全」中的 APIv2 密钥
  apiKeyV2?: string
  // 商户平台「API安全」中的 APIv3 密钥
  apiKeyV3?: string
  // APPID对应的接口密码，用于获取接口调用凭证access_token时使用
  appSecret?: string
  // p12的文件id
  p12?: string | null
  // API 证书中的 cert.pem
  certPem?: string
  // API 证书中的 key.pem
  keyPem?: string
  // 应用域名，回调中会使用此参数
  domain?: string
  // 服务器异步通知页面路径
  notifyUrl?: string
  // 页面跳转同步通知页面路径
  returnUrl?: string
  // 支持的支付类型
  payWays?: string
  // 是否沙箱环境
  sandbox?: boolean
  // 超时配置
  expireTime?: number
  // 支持的支付类型
  payWayList?: KeyValue[]
  // 是否启用
  activity?: boolean
  // 状态
  state?: string
  // 备注
  remark?: string
}
