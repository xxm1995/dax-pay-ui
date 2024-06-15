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
 * 编码是否存在
 */
export function existsByNo(receiverNo) {
  return defHttp.get<Result<boolean>>({
    url: '/allocation/receiver/existsByReceiverNo',
    params: { receiverNo },
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
 * 分账接收方
 */
export interface AllocationReceiver extends BaseEntity {
  // 分账接收方编号
  receiverNo?: string
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
}
