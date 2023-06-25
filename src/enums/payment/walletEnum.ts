/**
 * 钱包枚举
 */
export enum WalletEnum {
  /** 钱包状态-正常 */
  NORMAL = 'normal',

  /** 钱包状态-禁用 */
  FORBIDDEN = 'forbidden',
}
/**
 * 钱包日志枚举
 */
export enum WalletLogEnum {
  /**
   * 钱包日志-开通
   */
  ACTIVE = 'active',

  /**
   * 钱包日志-Admin操作余额变动
   */
  ADMIN_CHANGER = 'adminChanger',

  /**
   * 钱包日志-预冻结额度
   */
  FREEZE_BALANCE = 'freeze',

  /**
   * 钱包日志-解冻额度
   */
  UNFREEZE_BALANCE = 'unfreeze',

  /**
   * 钱包日志-解冻并扣减余额
   */
  REDUCE_AND_UNFREEZE_BALANCE = 'reduceAndUnfreeze',

  /**
   * 钱包日志-直接支付
   */
  PAY = 'pay',
  /**
   * 钱包日志-取消支付
   */
  CLOSE_PAY = 'closePay',

  /**
   * 钱包日志-退款
   */
  REFUND = 'refund',

  /**
   * 锁定钱包
   */
  LOCK = 'lock',

  /**
   * 解锁钱包
   */
  UNLOCK = 'unlock',
}

/**
 * 操作类型
 */
export enum WalletOperationEnum {
  /** 系统操作 */
  SOURCE_SYSTEM = 'system',

  /** 管理员操作 */
  SOURCE_ADMIN = 'admin',

  /** 用户操作 */
  SOURCE_USER = 'user',
}
