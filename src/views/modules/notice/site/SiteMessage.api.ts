import { defHttp } from '/@/utils/http/axios'
import { BaseEntity } from '/#/web'
import { PageResult, Result } from '/#/axios'

/**
 * 接收站内信消息分页查询
 */
export function pageByReceive(params) {
  return defHttp.get<Result<PageResult<SiteMessage>>>({
    url: '/site/message/pageByReceive',
    params: params,
  })
}

/**
 * 分页
 */
export const pageBySender = (params) => {
  return defHttp.get<Result<PageResult<SiteMessage>>>({
    url: '/site/message/pageBySender',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<SiteMessage>>({
    url: '/site/message/findById',
    params: { id },
  })
}

/**
 * 添加或更新
 */
export const saveOrUpdate = (obj: SiteMessage) => {
  return defHttp.post({
    url: '/site/message/saveOrUpdate',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/site/message/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<SiteMessage>>>({
    url: '/site/message/findAll',
  })
}

/**
 * 撤回
 */
export function cancel(id) {
  return defHttp.post({
    url: '/site/message/cancel',
    params: { id },
  })
}

/**
 * 发送
 */
export function send(id) {
  return defHttp.post({
    url: '/site/message/send',
    params: { id },
  })
}

/**
 * 站内信
 */
export interface SiteMessage extends BaseEntity {
  // 消息标题
  title?: string
  // 消息内容
  content?: string
  // 发送者id
  senderId?: string
  // 发送者姓名
  senderName?: string
  // 发送时间
  senderTime?: string
  // 消息类型
  receiveType?: string
  // 发布状态
  sendState?: string
  // 截至有效期
  efficientTime?: string | null
  // 撤回时间
  cancelTime?: string
}
