/**
 * 储值卡常量
 */
export enum VoucherEnum {
  /**
   * 状态-正常
   */
  STATUS_NORMAL = 'normal',

  /**
   * 状态-停用
   */
  STATUS_FORBIDDEN = 'forbidden',

  /**
   * 储值卡日志-开通
   */
  LOG_ACTIVE = 'active',

  /**
   * 储值卡日志-预冻结额度
   */
  LOG_FREEZE_BALANCE = 'freeze',

  /**
   * 储值卡日志-扣减并解冻余额
   */
  LOG_REDUCE_AND_UNFREEZE_BALANCE = 'reduceAndUnfreeze',

  /**
   * 储值卡日志-直接支付
   */
  LOG_PAY = 'pay',
  /**
   * 储值卡日志-取消支付
   */
  LOG_CLOSE_PAY = 'closePay',

  /**
   * 储值卡日志-退款到本卡中
   */
  LOG_REFUND_SELF = 'refundSelf',
}
