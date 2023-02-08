<template>
  <div>
    <div class="m-3 p-3 bg-white">
      <a-space>
        <a-button @click="req" type="primary"> 发送请求 </a-button>
        <a-button danger @click="genToken"> 重置幂等状态 </a-button>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { idempotentDemo } from '/@/views/modules/demo/idempotent/idempotentDemo.api'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { onMounted } from 'vue'

  const { createMessage } = useMessage()

  let idempotentToken = ''
  // 生成幂等token
  function genToken() {
    idempotentToken = String(new Date().getTime())
  }
  // 发起请求时携带幂等token
  function req() {
    idempotentDemo(idempotentToken).then((res) => {
      createMessage.info(res.data)
    })
  }
  onMounted(() => {
    genToken()
  })
</script>

<style scoped></style>
