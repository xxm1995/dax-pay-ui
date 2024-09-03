import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { MchEntity } from '#/web'
import {
  PayAllocStatusEnum,
  PayRefundStatusEnum,
  PayStatusEnum,
} from '@/enums/daxpay/TradeStatusEnum'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<PayOrder>>>({
    url: '/order/pay/page',
    params,
  })
}

/**
 * 获取订单
 */
export function getOrder(id: number) {
  return defHttp.get<Result<PayOrder>>({
    url: '/order/pay/findById',
    params: { id },
  })
}

/**
 * 根据订单号查询详情
 */
export function getOrderByOrderNo(orderNo: string) {
  return defHttp.get<Result>({
    url: '/order/pay/findByOrderNo',
    params: { orderNo },
  })
}

/**
 * 同步支付状态
 */
export function syncOrder(id: string) {
  return defHttp.post<Result>({
    url: '/order/pay/sync',
    params: { id },
  })
}

/**
 * 关闭支付记录
 */
export function close(id) {
  return defHttp.post<Result<void>>({
    url: '/order/pay/close',
    params: { id },
  })
}

/**
 * 关闭支付记录
 */
export function cancel(id) {
  return defHttp.post<Result<void>>({
    url: '/order/pay/cancel',
    params: { id },
  })
}

/**
 * 触发分账
 */
export function allocationByOrderNo(orderNo) {
  return defHttp.post<Result<void>>({
    url: '/order/pay/allocation',
    params: { orderNo },
  })
}

/**
 * 获取汇总金额
 */
export function getTotalAmount(param) {
  return defHttp.get<Result<number>>({
    url: '/order/pay/getTotalAmount',
    params: param,
  })
}

/**
 * 显示样式优化
 */
export function cellStyle({ row, column }) {
  // 支付状态
  if (column.field == 'status') {
    switch (row.status) {
      case PayStatusEnum.SUCCESS:
        return { color: 'green' }
      case PayStatusEnum.FAIL:
        return { color: 'red' }
      case PayStatusEnum.PROGRESS:
        return { color: 'orange' }
      case PayStatusEnum.CLOSE:
        return { color: 'gray' }
      case PayStatusEnum.CANCEL:
        return { color: 'gray' }
      default:
        return { color: 'red' }
    }
  }
  // 分账状态
  if (column.field == 'allocStatus') {
    switch (row.allocStatus) {
      case PayAllocStatusEnum.WAITING:
        return { color: 'orange' }
      case PayAllocStatusEnum.ALLOCATION:
        return { color: 'green' }
      default:
        return { color: 'red' }
    }
  }
  // 退款状态
  if (column.field == 'refundStatus') {
    switch (row.refundStatus) {
      case PayRefundStatusEnum.NO_REFUND:
        return { color: 'gray' }
      case PayRefundStatusEnum.REFUNDED:
        return { color: 'green' }
      case PayRefundStatusEnum.REFUNDING:
        return { color: 'orange' }
      case PayRefundStatusEnum.PARTIAL_REFUND:
        return { color: 'LightSkyBlue' }
      default:
        return { color: 'red' }
    }
  }
}

/**
 * 支付记录
 */
export interface PayOrder extends MchEntity {
  // 标题
  title?: string
  // 商户订单号
  bizOrderNo?: string
  // 支付订单号
  orderNo?: string
  // 三方系统交易号
  outOrderNo?: string
  // 描述
  description?: any
  // 是否支持分账
  allocation?: boolean
  // 自动分账
  autoAllocation?: boolean
  // 支付通道
  channel?: string
  // 支付方式
  method?: string
  // 金额
  amount?: number
  // 可退款余额
  refundableBalance?: number
  // 支付状态
  status?: string
  // 退款状态
  refundStatus?: string
  // 分账状态
  allocStatus?: string
  // 支付时间
  payTime?: string
  // 过期时间
  expiredTime?: string
  // 关闭时间
  closeTime?: string
  // 异步通知地址
  notifyUrl?: string
  // 商户扩展参数
  attach?: string
  // 附加参数
  extraParam?: string
  // 请求时间
  reqTime?: string
  // 支付终端ip
  clientIp?: string
  // 错误码
  errorCode?: string
  // 错误信息
  errorMsg?: string
}
