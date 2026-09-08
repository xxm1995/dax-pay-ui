<script lang="ts" setup>
  import { $t } from '@vben/locales';

  /**
   * 权限树工具条
   *
   * 搜索框 + 批量操作按钮 + 过滤复选框 + 已选统计。
   */
  defineProps<{
    /** 权限码总数 */
    codeTotalCount: number;
    /** 菜单总数 */
    menuTotalCount: number;
    /** 已选权限码数 */
    selectedCodeCount: number;
    /** 已选菜单数 */
    selectedMenuCount: number;
  }>();

  const emit = defineEmits<{
    /** 全选 */
    (e: 'checkAll'): void;
    /** 清空全部勾选 */
    (e: 'uncheckAll'): void;
    /** 展开全部 */
    (e: 'expandAll'): void;
    /** 折叠全部 */
    (e: 'collapseAll'): void;
  }>();

  // 搜索关键字
  const searchKeyword = defineModel<string>('searchKeyword', { default: '' });
  // 只显示菜单
  const onlyMenus = defineModel<boolean>('onlyMenus', { default: false });
  // 仅看已选
  const onlySelected = defineModel<boolean>('onlySelected', { default: false });
  // 勾选菜单时级联下属权限码
  const cascadeCodes = defineModel<boolean>('cascadeCodes', { default: true });
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- 搜索 -->
    <a-input v-model:value="searchKeyword" allow-clear :placeholder="$t('iam.role.searchPerm')" />
    <div class="flex flex-wrap items-center gap-2">
      <!-- 批量操作 -->
      <a-space wrap :size="8">
        <a-button size="small" @click="emit('checkAll')">{{ $t('iam.role.checkAll') }}</a-button>
        <a-button size="small" @click="emit('uncheckAll')">{{ $t('iam.role.uncheckAll') }}</a-button>
        <a-button size="small" @click="emit('expandAll')">{{ $t('iam.role.expandAll') }}</a-button>
        <a-button size="small" @click="emit('collapseAll')">{{ $t('iam.role.collapseAll') }}</a-button>
      </a-space>
      <a-divider type="vertical" class="!h-6" />
      <!-- 过滤开关 -->
      <a-space wrap :size="12">
        <a-tooltip :title="$t('iam.role.cascadeCodesTip')">
          <a-checkbox v-model:checked="cascadeCodes">
            {{ $t('iam.role.cascadeCodes') }}
          </a-checkbox>
        </a-tooltip>
        <a-checkbox v-model:checked="onlyMenus">
          {{ $t('iam.role.onlyMenus') }}
        </a-checkbox>
        <a-checkbox v-model:checked="onlySelected">
          {{ $t('iam.role.onlySelected') }}
        </a-checkbox>
      </a-space>
    </div>
    <!-- 已选统计 -->
    <div class="text-sm text-muted-foreground">
      {{
        $t('iam.role.selectedStats', {
          menu: selectedMenuCount,
          menuTotal: menuTotalCount,
          code: selectedCodeCount,
          codeTotal: codeTotalCount,
        })
      }}
    </div>
  </div>
</template>
