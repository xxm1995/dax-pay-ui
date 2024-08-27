<template>
  <basic-drawer
    v-bind="$attrs"
    width="60%"
    title="消息订阅配置"
    :open="visible"
    :mask-closable="false"
    @close="handleCancel"
  >
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
    <div class="h-80vh">
      <vxe-table height="auto" ref="xTable" key-field="id" :data="records" :loading="loading">
        <vxe-column field="subscribe" title="状态" align="center" :min-width="80">
          <template #default="{ row }">
            <template v-if="row.subscribe">
              <a-badge dot color="green" />
              <span style="color: green">已订阅</span>
            </template>
            <template v-else>
              <a-badge dot color="red" />
              <span style="color: red">未订阅</span>
            </template>
          </template>
        </vxe-column>
        <vxe-column field="code" title="通知类型" :min-width="180" />
        <vxe-column field="name" title="订阅名称" :min-width="180" />
        <vxe-column field="description" title="描述" :min-width="280" />
        <vxe-column fixed="right" :width="80" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link danger v-if="row.subscribe" @click="subscribeNotify(row.code, false)"
              >取消订阅</a-link
            >
            <a-link v-else @click="subscribeNotify(row.code, true)">订阅</a-link>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { nextTick, ref } from 'vue'
  import { findAllByAppId, NotifyConfigResult, subscribe } from './MerchantNotifyConfig.api'
  import BasicDrawer from '@/components/Drawer/src/BasicDrawer.vue'
  import ALink from '@/components/Link/Link.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'

  const loading = ref(false)
  const visible = ref(false)
  const records = ref<NotifyConfigResult[]>([])

  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()

  const appId = ref<string>('')

  nextTick(() => {
    xTable.value?.connect(xToolbar.value as VxeToolbarInstance)
  })
  /**
   * 入口
   */
  function init(mchAppId: string) {
    visible.value = true
    appId.value = mchAppId
    queryPage()
  }

  /**
   * 查询列表
   */
  function queryPage() {
    loading.value = true
    findAllByAppId(appId).then((res) => {
      records.value = res.data
      loading.value = false
    })
  }

  /**
   * 订阅设置
   */
  function subscribeNotify(notifyType, sub) {
    loading.value = true
    subscribe({
      appId: appId.value,
      notifyType,
      subscribe: sub,
    })
      .then(() => {})
      .finally(() => {
        queryPage()
      })
  }

  /**
   * 关闭
   */
  function handleCancel() {
    visible.value = false
  }

  defineExpose({
    init,
  })
</script>

<style></style>
