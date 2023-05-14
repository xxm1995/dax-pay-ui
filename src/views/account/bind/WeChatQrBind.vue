<template>
  <basic-modal
    title="扫码绑定"
    :footer="null"
    :can-fullscreen="false"
    v-bind="$attrs"
    :width="250"
    :height="250"
    :visible="visible"
    @cancel="handleCancel"
  >
    <a-spin :spinning="loading">
      <qr-code :value="qrCodeUrl" />
    </a-spin>
  </basic-modal>
</template>

<script lang="ts" setup>
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { $ref } from 'vue/macros'
  import { QrCode } from '/@/components/Qrcode'
  import { applyQrCode, getQrStatus } from '/@/api/sys/login'
  import { onBeforeUnmount, reactive } from 'vue'
  import { WE_CHAT } from '/@/views/login/third/OpenIdLoginType'
  import { useIntervalFn } from '@vueuse/core'

  let visible = $ref(false)
  let loading = $ref(false)
  let qrCodeUrl = $ref('请稍等')
  let interval: any

  const emits = defineEmits(['bind'])

  const form = reactive({
    client: '',
    loginType: WE_CHAT,
    authCode: '',
  })

  // 检查绑定的定时任务
  const { pause, resume } = useIntervalFn(
    () => {
      getQrStatus(form.authCode).then(({ data }) => {
        // 成功 进行绑定
        if (data === 'ok') {
          bindWeChat()
        } else if (data === 'expired') {
          pause()
          getApplyQrCode()
        }
      })
    },
    1000 * 3,
    { immediate: false },
  )

  function init() {
    visible = true
    getApplyQrCode()
  }

  /**
   * 获取
   */
  function getApplyQrCode() {
    loading = true
    applyQrCode().then((res) => {
      form.authCode = res.data.qrCodeKey
      qrCodeUrl = res.data.qrCodeUrl
      loading = false
      checkQrScanStatus()
    })
  }

  /**
   * 定时查询扫码情况
   */
  function checkQrScanStatus() {
    resume()
  }

  /**
   * 绑定
   */
  function bindWeChat() {
    emits('bind', {
      authCode: form.authCode,
      clientCode: form.loginType,
    })
    handleCancel()
  }
  /**
   * 关闭
   */
  function handleCancel() {
    pause()
    visible = false
  }
  onBeforeUnmount(() => {
    handleCancel()
  })
  defineExpose({
    init,
  })
</script>

<style scoped></style>
