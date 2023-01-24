import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<DataPermDemo>>>({
    url: '/demo/data/perm/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<DataPermDemo[]>>({
    url: '/demo/data/perm/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<DataPermDemo>>({
    url: '/demo/data/perm/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: DataPermDemo) {
  return defHttp.post({
    url: '/demo/data/perm/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: DataPermDemo) {
  return defHttp.post({
    url: '/demo/data/perm/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/demo/data/perm/delete',
    params: { id },
  })
}

/**
 * 数据权限演示
 */
export interface DataPermDemo extends BaseEntity {
  // 名称
  name?: string
  // 创建者名称
  creatorName?: string
  // 说明
  remark?: string
}
