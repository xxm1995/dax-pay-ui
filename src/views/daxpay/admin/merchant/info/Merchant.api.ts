import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { BaseEntity } from '#/web'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<Merchant>>>({
    url: '/merchant/page',
    params,
  })
}
/**
 * 详情
 */
export const get = (id) => {
  return defHttp.get<Result<Merchant>>({
    url: '/merchant/findById',
    params: { id },
  })
}
/**
 * 新增
 */
export const add = (obj) => {
  return defHttp.post<Result<void>>({
    url: '/merchant/add',
    data: obj,
  })
}
/**
 * 更新
 */
export const update = (obj) => {
  return defHttp.post<Result<void>>({
    url: '/merchant/update',
    data: obj,
  })
}

/**
 * 商户下拉列表
 */
export const dropdown = () => {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/merchant/dropdown',
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.post<Result<void>>({
    url: '/merchant/delete',
    params: { id },
  })
}

/**
 * 商户
 */
export interface Merchant extends BaseEntity {
  // 商户号
  mchNo?: string
  // 商户名称
  mchName?: string
  // 公司名称
  companyName?: string
  // 证件类型
  idType?: string
  // 证件号
  idNo?: string
  // 联系方式
  contact?: string
  // 法人名称
  legalPerson?: string
  // 法人证件号码
  legalPersonIdNo?: string
  // 状态
  status?: string
}
