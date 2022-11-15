import { defHttp } from '/@/utils/http/axios'
import { BaseEntity } from '/#/web'
import { PageResult, Result } from '/#/axios'

/**
 * 分页 待处理任务
 */
export function pageByTodoAdmin(params) {
  return defHttp.get<Result<PageResult<Task[]>>>({
    url: '/bpm/admin/task/pageByTodo',
    params: params,
  })
}
/**
 * 分页 已处理任务
 */
export function pageByDoneAdmin(params) {
  return defHttp.get<Result<PageResult<Task[]>>>({
    url: '/bpm/admin/task/pageByDone',
    params: params,
  })
}

/**
 * 分页 我的待办
 */
export function pageMyTodo(params) {
  return defHttp.get<Result<PageResult<Task[]>>>({
    url: '/bpm/task/pageMyTodo',
    params: params,
  })
}

/**
 * 分页 我的已办
 */
export function pageMyDone(params) {
  return defHttp.get<Result<PageResult<Task[]>>>({
    url: '/bpm/task/pageMyDone',
    params: params,
  })
}

/**
 * 根据任务实例ID查询任务列表
 */
export function findAllByInstanceId(instanceId) {
  return defHttp.get<Result<Task[]>>({
    url: '/bpm/task/findAllByInstanceId',
    params: { instanceId },
  })
}

/**
 * 获取流程节点的分组任务信息
 */
export function getNodeTasks(instanceId) {
  return defHttp.get<Result<Record<string, Task[]>>>({
    url: '/bpm/task/getNodeTasks',
    method: 'GET',
    params: { instanceId },
  })
}

/**
 * 任务处理
 */
export function approve(obj) {
  return defHttp.post({
    url: '/bpm/task/approve',
    data: obj,
  })
}

/**
 * 任务回退
 */
export function flowReturn(obj) {
  return defHttp.post({
    url: '/bpm/task/flowReturn',
    data: obj,
  })
}

/**
 * 重新分配人员
 */
export function assignee(taskId, userId) {
  return defHttp.post({
    url: '/bpm/task/assignee',
    params: { taskId, userId },
  })
}

/**
 * 流程任务扩展
 */
export interface Task extends BaseEntity {
  // 任务ID
  taskId?: string
  // 任务执行 ID
  executionId?: string
  // 多实例关联id
  multiId?: string
  // 流程实例的id
  instanceId?: string
  // 流程名称(业务标题)
  instanceName?: string
  // 流程定义名称
  defName?: string
  // 任务节点id
  nodeId?: string
  // 任务节点名称
  nodeName?: string
  // 处理状态
  state?: string
  // 处理结果
  result?: string
  // 处理意见
  reason?: string
  // 开始时间
  startTime?: string
  // 结束时间
  endTime?: string
  // 当前处理人
  userId?: string
  // 当前处理人
  userName?: string
  // 发起人
  startUserId?: string
  // 发起人名称
  startUserName?: string
  // 提交的表单值
  formVariables?: string
}
