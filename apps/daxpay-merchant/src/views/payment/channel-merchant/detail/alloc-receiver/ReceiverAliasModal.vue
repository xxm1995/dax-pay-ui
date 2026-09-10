<script lang="ts" setup>
  import type { AllocReceiverResult } from '#/api/payment/global/alloc-receiver/alloc-receiver.api';

  import { computed, ref } from 'vue';

  import { $t } from '@vben/locales';

  import { useMessage } from '#/hooks/useMessage';

  import { PRODUCT_CONFIG } from './constants';

  /**
   * 接收方别名弹窗
   *
   * 别名是纯本地备注字段(不上送通道), 任意绑定状态均可修改;
   * 与接收方名称(通道侧实名, 加密存储且受通道校验)无关。
   */
  const emit = defineEmits<{
    /** 保存成功(列表刷新) */
    (e: 'success'): void;
  }>();

  const { message } = useMessage();

  const visible = ref(false);
  const saving = ref(false);
  const alias = ref('');
  const row = ref<AllocReceiverResult>();
  const product = ref('');

  /** 当前产品配置 */
  const config = computed(() => PRODUCT_CONFIG[product.value]);

  /** 打开弹窗(回填现有别名) */
  function open(record: AllocReceiverResult, productCode: string) {
    row.value = record;
    product.value = productCode;
    alias.value = record.alias ?? '';
    visible.value = true;
  }

  /** 保存别名(空串提交即清空) */
  async function submit() {
    if (!row.value?.id) {
      return;
    }
    saving.value = true;
    try {
      await config.value?.api.updateAlias(row.value.id, alias.value.trim());
      visible.value = false;
      // 国际化：别名保存成功
      message.success($t('payment.channel.allocReceiver.aliasSaveSuccess'));
      emit('success');
    } finally {
      saving.value = false;
    }
  }

  defineExpose({ open });
</script>

<template>
  <a-modal
    v-model:open="visible"
    :title="$t('payment.channel.allocReceiver.aliasEdit')"
    :confirm-loading="saving"
    :width="460"
    @ok="submit"
  >
    <div class="mt-2">
      <a-form layout="vertical">
        <a-form-item
          :label="$t('payment.channel.allocReceiver.alias')"
          :extra="$t('payment.channel.allocReceiver.aliasTip')"
        >
          <a-input
            v-model:value="alias"
            :maxlength="50"
            allow-clear
            show-count
            :placeholder="$t('payment.channel.allocReceiver.aliasPlaceholder')"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
