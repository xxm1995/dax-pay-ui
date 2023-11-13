import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<ChinaWord>>>({
    url: '/chinaword/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<ChinaWord[]>>({
    url: '/chinaword/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<ChinaWord>>({
    url: '/chinaword/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: ChinaWord) {
  return defHttp.post({
    url: '/chinaword/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: ChinaWord) {
  return defHttp.post({
    url: '/chinaword/update',
    data: obj,
  })
}

/**
 * 刷新缓存
 */
export function refresh() {
  return defHttp.post({
    url: '/chinaword/refresh',
  })
}

/**
 * 更新
 */
export function verify(obj: any) {
  return defHttp.post({
    url: '/chinaword/verify',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/chinaword/delete',
    params: { id },
  })
}
/**
 * 批量删除
 */
export function deleteBatch(ids) {
  return defHttp.delete({
    url: '/chinaword/deleteBatch',
    params: ids,
  })
}

/**
 * 敏感词黑名单
 */
export interface ChinaWord extends BaseEntity {
  // 敏感词
  word?: string
  // 类型
  type?: string
  // 描述
  description?: string
  // 是否启用
  enable?: boolean
  // 是否是白名单
  white?: boolean | string
}
