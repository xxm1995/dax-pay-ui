import type { AppMode } from './constants';

import type { AllocReceiverAppOption } from '#/api/payment/global/alloc-receiver/alloc-receiver.api';

import { ref } from 'vue';

import { AlipayDirectAppApi } from '#/api/payment/alipay/alipay-direct-app.api';
import { DyMchAppApi } from '#/api/payment/douyin/mch-app.api';
import { WxMchAppApi } from '#/api/payment/wx/mch-app.api';

/**
 * 分账接收方弹窗的应用下拉加载(新增/重绑/详情共用)
 *
 * 商户端登录态绑定商户, 后端以登录商户强制过滤, 无需(也不可信)前端传 mchNo。
 * 微信服务商的 sp 档由后端按产品默认绑定自动解析, 商户端不加载不展示(恒空)。
 */
export function useReceiverAppOptions() {
  /** 应用下拉选项(按模式加载) */
  const appOptions = ref<AllocReceiverAppOption[]>([]);
  const spAppOptions = ref<AllocReceiverAppOption[]>([]);
  const subAppOptions = ref<AllocReceiverAppOption[]>([]);
  const appLoading = ref(false);

  /** 加载应用下拉(按模式) */
  async function loadAppOptions(mode: AppMode | undefined, channelMchNo: string) {
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
          // 支付宝直连: 该通道商户的支付宝应用(登录商户维度, 后端强制过滤)
          AlipayDirectAppApi.listByChannelMchNo(channelMchNo).then((res) => {
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
          // 抖音直连: 商户档应用(登录商户维度)
          DyMchAppApi.listAll().then((res) => {
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
          // 微信服务商: 平台档(sp)由后端按产品默认绑定自动解析, 商户端不加载;
          // 仅加载商户档(sub 可选)
          WxMchAppApi.listAll().then((res) => {
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
          // 微信直连: 商户档应用(登录商户维度)
          WxMchAppApi.listAll().then((res) => {
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
