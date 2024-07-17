<template>
  <alipay-config-edit ref="alipay" @ok="ok" />
  <wechat-pay-config-edit ref="wechat" @ok="ok" />
</template>
<script setup lang="ts">
  import { useMessage } from '@/hooks/web/useMessage'
  import { ChannelEnum } from '@/enums/daxpay/ChannelEnum'
  import { ChannelConfig } from './ChannelConfig.api'
  import AlipayConfigEdit from '@/views/daxpay/admin/channel/alipay/config/AlipayConfigEdit.vue'
  import WechatPayConfigEdit from '@/views/daxpay/admin/channel/wechat/config/WechatPayConfigEdit.vue'
  import { ref } from 'vue'

  const { createMessage } = useMessage()

  let alipay = ref<any>()
  let wechat = ref<any>()
  let union = ref<any>()
  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 打开
   */
  function show(record: ChannelConfig) {
    switch (record.channel) {
      case ChannelEnum.ALI: {
        alipay.value.init(record)
        break
      }
      case ChannelEnum.WECHAT: {
        wechat.value.init(record)
        break
      }
      case ChannelEnum.UNION_PAY: {
        union.value.init(record)
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
