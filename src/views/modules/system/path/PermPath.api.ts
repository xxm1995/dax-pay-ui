import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<PermPath>>>({
    url: '/perm/path/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<PermPath>>({
    url: '/perm/path/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: PermPath) => {
  return defHttp.post({
    url: '/perm/path/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: PermPath) => {
  return defHttp.post({
    url: '/perm/path/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/perm/path/delete',
    params: { id },
  })
}

/**
 * 删除
 */
export function delBatch(ids) {
  return defHttp.delete({
    url: `/perm/path/deleteBatch`,
    data: ids,
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<PermPath>>>({
    url: '/perm/path/findAll',
  })
}

/**
 * 批量更新状态
 */
export function batchUpdateEnable(permPathIds: number[], enable: boolean) {
  return defHttp.post({
    url: '/perm/path/batchUpdateEnable',
    data: { permPathIds, enable },
  })
}

/**
 * 同步
 */
export function syncSystem() {
  return defHttp.post({
    url: `/perm/path/syncSystem`,
  })
}

/**
 * 权限_请求
 */
export interface PermPath extends BaseEntity {
  // 权限标识
  code: string
  // 权限名称
  name: string
  // 请求类型
  requestType: string
  // 请求路径
  path: string
  // 分组名称
  groupName: string
  // 启用状态
  enable: boolean
  // 是否通过系统生成的权限
  generate: boolean
  // 描述
  remark: string
}
