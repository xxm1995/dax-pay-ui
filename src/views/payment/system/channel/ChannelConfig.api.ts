import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 列表
 */
export function findAll() {
  return defHttp.get<Result<PayChannelConfig[]>>({
    url: '/pay/channel/config/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<PayChannelConfig>>({
    url: '/pay/channel/config/findById',
    params: { id },
  })
}

/**
 * 更新
 */
export function update(param: PayChannelConfig){
  return defHttp.post<Result<void>>({
    url: '/pay/channel/config/update',
    data: param,
  })
}

/**
 * 支付通道配着
 */
export interface PayChannelConfig extends BaseEntity {
  // 通道编码
  code?: string
  // 支付通道名称
  name?: string
  // 图片
  iconId?: string
  // 卡牌背景色
  bgColor?: string
  // 备注
  remark?: string
}
