import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<DataVersionLog>>>({
    url: '/log/dataVersion/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<DataVersionLog>>({
    url: '/log/dataVersion/findById',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<DataVersionLog>>>({
    url: '/log/dataVersion/findAll',
  })
}

/**
 * 数据版本日志
 */
export interface DataVersionLog extends BaseEntity {
  // 表名称
  tableName?: string
  // 数据名称
  dataName?: string
  // 数据主键
  dataId?: string
  // 数据内容
  dataContent?: string
  // 本次变动的数据内容
  changeContent?: string
  // 数据版本
  version?: number
}
