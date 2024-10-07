import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { MchEntity } from '#/web'
import { LabeledValue } from 'ant-design-vue/lib/select'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<AllocReceiver>>>({
    url: '/allocation/receiver/page',
    params,
  })
}

/**
 * 查询详情
 */
export function get(id) {
  return defHttp.get<Result<AllocReceiver>>({
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
export function add(data: AllocReceiver) {
  return defHttp.post<Result<null>>({
    url: '/allocation/receiver/add',
    data,
  })
}

/**
 * 编码是否存在
 */
export function existsByNo(receiverNo, appId) {
  return defHttp.get<Result<boolean>>({
    url: '/allocation/receiver/existsByReceiverNo',
    params: { receiverNo, appId },
  })
}

/**
 * 修改
 */
export function update(data: AllocReceiver) {
  return defHttp.post<Result<void>>({
    url: '/allocation/receiver/update',
    data,
  })
}

/**
 * 删除
 */
export function del(receiverNo, appId) {
  return defHttp.post<Result<void>>({
    url: '/allocation/receiver/delete',
    data: { receiverNo, appId },
  })
}

/**
 * 分账接收方
 */
export interface AllocReceiver extends MchEntity {
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
