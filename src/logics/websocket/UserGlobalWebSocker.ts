/**
 * 用户全局websocket连接管理
 */
import { useWebSocket } from '@vueuse/core'
import { useUserStoreWithOut } from '/@/store/modules/user'
import { EVENT_NOTICE, NOTIFICATION_ERROR, NOTIFICATION_INFO, NOTIFICATION_WARN } from '/@/logics/websocket/WebSockerType'
import { publishWsEvent } from '/@/logics/websocket/WebsocketNotice'
import { useMessage } from '/@/hooks/web/useMessage'
import { findByParamKey } from '/@/api/common/Parameter'
import { authEcho } from '/@/api/common/BaseApi.api'

const { notification } = useMessage()

// websocket关闭
let wsClose: WebSocket['close']

/**
 * 初始化用户是否加载
 */
export async function initWebSocket() {
  const userStore = useUserStoreWithOut()
  const token = userStore.getToken
  const { data: wsUrl } = await findByParamKey('WebsocketServerUrl')
  // 判断token是否有效, 无效会自动退出
  await authEcho('')
  // 后端服务地址
  const serverUrl = `${wsUrl}/ws/user?AccessToken=${token}`

  // 创建websocket实例
  const { close } = useWebSocket(serverUrl, {
    autoReconnect: true, //自动重新连接
    heartbeat: true, // 心跳检测
    onMessage: onMessage,
    onConnected: () => {
      console.log('用户全局WebSocket连接成功')
    },
    onDisconnected: (ws, event) => {
      console.error('用户全局WebSocket断开连接')
    },
  })
  wsClose = close
}

/**
 * 事件分发
 */
/**
 * 处理接收到的消息
 */
function onMessage(ws: WebSocket, event: MessageEvent) {
  const res = JSON.parse(event.data)
  if ([NOTIFICATION_INFO, NOTIFICATION_WARN, NOTIFICATION_ERROR].includes(res.type)) {
    wsNotification(res)
  } else if ([EVENT_NOTICE].includes(res.type)) {
    wsEventNotice(res)
  }
}

/**
 * 事件通知 弹框
 */
function wsNotification(res: WsResult) {
  if (res.type === NOTIFICATION_INFO) {
    notification.info({
      message: '消息通知',
      description: res.data,
    })
  } else if (res.type === NOTIFICATION_WARN) {
    notification.warn({
      message: '警告',
      description: res.data,
    })
  } else if (res.type === NOTIFICATION_ERROR) {
    notification.info({
      message: '警告',
      description: res.data,
    })
  }
}

/**
 * 事件通知 发送到消息总线
 */
function wsEventNotice(res: WsResult) {
  // 发布事件到消息总线
  publishWsEvent(res.eventCode, res.data)
}
/**
 * 关闭
 */
export function closeWebSocket() {
  wsClose && wsClose()
}

/**
 * websocket响应消息类
 */
export interface WsResult<T = any> {
  // 类型编码
  type: number
  // 数据体
  data: T
  // 事件编码
  eventCode: number
}
