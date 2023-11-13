<template>
  <sms-aliyun-config ref="alibaba" @ok="ok" />
  <sms-huawei-config ref="huawei" @ok="ok" />
  <sms-yunpian-config ref="yunpian" @ok="ok" />
  <sms-tencent-config ref="tencent" @ok="ok" />
  <sms-uni-config ref="uniSms" @ok="ok" />
  <sms-jd-config ref="jdCloud" @ok="ok" />
  <sms-cloopen-config ref="cloopen" @ok="ok" />
  <sms-emay-config ref="emay" @ok="ok" />
  <sms-ctyun-config ref="ctyun" @ok="ok" />
  <sms-netease-config ref="netease" @ok="ok" />
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'
  import { SmsChannelConfig } from './SmsChannelConfig.api'
  import { smsChannelEnum } from '/@/enums/notice/smsChannelEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import SmsAliyunConfig from './channel/SmsAliyunConfig.vue'
  import SmsHuaweiConfig from './channel/SmsHuaweiConfig.vue'
  import SmsYunpianConfig from './channel/SmsYunpianConfig.vue'
  import SmsJdConfig from './channel/SmsJdConfig.vue'
  import SmsCloopenConfig from './channel/SmsCloopenConfig.vue'
  import SmsEmayConfig from './channel/SmsEmayConfig.vue'
  import SmsCtyunConfig from './channel/SmsCtyunConfig.vue'
  import SmsNeteaseConfig from './channel/SmsNeteaseConfig.vue'
  import SmsUniConfig from './channel/SmsUniConfig.vue'
  import SmsTencentConfig from './channel/SmsTencentConfig.vue'

  const { createMessage } = useMessage()

  // 事件
  const emits = defineEmits(['ok'])

  let alibaba = $ref<any>()
  let huawei = $ref<any>()
  let yunpian = $ref<any>()
  let tencent = $ref<any>()
  let uniSms = $ref<any>()
  let jdCloud = $ref<any>()
  let cloopen = $ref<any>()
  let emay = $ref<any>()
  let ctyun = $ref<any>()
  let netease = $ref<any>()
  /**
   * 打开
   */
  function show(record: SmsChannelConfig) {
    switch (record.code) {
      case smsChannelEnum.ALIBABA: {
        alibaba.init(record)
        break
      }
      case smsChannelEnum.HUAWEI: {
        huawei.init(record)
        break
      }
      case smsChannelEnum.YUNPIAN: {
        yunpian.init(record)
        break
      }
      case smsChannelEnum.TENCENT: {
        tencent.init(record)
        break
      }
      case smsChannelEnum.UNI_SMS: {
        uniSms.init(record)
        break
      }
      case smsChannelEnum.JD_CLOUD: {
        jdCloud.init(record)
        break
      }
      case smsChannelEnum.CLOOPEN: {
        cloopen.init(record)
        break
      }
      case smsChannelEnum.EMAY: {
        emay.init(record)
        break
      }
      case smsChannelEnum.CTYUN: {
        ctyun.init(record)
        break
      }
      case smsChannelEnum.NETEASE: {
        netease.init(record)
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
  defineExpose({
    show,
  })
</script>

<style lang="less" scoped></style>
