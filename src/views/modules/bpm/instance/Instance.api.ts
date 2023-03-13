import { defHttp } from '/@/utils/http/axios'
import { BaseEntity } from '/#/web'
import { PageResult, Result } from '/#/axios'
import { BpmModelNode } from '/@/views/modules/bpm/model/node/ModelNode.api'

/**
 * 分页
 */
export function pageAdmin(params) {
  return defHttp.get<Result<PageResult<Instance>>>({
    url: '/bpm/admin/instance/page',
    params: params,
  })
}

/**
 * 启动流程
 */
export function start(obj) {
  return defHttp.post({
    url: '/bpm/instance/start',
    data: obj,
  })
}

/**
 * 挂起实例
 */
export function suspend(instanceId) {
  return defHttp.post({
    url: '/bpm/instance/suspend',
    params: { instanceId },
  })
}

/**
 * 激活流程
 */
export function activate(instanceId) {
  return defHttp.post({
    url: '/bpm/instance/activate',
    params: { instanceId },
  })
}

/**
 * 分页 我的发起的流程
 */
export function pageMyApply(params) {
  return defHttp.get<Result<PageResult<Instance>>>({
    url: '/bpm/instance/pageMyApply',
    params: params,
  })
}

/**
 * 获取流程详情
 */
export function findByInstanceId(instanceId) {
  return defHttp.get<Result<Instance>>({
    url: '/bpm/instance/findByInstanceId',
    params: { instanceId },
  })
}

/**
 * 获取流程执行的节点, 用于绘制流程图
 */
export function getFlowNodes(instanceId) {
  return defHttp.get<Result<BpmModelNode>>({
    url: '/bpm/instance/getFlowNodes',
    params: { instanceId },
  })
}

/**
 * 获取当前任务节点信息
 */
export function getCurrentNode(instanceId) {
  return defHttp.get<Result<BpmModelNode>>({
    url: '/bpm/instance/getCurrentNode',
    params: { instanceId },
  })
}

/**
 * 获取可回退节点信息
 */
export function getBackNodes(instanceId) {
  return defHttp.get<Result<BpmModelNode[]>>({
    url: '/bpm/instance/getBackNodes',
    params: { instanceId },
  })
}

/**
 * 取消流程
 */
export function close(instanceId) {
  return defHttp.post({
    url: '/bpm/instance/close',
    params: { instanceId },
  })
}

/**
 * 流程实例扩展
 */
export interface Instance extends BaseEntity {
  // 流程实例的id
  instanceId: string
  // 流程标题
  instanceName: string
  // 模型id
  modelId: string
  // 流程定义ID
  defId: string
  // 流程定义名称
  defName: string
  // 发起人
  startUserId: string
  // 发起人名称
  startUserName: string
  // 流程实例的状态
  state: string
  // 开始时间
  startTime: string
  // 结束时间
  endTime: string
  // 提交的表单值
  formVariables: string
}
