import { defineStore } from 'pinia'
import { store } from '/@/store'
import { countByReceiveNotRead } from './SiteMessage.api'
import { listenerEvent } from '/@/logics/websocket/WebsocketNotice'
import { WsListenerEnum } from '/@/enums/wsNoticeEnum'

export const useSiteMessageStore = defineStore({
  id: 'SiteMessageStore',
  state: () => ({
    notReadCount: 0,
  }),
  actions: {
    // 更新未读消息数量
    updateNotReadCount() {
      countByReceiveNotRead().then(({ data }) => {
        this.notReadCount = data
      })
    },
  },
})
// setup 之外之使用
export function useSiteMessageStoreWithOut() {
  return useSiteMessageStore(store)
}
// 监听 通知消息更新
listenerEvent(WsListenerEnum.NOTICE_MESSAGE_UPDATE, (event) => {
  useSiteMessageStoreWithOut().updateNotReadCount()
})
