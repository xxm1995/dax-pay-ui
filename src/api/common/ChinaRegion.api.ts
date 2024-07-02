import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'

/**
 * 获取一级行政区
 */
export function findAllProvince() {
  return defHttp.get<Result<Region[]>>({
    url: '/china/region/findAllProvince',
  })
}

/**
 * 获取省市二级联动
 */
export function findAllProvinceAndCity() {
  return defHttp.get<Result<Region[]>>({
    url: '/china/region/findAllProvinceAndCity',
  })
}
/**
 * 获取省市区三级联动
 */
export function findAllProvinceAndCityAndArea() {
  return defHttp.get<Result<Region[]>>({
    url: '/china/region/findAllProvinceAndCityAndArea',
  })
}
/**
 * 获取省市二级联动
 */
export function findAllRegionByParentCode(parentCode: string) {
  return defHttp.get<Result<Region[]>>({
    url: '/china/region/findAllRegionByParentCode',
    params: { parentCode },
  })
}

/**
 * 区域
 */
export interface Region {
  code: string
  name: string
  level: 1 | 2 | 3 | 4 | 5
  isLeaf?: boolean
  children: Region[]
}
