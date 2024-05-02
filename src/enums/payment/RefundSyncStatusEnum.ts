/**
 * 退款同步状态枚举
 */
export enum RefundSyncStatus {
  //退款成功
  SUCCESS = 'refund_success',
  //退款失败
  FAIL = 'refund_fail',
  //退款中
  PROGRESS = 'refund_progress',
  //交易不存在
  NOT_FOUND = 'pay_not_found',
}
