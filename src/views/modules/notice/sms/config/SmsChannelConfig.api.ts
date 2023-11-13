import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<SmsChannelConfig>>>({
    url: '/sms/config/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<SmsChannelConfig[]>>({
    url: '/sms/config/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<SmsChannelConfig>>({
    url: '/sms/config/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: SmsChannelConfig) {
  return defHttp.post({
    url: '/sms/config/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: SmsChannelConfig) {
  return defHttp.post({
    url: '/sms/config/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/sms/config/delete',
    params: { id },
  })
}

/**
 * 短信渠道配置
 */
export interface SmsChannelConfig extends BaseEntity {
  // 渠道类型编码
  code?: string
  // 渠道类型名称
  name?: string
  // 状态
  state?: string
  // AccessKey
  accessKey?: string
  // AccessSecret
  accessSecret?: string
  // 配置
  config?: string
  // 图片
  image?: string
  // 排序
  sortNo?: number
  // 备注
  remark?: string
}
