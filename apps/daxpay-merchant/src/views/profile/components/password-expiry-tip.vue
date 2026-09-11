<script setup lang="ts">
  import type { PasswordStatus } from '#/api/core/user.api';

  import { computed, onMounted, ref } from 'vue';

  import { $t } from '@vben/locales';
  import { formatDateTime } from '@vben/utils';

  import { UserCommonApi } from '#/api/core/user.api';

  defineOptions({ name: 'PasswordExpiryTip' });

  // 剩余天数展示上限(天): 超过一年的有效期对用户没有决策价值
  const MAX_REMAINING_DAYS_DISPLAY = 365;

  // 密码状态(有效期为空的场景由文案兜底)
  const status = ref<null | PasswordStatus>(null);

  // 状态提示类型: 已过期 error / 即将过期 warning / 其他 info
  const alertType = computed(() => {
    if (status.value?.expired) {
      return 'error';
    }
    return status.value?.expiringSoon ? 'warning' : 'info';
  });

  /** 提示主文案 */
  const message = computed(() => {
    const current = status.value;
    if (!current) {
      return '';
    }
    if (current.expired) {
      // 密码已过期
      return $t('profile.passwordStatus.expired');
    }
    if (current.expiringSoon) {
      // 密码即将过期(剩余天数不超过提醒阈值)
      return $t('profile.passwordStatus.expiringSoon', {
        days: current.remainingDays ?? 0,
      });
    }
    if (!current.rotationEnabled || !current.expireTime) {
      // 未启用定期轮换
      return $t('profile.passwordStatus.unlimited');
    }
    // 密码有效期至指定日期
    return $t('profile.passwordStatus.validUntil', {
      date: formatDateTime(current.expireTime),
    });
  });

  /** 提示补充说明(仅有效期场景展示剩余天数) */
  const description = computed(() => {
    const current = status.value;
    if (!current || current.expired || current.expiringSoon || !current.expireTime) {
      return '';
    }
    // 剩余天数只在一年内展示: 长期有效期(如运维手工写入的"永不过期"日期)的天数没有参考价值
    const days = current.remainingDays;
    if (days === null || days === undefined || days > MAX_REMAINING_DAYS_DISPLAY) {
      return '';
    }
    // 距离密码过期的剩余天数
    return $t('profile.passwordStatus.remaining', { days });
  });

  onMounted(async () => {
    const { data } = await UserCommonApi.getPasswordStatus();
    status.value = data ?? null;
  });
</script>

<template>
  <!-- 包装层承载间距: antd 组件标签上直接写 Tailwind 间距类会被 cssinjs 样式覆盖 -->
  <div v-if="message" class="mb-4">
    <a-alert show-icon :description="description" :message="message" :type="alertType" />
  </div>
</template>
