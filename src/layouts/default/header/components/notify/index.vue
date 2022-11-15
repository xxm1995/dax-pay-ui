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
              <a href="javascript:" @click="showMessage(o)">
                <a-list-item-meta :description="o.senderTime">
                  <template #title>
                    <a-tag color="red">未读</a-tag>
                    <a-typography-text :ellipsis="{ tooltip: o.title }" :content="o.title" />
                  </template>
                </a-list-item-meta>
              </a>
              <span>{{ o.senderName }}</span>
            </a-list-item>
          </a-list>
          <div style="margin-top: 5px; text-align: center">
            <a-button @click="toSiteMessage" type="dashed" block>查看更多</a-button>
          </div>
        </a-spin>
      </template>
    </a-popover>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { BellOutlined } from '@ant-design/icons-vue'
  import { tabListData, ListItem } from './data'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { $ref } from 'vue/macros'
  import { countByReceiveNotRead, pageByReceive } from '/@/layouts/default/header/components/notify/SiteMessage.api'

  const { prefixCls } = useDesign('header-notify')
  const { createMessage } = useMessage()
  const listData = ref(tabListData)

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
  function toSiteMessage() {}

  // 查看我的消息
  function showMessage(message) {}
  function onNoticeClick(record: ListItem) {
    createMessage.success('你点击了通知，ID=' + record.id)
    // 可以直接将其标记为已读（为标题添加删除线）,此处演示的代码会切换删除线状态
    record.titleDelete = !record.titleDelete
  }
</script>
<style lang="less">
  .header-notice {
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>
