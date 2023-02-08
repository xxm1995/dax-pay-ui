<template>
  <div>
    <div class="m-3 p-3 bg-white">
      <a-textarea disabled v-model:value="showMsg" />
      <a-textarea v-model:value="msg" />
      <a-space>
        <a-button @click="push">发送(本页面)</a-button>
        <a-button @click="globalPush">发送(全局)</a-button>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'
  import { useWebSocket } from '@vueuse/core'
  import { findByParamKey } from '/@/api/common/Parameter'
  import { useUserStore } from '/@/store/modules/user'
  import { onMounted, onUnmounted } from 'vue'
  import { clearEvent, listenerEvent } from '/@/logics/websocket/WebsocketNotice'
  import { WsListenerEnum } from '/@/enums/wsNoticeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { defHttp } from '/@/utils/http/axios'

  const { createMessage } = useMessage()

  // websocket关闭
  let wsService: WebSocket | undefined
  let wsClose: WebSocket['close']
  let userId = $ref(0)
  let msg = $ref('')
  let showMsg = $ref('')
  let websocketUrl = $ref('')

  function initWs() {
    // 建立连接对象
    const userStore = useUserStore()
    userId = userStore.getUserInfo.userId
    findByParamKey('WebsocketServerUrl').then(({ data: url }) => {
      websocketUrl = url + '/test/ws/' + userId
      initWebSocket()
    })
  }

  function initWebSocket() {
    const { close, ws } = useWebSocket(websocketUrl, {
      // 自动重连
      autoReconnect: false,
      // 心跳
      heartbeat: false,
      onMessage: onMessage,
      onConnected: () => {
        console.log('WebSocket Demo连接成功')
      },
      onDisconnected: (ws, event) => {
        console.error('WebSocket Demo断开连接')
      },
    })
    wsClose = close
    wsService = ws.value
  }
  // 接收消息 (本页面ws)
  function onMessage(ws: WebSocket, event: MessageEvent) {
    showMsg = '本页面WS消息: ' + event.data
  }
  // 发送消息 (本页面)
  function push() {
    wsService?.send(msg)
  }
  // 发送 (全局ws)
  function globalPush() {
    defHttp.post({
      url: '/demo/global/ws/send',
      params: { userId, msg },
    })
  }

  function closeWebSocket() {
    wsClose && wsClose()
  }
  // 监听全局事件
  const onGlobalMessage = (msg) => {
    createMessage.info('接收到本页面的全局消息: ' + msg)
  }
  onMounted(() => {
    // 监听 通知消息更新
    listenerEvent(WsListenerEnum.EVENT_TEST_WEBSOCKET, onGlobalMessage)
    initWs()
  })

  onUnmounted(() => {
    clearEvent(WsListenerEnum.EVENT_TEST_WEBSOCKET, onGlobalMessage)
    closeWebSocket()
  })
</script>

<style scoped></style>
