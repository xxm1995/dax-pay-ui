import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'

/**
 * 分页 非新闻素材
 */
export function page(params) {
  return defHttp.get<Result<PageResult>>({
    url: '/wechat/article/page',
    params: params,
  })
}
