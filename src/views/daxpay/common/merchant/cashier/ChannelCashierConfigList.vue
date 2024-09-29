<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="70%"
    title="通道配置"
    :mask-closable="true"
    :open="visible"
    @close="handleCancel"
  >
    <div class="m-3 p-3 bg-white">
      <a-spin :spinning="confirmLoading">
        <a-list
          style="margin-left: 20px"
          :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 5 }"
          :data-source="channelConfigs"
        >
          <template #renderItem="{ item }">
            <a-card hoverable style="max-width: 200px; margin-bottom: 20px" @click="setting(item)">
              <template #cover>
                <a-image
                  style="width: 150px; height: 150px; margin-top: 20px"
                  :preview="false"
                  :src="getIcon(item.channel)"
                  :fallback="fallbackImg"
                />
              </template>
              <a-card-meta style="display: flex; justify-content: space-between" :title="item.name">
                <template #description>
                  <template v-if="item.enable">
                    <a-badge dot color="green" />
                    <span style="color: green">已启用</span>
                  </template>
                  <template v-else-if="item.enable === false">
                    <a-badge dot color="red" />
                    <span style="color: red">未启用</span>
                  </template>
                  <template v-else>
                    <a-badge dot color="grey" />
                    <span style="color: grey">未配置</span>
                  </template>
                </template>
              </a-card-meta>
            </a-card>
          </template>
        </a-list>
      </a-spin>
    </div>
    <channel-cashier-config-edit ref="channelCashierConfigEdit" @ok="query" />
  </basic-drawer>
</template>
<script setup lang="ts">
  import { BasicDrawer } from '@/components/Drawer'
  import { ref } from 'vue'
  import { findAll, ChannelCashierConfig } from './ChannelCashierConfig.api'
  import ChannelCashierConfigEdit from './ChannelCashierConfigEdit.vue'

  const confirmLoading = ref(false)

  const currentAppId = ref('')

  const visible = ref(false)

  /**
   * 初始化并展示
   */
  async function init(appId: string) {
    visible.value = true
    currentAppId.value = appId
    query()
  }

  /**
   * 查询
   */
  function query() {
    // 列表信息
    confirmLoading.value = true
    findAll(currentAppId.value).then(({ data }) => {
      channelConfigs.value = data
      confirmLoading.value = false
    })
  }

  /**
   * 打开支付设置界面
   */
  function setting(record: ChannelConfig) {
    channelConfigEdit.value.show(record)
  }

  /**
   * 关闭页面
   */
  function handleCancel() {
    visible.value = false
  }

  /**
   * 获取icon
   */
  function getIcon(type: string) {
    switch (type) {
      case DaxpayEnum.ALI:
        return alipay
      case DaxpayEnum.WECHAT:
        return wechat
      case DaxpayEnum.UNION_PAY:
        return unionPay
      default:
        return ''
    }
  }
</script>
<style scoped lang="less"></style>
