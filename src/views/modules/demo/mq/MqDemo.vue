<template>
  <div>
    <div class="m-3 p-3 bg-white">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="RabbitMQ" force-render>
          <a-textarea v-model:value="rabbitMQMsg" />
          <a-button @click="pushRabbitMQ">发送</a-button>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Redis消息" force-render>
          <a-textarea v-model:value="redisMQMsg" />
          <a-button @click="pushRedisMQ">发送</a-button>
        </a-tab-pane>
        <a-tab-pane key="4" tab="Redis过期事件" force-render>
          <a-textarea v-model:value="redisKeyMsg" />
          <a-button @click="pushRedisKey">发送</a-button>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useMessage } from '/@/hooks/web/useMessage'
  import { sendKeyExpired, sendRabbitMsg, sendRedisMsg } from './MqDemo.api'
  import { $ref } from 'vue/macros'

  const { createMessage } = useMessage()

  let rabbitMQMsg = $ref('')
  let redisMQMsg = $ref('')
  let redisKeyMsg = $ref('')

  // RabbitMQ
  function pushRabbitMQ() {
    sendRabbitMsg(rabbitMQMsg).then(() => createMessage.info('请查看后端控制台日志输出'))
  }
  // 发送redis消息
  function pushRedisMQ() {
    console.log(redisMQMsg)
    sendRedisMsg(redisMQMsg).then(() => createMessage.info('请查看后端控制台日志输出'))
  }
  // 发送redisKey消息
  function pushRedisKey() {
    sendKeyExpired(redisKeyMsg).then(() => createMessage.info('请查看后端控制台等待日志输出'))
  }
</script>

<style scoped></style>
