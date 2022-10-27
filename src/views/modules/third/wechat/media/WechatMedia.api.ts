import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
/**
 * 分页 非新闻素材
 */
export function pageFile(params) {
  return defHttp.get<Result<PageResult>>({
    url: '/wechat/media/pageFile',
    params: params,
  })
}

/**
 * 删除素材
 */
export function deleteFile(mediaId) {
  return defHttp.delete({
    url: '/wechat/media/deleteFile',
    params: { mediaId },
  })
}
