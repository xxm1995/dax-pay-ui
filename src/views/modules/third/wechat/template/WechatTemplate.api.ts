import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<WechatTemplate>>>({
    url: '/wechat/template/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<WechatTemplate>>({
    url: '/wechat/template/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: WechatTemplate) => {
  return defHttp.post({
    url: '/wechat/template/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: WechatTemplate) => {
  return defHttp.post({
    url: '/wechat/template/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/wechat/template/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<WechatTemplate>>>({
    url: '/wechat/template/findAll',
  })
}

/**
 * 微信消息模板
 */
export interface WechatTemplate extends BaseEntity {
  // 名称
  name: string
  // 编码
  code: string
  // 是否启用
  enable: boolean
  // 模板ID
  templateId: string
  // 模板标题
  title: string
  // 模板所属行业的一级行业
  primaryIndustry: string
  // 模板所属行业的二级行业
  deputyIndustry: string
  // 模板内容
  content: string
  // 示例
  example: string
}
