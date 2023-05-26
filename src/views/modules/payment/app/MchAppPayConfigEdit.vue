<template>
    <AlipayConfigEdit v-if="currentComponent === AlipayConfigEdit"/>
    <WechatPayConfigEdit v-else-if="currentComponent === AlipayConfigEdit"/>
</template>
<script setup lang="ts">
  import { BasicDrawer } from '/@/components/Drawer'
  import { $ref } from 'vue/macros'
  import AlipayConfigEdit from '/@/views/modules/payment/channel/alipay/AlipayConfigEdit.vue'
  import WechatPayConfigEdit from '/@/views/modules/payment/channel/wechat/WechatPayConfigEdit.vue'
  import { MchAppPayConfigResult } from '/@/views/modules/payment/app/MchApplication.api'

  let currentComponent = $ref<any>()
  let config = $ref<MchAppPayConfigResult>({ channelName: '配置' } as MchAppPayConfigResult)
  let visible = $ref(false)

  const map = {
    ali_pay: 'AlipayConfigEdit',
    wechat_pay: 'WechatPayConfigEdit',
    union_pay: null,
    cash_pay: null,
    wallet_pay: null,
    voucher_pay: null,
  }

  /**
   * 打开
   */
  function show(record: MchAppPayConfigResult) {
    config = record
    visible = true
    currentComponent = map[record.channelCode]
  }

  /**
   * 关闭
   */
  function handleCancel() {
    visible = false
  }

  defineExpose({ show })
</script>

<style scoped lang="less"></style>
