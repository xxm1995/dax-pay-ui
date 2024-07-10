import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { BaseEntity } from '#/web'
import { unref } from 'vue'

/**
 * 权限码树列表
 */
export const codeTree = () => {
  return defHttp.get<Result<Array<PermCode>>>({
    url: '/perm/code/tree',
  })
}

/**
 * 权限码目录树
 */
export const catalogTree = () => {
  return defHttp.get<Result<Array<PermCode>>>({
    url: '/perm/code/catalogTree',
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<PermCode>>({
    url: '/perm/code/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: PermCode) => {
  return defHttp.post({
    url: '/perm/code/add',
    data: unref(obj),
  })
}

/**
 * 更新
 */
export const update = (obj: PermCode) => {
  return defHttp.post({
    url: '/perm/code/update',
    data: unref(obj),
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/perm/code/delete',
    params: { id },
  })
}

/**
 * 编码是否被使用
 */
export const existsByCode = (code: string) => {
  return defHttp.get<Result<boolean>>({
    url: '/perm/code/existsByCode',
    method: 'GET',
    params: { code },
  })
}
export const existsByCodeNotId = (code: string, id) => {
  return defHttp.get<Result<boolean>>({
    url: '/perm/code/existsByCodeNotId',
    params: { code, id },
  })
}

/**
 * 权限码
 */
export interface PermCode extends BaseEntity {
  // 权限码权限编码
  code: string
  // 权限码名称
  name: string
  // 父id
  pid?: string
  // 描述
  remark?: string
  // 是否为子节点
  leaf: boolean
  // 显示标题, 纯显示用
  title?: string
}

/**
 * 权限码树
 */
export interface PermCodeTree extends PermCode {
  children: PermCodeTree[]
}
