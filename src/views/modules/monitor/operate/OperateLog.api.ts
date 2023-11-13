import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<OperateLog>>>({
    url: '/log/operate/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<OperateLog>>({
    url: '/log/operate/findById',
    params: { id },
  })
}

/**
 * 清除指定天数之前的日志
 */
export const deleteByDay = (deleteDay) => {
  return defHttp.delete<Result>({
    url: '/log/operate/deleteByDay',
    params: { deleteDay },
  })
}

/**
 * 操作日志
 */
export interface OperateLog extends BaseEntity {
  // 操作模块
  title?: string
  // 操作人员id
  operateId?: number
  // 操作人员账号
  username?: string
  // 业务类型
  businessType?: string
  // 请求方法
  method?: string
  // 请求方式
  requestMethod?: string
  // 请求url
  operateUrl?: string
  // 操作ip
  operateIp?: string
  // 操作地点
  operateLocation?: string
  // 请求参数
  operateParam?: string
  // 返回参数
  operateReturn?: string
  // 是否成功
  success?: boolean
  // 错误提示
  errorMsg?: string
  // 操作时间
  operateTime?: string
}
