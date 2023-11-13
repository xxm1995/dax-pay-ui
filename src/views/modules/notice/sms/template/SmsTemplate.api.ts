import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<SmsTemplate>>>({
    url: '/sms/template/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<SmsTemplate[]>>({
    url: '/sms/template/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<SmsTemplate>>({
    url: '/sms/template/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: SmsTemplate) {
  return defHttp.post({
    url: '/sms/template/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: SmsTemplate) {
  return defHttp.post({
    url: '/sms/template/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/sms/template/delete',
    params: { id },
  })
}

/**
 * 短信模板配置
 */
export interface SmsTemplate extends BaseEntity {
  // 短信渠道商类型
  supplierType?: string
  // 短信渠道商类型
  templateId?: string
  // 短信模板名称
  name?: string
  // 短信模板内容
  content?: string
}
