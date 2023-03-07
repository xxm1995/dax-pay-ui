import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<DynamicDataSource>>>({
    url: '/dynamic/source/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<DynamicDataSource>>({
    url: '/dynamic/source/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: DynamicDataSource) => {
  return defHttp.post({
    url: '/dynamic/source/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: DynamicDataSource) => {
  return defHttp.post({
    url: '/dynamic/source/update',
    data: obj,
  })
}

/**
 * 测试连接
 */
export const testConnection = (obj: DynamicDataSource) => {
  return defHttp.post<Result<string>>({
    url: '/dynamic/source/testConnection',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/dynamic/source/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<DynamicDataSource>>>({
    url: '/dynamic/source/findAll',
  })
}

/**
 * 动态数据源管理
 */
export interface DynamicDataSource extends BaseEntity {
  // 数据源编码
  code?: string
  // 数据源名称
  name?: string
  // 数据库类型
  databaseType?: string
  // 驱动类
  dbDriver?: string
  // 数据源地址
  dbUrl?: string
  // 用户名
  dbUsername?: string
  // 密码
  dbPassword?: string
  // 备注
  remark?: string
}
