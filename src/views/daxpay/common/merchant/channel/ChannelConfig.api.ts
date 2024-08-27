import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'
import { unref } from 'vue'

/**
 * 列表
 */
export function findAll(appId) {
  return defHttp.get<Result<ChannelConfig[]>>({
    url: '/channel/config/findAllByAppId',
    params: {
      appId: unref(appId),
    },
  })
}

/**
 * 支付通道配着
 */
export interface ChannelConfig extends MchEntity {
  channel?: string
  // 通道名称
  name?: string
  // 是否启用
  enable?: boolean
  // 通道商户号
  outMchNo?: string
  // 通道APPID
  outAppId?: string
}
