import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { MchEntity } from '#/web'
import { CallbackStatusEnum } from '@/enums/daxpay/TradeStatusEnum'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<TradeCallbackRecord>>>({
    url: '/record/callback/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<TradeCallbackRecord>>({
    url: '/record/callback/findById',
    params: { id },
  })
}

/**
 * 显示样式优化
 */
export function cellStyle({ row, column }) {
  // 支付状态
  if (column.field == 'status') {
    if (row.status == CallbackStatusEnum.SUCCESS) {
      return { color: 'green' }
    }
    if (row.status == CallbackStatusEnum.FAIL || row.status == CallbackStatusEnum.EXCEPTION) {
      return { color: 'red' }
    }
    if (row.status == CallbackStatusEnum.NOT_FOUND) {
      return { color: 'orange' }
    }
    if (row.status == CallbackStatusEnum.IGNORE) {
      return { color: 'gray' }
    }
  }
}

/**
 * 支付回调记录
 */
export interface TradeCallbackRecord extends MchEntity {
  // 交易号
  tradeNo?: string
  // 通道交易号
  outTradeNo?: string
  // 支付通道
  channel?: string
  // 回调类型
  callbackType?: string
  // 通知消息
  notifyInfo?: string
  // 回调处理状态
  status?: string
  // 修复号
  repairNo?: string
  // 提示信息
  errorMsg?: string
}
