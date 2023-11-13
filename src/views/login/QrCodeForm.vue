<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <div class="enter-x min-w-64 min-h-64">
      <a-spin :spinning="loading">
        <qr-code value="qrCodeUrl" class="enter-x flex justify-center xl:justify-start" :width="280" />
      </a-spin>
      <Divider class="enter-x">请使用微信扫码</Divider>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin"> 返回 </Button>
    </div>
  </template>
</template>
<script lang="ts" setup>
  import { computed, onMounted, unref } from 'vue'
  import LoginFormTitle from './LoginFormTitle.vue'
  import { Button, Divider } from 'ant-design-vue'
  import { QrCode } from '/@/components/Qrcode'
  import { useLoginState, LoginStateEnum } from './useLogin'
  import { $ref } from 'vue/macros'
  import { applyQrCode, getQrStatus } from '/@/api/sys/login'
  import { useDebounceFn, useIntervalFn } from '@vueuse/core'
  import { getAppEnvConfig } from '/@/utils/env'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useUserStore } from '/@/store/modules/user'

  const { handleBackLogin, getLoginState } = useLoginState()

  const { createMessage } = useMessage()
  const { notification } = useMessage()
  const userStore = useUserStore()

  const getShow = computed(() => {
    const flag = unref(getLoginState) === LoginStateEnum.QR_CODE
    // 变相实现Watch的效果
    flag ? getQrCode() : pause()
    return flag
  })

  const { pause, resume } = useIntervalFn(() => checkQrScanStatus(), 1000 * 3, { immediate: false })

  let qrCodeUrl = $ref('请稍等')
  // true可以获取, false不可以获取
  let getQrFlag = $ref(true)
  let loading = $ref(false)
  let client = $ref<string>('')
  let loginType = $ref('weChat')
  let authCode = $ref<string>()

  onMounted(() => {
    // 终端编码
    const { VITE_GLOB_APP_CLIENT } = getAppEnvConfig()
    client = VITE_GLOB_APP_CLIENT
  })
  // 获取扫码链接 使用防抖函数包装
  const getQrCode = useDebounceFn(() => {
    if (getQrFlag) {
      loading = true
      applyQrCode().then(({ data }) => {
        authCode = data.qrCodeKey
        qrCodeUrl = data.qrCodeUrl
        getQrFlag = false
        loading = false
        resume()
      })
    }
  }, 1000)
  /**
   * 检查登录状态
   */
  function checkQrScanStatus() {
    getQrStatus(authCode).then(async ({ data }) => {
      // 成功 进行登录
      if (data === 'ok') {
        pause()
        const token = await userStore.login({
          client: client,
          loginType: loginType,
        })
        if (token) {
          notification.success({
            message: '登录成功',
            description: '欢迎回来',
            duration: 3,
          })
        }
      } else if (data === 'expired') {
        getQrFlag = true
        applyQrCode()
      }
    })
  }
</script>
