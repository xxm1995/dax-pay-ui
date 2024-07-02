import { defHttp } from '@/utils/http/axios'
import { Result } from '#/axios'

/**
 * 获取文件预览地址
 */
export const imgCaptcha = () => {
  return defHttp.post<Result<Captcha>>({
    url: '/captcha/imgCaptcha',
  })
}

/**
 * 验证码
 */
export interface Captcha {
  captchaKey: string
  captchaData: string
}
