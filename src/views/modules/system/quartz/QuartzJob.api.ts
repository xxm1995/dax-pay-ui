import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<QuartzJob>>>({
    url: '/quartz/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<QuartzJob>>({
    url: '/quartz/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: QuartzJob) => {
  return defHttp.post({
    url: '/quartz/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: QuartzJob) => {
  return defHttp.post({
    url: '/quartz/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/quartz/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<QuartzJob>>>({
    url: '/quartz/findAll',
  })
}

/**
 * 开始
 * @param id
 */
export function start(id) {
  return defHttp.post({
    url: '/quartz/start',
    params: { id },
  })
}

/**
 * 停止
 */
export function stop(id) {
  return defHttp.post({
    url: '/quartz/stop',
    params: { id },
  })
}

/**
 * 立即执行
 */
export function execute(id) {
  return defHttp.post({
    url: '/quartz/execute',
    params: { id },
  })
}

/**
 * 同步任务状态
 */
export const syncJobStatus = () => {
  return defHttp.post({
    url: '/quartz/syncJobStatus',
  })
}

/**
 * 判断是否是定时任务类
 */
export function judgeJobClass(jobClassName) {
  return defHttp.get<Result<string>>({
    url: '/quartz/judgeJobClass',
    params: { jobClassName },
  })
}

/**
 * 定时任务
 */
export interface QuartzJob extends BaseEntity {
  // 任务名称
  name: string
  // 任务类名
  jobClassName: string
  // cron表达式
  cron: string
  // 参数
  parameter: string
  // 状态
  state: number
  // 备注
  remark: string
}
