import { defHttp } from '/@/utils/http/axios'
import { Result } from "/#/axios";

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
 * 获取文件地址前缀
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
