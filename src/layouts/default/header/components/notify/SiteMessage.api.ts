import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { SiteMessage } from '/@/views/modules/notice/site/SiteMessage.api'

/**
 * 未读消息数量
 */
export function countByReceiveNotRead() {
  return defHttp.get<Result<number>>({
    url: '/site/message/countByReceiveNotRead',
  })
}

/**
 * 接收站内信消息分页查询
 */
export function pageByReceive(params) {
  return defHttp.get<Result<PageResult<SiteMessage>>>({
    url: '/site/message/pageByReceive',
    params: params,
  })
}

/**
 * 查看消息
 */
export function findById(id) {
  return defHttp.get<Result<SiteMessage>>({
    url: '/site/message/findById',
    params: { id },
  })
}

/**
 * 标记为已读
 */
export function read(id) {
  return defHttp.post({
    url: '/site/message/read',
    params: { id },
  })
}
