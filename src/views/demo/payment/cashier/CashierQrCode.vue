<template>
  <a-modal :visible="visible" title="扫码支付" @cancel="handleCancel" :footer="null" :width="250">
    <div style="display: flex; flex-direction: column; align-items: center">
      <qr-code :options="{ margin: 0 }" :width="180" :value="qrUrl" />
      <div class="mt-15px" style="display: flex; flex-direction: row; align-items: center; justify-content: center">
        {{ bottomTitle }}
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import QrCode from '/@/components/Qrcode/src/Qrcode.vue'
  import { $ref } from 'vue/macros'

  let visible = $ref(false)
  let icon = $ref('')
  let bottomTitle = $ref('')
  let qrUrl = $ref('')

  const emits = defineEmits(['cancel'])
  function init(url, title) {
    visible = true
    qrUrl = url
    bottomTitle = title
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
