import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult>>({
    url: '/client/page',
    params,
  })
}
