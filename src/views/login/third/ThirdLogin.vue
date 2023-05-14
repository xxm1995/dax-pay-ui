<template>
  <a @click="onThirdLogin(DING_TALK)" title="钉钉"><DingdingOutlined /></a>
  <a @click="onThirdLogin(WE_COM)" title="企业微信"> <icon-font class="item-icon" type="wecom" /></a>
  <a @click="onThirdLogin(WE_CHAT_OPEN)" title="微信"><WechatFilled /></a>
</template>

<script lang="ts" setup>
  import { DingdingOutlined, WechatFilled, createFromIconfontCN } from '@ant-design/icons-vue'
  import { $ref } from 'vue/macros'
  import { getAppEnvConfig } from '/@/utils/env'
  import { useUserStore } from '/@/store/modules/user'
  import { LoginParams } from '/@/api/sys/model/userModel'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { DING_TALK, WE_CHAT_OPEN, WE_COM } from './OpenIdLoginType'
  const IconFont = createFromIconfontCN({
    scriptUrl: '/icons/weCom.js',
  })

  const emits = defineEmits(['loginFinish', 'loginLoading'])

  const userStore = useUserStore()
  const { notification } = useMessage()

  const { VITE_GLOB_API_URL, VITE_GLOB_APP_CLIENT } = getAppEnvConfig()
  let currentLoginType = $ref<string>()
  /**
   * 调起登录
   */
  function onThirdLogin(loginTpe) {
    currentLoginType = loginTpe
    const url = VITE_GLOB_API_URL + `/auth/third/toLoginUrl/${loginTpe}`
    open(
      url,
      `login ${loginTpe}`,
      'height=600, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no',
    )
    // 监听回调
    addEventListener('message', authCodeCallback, false)

    /**
     * 认证码回调
     */
    async function authCodeCallback(event) {
      // 回调后就进行解绑事件, 防止重复接收消息
      window.removeEventListener('message', authCodeCallback)
      const data = event.data
      emits('loginLoading')
      const token = await userStore
        .login({
          ...data,
          client: VITE_GLOB_APP_CLIENT,
          loginType: currentLoginType,
        } as LoginParams)
        .finally(() => emits('loginFinish'))
      if (token) {
        notification.success({
          message: '登录成功',
          description: '欢迎回来',
          duration: 3,
        })
      }
    }
  }
</script>

<style scoped></style>
