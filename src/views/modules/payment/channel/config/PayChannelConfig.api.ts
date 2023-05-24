import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<PayChannelConfig>>>({
    url: '/channel/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<PayChannelConfig[]>>({
    url: '/channel/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<PayChannelConfig>>({
    url: '/channel/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: PayChannelConfig) {
  return defHttp.post({
    url: '/channel/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: PayChannelConfig) {
  return defHttp.post({
    url: '/channel/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/channel/delete',
    params: { id },
  })
}

/**
 * 支付通道配置
 */
export interface PayChannelConfig extends BaseEntity {
  // 通道编码
  code?: string
  // 支付通道名称
  name?: string
  // 图片
  image?: string
}
