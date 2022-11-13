import { defHttp } from '/@/utils/http/axios'
import { BaseEntity } from '/#/web'
import { PageResult, Result } from '/#/axios'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<BpmModel>>>({
    url: '/bpm/model/page',
    params: params,
  })
}

/**
 * 获取生效并部署的主流程列表
 */
export function findMainProcess() {
  return defHttp.get<Result<BpmModel>>({
    url: '/bpm/model/findMainProcess',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<BpmModel>>({
    url: '/bpm/model/findById',
    params: { id },
  })
}

/**
 * 根据流程定义id获取模型信息
 */
export function findByDefId(defId) {
  return defHttp.get<Result<BpmModel>>({
    url: '/bpm/model/findByDefId',
    params: { defId },
  })
}

/**
 * 添加
 */
export function add(obj) {
  return defHttp.post<Result>({
    url: '/bpm/model/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj) {
  return defHttp.post<Result>({
    url: '/bpm/model/update',
    data: obj,
  })
}
/**
 * 上传bpmn文件
 */
export function uploadBpmn(id, modelEditorXml) {
  return defHttp.post<Result>({
    url: '/bpm/model/uploadBpmn',
    data: {
      id,
      modelEditorXml,
    },
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete<Result>({
    url: '/bpm/model/delete',
    params: { id },
  })
}

/**
 * 发布
 */
export function publish(id) {
  return defHttp.post<Result>({
    url: '/bpm/model/publish',
    params: { id },
  })
}
/**
 * 校验流程
 */
export function verifyModel(id) {
  return defHttp.get<Result>({
    url: '/bpm/model/verifyModel',
    params: { id },
  })
}

/**
 * 复制
 */
export function copy(id) {
  return defHttp.post<Result>({
    url: '/bpm/model/copy',
    params: { id },
  })
}

/**
 * 流程模型
 */
export interface BpmModel extends BaseEntity {
  // 名称
  name: string
  // 流程类型
  modelType?: string
  // 关联表单
  formId?: string | null
  // 发布状态
  publish?: string
  // 启用状态
  enable?: boolean
  // 部署id
  deployId?: string
  // 流程定义id
  defId?: string
  // 流程key
  defKey?: string
  // 流程名称
  defName?: string
  // 流程备注
  defRemark?: string
  // 是否主流程
  mainProcess?: boolean
  // 流程版本号
  processVersion?: number
  // 流程xml
  modelEditorXml?: string
  // 备注
  remark?: string
}
