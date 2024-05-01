import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 重新发送消息通知
 */
export function resetSendNotice(taskId) {
  return defHttp.post<Result>({
    url: '/task/notice/resetSend',
    method: 'post',
    params: { taskId },
  })
}

/**
 * 任务分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<ClientNoticeTask[]>>>({
    url: '/task/notice/page',
    method: 'get',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<ClientNoticeTask>>({
    url: '/task/notice/findById',
    params: { id },
  })
}

/**
 * 记录分页
 */
export function pageRecord(params) {
  return defHttp.get<Result<PageResult<ClientNoticeRecord[]>>>({
    url: '/task/notice/record/page',
    method: 'get',
    params,
  })
}

/**
 * 记录单条
 */
export function getRecord(id) {
  return defHttp.get<Result<ClientNoticeRecord>>({
    url: '/task/notice/record/findById',
    params: { id },
  })
}

/**
 * 消息通知任务
 */
export interface ClientNoticeTask extends BaseEntity {
  // 本地交易ID
  tradeId?: string
  // 本地交易ID
  tradeNo?: string
  // 消息类型
  noticeType?: string
  // 消息内容
  content?: string
  // 是否发送成功
  success?: boolean
  // 发送次数
  sendCount?: number
  // 发送地址
  url?: string
  // 最后发送时间
  latestTime?: string
}

/**
 * 消息通知记录
 */
export interface ClientNoticeRecord extends BaseEntity {
  // 任务ID
  taskId?: string
  // 请求次数
  reqCount?: number
  // 发送类型
  sendType?: boolean
  // 发送是否成功
  success?: boolean
  // 错误信息
  errorMsg?: string
}
