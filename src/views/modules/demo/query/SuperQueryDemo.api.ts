import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<SuperQuery>>>({
    url: '/demo/super/query/page',
    params,
  })
}
/**
 * 分页 超级查询
 */
export function superPage(params, queryParams) {
  return defHttp.post<Result<PageResult<SuperQuery>>>({
    url: '/demo/super/query/superQuery',
    params: params,
    data: queryParams,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<SuperQuery[]>>({
    url: '/demo/super/query/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<SuperQuery>>({
    url: '/demo/super/query/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: SuperQuery) {
  return defHttp.post({
    url: '/demo/super/query/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: SuperQuery) {
  return defHttp.post({
    url: '/demo/super/query/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/demo/super/query/delete',
    params: { id },
  })
}

/**
 * 超级查询演示
 */
export interface SuperQuery extends BaseEntity {
  // 名称
  name?: string
  // 年龄
  age?: number
  // 是否vip
  vip?: boolean
  // 生日
  birthday?: string
  // 上班时间
  workTime?: string
  // 注册时间
  registrationTime?: string
  // 政治面貌
  political?: number
  // 备注
  remark?: string
}
