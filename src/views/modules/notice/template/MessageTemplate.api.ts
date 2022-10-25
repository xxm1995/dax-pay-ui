import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<MessageTemplate>>>({
    url: '/message/template/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<MessageTemplate>>({
    url: '/message/template/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: MessageTemplate) => {
  return defHttp.post({
    url: '/message/template/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: MessageTemplate) => {
  return defHttp.post({
    url: '/message/template/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/message/template/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<MessageTemplate>>>({
    url: '/message/template/findAll',
  })
}

/**
 * 消息模板
 */
export interface MessageTemplate extends BaseEntity {
  // 编码
  code: string
  // 名称
  name: string
  // 模板数据
  data: string
  // 模板类型
  type: number
  // 备注
  remark: string
}
