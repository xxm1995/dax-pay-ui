/**
 * 支付状态
 */
export enum PayStatusEnum {
  /**
   * 支付中
   */
  PROGRESS = 'progress',
  /**
   * 成功
   */
  SUCCESS = 'success',
  /**
   * 支付关闭
   */
  CLOSE = 'close',
  /**
   * 支付撤销
   */
  CANCEL = 'cancel',
  /**
   * 失败
   */
  FAIL = 'fail',
  /**
   * 支付超时
   */
  TIMEOUT = 'timeout',
}

/**
 * 支付订单的退款状态
 */
export enum PayRefundStatusEnum {
  /**
   * 未退款
   */
  NO_REFUND = 'no_refund',
  /**
   * 退款中
   */
  REFUNDING = 'refunding',
  /**
   * 部分退款
   */
  PARTIAL_REFUND = 'partial_refund',
  /**
   * 全部退款
   */
  REFUNDED = 'refunded',
}

/**
 * 支付订单的分账状态
 */
export enum PayAllocStatusEnum {
  /**
   * 待分账
   */
  WAITING = 'waiting',
  /**
   * 已分账
   */
  ALLOCATION = 'allocation',
}

/**
 * 退款状态枚举
 */
export enum RefundStatusEnum {
  /**
   * 退款中
   */
  PROGRESS = 'progress',
  /**
   * 成功
   */
  SUCCESS = 'success',
  /**
   * 关闭
   */
  CLOSE = 'close',
  /**
   * 失败
   */
  FAIL = 'fail',
}

/**
 * 转账状态
 */
export enum TransferStatusEnum {
  /** 转账中 */
  PROGRESS = 'progress',
  /** 转账成功 */
  SUCCESS = 'success',
  /** 转账关闭 */
  FAIL = 'fail',
  /** 转账失败 */
  CLOSE = 'close',
}
