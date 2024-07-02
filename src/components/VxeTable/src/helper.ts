import { ComponentType } from './componentType'
import { useI18n } from '@/hooks/web/useI18n'
import XEUtils from 'xe-utils'
import { ignoreTrimInputComponents } from './const'

const { t } = useI18n()

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component: ComponentType) {
  if (!component) return
  if (component.includes('RangePicker')) {
    return ['请选择', '请选择']
  }
  if (component.includes('Input') || component.includes('Complete') || component.includes('Rate')) {
    return '请输入'
  } else {
    return '请选择'
  }
}

/**
 *
 * @description: 对输入值进行首尾空格的清理
 */
export function sanitizeInputWhitespace(component: ComponentType, value: string) {
  if (ignoreTrimInputComponents.includes(component)) {
    return XEUtils.trim(value)
  }
  return value
}
