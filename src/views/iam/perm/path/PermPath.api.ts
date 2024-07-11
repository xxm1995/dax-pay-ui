import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 请求资源树
 */
export const tree = (clientCode) => {
  return defHttp.get<Result<PermPathTree[]>>({
    url: '/perm/path/tree',
    params: { clientCode },
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<PermPath>>({
    url: '/perm/path/findById',
    params: { id },
  })
}

/**
 * 同步
 */
export function syncSystem() {
  return defHttp.post({
    url: `/perm/path/sync`,
  })
}

/**
 * 请求权限
 */
export interface PermPath extends BaseEntity {
  // 标识
  code: string
  // 上级标识
  parentCode: string
  // 权限名称
  name: string
  // 请求类型
  method: string
  // 请求路径
  path: string
}

/**
 * 请求权限树
 */
export interface PermPathTree extends PermPath {
  // 显示标题
  title: string
  // 上级id 角色分配时使用
  pid: string
  // 子级
  children: PermPathTree[]
}
