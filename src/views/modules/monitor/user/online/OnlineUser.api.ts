import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<OnlineUserInfo>>>({
    url: '/online/user/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<OnlineUserInfo>>({
    url: '/online/user/findById',
    params: { id },
  })
}

/**
 * 在线用户信息
 */
export interface OnlineUserInfo extends BaseEntity {
  name: string
  username: string
  phone: string
  email: string
  status: string
}
