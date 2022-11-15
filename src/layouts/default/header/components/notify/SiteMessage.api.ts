import { defHttp } from '/@/utils/http/axios'
import { BaseEntity } from '/#/web'
import { PageResult, Result } from '/#/axios'

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
  return defHttp.get<Result<PageResult>>({
    url: '/site/message/pageByReceive',
    params: params,
  })
}
