import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<PayNotifyRecord>>>({
    url: '/pay/notify/record/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<PayNotifyRecord[]>>({
    url: '/pay/notify/record/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<PayNotifyRecord>>({
    url: '/pay/notify/record/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: PayNotifyRecord) {
  return defHttp.post({
    url: '/pay/notify/record/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: PayNotifyRecord) {
  return defHttp.post({
    url: '/pay/notify/record/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/pay/notify/record/delete',
    params: { id },
  })
}

/**
 * 支付回调记录
 */
export interface PayNotifyRecord extends BaseEntity {
  // 支付号
  paymentId?: string
  // 通知消息
  notifyInfo?: string
  // 支付通道
  payChannel?: number
  // 处理状态
  status?: number
  // 提示信息
  msg?: string
  // 回调时间
  notifyTime?: string
}
