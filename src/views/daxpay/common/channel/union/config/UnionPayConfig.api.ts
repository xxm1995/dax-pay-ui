import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'
import { MchEntity } from '#/web'
import { unref } from 'vue'
/**
 * 获取单条
 */
export function getConfig(id) {
  return defHttp.get<Result<UnionPayConfig>>({
    url: '/union/pay/config/findById',
    params: { id: unref(id) },
  })
}

/**
 * 保存或更新
 */
export function saveOrUpdate(obj: UnionPayConfig) {
  return defHttp.post({
    url: '/union/pay/config/saveOrUpdate',
    data: obj,
  })
}

/**
 * 微信支付配置
 */
export interface UnionPayConfig extends MchEntity {
  // 商户号
  unionMachId?: string
  // 商户收款账号
  seller?: string
  // 是否启用
  enable: boolean
  // 支付限额
  limitAmount?: number
  // 签名类型
  signType?: string
  // 是否为证书签名
  certSign?: boolean
  // 应用私钥证书
  keyPrivateCert?: string
  // 私钥证书对应的密码
  keyPrivateCertPwd?: string
  // 中级证书
  acpMiddleCert?: string
  // 根证书
  acpRootCert?: string
  // 是否沙箱环境
  sandbox?: boolean
}
