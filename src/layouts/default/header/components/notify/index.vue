<template>
  <div :class="prefixCls">
    <a-popover
      v-model:visible="visible"
      trigger="click"
      overlayClassName="header-notice-wrapper"
      @visibleChange="visibleChange"
      :overlayStyle="{ width: '300px' }"
    >
      <a-badge :count="notReadMsgCount" dot>
        <BellOutlined />
      </a-badge>
      <template #content>
        <a-spin :spinning="loading">
          <a-list>
            <a-list-item v-for="o in notReadMsgList" :key="o.id">
              <a-list-item-meta :description="o.senderTime">
                <template #title>
                  <a @click="showMessage(o)">
                    <a-tag color="red">未读</a-tag>
                    <a-typography-text style="width: 150px" :ellipsis="{ tooltip: o.title }" :content="o.title" />
                  </a>
                </template>
              </a-list-item-meta>
              <span>{{ o.senderName }}</span>
            </a-list-item>
          </a-list>
          <div style="margin-top: 5px; text-align: center">
            <a-button @click="toSiteMessage" type="dashed" block>查看更多</a-button>
          </div>
        </a-spin>
      </template>
    </a-popover>
    <notice-icon-reader ref="noticeIconReader" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { BellOutlined } from '@ant-design/icons-vue'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { $ref } from 'vue/macros'
  import { countByReceiveNotRead, pageByReceive } from '/@/layouts/default/header/components/notify/SiteMessage.api'
  import { router } from '/@/router'
  import { PageEnum } from '/@/enums/pageEnum'
  import NoticeIconReader from '/@/layouts/default/header/components/notify/NoticeIconReader.vue'

  const { prefixCls } = useDesign('header-notify')
  const { createMessage } = useMessage()

  const noticeIconReader = $ref<any>()

  let loading = $ref(false)
  let visible = $ref(false)
  // 未读消息数量
  let notReadMsgCount = $ref(0)
  let notReadMsgList = $ref<any>([])
  onMounted(() => {
    receivedCount()
  })

  // 查询当前用户的未读消息数量
  function receivedCount() {
    countByReceiveNotRead().then(({ data }) => {
      notReadMsgCount = data
    })
  }

  // 打开列表页
  function fetchNotice() {
    loading = false
    pageByReceive({
      current: 1,
      size: 3,
      haveRead: false,
    }).then(({ data }) => {
      notReadMsgList = data.records
      loading = false
    })
  }

  // 变化回调
  function visibleChange() {
    if (visible) {
      fetchNotice()
    }
  }

  // 跳转到站内信界面
  function toSiteMessage() {
    visible = false
    router.push(PageEnum.SITE_MESSAGE)
  }

  // 查看我的消息
  function showMessage(message) {
    visible = false
    if (!message.haveRead) {

    }
    noticeIconReader.init(message)
  }
</script>
<style lang="less"></style>
