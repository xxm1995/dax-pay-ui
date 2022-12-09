import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<Dict>>>({
    url: '/dict/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<Dict>>({
    url: '/dict/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: Dict) => {
  return defHttp.post({
    url: '/dict/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: Dict) => {
  return defHttp.post({
    url: '/dict/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/dict/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<Dict>>>({
    url: '/dict/findAll',
  })
}

/**
 * 编码是否存在
 */
export function existsByCode(code) {
  return defHttp.get<Result<boolean>>({
    url: '/dict/existsByCode',
    params: { code },
  })
}
export function existsByCodeNotId(code, id) {
  return defHttp.get<Result<boolean>>({
    url: '/dict/existsByCodeNotId',
    params: { code, id },
  })
}

/**
 * 字典
 */
export interface Dict extends BaseEntity {
  // 编码
  code: string
  // 名称
  name: string
  // 是否启用
  enable?: boolean
  // 分类标签
  groupTag: string
  // 备注
  remark: string
}
