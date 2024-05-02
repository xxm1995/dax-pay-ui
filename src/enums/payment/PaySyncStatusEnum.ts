/**
 * 支付同步状态
 */
export enum PaySyncStatus {
  // 支付查询失败
  FAIL = 'fail',
  // 支付成功
  SUCCESS = 'success',
  // 支付中
  PROGRESS = 'progress',
  // 支付已关闭
  CLOSED = 'closed',
  // 支付退款
  REFUND = 'refund',
  // 交易不存在
  NOT_FOUND = 'not_found',
}
