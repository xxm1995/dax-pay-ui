import { defHttp } from '/@/utils/http/axios'
import { Result, PageResult } from '/#/axios'
import { BaseEntity } from '/#/web'

/**
 * 导入
 */
export function voucherImport(params) {
  return defHttp.post<Result>({
    url: '/voucher/import',
    data: params,
  })
}

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<Voucher[]>>>({
    url: '/voucher/page',
    params,
  })
}

/**
 * 查询详情
 */
export function get(id) {
  return defHttp.get<Result<Voucher>>({
    url: '/voucher/findById',
    params: { id },
  })
}

/**
 * 储值卡
 */
export interface Voucher extends BaseEntity {
  // 卡号
  cardNo?: string
  // 面值
  faceValue?: number
  // 余额
  balance?: string
  // 是否长期有效
  enduring?: boolean
  // 开始时间
  startTime?: string
  // 结束时间
  endTime?: string
  // 状态
  status?: string
}
