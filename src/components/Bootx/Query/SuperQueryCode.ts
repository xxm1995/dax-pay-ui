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

export interface QueryField {
  type: string
  placeholder: string
  field: string
}
