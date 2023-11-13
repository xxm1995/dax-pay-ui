import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<QuerySql>>>({
    url: '/data/result/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<QuerySql[]>>({
    url: '/data/result/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<QuerySql>>({
    url: '/data/result/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: QuerySql) {
  return defHttp.post({
    url: '/data/result/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: QuerySql) {
  return defHttp.post({
    url: '/data/result/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/data/result/delete',
    params: { id },
  })
}

/**
 * SQL查询语句
 */
export interface QuerySql extends BaseEntity {
  // 数据源ID
  databaseId?: string
  // 名称
  name?: string
  // sql语句
  sql?: string
  // 是否集合
  isList?: boolean
  // SQL查询参数
  params?: string
  // SQL查询结果字段
  fields?: string
  // 备注
  remark?: string
}
