import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<MethodConst>>>({
    url: '/const/method/page',
    params,
  })
}

export interface MethodConst extends BaseEntity {
  /** 编码 */
  code?: string
  /** 名称 */
  name?: string
  /** 是否启用 */
  enable?: boolean
  /** 备注 */
  remark?: string
}
