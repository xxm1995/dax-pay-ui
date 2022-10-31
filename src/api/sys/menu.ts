import { defHttp } from '/@/utils/http/axios'
import { MenuAndResource } from './model/menuModel'
import { Result } from '/#/axios'

/**
 * 获取菜单和权限码
 */
export const getPermissions = (clientCode: string) => {
  return defHttp.get<Result<MenuAndResource>>({ url: '/role/menu/getPermissions', params: { clientCode } })
}
