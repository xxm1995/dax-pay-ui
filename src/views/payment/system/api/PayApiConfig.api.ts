import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<PayApiConfig[]>>({
    url: '/pay/api/config/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<PayApiConfig>>({
    url: '/pay/api/config/findById',
    params: { id },
  })
}

/**
 * 更新
 */
export function update(param: PayApiConfig) {
  return defHttp.post<Result<void>>({
    url: '/pay/api/config/update',
    data: param,
  })
}

/**
 * 支付开放接口配置
 */
export interface PayApiConfig extends BaseEntity {
  // 编码
  code?: string
  // 接口地址
  api?: string
  // 名称
  name?: string
  // 支持回调通知
  noticeSupport?: boolean
  // 是否启用
  enable?: boolean
  // 是否开启回调通知
  notice?: boolean
  // 只有异步支付才进行通知
  onlyAsyncNotice?: boolean
  // 默认回调地址
  noticeUrl?: string
  // 请求参数是否签名
  reqSign?: boolean
  // 响应参数是否签名
  resSign?: boolean
  // 是否记录请求的信息
  remark?: string
}
