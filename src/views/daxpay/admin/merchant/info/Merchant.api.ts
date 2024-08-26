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
export const merchantDropdown = () => {
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
 * 创建商户管理员
 */
export const createMerchantAdmin = (obj: MerchantAdmin) => {
  return defHttp.post<Result<void>>({
    url: '/merchant/createAdmin',
    data: obj,
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
  // 公司联系方式
  companyContact?: string
  // 公司地址
  companyAddress?: string
  // 公司信用编码
  companyCode?: string
  // 法人名称
  legalPerson?: string
  // 法人证件类型
  idType?: string
  // 法人证件号
  idNo?: string
  // 法人联系方式
  contact?: string
  // 状态
  status?: string
}

/**
 * 商户管理员创建参数
 */
export interface MerchantAdmin {
  // 商户号
  mchNo?: string
  // 管理员名称
  name?: string
  // 商户管理员账号
  account?: string
  // 商户管理员密码
  password?: string
  // 重复密码
  confirmPassword?: string
  // 手机号
  phone?: string
  // 邮箱
  email?: string
}
