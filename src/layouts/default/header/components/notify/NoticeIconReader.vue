<template>
  <basic-modal
    v-bind="$attrs"
    :width="modalWidth"
    title="通知消息"
    :min-height="550"
    :visible="visible"
    :mask-closable="false"
    @cancel="handleCancel"
  >
    <a-card class="daily-article" :loading="confirmLoading">
      <a-card-meta :title="message.title" :description="'发布人：' + message.senderName + ' 发布时间： ' + message.senderTime" />
      <a-divider />
      <span v-html="message.content" class="article-content"></span>
    </a-card>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { $ref } from 'vue/macros'

  const modalWidth = $ref('60%')
  let visible = $ref(false)
  let confirmLoading = $ref(false)
  let message = $ref({})

  // 初始化 显示信息内容
  function init(messageInfo) {
    visible = true
    message = messageInfo
  }

  function handleCancel() {
    visible = false
  }
  defineExpose({ init })
</script>

<style scoped></style>
