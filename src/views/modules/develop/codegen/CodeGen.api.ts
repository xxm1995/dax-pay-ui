import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<DatabaseTable>>>({
    url: '/gen/table/page',
    params: params,
  })
}

/**
 * 获取表相关的代码生成参数信息
 */
export function getTableGenParam(dataSourceCode, tableName) {
  return defHttp.get<Result<TableGenParam>>({
    url: '/gen/table/getTableGenParam',
    params: { dataSourceCode, tableName },
  })
}

/**
 * 预览
 */
export function codeGenPreview(obj) {
  return defHttp.get<Result<DatabaseTable>>({
    url: '/gen/code/codeGenPreview',
    data: obj,
  })
}

/**
 * 下载
 */
export function genCodeZip(obj) {
  return defHttp.post({
    url: '/gen/code/genCodeZip',
    responseType: 'blob',
    data: obj,
  })
}

/**
 * 表信息
 */
export interface DatabaseTable {
  // 表名
  tableName: string
  // 引擎类型
  engine: string
  // 表表述
  tableComment: string
  // 创建时间
  createTime: string
}

/**
 * 代码生成相关参数信息
 */
export interface TableGenParam {
  // 实体类名称(大驼峰)
  entityName: string
  // 功能模块名称(全小写)
  module: string
}

export interface DataSource {
  value: string
  label: string
}
