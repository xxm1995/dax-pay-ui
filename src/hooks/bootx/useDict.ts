import { useDictStoreWithOut } from '/@/store/modules/dict'
import { LabeledValue } from 'ant-design-vue/lib/select'

const useDictStore = useDictStoreWithOut()

/**
 * 字典项转换
 */
function dictConvert(dictCode: string, code) {
  const dictList = useDictStore.getDict
  const item = dictList.filter((dict) => {
    return dictCode === dict.dictCode && dict.code === String(code)
  })
  if (item && item.length > 0) {
    return item[0].name
  } else {
    return ''
  }
}

/**
 * 获取字典项列表
 */
export function dictItems(dictCode: string) {
  const dictList = useDictStore.getDict
  return dictList
    .filter((dict) => dictCode === dict.dictCode)
    .map((item) => {
      return { ...item, code: Number(item.code) }
    })
}

/**
 * 获取字典项列表(code值为数字)
 */
export function dictItemsNumber(dictCode: string) {
  const dictList = useDictStore.getDict
  return dictList
    .filter((dict) => dictCode === dict.dictCode)
    .map((item) => {
      return { ...item, code: Number(item.code) }
    })
}

/**
 * 获取字典下拉框数据列表
 */
function dictDropDown(dictCode: string): LabeledValue[] {
  const list = useDictStore.getDict
  return list
    .filter((dict) => dictCode === dict.dictCode)
    .map((o) => {
      return { label: o.name, value: o.code }
    })
}
/**
 * 获取字典下拉框数据列表
 */
function dictDropDownNumber(dictCode: string): LabeledValue[] {
  const list = useDictStore.getDict
  return list
    .filter((dict) => dictCode === dict.dictCode)
    .map((o) => {
      return { label: o.name, value: Number(o.code) }
    })
}

/**
 * 字典hooks
 */
export function useDict() {
  return {
    dictConvert,
    dictItems,
    dictItemsNumber,
    dictDropDown,
    dictDropDownNumber,
  }
}
