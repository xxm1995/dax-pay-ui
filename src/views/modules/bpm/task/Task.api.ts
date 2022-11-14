import { defHttp } from '/@/utils/http/axios'
import { BaseEntity } from '/#/web'
import { PageResult, Result } from '/#/axios'

/**
 * 分页 待处理任务
 */
export function pageByTodoAdmin(params) {
  return defHttp.get<Result<PageResult>>({
    url: '/bpm/admin/task/pageByTodo',
    params: params,
  })
}
/**
 * 分页 已处理任务
 */
export function pageByDoneAdmin(params) {
  return defHttp.get<Result<PageResult>>({
    url: '/bpm/admin/task/pageByDone',
    params: params,
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
