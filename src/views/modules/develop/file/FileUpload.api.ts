import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { UpdateFileInfo } from "/@/api/common/FileUpload";

/**
 * 分页
 */
export const page = (params) => {
  return defHttp.get<Result<PageResult<UpdateFileInfo>>>({
    url: '/file/page',
    params,
  })
}

/**
 * 获取单条
 */
export const get = (id) => {
  return defHttp.get<Result<UpdateFileInfo>>({
    url: '/file/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export const add = (obj: UpdateFileInfo) => {
  return defHttp.post({
    url: '/file/add',
    data: obj,
  })
}

/**
 * 更新
 */
export const update = (obj: UpdateFileInfo) => {
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
  return defHttp.get<Result<UpdateFileInfo>>({
    url: '/file/findAll',
  })
}
