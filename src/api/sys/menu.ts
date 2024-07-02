import { defHttp } from '@/utils/http/axios'
import { getMenuListResultModel, MenuAndResource } from './model/menuModel'
import { Result } from '#/axios'

enum Api {
  GetMenuList = '/getMenuList',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList })
}

/**
 * 获取菜单和权限码
 */
export const getPermissions = (clientCode: string) => {
  return defHttp.get<Result<MenuAndResource>>({
    url: '/role/menu/getPermissions',
    params: { clientCode },
  })
}
