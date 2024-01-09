import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 查询全部
 */
export function findAll(){
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
export interface PayApiConfig extends BaseEntity{
  /**
   * 编码
   */
  code?: string
  api?: string
  name?: string
  enable?: boolean
  notice?: boolean
  onlyAsyncNotice?: boolean
  noticeUrl?: string
  reqSign?: boolean
  resSign?: boolean
  noticeSign?: boolean
  record?: boolean
}
