import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 列表
 */
export function findAll() {
  return defHttp.get<Result<PayMethodInfo[]>>({
    url: '/pay/method/info/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<PayMethodInfo>>({
    url: '/pay/method/info/findById',
    params: { id },
  })
}

/**
 * 更新
 */
export function update(param: PayMethodInfo) {
  return defHttp.post<Result<void>>({
    url: '/pay/way/info/update',
    data: param,
  })
}

/**
 * 支付通道信息
 */
export interface PayMethodInfo extends BaseEntity {
  // 通道编码
  code?: string
  // 支付通道名称
  name?: string
  // 备注
  remark?: string
}
