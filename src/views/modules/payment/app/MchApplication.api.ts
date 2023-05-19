import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<MchApplication>>>({
    url: '/merchant/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<MchApplication[]>>({
    url: '/merchant/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<MchApplication>>({
    url: '/merchant/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: MchApplication) {
  return defHttp.post({
    url: '/merchant/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: MchApplication) {
  return defHttp.post({
    url: '/merchant/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/merchant/delete',
    params: { id },
  })
}

/**
 * 商户应用
 */
export interface MchApplication extends BaseEntity {
  // 应用编码
  appNo?: string
  // 名称
  name?: string
  // 商户号
  mchNo?: string
  // 状态类型
  state?: string
  // 备注
  remark?: string
}
