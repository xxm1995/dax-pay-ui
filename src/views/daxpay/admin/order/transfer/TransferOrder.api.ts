import { defHttp } from '@/utils/http/axios'
import { PageResult, Result } from '#/axios'
import { BaseEntity } from '#/web'

/**
 * 分页
 */
export function page(params) {
  return defHttp.get<Result<PageResult<TransferOrder>>>({
    url: '/order/transfer/page',
    params,
  })
}

/**
 * 获取单条
 */
export function get(id) {
  return defHttp.get<Result<TransferOrder>>({
    url: '/order/transfer/findById',
    params: { id },
  })
}

/**
 * 获取单条
 */
export function getByBizTransferNo(bizTransferNo) {
  return defHttp.get<Result<TransferOrder>>({
    url: '/order/transfer/findByBizTransferNo',
    params: { bizTransferNo },
  })
}

/**
 * 发起转账
 */
export function transfer(params) {
  return defHttp.post<Result<void>>({
    url: '/order/transfer/transfer',
    data: params,
  })
}

/**
 * 转账信息同步
 */
export function syncByTransferNo(transferNo) {
  return defHttp.post<Result<void>>({
    url: '/order/transfer/syncByTransferNo',
    params: { transferNo },
  })
}

/**
 * 转账重试
 */
export function resetTransfer(id) {
  return defHttp.post<Result<void>>({
    url: '/order/transfer/resetTransfer',
    params: { id },
  })
}

/**
 * 获取汇总金额
 */
export function getTotalAmount(param) {
  return defHttp.get<Result<number>>({
    url: '/order/transfer/getTotalAmount',
    params: param,
  })
}

/**
 * 转账记录
 */
export interface TransferOrder extends BaseEntity {
  // 商户转账号
  bizTransferNo?: string
  // 转账号
  transferNo?: string
  // 通道转账号
  outTransferNo?: string
  // 通道
  channel?: string
  // 转账金额
  amount?: number
  // 标题
  title?: string
  // 转账原因/备注
  reason?: string
  // 转账类型, 微信使用
  transferType?: string
  // 付款方
  payer?: string
  // 收款人账号
  payeeAccount?: string
  // 收款人姓名
  payeeName?: string
  // 状态
  status?: string
  // 成功时间
  successTime?: string
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
