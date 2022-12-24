import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'

/**
 * 获取一级行政区
 */
export function findAllProvince() {
  return defHttp.get<Result<Region[]>>({
    url: '/china/region/findAllProvince',
  })
}

/**
 * 获取省市二级联动列表
 */
export function findAllProvinceAndCity() {
  return defHttp.get<Result<Region[]>>({
    url: '/china/region/findAllProvinceAndCity',
  })
}

/**
 * 获取省市三级联动列表
 */
export function findAllProvinceAndCityAndArea() {
  return defHttp.get<Result<Region[]>>({
    url: '/china/region/findAllProvinceAndCityAndArea',
  })
}

/**
 * 区域表
 */
export interface Region {
  // 区划id
  id?: number
  // 区域名称
  name?: string
  // 上级区划id
  pid?: number
  // 区划级别
  level?: 1 | 2 | 3 | 4
  children?: Region[]
}
