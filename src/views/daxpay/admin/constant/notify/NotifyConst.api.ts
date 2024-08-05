import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<NotifyConst>>>({
    url: '/const/merchant/notify/page',
    params,
  })
}

export interface NotifyConst extends BaseEntity {
  /** 编码 */
  code?: string
  /** 名称 */
  name?: string
  /** 是否启用 */
  enable?: boolean
  /** 描述 */
  description?: string
}
