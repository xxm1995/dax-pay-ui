import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<ChannelConst>>>({
    url: '/const/method',
    params,
  })
}
/**
 * 详情
 */
export const get = (id) => {
  return defHttp.get<Result<ChannelConst>>({
    url: '/const/method',
    params: { id },
  })
}

export interface ChannelConst extends BaseEntity {
  /** 编码 */
  code: string
  /** 名称 */
  name: string
  /** 是否启用 */
  enable: boolean
  /** 备注 */
  remark: string
}
