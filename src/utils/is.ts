import { router } from '@/router'

export {
  isArguments,
  isArrayBuffer,
  isArrayLike,
  isArrayLikeObject,
  isBuffer,
  isBoolean,
  isDate,
  isElement,
  isEmpty,
  isEqual,
  isEqualWith,
  isError,
  isFunction,
  isFinite,
  isLength,
  isMap,
  isMatch,
  isMatchWith,
  isNative,
  isNil,
  isNumber,
  isNull,
  isObjectLike,
  isPlainObject,
  isRegExp,
  isSafeInteger,
  isSet,
  isString,
  isSymbol,
  isTypedArray,
  isUndefined,
  isWeakMap,
  isWeakSet,
} from 'lodash-es'
const toString = Object.prototype.toString

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined'
}

// TODO 此处 isObject 存在歧义
export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

// TODO 此处 isArray 存在歧义
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window')
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export function isHttpUrl(path: string): boolean {
  const reg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/
  return reg.test(path)
}

export function isPascalCase(str: string): boolean {
  const regex = /^[A-Z][A-Za-z]*$/
  return regex.test(str)
}

/**
 * 是否是网址
 * @param path
 */
export function isUrl(path: string): boolean {
  return isHttpUrl(path)
}

/**
 * 是否从外部打开的链接
 * @return 打开的地址, 为空字符则说明无法打开
 */
export function isOutsideUrl(path: string): string {
  if (isUrl(path)) {
    return path
  }
  if (path.startsWith('outside://')) {
    // 转换成项目内路由地址
    const routerPath = path.substring(10)
    const to = router.resolve(routerPath)
    return to.href
  }
  return ''
}
