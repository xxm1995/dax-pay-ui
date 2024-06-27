<template>
  <a-modal :visible="visible" title="扫码获取OpenId" @cancel="handleClose" :footer="null" :width="300">
    <div style="display: flex; flex-direction: column; align-items: center; padding: 20px 0">
      <qr-code :options="{ margin: 0 }" :width="250" :value="qrUrl" />
      <div class="mt-15px mb-15px" style="display: flex; flex-direction: row; align-items: center; justify-content: center">
        {{ bottomTitle }}
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import QrCode from '/@/components/Qrcode/src/Qrcode.vue'
  import { $ref } from 'vue/macros'

  let visible = $ref(false)
  let qrUrl = $ref('')
  let bottomTitle = $ref('')
  const emit = defineEmits(['close'])

  /**
   * 显示
   */
  function init(url, title) {
    visible = true
    qrUrl = url
    bottomTitle = title
  }

  /**
   * 关闭
   */
  function handleClose() {
    visible = false
    emit('close')
  }
  defineExpose({ init, handleClose })
</script>

<style scoped></style>
