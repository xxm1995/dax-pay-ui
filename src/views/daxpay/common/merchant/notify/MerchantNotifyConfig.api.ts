import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'
import { unref } from 'vue'
/**
 * 分页
 */
export const findAllByAppId = (appId) => {
  return defHttp.get<Result<NotifyConfigResult[]>>({
    url: '/merchant/notify/config/findAllByAppId',
    params: { appId: unref(appId) },
  })
}

export function subscribe(params) {
  return defHttp.post<Result<NotifyConfigResult>>({
    url: '/merchant/notify/config/subscribe',
    data: params,
  })
}

export interface NotifyConfigResult extends BaseEntity {
  /** 消息通知类型编码 */
  code?: string
  /** 订阅名称 */
  name?: string
  /** 是否订阅 */
  subscribe?: boolean
  /** 描述 */
  description?: string
}
