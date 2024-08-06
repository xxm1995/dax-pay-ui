import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 重新发送消息通知
 */
export function send(taskId) {
  return defHttp.post<Result>({
    url: '/merchant/notice/callback/send',
    method: 'post',
    params: { taskId },
  })
}

/**
 * 任务分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<CallbackTask[]>>>({
    url: '/merchant/notice/callback/task/page',
    method: 'get',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<CallbackTask>>({
    url: '/merchant/notice/callback/task/findById',
    params: { id },
  })
}

/**
 * 记录分页
 */
export function pageRecord(params) {
  return defHttp.get<Result<PageResult<CallbackRecord[]>>>({
    url: '/merchant/notice/callback/record/page',
    method: 'get',
    params,
  })
}

/**
 * 记录单条
 */
export function getRecord(id) {
  return defHttp.get<Result<CallbackRecord>>({
    url: '/merchant/notice/callback/record/findById',
    params: { id },
  })
}

/**
 * 消息通知任务
 */
export interface CallbackTask extends MchEntity {
  // 本地交易ID
  tradeId?: string
  // 本地交易号
  tradeNo?: string
  // 交易类型
  tradeType?: string
  // 消息内容
  content?: string
  // 是否发送成功
  success?: boolean
  // 下次发送时间
  nextTime?: string
  // 发送次数
  sendCount?: number
  // 延迟重试次数
  delayCount?: number
  // 发送地址
  url?: string
  // 最后发送时间
  latestTime?: string
}

/**
 * 消息通知记录
 */
export interface CallbackRecord extends MchEntity {
  // 任务ID
  taskId?: string
  // 请求次数
  reqCount?: number
  // 发送类型
  sendType?: boolean
  // 发送是否成功
  success?: boolean
  // 错误编码
  errorCode?: string
  // 错误信息
  errorMsg?: string
}
