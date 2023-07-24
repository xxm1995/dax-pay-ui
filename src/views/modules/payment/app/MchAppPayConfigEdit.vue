<template>
  <mch-app-alipay-config-edit ref="alipay" @ok="ok" />
  <mch-app-wechat-pay-config-edit ref="wechat" @ok="ok" />
  <mch-app-wallet-config-edit ref="wallet" @ok="ok" />
</template>
<script setup lang="ts">
  import { $ref } from 'vue/macros'
  import { MchAppPayConfigResult } from './MchApplication.api'
  import MchAppAlipayConfigEdit from '/@/views/modules/payment/channel/alipay/MchAppAlipayConfigEdit.vue'
  import MchAppWechatPayConfigEdit from '/@/views/modules/payment/channel/wechat/MchAppWechatPayConfigEdit.vue'
  import MchAppWalletConfigEdit from '/@/views/modules/payment/channel/wallet/config/MchAppWalletConfigEdit.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { payChannelEnum } from '/@/enums/payment/payChannelEnum'

  const { createMessage } = useMessage()

  let alipay = $ref<any>()
  let wechat = $ref<any>()
  let wallet = $ref<any>()
  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 打开
   */
  function show(record: MchAppPayConfigResult) {
    switch (record.channelCode) {
      case payChannelEnum.ALI: {
        alipay.init(record)
        break
      }
      case payChannelEnum.WECHAT: {
        wechat.init(record)
        break
      }
      case payChannelEnum.WALLET: {
        wallet.init(record)
        break
      }
      default: {
        createMessage.info('暂未支持, 请期待...')
      }
    }
  }

  /**
   * 操作完成回调
   */
  function ok() {
    emits('ok')
  }

  defineExpose({ show })
</script>

<style scoped lang="less"></style>
