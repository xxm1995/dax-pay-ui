import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 列表
 */
export function findAll() {
  return defHttp.get<Result<PayWayInfo[]>>({
    url: '/pay/way/info/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<PayWayInfo>>({
    url: '/pay/way/info/findById',
    params: { id },
  })
}

/**
 * 更新
 */
export function update(param: PayWayInfo) {
  return defHttp.post<Result<PayWayInfo>>({
    url: '/pay/way/info/update',
    data: param,
  })
}

/**
 * 支付通道信息
 */
export interface PayWayInfo extends BaseEntity {
  // 通道编码
  code?: string
  // 支付通道名称
  name?: string
  // 备注
  remark?: string
}
