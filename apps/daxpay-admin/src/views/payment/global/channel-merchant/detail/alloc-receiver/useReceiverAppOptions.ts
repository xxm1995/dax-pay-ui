import type { AppMode } from './constants';

import type { AllocReceiverAppOption } from '#/api/payment/global/alloc-receiver/alloc-receiver.api';

import { ref } from 'vue';

import { AlipayMchAppApi } from '#/api/payment/channel/alipay/mch-app.api';
import { DyMchAppApi } from '#/api/payment/douyin/mch-app.api';
import { WxMchAppApi } from '#/api/payment/wx/mch-app.api';
import { WxPlatformAppApi } from '#/api/payment/wx/platform-app.api';

/**
 * 分账接收方弹窗的应用下拉加载(新增/重绑/详情共用)
 *
 * 按产品模式加载三档应用列表: alipay=直连应用 / douyin=商户档 /
 * wechat-isv=平台档(sp)+商户档(sub) / wechat-merchant=商户档。
 */
export function useReceiverAppOptions() {
  /** 应用下拉选项(按模式加载) */
  const appOptions = ref<AllocReceiverAppOption[]>([]);
  const spAppOptions = ref<AllocReceiverAppOption[]>([]);
  const subAppOptions = ref<AllocReceiverAppOption[]>([]);
  const appLoading = ref(false);

  /** 加载应用下拉(按模式) */
  async function loadAppOptions(mode: AppMode | undefined, mchNo: string, channelMchNo: string) {
    appOptions.value = [];
    spAppOptions.value = [];
    subAppOptions.value = [];
    if (!mode || mode === 'none') {
      return;
    }
    appLoading.value = true;
    try {
      switch (mode) {
        case 'alipay': {
          // 支付宝直连: 该通道商户的支付宝应用
          AlipayMchAppApi.listByChannelMchNo(mchNo, channelMchNo).then((res) => {
            appOptions.value = (res.data ?? [])
              .filter((app) => !!app.aliAppId)
              .map((app) => ({
                label: `${app.appName ?? app.aliAppId}（${app.aliAppId}）`,
                value: String(app.id),
              }));
          });

          break;
        }
        case 'douyin': {
          // 抖音直连: 商户档应用
          DyMchAppApi.listByMchNo(mchNo).then((res) => {
            appOptions.value = (res.data ?? [])
              .filter((app) => !!app.douyinAppId)
              .map((app) => ({
                label: `${app.appName ?? app.douyinAppId}（${app.douyinAppId}）`,
                value: app.douyinAppId!,
              }));
          });

          break;
        }
        case 'wechat-isv': {
          // 微信服务商: 平台档(sp 必选) + 商户档(sub 可选)
          WxPlatformAppApi.listAll().then((res) => {
            spAppOptions.value = (res.data ?? [])
              .filter((app) => !!app.wxAppId)
              .map((app) => ({
                label: `${app.appName ?? app.wxAppId}（${app.wxAppId}）`,
                value: app.wxAppId!,
              }));
          });
          WxMchAppApi.listByMchNo(mchNo).then((res) => {
            subAppOptions.value = (res.data ?? [])
              .filter((app) => !!app.wxAppId)
              .map((app) => ({
                label: `${app.appName ?? app.wxAppId}（${app.wxAppId}）`,
                value: app.wxAppId!,
              }));
          });

          break;
        }
        case 'wechat-merchant': {
          // 微信直连: 商户档应用
          WxMchAppApi.listByMchNo(mchNo).then((res) => {
            appOptions.value = (res.data ?? [])
              .filter((app) => !!app.wxAppId)
              .map((app) => ({
                label: `${app.appName ?? app.wxAppId}（${app.wxAppId}）`,
                value: app.wxAppId!,
              }));
          });

          break;
        }
        // No default
      }
    } finally {
      appLoading.value = false;
    }
  }

  return { appOptions, spAppOptions, subAppOptions, appLoading, loadAppOptions };
}
