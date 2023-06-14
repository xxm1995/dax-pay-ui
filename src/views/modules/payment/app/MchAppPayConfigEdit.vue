<template>
  <mch-app-alipay-config-edit ref="alipay" />
</template>
<script setup lang="ts">
  import { $ref } from 'vue/macros'
  import WechatPayConfigEdit from '/@/views/modules/payment/channel/wechat/WechatPayConfigEdit.vue'
  import { MchAppPayConfigResult } from '/@/views/modules/payment/app/MchApplication.api'
  import MchAppAlipayConfigEdit from '/@/views/modules/payment/channel/alipay/MchAppAlipayConfigEdit.vue'

  let alipay = $ref<any>()

  let component = $ref<any>()

  const map = {
    ali_pay: alipay,
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
    component = map[record.channelCode]
    console.log(123)
    console.log(component)
    component.init(record)
  }

  /**
   * 关闭
   */
  function handleCancel() {
  }

  defineExpose({ show })
</script>

<style scoped lang="less"></style>
