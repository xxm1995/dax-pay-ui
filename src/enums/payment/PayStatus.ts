/**
 * 支付状态
 */
export enum PayStatus {
  /** 未知状态 */
  TRADE_UNKNOWN = 'trade_unknown',

  /** 支付中 */
  TRADE_PROGRESS = 'trade_progress',

  /** 成功 */
  TRADE_SUCCESS = 'trade_success',

  /** 失败 */
  TRADE_FAIL = 'trade_fail',

  /** 支付取消(超时/手动取消/订单已经关闭撤销支付单) */
  TRADE_CANCEL = 'trade_cancel',

  /** 退款中(部分退款) */
  TRADE_REFUNDING = 'trade_refunding',

  /** 已退款 */
  TRADE_REFUNDED = 'trade_refunded',
}
