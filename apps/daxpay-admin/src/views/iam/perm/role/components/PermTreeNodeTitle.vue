<script lang="ts" setup>
  import type { TreeNode } from '../composables/usePermTreeAssign';

  import { $t } from '@vben/locales';

  import { menuTypeDotClassMap, menuTypeI18nMap } from '#/enums/menuType';

  import { getDisplayTitle } from '../composables/usePermTreeAssign';

  /**
   * 权限树节点标题（a-tree titleRender 内容）
   *
   * 类型小圆点区分菜单/权限码，搜索关键字红色高亮，一码多挂悬停提示。
   */
  const props = defineProps<{
    /** 搜索关键字（空串不高亮） */
    keyword?: string;
    /** 权限码是否挂载到多个菜单（一码多挂） */
    multiMounted?: boolean;
    /** 树节点 */
    node: TreeNode;
  }>();

  /** 标题文本：优先 displayTitle（本地化映射时已算好），缺失时现算兜底 */
  function resolveNodeTitle(node: TreeNode): string {
    return node.displayTitle || getDisplayTitle(node) || '';
  }

  /** 节点类型小圆点 class：菜单按 menuType，权限码中性色 */
  function getNodeDotClass(node: TreeNode): string {
    if (node.type === 'code') {
      return 'bg-muted-foreground/50';
    }
    if (node.menuType && menuTypeDotClassMap[node.menuType]) {
      return menuTypeDotClassMap[node.menuType]!;
    }
    return 'bg-muted-foreground/40';
  }

  /** 菜单类型悬停文案（有映射才返回） */
  function getMenuTypeTip(menuType?: string): string {
    if (!menuType || !menuTypeI18nMap[menuType]) {
      return '';
    }
    return $t(menuTypeI18nMap[menuType]!);
  }

  /** 拆分搜索高亮片段 */
  function splitHighlight(text: string): null | { after: string; before: string; hit: string } {
    const keyword = (props.keyword || '').trim();
    if (!keyword || !text) {
      return null;
    }
    const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
    if (idx === -1) {
      return null;
    }
    return {
      before: text.slice(0, idx),
      hit: text.slice(idx, idx + keyword.length),
      after: text.slice(idx + keyword.length),
    };
  }
</script>

<template>
  <span class="inline-flex max-w-full items-center gap-1.5">
    <!-- 菜单：圆点悬停显示类型名 -->
    <a-tooltip v-if="node.type !== 'code' && getMenuTypeTip(node.menuType)" :title="getMenuTypeTip(node.menuType)">
      <span class="inline-block h-1.5 w-1.5 shrink-0 rounded-full" :class="getNodeDotClass(node)" />
    </a-tooltip>
    <span v-else class="inline-block h-1.5 w-1.5 shrink-0 rounded-full" :class="getNodeDotClass(node)" />
    <!-- 权限码：多挂才包 tip；标题弱化 -->
    <template v-if="node.type === 'code'">
      <a-tooltip v-if="props.multiMounted" :title="$t('iam.role.codeMultiMountTip')">
        <span class="text-muted-foreground">
          <template v-for="(hl, i) in [splitHighlight(resolveNodeTitle(node))]" :key="i">
            <template v-if="hl">
              {{ hl.before }}<span class="text-red-500">{{ hl.hit }}</span
              >{{ hl.after }}
            </template>
            <template v-else>{{ resolveNodeTitle(node) }}</template>
          </template>
        </span>
      </a-tooltip>
      <span v-else class="text-muted-foreground">
        <template v-for="(hl, i) in [splitHighlight(resolveNodeTitle(node))]" :key="i">
          <template v-if="hl">
            {{ hl.before }}<span class="text-red-500">{{ hl.hit }}</span
            >{{ hl.after }}
          </template>
          <template v-else>{{ resolveNodeTitle(node) }}</template>
        </template>
      </span>
    </template>
    <template v-else>
      <template v-for="(hl, i) in [splitHighlight(resolveNodeTitle(node))]" :key="i">
        <span v-if="hl">
          {{ hl.before }}<span class="text-red-500">{{ hl.hit }}</span
          >{{ hl.after }}
        </span>
        <span v-else>{{ resolveNodeTitle(node) }}</span>
      </template>
    </template>
  </span>
</template>
