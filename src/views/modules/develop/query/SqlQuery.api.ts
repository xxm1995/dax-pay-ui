import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 查询全部
 */
export function querySql(sql: string) {
  return defHttp.post<Result<SqlQueryResult>>({
    url: '/data/result/querySql',
    data: { sql },
  })
}

/**
 *  导出查询结果
 */
export function exportQueryResult(sql: string) {
  return defHttp.post<BlobPart>({
    url: '/data/result/exportQueryResult',
    responseType: 'blob',
    data: { sql },
  })
}

/**
 * SQL查询语句
 */
export interface SqlQueryResult extends BaseEntity {
  // 数据源ID
  fields: string[]
  // 名称
  data: object[]
}
