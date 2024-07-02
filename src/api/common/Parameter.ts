import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'

/**
 * 根据键名获取键值
 */
export function findByParamKey(key) {
  return defHttp.get<Result<string>>({
    url: `/system/param/findByParamKey`,
    method: 'GET',
    params: { key },
  })
}
