<template>
  <a-modal
    title="商户收款码牌"
    :loading="confirmLoading"
    :width="500"
    :open="visible"
    :mask-closable="false"
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="flex justify-center" style="padding: 30px 0">
      <a-qrcode
        ref="qrcodeCanvasRef"
        :status="confirmLoading ? 'loading' : 'active'"
        :size="350"
        :value="url"
        :error-level="'Q'"
        color="black"
        bg-color="white"
      />
    </div>
    <div class="flex justify-center" style="margin-bottom: 20px">
      <a-button type="primary" @click="download">保存码牌</a-button>
      <a-button style="margin-left: 25px" @click="copy">复制地址</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { copyText } from '@/utils/copyTextToClipboard'
  import { getQrCodeUrl } from './ChannelCashierConfig.api'

  const confirmLoading = ref(false)
  const visible = ref(false)
  const url = ref('')
  const qrcodeCanvasRef = ref()

  /**
   * 初始化
   */
  function init(appId: string) {
    visible.value = true
    confirmLoading.value = true
    getQrCodeUrl(appId).then((res) => {
      url.value = res.data
      confirmLoading.value = false
    })
  }

  /**
   * 复制
   */
  function copy() {
    copyText(url.value)
  }
  /**
   * 关闭
   */
  function handleCancel() {
    visible.value = false
  }

  /**
   * 下嘴
   */
  async function download() {
    const url = qrcodeCanvasRef.value.toDataURL()
    const a = document.createElement('a')
    a.download = 'QRCode.png'
    a.href = url
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
