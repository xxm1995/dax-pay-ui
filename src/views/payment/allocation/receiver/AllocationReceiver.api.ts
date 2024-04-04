import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<AllocationReceiver>>>({
    url: '/allocation/receiver/page',
    params,
  })
}

/**
 * 查询详情
 */
export function get(id) {
  return defHttp.get<Result<AllocationReceiver>>({
    url: '/allocation/receiver/findById',
    params: { id },
  })
}

/**
 * 获取可以分账的通道
 */
export function findChannels() {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/allocation/receiver/findChannels',
  })
}

/**
 * 根据通道获取分账接收方类型
 */
export function findReceiverTypeByChannel(channel) {
  return defHttp.get<Result<LabeledValue[]>>({
    url: '/allocation/receiver/findReceiverTypeByChannel',
    params: { channel },
  })
}

/**
 * 新增
 */
export function add(data: AllocationReceiver) {
  return defHttp.post<Result<null>>({
    url: '/allocation/receiver/add',
    data,
  })
}

/**
 * 修改
 */
export function update(data: AllocationReceiver) {
  return defHttp.post<Result<null>>({
    url: '/allocation/receiver/update',
    data,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.post<Result<null>>({
    url: '/allocation/receiver/delete',
    params: { id },
  })
}

/**
 * 同步到三方支付系统中
 */
export function registerByGateway(id) {
  return defHttp.post<Result<null>>({
    url: '/allocation/receiver/registerByGateway',
    params: { id },
  })
}

/**
 * 从三方支付系统中删除
 */
export function removeByGateway(id) {
  return defHttp.post<Result<null>>({
    url: '/allocation/receiver/removeByGateway',
    params: { id },
  })
}

/**
 * 分账接收方
 */
export interface AllocationReceiver extends BaseEntity {
  // 账号别名
  name?: string
  // 所属通道
  channel?: string
  // 分账接收方类型
  receiverType?: string
  // 接收方账号
  receiverAccount?: string
  // 接收方姓名
  receiverName?: string
  // 分账关系类型
  relationType?: string
  // 关系名称
  relationName?: string
  // 是否已经同步到网关
  sync?: boolean
}
