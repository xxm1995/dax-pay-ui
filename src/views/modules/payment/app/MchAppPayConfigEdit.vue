<template>
  <mch-app-alipay-config-edit ref="alipay" @ok="ok" />
  <mch-app-wechat-pay-config-edit ref="wechat" @ok="ok" />
</template>
<script setup lang="ts">
  import { $ref } from 'vue/macros'
  import { MchAppPayConfigResult } from './MchApplication.api'
  import MchAppAlipayConfigEdit from '/@/views/modules/payment/channel/alipay/MchAppAlipayConfigEdit.vue'
  import MchAppWechatPayConfigEdit from '/@/views/modules/payment/channel/wechat/MchAppWechatPayConfigEdit.vue'
  import { useMessage } from '/@/hooks/web/useMessage'

  const { createMessage } = useMessage()

  let alipay = $ref<any>()
  let wechat = $ref<any>()
  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 打开
   */
  function show(record: MchAppPayConfigResult) {
    console.log(record)
    switch (record.channelCode) {
      case 'ali_pay': {
        alipay.init(record)
        break
      }
      case 'wechat_pay': {
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
