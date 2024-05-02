/**
 * 支付状态
 */
export enum PayStatus {
  /** 支付中 */
  PROGRESS = 'progress',

  /** 成功 */
  SUCCESS = 'success',

  /** 支付关闭(超时/手动取消/订单已经关闭撤销支付单) */
  CANCEL = 'close',

  /** 部分退款 */
  PARTIAL_REFUND = 'partial_refund',

  /** 全部退款 */
  REFUNDED = 'refunded',

  /** 失败 */
  FAIL = 'fail',
}
