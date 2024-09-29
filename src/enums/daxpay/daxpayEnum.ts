/**
 * 支付通道
 */
export enum DaxpayEnum {
  ALI = 'ali_pay',
  WECHAT = 'wechat_pay',
  UNION_PAY = 'union_pay',
}

/**
 * 交易类型
 */
export enum TradeTypeEnum {
  /**
   * 支付
   */
  PAY = 'pay',
  /**
   * 退款
   */
  REFUND = 'refund',
  /**
   * 转账
   */
  TRANSFER = 'transfer',
}

/**
 * 客户通知内容类型
 */
export enum NotifyContentTypeEnum {
  /** 支付订单变动通知 */
  PAY = 'PAY',

  /** 退款订单变动通知 */
  REFUND = 'refund',

  /** 支付订单变动通知 */
  TRANSFER = 'transfer',
}

/**
 * 通道认证状态
 */
export enum ChannelAuthStatusEnum {
  /** 获取中 */
  WAITING = 'waiting',
  /** 获取成功 */
  SUCCESS = 'success',
  /** 数据不存在 */
  NOT_EXIST = 'not_exist',
}

/**
 * 收银台类型
 */
export enum CashierTypeEnum {
  WECHAT_PAY = 'wechat_pay',
  ALIPAY = 'alipay',
}
