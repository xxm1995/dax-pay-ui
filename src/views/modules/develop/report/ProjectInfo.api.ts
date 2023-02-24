import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<ProjectInfo>>>({
    url: '/goview/admin/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<ProjectInfo[]>>({
    url: '/goview/admin/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<ProjectInfo>>({
    url: '/goview/admin/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: ProjectInfo) {
  return defHttp.post({
    url: '/goview/admin/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: ProjectInfo) {
  return defHttp.post({
    url: '/goview/admin/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/goview/admin/delete',
    params: { id },
  })
}

/**
 * 自定义大屏信息
 */
export interface ProjectInfo extends BaseEntity {
  // 项目名称
  name?: string
  // 发布状态
  state?: number
  // 报表内容
  content?: string
  // 备注
  remark?: string
  // 预览图片id
  indexImage?: string
  // 是否在编辑中
  edit?: boolean
}
