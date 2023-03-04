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
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<ProjectInfo>>({
    url: '/goview/admin/findById',
    params: { id },
  })
}

/**
 * 获取GoView的地址
 */
export function getGoViewUrl() {
  return defHttp.get<Result<string>>({
    url: '/goview/admin/getGoViewUrl',
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
 * 发布
 */
export function publish(id) {
  return defHttp.post<Result>({
    url: '/goview/admin/publish',
    params: { id },
  })
}

/**
 * 取消发布
 */
export function unPublish(id) {
  return defHttp.post<Result>({
    url: '/goview/admin/unPublish',
    params: { id },
  })
}

/**
 * 应用编辑中的信息
 */
export function enableEditContent(id) {
  return defHttp.post<Result>({
    url: '/goview/admin/enableEditContent',
    params: { id },
  })
}

/**
 * 重置编辑中的信息
 */
export function resetEditContent(id) {
  return defHttp.post<Result>({
    url: '/goview/admin/resetEditContent',
    params: { id },
  })
}

/**
 * 复制
 */
export function copy(id) {
  return defHttp.post({
    url: '/goview/admin/copy',
    params: { id },
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
  // 备注
  remark?: string
  // 预览图片id
  indexImage?: string
  // 是否在编辑中
  edit?: boolean
}
