import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<QuartzJobLog>>>({
    url: '/quartz/log/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<QuartzJobLog>>({
    url: '/quartz/log/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: QuartzJobLog) => {
  return defHttp.post({
    url: '/quartz/log/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: QuartzJobLog) => {
  return defHttp.post({
    url: '/quartz/log/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/quartz/log/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<QuartzJobLog>>>({
    url: '/quartz/log/findAll',
  })
}

/**
 * 任务执行日志
 */
export interface QuartzJobLog extends BaseEntity {
  // 处理器名称
  handlerName: string
  // 处理器全限定名
  className: string
  // 是否执行成功
  success: boolean
  // 错误信息
  errorMessage: string
  // 开始时间
  startTime: string
  // 结束时间
  endTime: string
  // 执行时长
  duration: number
}
