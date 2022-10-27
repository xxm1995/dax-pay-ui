import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<WechatMenu>>>({
    url: '/wechat/menu/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<WechatMenu>>({
    url: '/wechat/menu/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: WechatMenu) => {
  return defHttp.post({
    url: '/wechat/menu/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: WechatMenu) => {
  return defHttp.post({
    url: '/wechat/menu/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/wechat/menu/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<WechatMenu>>>({
    url: '/wechat/menu/findAll',
  })
}

/**
 * 清空微信菜单
 */
export function clearMenu() {
  return defHttp.post({
    url: '/wechat/menu/clearMenu',
  })
}

/**
 * 发布菜单
 */
export function publish(id) {
  return defHttp.post({
    url: '/wechat/menu/publish',
    params: { id },
  })
}

/**
 * 导入微信配置的菜单
 */
export function importMenu() {
  return defHttp.post({
    url: '/wechat/menu/importMenu',
  })
}

/**
 * 微信自定义菜单
 */
export interface WechatMenu extends BaseEntity {
  // 名称
  name: string
  // 菜单信息
  menuInfo: string | null
  // 备注
  remark: string
  // 是否发布
  publish: boolean
}
