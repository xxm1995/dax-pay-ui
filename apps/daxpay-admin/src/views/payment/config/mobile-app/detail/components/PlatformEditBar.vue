<script lang="ts" setup>
  import { $t } from '@vben/locales';

  /**
   * 平台配置页签右侧编辑操作条
   *
   * 非编辑态仅显示「编辑」; 编辑态显示「取消/保存」。
   */
  const props = defineProps<{
    /** 平台不可用(整体隐藏) */
    disabled?: boolean;
    /** 是否处于编辑状态 */
    editing: boolean;
    /** 保存中 */
    saving: boolean;
  }>();

  const emit = defineEmits<{
    /** 进入编辑 */
    (e: 'edit'): void;
    /** 取消编辑 */
    (e: 'cancel'): void;
    /** 保存 */
    (e: 'save'): void;
  }>();
</script>

<template>
  <a-space v-if="!props.disabled">
    <template v-if="!props.editing">
      <a-button type="primary" @click="emit('edit')">
        {{ $t('common.edit') }}
      </a-button>
    </template>
    <template v-else>
      <a-button @click="emit('cancel')">
        {{ $t('common.cancel') }}
      </a-button>
      <a-button type="primary" :loading="props.saving" @click="emit('save')">
        {{ $t('common.save') }}
      </a-button>
    </template>
  </a-space>
</template>
