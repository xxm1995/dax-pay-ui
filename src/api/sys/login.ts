import { defHttp } from '/@/utils/http/axios'
import { LoginParams } from './model/userModel'
import { Result } from '/#/axios'

/**
 * 登录接口 返回token
 */
export function login(params: LoginParams) {
  return defHttp.post<Result<string>>({
    url: '/token/login',
    params,
  })
}

/**
 * 获取微信扫码登录二维码
 */
export function applyQrCode() {
  return defHttp.post<Result<WeChatLoginQrCode>>({
    url: `/token/wechat/qr/applyQrCode`,
  })
}

/**
 * 获取扫码状态
 */
export function getQrStatus(qrCodeKey) {
  return defHttp.get<Result<string>>({
    url: `/token/wechat/qr/getStatus`,
    params: { qrCodeKey },
  })
}

/**
 * 退出
 */
export function doLogout() {
  return defHttp.post({ url: '/token/logout' })
}

/**
 * 登录二维码
 */
export interface WeChatLoginQrCode {
  qrCodeKey: string
  qrCodeUrl: string
}
