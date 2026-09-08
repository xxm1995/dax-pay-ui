<script lang="ts" setup>
  import type { FormInstance, Rule } from 'antdv-next';

  import type { DyMiniAppConfig } from '#/api/payment/mobile-app.api';

  import { computed, ref } from 'vue';

  import { $t } from '@vben/locales';

  /**
   * 抖音小程序配置表单
   *
   * 嵌套配置对象由壳层持有并传入引用, 表单字段直接写回该对象;
   * 校验规则随组件自治, 壳层经 expose 的 validate/clearValidate 驱动。
   */
  const props = defineProps<{
    /** 是否禁用(非编辑态) */
    disabled?: boolean;
    /** 抖音小程序嵌套配置(响应式引用, 壳层持有) */
    dyMini: DyMiniAppConfig;
  }>();

  const formRef = ref<FormInstance>();

  // 表单模型中转: v-model 绑定 props 对象的嵌套属性(对象引用由壳层持有), 避免触发 props 突变规则
  const model = computed(() => props.dyMini);

  // 校验规则: appId/appSecret 必填
  const rules = computed<Record<string, Rule[]>>(() => ({
    appId: [
      {
        required: true,
        whitespace: true,
        message: $t('payment.mobileApp.fields.appIdRequired'),
      },
    ],
    appSecret: [
      {
        required: true,
        whitespace: true,
        message: $t('payment.mobileApp.fields.appSecretRequired'),
      },
    ],
  }));

  /** 校验表单(失败抛出, 由壳层捕获) */
  async function validate() {
    await formRef.value?.validate();
  }

  /** 清除校验状态 */
  function clearValidate() {
    formRef.value?.clearValidate();
  }

  defineExpose({ validate, clearValidate });
</script>

<template>
  <a-form ref="formRef" :model="model" :rules="rules" layout="vertical" class="max-w-2xl">
    <!-- 抖音 AppId -->
    <a-form-item name="appId" :label="$t('payment.mobileApp.fields.dyAppId')">
      <a-input
        v-model:value="model.appId"
        :disabled="props.disabled"
        :placeholder="$t('payment.mobileApp.fields.dyAppIdPlaceholder')"
      />
    </a-form-item>
    <!-- 抖音 AppSecret -->
    <a-form-item name="appSecret" :label="$t('payment.mobileApp.fields.dyAppSecret')">
      <a-input
        v-model:value="model.appSecret"
        :disabled="props.disabled"
        allow-clear
        :placeholder="$t('payment.mobileApp.fields.dyAppSecretPlaceholder')"
      />
    </a-form-item>
  </a-form>
</template>
