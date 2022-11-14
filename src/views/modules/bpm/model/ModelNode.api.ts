import { defHttp } from '/@/utils/http/axios'
import { BaseEntity } from '/#/web'
import { PageResult, Result } from '/#/axios'

/**
 * 查询全部
 */
export function listByModelId(modelId) {
  return defHttp.get<Result<BpmModelNode[]>>({
    url: '/bpm/model/node/findAllByModelId',
    params: { modelId },
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<BpmModelNode>>({
    url: '/bpm/model/node/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj) {
  return defHttp.post({
    url: '/bpm/model/node/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj) {
  return defHttp.post({
    url: '/bpm/model/node/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/bpm/model/node/delete',
    params: { id },
  })
}

/**
 * 同步
 */
export function sync(modelId) {
  return defHttp.post({
    url: '/bpm/model/node/sync',
    params: { modelId },
  })
}

/**
 * 获取节点信息
 */
export function getNode(defId, nodeId) {
  return defHttp.get({
    url: '/bpm/model/node/findByDefIdAndTaskId',
    params: { defId, nodeId },
  })
}

/**
 * 获取下一环节列表
 */
export function getNextNodes(defId, nodeId) {
  return defHttp.get({
    url: '/bpm/model/node/getNextNodes',
    params: { defId, nodeId },
  })
}

/**
 * 模型任务节点配置
 */
export interface BpmModelNode extends BaseEntity {
  // 关联模型id
  modelId?: string
  // 流程定义id
  defId?: string
  // 流程key
  defKey?: string
  // 任务节点id
  nodeId?: string
  // 任务节点名称
  nodeName?: string
  // 是否多任务
  multi?: boolean
  // 是否串签
  sequential?: boolean
  // 是否是或签
  orSign?: boolean
  // 是否比例通过
  ratioPass?: boolean
  // 通过比例
  passRatio?: number
  // 是否允许驳回
  reject?: boolean
  // 是否允许回退
  back?: boolean
  // 是否允许取回
  retrieve?: boolean
  // 是否跳过当前节点
  skip?: boolean
  // 关联表单
  formId?: string
  // 分配类型
  assignType?: string
  // 分配的原始数据
  assignRaw?: string
  // 分配的数据的展示
  assignShow?: string
}
