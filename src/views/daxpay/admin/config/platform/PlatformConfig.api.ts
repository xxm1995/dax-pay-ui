import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 获取配置
 */
export function get(){
  return defHttp.get<Result<PlatformConfig>>({ url: '/platform/config/get' })
}

export function update(data: PlatformConfig) {
  return defHttp.post<Result>({ url: '/platform/config/update', data })
}
/**
 * 平台配置
 */
export interface PlatformConfig extends BaseEntity {
  // 网关地址
  gatewayServiceUrl?: string
}
