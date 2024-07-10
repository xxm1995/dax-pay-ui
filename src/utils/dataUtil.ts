import { unref } from 'vue'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 树形数据转换
 * @param data 树状数据
 * @param key 值名称/主键名称
 * @param title 标题名称
 * @param children 孩子列表字段名
 * @returns {*[]}
 */
export function treeDataTranslate(data, key = 'value', title = 'title', children = 'children') {
  const temp = [] as Tree[]
  if (!data) {
    return []
  }

  for (let i = 0; i < data.length; i++) {
    const p = {
      key: data[i][key],
      title: data[i][title],
      value: String(data[i][key]),
      raw: data[i],
      children: [],
    } as Tree
    if (data[i][children] && data[i][children].length > 0) {
      p.children = treeDataTranslate(data[i][children], key, title, children)
    }
    temp.push(p)
  }
  return temp
}
export interface Tree {
  key: string
  title: string
  value: unknown
  // 关联原始数据
  raw: unknown
  children?: Tree[] | null
}

/**
 * 从列表中获取指定的对象
 * @param list 列表
 * @param fieldValue 要查询的字段值
 * @param fieldName 字段名称
 */
export function findOneByField(list: any, fieldValue: object, fieldName: string) {
  const item = unref(list)?.filter((o) => {
    return o[fieldName] === fieldValue
  })
  if (item && item.length > 0) {
    return item[0]
  } else {
    return null
  }
}

/**
 * 转换成下拉框数据格式
 * @param list 数据列表
 * @param labelName label名称
 * @param valueName 值名称
 */
export function dropdownTranslate(list: any, labelName = 'name', valueName = 'code') {
  return unref(list)?.map((o) => {
    return {
      label: o[labelName],
      value: o[valueName],
    } as LabeledValue
  })
}
