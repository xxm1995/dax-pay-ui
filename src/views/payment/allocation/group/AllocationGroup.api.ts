import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页查询
 */
export function page(params) {
  return defHttp.get<Result<PageResult<AllocationGroup>>>({
    url: '/allocation/group/page',
    params,
  })
}

/**
 * 查询详情
 */
export function get(id) {
  return defHttp.get<Result<AllocationGroup>>({
    url: '/allocation/group/findById',
    params: { id },
  })
}

/**
 * 查询分账接收方信息
 */
export function getReceivers(groupId) {
  return defHttp.get<Result<AllocationGroupReceiver[]>>({
    url: '/allocation/group/findReceiversByGroups',
    params: { groupId },
  })
}

/**
 * 创建
 */
export function add(data: AllocationGroup) {
  return defHttp.post<Result<AllocationGroup>>({
    url: '/allocation/group/create',
    data,
  })
}

/**
 * 修改
 */
export function update(data: AllocationGroup) {
  return defHttp.post<Result<AllocationGroup>>({
    url: '/allocation/group/update',
    data,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.post<Result>({
    url: '/allocation/group/delete',
    params: { id },
  })
}

/**
 * 批量绑定接收者
 */
export function bindReceivers(data) {
  return defHttp.post<Result>({
    url: '/allocation/group/bindReceivers',
    data,
  })
}

/**
 * 批量取消绑定接收者
 */
export function unbindReceivers(data: { groupId: string; receiverIds: string[] }) {
  return defHttp.post<Result>({
    url: '/allocation/group/unbindReceivers',
    data,
  })
}

/**
 * 取消绑定接收者
 */
export function unbindReceiver(receiverId) {
  return defHttp.post<Result>({
    url: '/allocation/group/unbindReceiver',
    params: { receiverId },
  })
}

/**
 * 修改分账比例
 */
export function updateRate(receiverId, rate: number) {
  return defHttp.post<Result>({
    url: '/allocation/group/updateRate',
    params: { receiverId, rate },
  })
}

/**
 * 编码是否存在
 */
export function existsByNo(receiverNo) {
  return defHttp.get<Result<boolean>>({
    url: '/allocation/group/existsByGroupNo',
    params: { receiverNo },
  })
}

/**
 * 设置默认分账组
 */
export function setDefaultGroup(id) {
  return defHttp.post<Result>({
    url: '/allocation/group/setDefault',
    params: { id },
  })
}

/**
 * 取消默认分账组
 */
export function cancelDefaultGroup(id) {
  return defHttp.post<Result>({
    url: '/allocation/group/clearDefault',
    params: { id },
  })
}

/**
 * 分账组
 */
export interface AllocationGroup extends BaseEntity {
  /**
   * 分账组编号
   */
  groupNo?: string
  /**
   * 分账组名称
   */
  name?: string
  /**
   * 通道
   */
  channel?: string
  /**
   * 总分账比例
   */
  totalRate?: number
  /**
   * 分账组描述
   */
  remark?: string
}

/**
 * 分账组接收方信息
 */
export interface AllocationGroupReceiver extends BaseEntity {
  /**
   * 分账接收方ID
   */
  receiverId?: string
  /**
   * 默认分账组
   */
  defaultGroup?: boolean
  /**
   * 分账比例
   */
  rate?: number
  /**
   * 分账接收方类型
   */
  receiverType?: string
  /**
   * 分账接收方账号
   */
  receiverAccount?: string
  /**
   * 分账接收方名称
   */
  receiverName?: string
  /**
   * 分账关系类型
   */
  relationType?: string
  /**
   * 关系名称
   */
  relationName?: string
}
