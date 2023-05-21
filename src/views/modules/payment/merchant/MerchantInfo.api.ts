import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<MerchantInfo>>>({
    url: '/merchant/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<MerchantInfo[]>>({
    url: '/merchant/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<MerchantInfo>>({
    url: '/merchant/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: MerchantInfo) {
  return defHttp.post({
    url: '/merchant/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: MerchantInfo) {
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
 * 商户
 */
export interface MerchantInfo extends BaseEntity {
  // 商户号
  mchNo?: string
  // 商户名称
  mchName?: string
  // 商户简称
  mchShortName?: string
  // 类型
  type?: string
  // 联系人姓名
  contactName?: string
  // 联系人手机号
  contactTel?: string
  // 状态
  state?: string
  // 商户备注
  remark?: string
}
