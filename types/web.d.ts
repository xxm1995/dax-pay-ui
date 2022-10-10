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
export interface EditModel {

}

/**
 * 基础实体对象
 */
export class BaseEntity {
  id: number
}

/**
 * 表单类型
 */
export enum FormType {
  Add,
  Edit,
  Show,
}
