import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'
import { deleteBatchUserAssign } from "/@/views/modules/system/scope/DataScope.api";

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<GeneralTemplate>>>({
    url: '/general/template/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<GeneralTemplate[]>>({
    url: '/general/template/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<GeneralTemplate>>({
    url: '/general/template/findById',
    params: { id },
  })
}
/**
 * 编码是否被使用
 */
export const existsByCode = (code) => {
  return defHttp.get<Result<boolean>>({
    url: '/general/template/existsByCode',
    params: { code },
  })
}
export const existsByCodeNotId = (code, id) => {
  return defHttp.get<Result<boolean>>({
    url: '/general/template/existsByCodeNotId',
    params: { code, id },
  })
}
/**
 * 添加
 */
export function add(obj: GeneralTemplate) {
  return defHttp.post({
    url: '/general/template/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: GeneralTemplate) {
  return defHttp.post({
    url: '/general/template/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/general/template/delete',
    params: { id },
  })
}

/**
 * 批量删除
 */
export function deleteBatch(ids) {
  return defHttp.delete({
    url: '/general/template/delete',
    data: ids,
  })
}

/**
 * 通用模板管理
 */
export interface GeneralTemplate extends BaseEntity {
  // 模板名称
  name?: string
  // 模板代码
  code?: string
  // 使用类型(导入/导出)
  useType?: string
  // 模板类型
  fileType?: string
  // 模板后缀名
  fileSuffix?: string
  // 状态
  state?: string
  // 文件ID
  fileId?: string
  // 备注
  remark?: string
}
