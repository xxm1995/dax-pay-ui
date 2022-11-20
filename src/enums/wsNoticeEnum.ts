/**
 * 服务端websocket事件通知类型
 */
export enum WsListenerEnum {
  // 通知消息发生消息更新 主要是 未读数量更新
  NOTICE_MESSAGE_UPDATE = 'notice_message_update',
  // ws测试事件
  EVENT_TEST_WEBSOCKET = 'event_test_websocket',
}
