<template>
  <CollapseContainer title="账号绑定" :canExpan="false">
    <a-spin :spinning="loading">
      <a-row :span="24">
        <a-col :span="14">
          <a-list>
            <a-list-item>
              <a-list-item-meta title="微信(公众号)">
                <template #description>
                  <span v-show="bindInfo.weChat.bind">{{ bindInfo.weChat.username }}</span>
                  <span v-show="!bindInfo.weChat.bind">未绑定</span>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a v-if="!bindInfo.weChat.bind" @click="bindWeChat">绑定</a>
                <a v-else @click="unBindThird(WE_CHAT)" style="color: red">解绑</a>
              </template>
            </a-list-item>
            <a-list-item>
              <a-list-item-meta title="微信(开放平台)">
                <template #description>
                  <span v-show="bindInfo.weChatOpen.bind">{{ bindInfo.weChatOpen.username }}</span>
                  <span v-show="!bindInfo.weChatOpen.bind">未绑定</span>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a v-if="!bindInfo.weChatOpen.bind" @click="bindThirdUser(WE_CHAT_OPEN)">绑定</a>
                <a v-else @click="unBindThird(WE_CHAT_OPEN)" style="color: red">解绑</a>
              </template>
            </a-list-item>
            <a-list-item>
              <a-list-item-meta title="企业微信">
                <template #description>
                  <span v-show="bindInfo.weCom.bind">{{ bindInfo.weCom.username }}</span>
                  <span v-show="!bindInfo.weCom.bind">未绑定</span>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a v-if="!bindInfo.weCom.bind" @click="bindThirdUser(WE_COM)">绑定</a>
                <a v-else @click="unBindThird(WE_COM)" style="color: red">解绑</a>
              </template>
            </a-list-item>
            <a-list-item>
              <a-list-item-meta title="钉钉">
                <template #description>
                  <span v-show="bindInfo.dingTalk.bind">{{ bindInfo.dingTalk.username }}</span>
                  <span v-show="!bindInfo.dingTalk.bind">未绑定</span>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a v-if="!bindInfo.dingTalk.bind" @click="bindThirdUser(DING_TALK)">绑定</a>
                <a v-else @click="unBindThird(DING_TALK)" style="color: red">解绑</a>
              </template>
            </a-list-item>
          </a-list>
        </a-col>
      </a-row>
    </a-spin>
    <we-chat-qr-bind ref="weChatQrBind" @bind="bindWeChatCallback" />
  </CollapseContainer>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { CollapseContainer } from '/@/components/Container'
  import { $ref } from 'vue/macros'
  import { DING_TALK, WE_CHAT, WE_CHAT_OPEN, QQ, WE_COM } from '/@/views/login/third/OpenIdLoginType'
  import { bindThird, getThirdBindInfo, unbindThird } from '/@/views/account/account.api'
  import { UserThirdBindInfo } from '/@/views/account/accountModel'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { getAppEnvConfig } from '/@/utils/env'
  import WeChatQrBind from './WeChatQrBind.vue'

  const { createMessage, createConfirm } = useMessage()

  let loading = $ref(false)
  let currentLoginType = $ref()
  let weChatQrBind = $ref<any>()
  let bindInfo = $ref({
    weChat: {},
    weChatOpen: {},
    weCom: {},
    dingTalk: {},
    qq: {},
  } as UserThirdBindInfo)

  onMounted(() => {
    init()
  })

  function init() {
    loading = true
    getThirdBindInfo().then((res) => {
      bindInfo = res.data
      loading = false
    })
  }
  /**
   * 绑定账号
   */
  function bindThirdUser(loginType) {
    currentLoginType = loginType
    const { VITE_GLOB_API_URL } = getAppEnvConfig()
    const url = VITE_GLOB_API_URL + `/auth/third/toLoginUrl/${loginType}`
    window.open(
      url,
      `login ${loginType}`,
      'height=600, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no',
    )

    // 监听回调
    window.addEventListener('message', bindThirdCallback, false)
  }
  /**
   * 扫码回调
   */
  function bindThirdCallback(event) {
    // 回调后就进行解绑事件, 防止重复接收消息
    window.removeEventListener('message', bindThirdCallback)
    const data = event.data
    // 绑定
    loading = true
    bindThird({
      ...data,
      loginType: currentLoginType,
    })
      .then(() => {
        createMessage.success('绑定成功')
      })
      .finally(() => {
        init()
      })
  }

  /**
   * 微信公众平台绑定
   */
  function bindWeChat() {
    weChatQrBind.init()
  }

  /**
   * 微信绑定回调
   */
  function bindWeChatCallback(from) {
    loading = true
    bindThird(from)
      .then(() => {
        createMessage.success('绑定成功')
      })
      .finally(() => {
        init()
      })
  }

  /**
   * 解绑账号
   */
  function unBindThird(clientCode) {
    createConfirm({
      iconType: 'warning',
      title: '是否解除绑定的第三方平台账号',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await unbindThird(clientCode)
        init()
      },
    })
  }
</script>
<style lang="less" scoped>
  .avatar {
    font-size: 40px !important;
  }

  .extra {
    float: right;
    margin-top: 10px;
    margin-right: 30px;
    cursor: pointer;
  }
</style>
