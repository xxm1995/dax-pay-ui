import { defHttp } from '/@/utils/http/axios'
import { PageResult, Result } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<Voucher>>>({
    url: '/voucher/page',
    params,
  })
}

/**
 * 查询全部
 */
export function findAll() {
  return defHttp.get<Result<Voucher[]>>({
    url: '/voucher/findAll',
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<Voucher>>({
    url: '/voucher/findById',
    params: { id },
  })
}

/**
 * 添加
 */
export function add(obj: Voucher) {
  return defHttp.post({
    url: '/voucher/add',
    data: obj,
  })
}

/**
 * 更新
 */
export function update(obj: Voucher) {
  return defHttp.post({
    url: '/voucher/update',
    data: obj,
  })
}

/**
 * 删除
 */
export function del(id) {
  return defHttp.delete({
    url: '/voucher/delete',
    params: { id },
  })
}

/**
 * 锁定
 */
export function lock(id) {
  return defHttp.post({
    url: '/voucher/lock',
    params: { id },
  })
}

/**
 * 解锁
 */
export function unlock(id) {
  return defHttp.post({
    url: '/voucher/unlock',
    params: { id },
  })
}

/**
 * 批量生成储值卡
 */
export function generationBatch(obj) {
  return defHttp.post({
    url: '/voucher/generationBatch',
    data: obj,
  })
}

/**
 * 储值卡
 */
export interface Voucher extends BaseEntity {
  // 卡号
  cardNo?: string
  // 批次号
  batchNo?: string
  // 面值
  faceValue?: number
  // 余额
  balance?: number
  // 是否长期有效
  enduring?: boolean
  // 开始时间
  startTime?: string
  // 结束时间
  endTime?: string
  // 状态
  status?: number
}
