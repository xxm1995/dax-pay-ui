import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<DynamicForm>>>({
    url: '/dynamic/form/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<DynamicForm>>({
    url: '/dynamic/form/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: DynamicForm) => {
  return defHttp.post({
    url: '/dynamic/form/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: DynamicForm) => {
  return defHttp.post({
    url: '/dynamic/form/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/dynamic/form/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<DynamicForm>>>({
    url: '/dynamic/form/findAll',
  })
}

/**
 * 编码是否存在
 */
export function existsByCode(code) {
  return defHttp.get<Result<boolean>>({
    url: '/dynamic/form/existsByCode',
    params: { code },
  })
}
export function existsByCodeNotId(code, id) {
  return defHttp.get<Result<boolean>>({
    url: '/dynamic/form/existsByCodeNotId',
    params: { code, id },
  })
}

/**
 * 动态表单
 */
export interface DynamicForm extends BaseEntity {
  // 表单名称
  name: string
  // 表单键名
  code: string
  // 表单内容
  value?: string
  // 备注
  remark: string
}
