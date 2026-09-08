<script lang="ts" setup>
  import type { AllocReceiverScanAuthUrlResult } from '#/api/payment/global/alloc-receiver/alloc-receiver.api';

  import { $t } from '@vben/locales';

  import { QrCode } from '#/components/qrcode';

  /**
   * 扫码获取接收方账号弹窗(微信/支付宝/抖音共用, 二维码展示)
   *
   * 轮询与链接生成在 [useReceiverScanAuth] 中, 本组件仅展示。
   */
  defineProps<{
    /** 授权链接结果(含 authUrl 二维码内容) */
    authUrl: AllocReceiverScanAuthUrlResult;
    /** 授权通道(提示文案) */
    channel: 'alipay' | 'douyin' | 'wechat';
    /** 弹窗开关 */
    open: boolean;
  }>();

  const emit = defineEmits<{
    /** 关闭弹窗(停止轮询由调用方处理) */
    (e: 'close'): void;
  }>();
</script>

<template>
  <a-modal
    :open="open"
    :title="$t('payment.channel.allocReceiver.scanTitle')"
    :footer="null"
    :mask-closable="false"
    centered
    width="440"
    @cancel="emit('close')"
  >
    <div class="flex flex-col items-center py-4">
      <div v-if="authUrl.authUrl" class="rounded-lg border border-border p-4">
        <QrCode :value="authUrl.authUrl" :width="220" :margin="0" />
      </div>
      <a-spin v-else />
      <!-- 扫码提示(按授权通道区分) -->
      <div class="mt-4 text-center text-sm text-muted-foreground">
        {{ $t(`payment.channel.allocReceiver.scanTip.${channel}`) }}
      </div>
    </div>
  </a-modal>
</template>
