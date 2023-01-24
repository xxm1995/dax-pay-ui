import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<DataEncryptDemo>>>({
    url: '/demo/data/encrypt/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<DataEncryptDemo[]>>({
    url: '/demo/data/encrypt/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<DataEncryptDemo>>({
    url: '/demo/data/encrypt/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: DataEncryptDemo) {
  return defHttp.post({
    url: '/demo/data/encrypt/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: DataEncryptDemo) {
  return defHttp.post({
    url: '/demo/data/encrypt/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/demo/data/encrypt/delete',
    params: { id },
  })
}

/**
 * 数据加密解密演示
 */
export interface DataEncryptDemo extends BaseEntity {
  // 名称
  name?: string
  // 内容
  content?: string
  // 原始内容
  contentEncryption?: string
}
