<template>
  <div style="display: flex; height: 768px; margin: 20px; flex-direction: column; align-items: center; background: white; padding: 15px">
    <div class="mt-15px mb-15px" style="display: flex; font-size: 32px; flex-direction: row; align-items: center; justify-content: center">
      <a-form-item label="支付通道">
        <a-radio-group v-model:value="channel" button-style="solid" @change="getUrl">
          <a-radio-button :value="payChannelEnum.WECHAT">微信</a-radio-button>
          <a-radio-button :value="payChannelEnum.ALI">支付宝</a-radio-button>
        </a-radio-group>
      </a-form-item> </div
    ><qr-code :options="{ margin: 0 }" :width="250" :value="url" />
    <div style="font-size: 26px"> {{}} </div>
    <a-form-item label="" style="margin-top: 30px">
      <a-input v-model:value="openId" disabled placeholder="请扫码获取OpenID或UserId" style="width: 350px" />
      <a-button type="primary" :disabled="!openId" @click="copy">复制</a-button>
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, unref } from 'vue'
  import { payChannelEnum } from '/@/enums/payment/payChannelEnum'
  import { aliGenerateAuthUrl, aliGetOpenId, wxGenerateAuthUrl, wxGetOpenId } from '/@/views/demo/openid/OpenId.api'
  import { useIntervalFn } from '@vueuse/shared'
  import QrCode from '/@/components/Qrcode/src/Qrcode.vue'
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard'
  import { useMessage } from '/@/hooks/web/useMessage'

  const { createMessage } = useMessage()

  const channel = ref(payChannelEnum.WECHAT)
  const code = ref('')
  const url = ref('null')
  const openId = ref('')
  let pause: any = () => {}

  function copy() {
    useCopyToClipboard(openId.value)
    createMessage.info('已复制到剪贴板中')
  }

  onMounted(() => {
    getUrl()
  })

  /**
   * 获取扫码链接
   */
  function getUrl() {
    openId.value = ''
    if (channel.value === payChannelEnum.ALI) {
      aliGenerateAuthUrl().then((res) => {
        code.value = res.data.code
        url.value = res.data.authUrl
        alipayGet()
      })
    } else {
      wxGenerateAuthUrl().then((res) => {
        code.value = res.data.code
        url.value = res.data.authUrl
        wxGet()
      })
    }
  }

  /**
   * 微信查询
   */
  function wxGet() {
    pause()
    let intervalFn = useIntervalFn(
      () => {
        wxGetOpenId(code.value)
          .then((res) => {
            // 成功
            if (res.data.status === 'success') {
              createMessage.success('获取OpenID成功')
              openId.value = res.data.openId
              pause()
            }
          })
          .catch((err) => {
            // 失败
            createMessage.error(err.message)
            pause()
          })
      },
      1000 * 3,
      { immediate: false },
    )
    pause = intervalFn.pause
    intervalFn.resume()
  }
  /**
   * 支付宝查询
   */
  function alipayGet() {
    pause()
    let intervalFn = useIntervalFn(
      () => {
        aliGetOpenId(code.value)
          .then((res) => {
            // 成功
            if (res.data.status === 'success') {
              createMessage.success('获取OpenID成功')
              openId.value = res.data.openId
              pause()
            }
          })
          .catch((err) => {
            // 失败
            createMessage.error(err.message)
            pause()
          })
      },
      1000 * 3,
      { immediate: false },
    )
    pause = intervalFn.pause
    intervalFn.resume()
  }
</script>
<style scoped lang="less"></style>
