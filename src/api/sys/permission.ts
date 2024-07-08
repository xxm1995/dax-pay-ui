import { defHttp } from '@/utils/http/axios'
import { PermMenu } from './model/menuModel'
import { Result } from '#/axios'

/**
 * 获取菜单
 */
export const menuTree = (clientCode: string) => {
  return defHttp.get<Result<PermMenu[]>>({
    url: '/perm/menu/tree',
    params: { clientCode },
  })
}

/**
 * 获取权限码列表
 */
export function getPermCodes() {
  return defHttp.get<Result<string[]>>({
    url: '/perm/code/findCodesByUser',
  })
}
