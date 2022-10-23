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
 * 添加
 */
export const add = (obj: DataVersionLog) => {
  return defHttp.post({
    url: '/log/dataVersion/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: DataVersionLog) => {
  return defHttp.post({
    url: '/log/dataVersion/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/log/dataVersion/delete',
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
  // 数据名称
  dataName: string
  // 数据主键
  dataId: string
  // 数据内容
  dataContent: string
}
