import type {
  AllocReceiverScanAuthParam,
  AllocReceiverScanAuthUrlResult,
} from '#/api/payment/global/alloc-receiver/alloc-receiver.api';

import { onBeforeUnmount, ref } from 'vue';

import { $t } from '@vben/locales';

import { useIntervalFn } from '@vueuse/core';

import { AllocReceiverScanAuthApi } from '#/api/payment/global/alloc-receiver/alloc-receiver.api';
import { useMessage } from '#/hooks/useMessage';

/** 认证状态(与转账扫码/授权调试页一致) */
const AuthStatus = {
  WAITING: 'waiting',
  SUCCESS: 'success',
  NOT_EXIST: 'not_exist',
} as const;

/**
 * 扫码获取接收方账号(授权链接 + queryCode 轮询, 复用认证域 OAuth 机制)
 *
 * 轮询成功回填账号(微信/抖音回填 openId, 支付宝回填 userId);
 * 前置校验与应用字段收集由调用方在 [buildParam] 内完成, 返回 null 表示校验失败不开弹窗。
 */
export function useReceiverScanAuth(options: {
  /** 组装授权链接参数(含前置校验, 可异步), 返回 null 表示校验失败中止 */
  buildParam: () => AllocReceiverScanAuthParam | null | Promise<AllocReceiverScanAuthParam | null>;
  /** 授权通道(决定弹窗提示文案与账号回填来源) */
  channel: () => 'alipay' | 'douyin' | 'wechat';
  /** 扫码成功回填接收方账号 */
  onAccount: (account: string) => void;
}) {
  const { message } = useMessage();

  const scanVisible = ref(false);
  const scanAuthUrl = ref<AllocReceiverScanAuthUrlResult>({});
  /** 授权链接生成中(按钮 loading, 生成成功后才开弹窗) */
  const scanGenerating = ref(false);

  /** 轮询扫码授权结果 */
  const { pause: pauseScanPolling, resume: resumeScanPolling } = useIntervalFn(
    async () => {
      const queryCode = scanAuthUrl.value.queryCode;
      if (!queryCode) {
        pauseScanPolling();
        return;
      }
      try {
        const { data } = await AllocReceiverScanAuthApi.queryResult(queryCode);
        if (data?.status === AuthStatus.SUCCESS) {
          const account = options.channel() === 'alipay' ? data.userId : data.openId;
          if (account) {
            options.onAccount(account);
            message.success($t('payment.channel.allocReceiver.scanSuccess'));
          }
          pauseScanPolling();
          scanVisible.value = false;
        } else if (data?.status === AuthStatus.NOT_EXIST) {
          pauseScanPolling();
          message.error($t('payment.channel.allocReceiver.scanFailed'));
        }
      } catch {
        pauseScanPolling();
      }
    },
    3000,
    { immediate: false },
  );

  /** 打开扫码弹窗: 前置校验并生成授权链接, 成功后再开弹窗轮询(失败不闪弹窗) */
  async function handleScanAccount() {
    pauseScanPolling();
    const param = await options.buildParam();
    if (!param) {
      return;
    }
    scanAuthUrl.value = {};
    scanGenerating.value = true;
    try {
      const { data } = await AllocReceiverScanAuthApi.generateUrl(param);
      scanAuthUrl.value = data ?? {};
      // 生成成功才开弹窗, 失败时弹窗不出现(错误提示由全局拦截器展示, 避免闪屏)
      if (scanAuthUrl.value.queryCode) {
        scanVisible.value = true;
        resumeScanPolling();
      }
    } catch {
      // 失败无需处理, 弹窗未打开, 错误提示由全局拦截器展示
    } finally {
      scanGenerating.value = false;
    }
  }

  /** 关闭扫码弹窗: 停止轮询并清空状态 */
  function closeScanModal() {
    pauseScanPolling();
    scanVisible.value = false;
    scanAuthUrl.value = {};
  }

  onBeforeUnmount(() => {
    pauseScanPolling();
  });

  return { scanVisible, scanAuthUrl, scanGenerating, handleScanAccount, closeScanModal };
}
