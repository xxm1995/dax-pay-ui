import type {
  AllocReceiverBindParam,
  AllocReceiverCreateParam,
  AllocReceiverQueryParam,
  AllocReceiverResult,
} from '#/api/payment/global/alloc-receiver/alloc-receiver.api';

import {
  AlipayDirectAllocReceiverApi,
  AlipayIsvAllocReceiverApi,
  DouyinDirectAllocReceiverApi,
  WechatDirectAllocReceiverApi,
  WechatIsvAllocReceiverApi,
} from '#/api/payment/global/alloc-receiver/alloc-receiver.api';

/** 应用选择模式(按支付产品区分) */
export type AppMode = 'alipay' | 'douyin' | 'none' | 'wechat-isv' | 'wechat-merchant';

/** 产品 → 接收方配置 */
export interface ProductConfig {
  api: {
    bind: (id: string, data?: AllocReceiverBindParam) => Promise<unknown>;
    create: (data: AllocReceiverCreateParam) => Promise<unknown>;
    delete: (id: string) => Promise<unknown>;
    page: (
      params: AllocReceiverQueryParam,
    ) => Promise<{ data: { current?: number; records?: AllocReceiverResult[]; size?: number; total?: number } }>;
    unbind: (id: string) => Promise<unknown>;
  };
  appMode: AppMode;
  /** 是否有分账关系类型(微信/抖音) */
  hasRelation: boolean;
  receiverTypes: string[];
}

/**
 * 支付产品 → 接收方绑定配置映射(单一事实源, 新增产品仅在此加一行)
 * 关系类型下拉不提供 service_provider(微信通道保留值, 后端映射为 CUSTOM+自定义名)
 */
export const PRODUCT_CONFIG: Record<string, ProductConfig> = {
  alipay: {
    api: AlipayDirectAllocReceiverApi,
    appMode: 'alipay',
    hasRelation: false,
    receiverTypes: ['USER_ID', 'LOGIN_NAME'],
  },
  alipay_isv: {
    api: AlipayIsvAllocReceiverApi,
    appMode: 'none',
    hasRelation: false,
    receiverTypes: ['USER_ID', 'LOGIN_NAME'],
  },
  douyin_pay: {
    api: DouyinDirectAllocReceiverApi,
    appMode: 'douyin',
    hasRelation: true,
    receiverTypes: ['MERCHANT_ID', 'PERSONAL_OPENID'],
  },
  wechat_isv: {
    api: WechatIsvAllocReceiverApi,
    appMode: 'wechat-isv',
    hasRelation: true,
    receiverTypes: ['MERCHANT_ID', 'PERSONAL_OPENID', 'PERSONAL_SUB_OPENID'],
  },
  wechat_pay: {
    api: WechatDirectAllocReceiverApi,
    appMode: 'wechat-merchant',
    hasRelation: true,
    receiverTypes: ['MERCHANT_ID', 'PERSONAL_OPENID'],
  },
};

/** 分账关系类型(不含服务商保留值) */
export const RELATION_TYPES = [
  'store',
  'staff',
  'store_owner',
  'partner',
  'headquarter',
  'brand',
  'distributor',
  'user',
  'supplier',
  'custom',
];

/** 绑定状态 → tag 颜色 */
export const STATUS_COLOR: Record<string, string> = {
  bound: 'success',
  fail: 'error',
  unbound: 'default',
};
