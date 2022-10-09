import { PageResult } from '/#/axios'

/**
 * 分页属性
 */
export interface Pagination {
  size: number
  current: number
  total: number
}

/**
 * 分页参数
 */
export interface PageParam {
  // 每页数量
  size: number
  // 当前页数
  current: number
}

/**
 * 分页表格列表对象
 */
export interface TablePageModel<T = any> {
  // 加载状态
  loading: boolean
  // 批量操作标识
  batchOperateFlag: boolean
  // 高级查询条件生效状态
  superQueryFlag: boolean
  // 分页参数
  pages: PageParam
  // 查询参数
  queryParam: object
  // 结果
  pagination: PageResult<T>
}

/**
 * 编辑界面参数对象
 */
export interface EditModel {}
