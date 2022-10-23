import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<FileUpload>>>({
    url: '/file/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<FileUpload>>({
    url: '/file/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: FileUpload) => {
  return defHttp.post({
    url: '/file/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: FileUpload) => {
  return defHttp.post({
    url: '/file/update',
    data: obj,
  })
}

/**
 * 删除
 */
export const del = (id) => {
  return defHttp.delete({
    url: '/file/delete',
    params: { id },
  })
}

/**
 * 查询全部
 */
export const findAll = () => {
  return defHttp.get<Result<Array<FileUpload>>>({
    url: '/file/findAll',
  })
}

/**
 * 上传文件信息
 */
export interface FileUpload extends BaseEntity {
  // 存储位置
  filePath: string
  // 文件名称
  fileName: string
  // 文件类型
  fileType: string
  // 文件后缀
  fileSuffix: string
  // 文件大小
  fileSize: number
  // 外部关联id
  externalStorageId: string
}
