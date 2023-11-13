import { checkPasswordSecurity } from '/@/views/security/remind/UserRemind.api'
import { useMessage } from '/@/hooks/web/useMessage'
import { Modal } from 'ant-design-vue'
import { router } from '/@/router'
import { PageConstant } from '/@/enums/pageEnum'

/**
 * 用户密码检查
 */
export async function userPassWordCheck(): Promise<boolean> {
  const { createConfirm, createMessage } = useMessage()
  const { data } = await checkPasswordSecurity()
  // 检查是否是默认密码未进行修改
  if (data.defaultPwd) {
    Modal.warning({
      title: '警告',
      content: '请修改用户的默认密码后进行登录',
      okText: '去修改',
      keyboard: false,
      onOk: () => {
        router.push(PageConstant.ACCOUNT_PASSWORD)
      },
    })
    return false
  }
  // 检查密码是否已经过期
  if (data.expirePwd) {
    Modal.warning({
      title: '警告',
      content: '密码已经过期，请进行修改',
      okText: '去修改',
      keyboard: false,
      onOk: () => {
        router.push(PageConstant.ACCOUNT_PASSWORD)
      },
    })
    return false
  }
  // 密码临过期提醒
  if (data.expireRemind) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: `密码还有 ${data.expireRemindNum} 天将过期，请及时进行修改`,
      okText: '去修改',
      cancelText: '暂不修改',
      onOk: () => {
        router.push(PageConstant.ACCOUNT_PASSWORD)
      },
    })
    return false
  }
  return true
}
