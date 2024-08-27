import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { MchEntity } from '#/web'

/**
 * 任务分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<ReconcileStatement[]>>>({
    url: '/reconcile/statement/page',
    method: 'get',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<ReconcileStatement>>({
    url: '/reconcile/statement/findById',
    params: { id },
  })
}

/**
 * 手动创建对账订单
 */
export function create(params: ReconcileCreatParam) {
  return defHttp.post<Result<ReconcileStatement>>({
    url: '/reconcile/statement/create',
    data: params,
  })
}

/**
 * 下载对账单
 */
export function downAndSave(id: any) {
  return defHttp.post<any>({
    url: '/reconcile/statement/downAndSave',
    params: { id },
  })
}

/**
 * 对账单比对
 */
export function compare(id: any) {
  return defHttp.post<any>({
    url: '/reconcile/statement/compare',
    params: { id },
  })
}

/**
 * 对账记录
 */
export interface ReconcileStatement extends MchEntity {
  /** 名称 */
  name?: string

  /** 对账号 */
  reconcileNo?: string

  /** 对账日期 */
  date?: string

  /** 交易对账文件是否下载或上传成功 */
  downOrUpload?: boolean

  /** 交易对账文件是否比对完成 */
  compare?: boolean

  /** 通道 */
  channel?: string

  /** 对账结果 */
  result?: string

  /** 通道对账单文件id */
  channelFileUrl?: string

  /** 平台对账单文件ID */
  platformFileUrl?: string

  /* 平台侧信息 */

  /** 支付订单数 */
  orderCount?: number

  /** 支付交易金额 */
  orderAmount?: number

  /** 退款订单数 */
  refundCount?: number

  /** 退款交易金额 */
  refundAmount?: number

  /* 通道侧信息 */
  /** 通道支付订单数 */
  channelOrderCount?: number

  /** 通道支付交易金额 */
  channelOrderAmount?: number

  /** 通道退款订单数 */
  channelRefundCount?: number

  /** 通道退款交易金额 */
  channelRefundAmount?: number

  /** 错误编码 */
  errorCode?: string

  /** 错误消息 */
  errorMsg?: string
}

/**
 * 对账创建参数
 */
export interface ReconcileCreatParam {
  /** 名称 */
  title?: string

  /** 对账日期 */
  date?: string

  /** 支付通道 */
  channel?: string
  /**
   * 商户号
   */
  mchNo?: string
  /**
   * 应用AppId
   */
  appId?: string
}
