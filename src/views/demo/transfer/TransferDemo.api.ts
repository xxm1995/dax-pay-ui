import { defHttp } from '/@/utils/http/axios'
import { Result } from '/#/axios'

/**
 * 手动转账
 * @param param
 */
export function transfer(param) {
  return defHttp.post<Result<TransferResult>>({
    url: '/order/transfer/transfer',
    data: param,
  })
}

/**
 * 转账结果
 */
export interface TransferResult {
  // 状态
  status: string
  // 转账号
  transferNo: string
}
