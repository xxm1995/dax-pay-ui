import mitt, { EventHandlerList, Handler } from '/@/utils/mitt'
import { WsListenerEnum } from '/@/enums/wsNoticeEnum'

/**
 * 服务端WebSocket消息推送通知
 */

const emitter = mitt()

/**
 * 发布事件
 */
export function publishWsEvent(key, data) {
  emitter.emit(key, data)
}

/**
 * 事件监听
 */
export function listenerEvent(key: WsListenerEnum, callback: Handler) {
  emitter.on(key.toString(), callback)
}
/**
 * 清除指定key所关联的事件监听
 */
export function clearEventsByKey(key: WsListenerEnum) {
  // 一个key可能对应多个事件回调, 清除该key所关联的所有会话
  const eventHandlerList = emitter.all.get(key.toString()) as EventHandlerList
  eventHandlerList.forEach((value) => emitter.off(key.toString(), value))
}

/**
 * 清除指定事件的监听
 */
export function clearEvent(key: WsListenerEnum, callback: Handler) {
  emitter.off(key.toString(), callback)
}
