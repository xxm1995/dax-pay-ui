import { closeWebSocket, initWebSocket } from '/@/logics/websocket/UserGlobalWebSocker'
import { useUserStoreWithOut } from '/@/store/modules/user'
import { userPassWordCheck } from '/@/views/security/remind/UserRemind'

/**
 * 用户登录后初始化等操作, 主要用在下列两种场景上
 * 1. 用户登陆后的操作
 * 2. 刷新页面时路由重新加载
 */
export async function userLoginInitAction() {
  const userStore = useUserStoreWithOut()

  // 刷新登陆后用户信息
  userStore.refreshUserInfoAction().then()
  // 初始化 websocket连接.
  initWebSocket().then()
  // 检查密码情况
  const check = await userPassWordCheck()
  if (!check) {
    return
  }
  // 检查消息提醒
}

/**
 * 用户后的操作
 */
export function userLogoutAction() {
  const userStore = useUserStoreWithOut()
  // 关闭websocket
  closeWebSocket()

  // 重置 Token和用户信息 需要放最后
  userStore.resetState()
}

/**
 * 监听后端推送的退出事件
 */
