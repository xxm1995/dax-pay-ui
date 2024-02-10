<template>
  <a-modal :visible="visible" title="条码支付" :width="350">
    <a-spin :spinning="loading">
      <div>
        <div style="margin-bottom: 10px; display: flex; flex-direction: row; justify-content: start">
          {{ topTitle }}
        </div>
        <div style="display: flex; flex-direction: row; justify-content: space-between">
          <a-input allowClear v-model="authCode" />
        </div>
      </div>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="loading" type="primary" @click="handleOk">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'

  let visible = $ref(false)
  let loading = $ref(false)
  let topTitle = $ref('')
  let authCode = $ref('')

  const emits = defineEmits(['ok', 'cancel'])
  function init(title) {
    visible = true
    loading = false
    topTitle = title
    authCode = ''
  }
  function handleOk() {
    loading = true
    emits('ok', authCode)
  }
  function handleCancel() {
    handleClose()
    emits('cancel')
  }
  function handleClose() {
    visible = false
  }
  defineExpose({ init, handleClose })
</script>

<style scoped></style>
