import { LabeledValue } from 'ant-design-vue/lib/select'

// 数字
export const NUMBER = 'number'
// 字符串
export const STRING = 'string'
// 布尔
export const BOOLEAN = 'boolean'
// 日期
export const DATE = 'date'
// 时间
export const TIME = 'time'
// 日期时间
export const DATE_TIME = 'date_time'
// 列表
export const LIST = 'list'

/**
 * 查询属性
 */
export interface QueryField {
  //类型
  type?: 'number' | 'string' | 'boolean' | 'date' | 'time' | 'date_time' | 'list'
  // 提示
  placeholder?: string
  // 字段名称
  field?: string
  // 栅格宽度
  md?: number
  // 显示名称
  name?: string
  // 精度
  precision?: number
  // 查询列表
  selectList?: LabeledValue[] | null
  // 时间格式化
  format?: string | null
  // 是否禁止编辑
  disable?: boolean
}

/**
 * 查询参数
 */
export interface QueryParam {
  // antd select 组件限制原因导致不能使用bool
  or?: 'true' | 'false'
  // 参数名称
  paramName?: string
  // 格式化 主要用于时间格式化
  format?: string
  // 精度
  precision?: number
  // 比较类型
  compareType?: 'eq' | 'ne' | 'like' | 'like_left' | 'like_right' | 'not_like' | 'gt' | 'ge' | 'lt' | 'le' | 'is_null' | 'not_null'
  // 参数类型
  paramType?: string
  // 参数值
  paramValue?: object
  // 嵌套查询
  nestedParams?: QueryParam[]
}
