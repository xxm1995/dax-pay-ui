<template>
  <a-modal :visible="visible" title="扫码获取OpenId" @cancel="handleClose" :footer="null" :width="300">
    <div style="display: flex; flex-direction: column; align-items: center; padding: 20px 0">
      <qr-code :options="{ margin: 0 }" :width="250" :value="qrUrl" />
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import QrCode from '/@/components/Qrcode/src/Qrcode.vue'
  import { $ref } from 'vue/macros'

  let visible = $ref(false)
  let qrUrl = $ref('')

  /**
   * 显示
   */
  function init(url) {
    visible = true
    qrUrl = url
  }

  /**
   * 关闭
   */
  function handleClose() {
    visible = false
  }
  defineExpose({ init, handleClose })
</script>

<style scoped></style>
