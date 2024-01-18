<template>
  <alipay-config-edit ref="alipay" @ok="ok" />
  <wechat-pay-config-edit ref="wechat" @ok="ok" />
</template>
<script setup lang="ts">
  import { $ref } from 'vue/macros'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { payChannelEnum } from '/@/enums/payment/payChannelEnum'
  import { PayChannelConfig } from '/@/views/payment/system/channel/ChannelConfig.api'
  import AlipayConfigEdit from '/@/views/payment/channel/alipay/config/AlipayConfigEdit.vue'
  import WechatPayConfigEdit from '/@/views/payment/channel/wechat/config/WechatPayConfigEdit.vue'

  const { createMessage } = useMessage()

  let alipay = $ref<any>()
  let wechat = $ref<any>()
  let wallet = $ref<any>()
  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 打开
   */
  function show(record: PayChannelConfig) {
    switch (record.code) {
      case payChannelEnum.ALI: {
        alipay.init(record)
        break
      }
      case payChannelEnum.WECHAT: {
        wechat.init(record)
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
