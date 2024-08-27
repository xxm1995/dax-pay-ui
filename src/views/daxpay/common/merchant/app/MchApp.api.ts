import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { BaseEntity } from '#/web'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<MchApp>>>({
    url: '/mch/app/page',
    params,
  })
}
/**
 * 详情
 */
export const get = (id) => {
  return defHttp.get<Result<MchApp>>({
    url: '/mch/app/findById',
    params: { id },
  })
}
/**
 * 新增
 */
export const add = (obj) => {
  return defHttp.post<Result<void>>({
    url: '/mch/app/add',
    data: obj,
  })
}
/**
 * 更新
 */
export const update = (obj) => {
  return defHttp.post<Result<void>>({
    url: '/mch/app/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.post<Result<void>>({
    url: '/mch/app/delete',
    params: { id },
  })
}

/**
 * 查询商户下的应用列表
 */
export function mchAppDropdown(mchNo) {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/mch/app/dropdown',
    params: { mchNo },
  })
}

/**
 * 商户应用
 */
export interface MchApp extends BaseEntity {
  // 商户号
  mchNo?: string
  // 应用号
  appId?: string
  // 应用名称
  appName?: string
  // 签名方式
  signType: string
  // 签名秘钥
  signSecret?: string
  // 是否对请求进行验签
  reqSign: boolean
  // 支付限额
  limitAmount: number
  // 订单默认超时时间(分钟)
  orderTimeout: number
  // 异步消息通知类型
  notifyType: string
  // 通知地址, http/WebSocket 需要配置
  notifyUrl?: string
  // 状态
  status?: string
}
