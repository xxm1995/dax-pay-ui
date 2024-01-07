import { defHttp } from '/@/utils/http/axios'
import { Result, UploadFileParams } from '/#/axios'
import { UploadApiResult } from '/@/api/sys/model/uploadModel'
import { getAppEnvConfig } from '/@/utils/env'
const { VITE_GLOB_API_URL } = getAppEnvConfig()

/**
 * 获取文件预览地址
 */
export const getFilePreviewUrl = (id) => {
  return defHttp.get<Result<string>>({
    url: `/file/getFilePreviewUrl`,
    params: { id },
  })
}

/**
 * 获取文件预览地址前缀
 */
export const getFilePreviewUrlPrefix = () => {
  return defHttp.get<Result<string>>({
    url: `/file/getFilePreviewUrlPrefix`,
  })
}

/**
 * 获取文件下载地址
 */
export const getFileDownloadUrl = (id) => {
  return defHttp.get<Result<string>>({
    url: `/file/getFileDownloadUrl`,
    params: { id },
  })
}

/**
 * 上传文件
 * @param params
 * @param onUploadProgress
 */
export function uploadFile(params: UploadFileParams, onUploadProgress: (progressEvent: ProgressEvent) => void) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: VITE_GLOB_API_URL + '/file/upload',
      onUploadProgress,
    },
    params,
  )
}

/**
 * 上传文件信息
 */
export interface UpdateFileInfo {
  // id
  id?: number
  // 文件访问地址
  url?: string
  // 文件大小，单位字节
  size?: string
  // 文件名称
  filename?: string
  // 原始文件名
  originalFilename?: string
  // 基础存储路径
  basePath?: string
  // 存储路径
  path?: string
  // 文件扩展名
  ext?: string
  // MIME类型
  contentType?: string
  // 存储平台
  platform?: string
  // 缩略图访问路径
  thUrl?: string
  // 缩略图名称
  thFilename?: string
  // 缩略图大小，单位字节
  thSize?: string
  // 缩略图MIME类型
  thContentType?: string
  // 文件所属对象id
  objectId?: string
  // 文件所属对象类型，例如用户头像，评价图片
  objectType?: string
  // 文件元数据
  metadata?: string
  // 文件用户元数据
  userMetadata?: string
  // 缩略图元数据
  thMetadata?: string
  // 缩略图用户元数据
  thUserMetadata?: string
  // 附加属性
  attr?: string
  // 文件ACL
  fileAcl?: string
  // 缩略图文件ACL
  thFileAcl?: string
}
