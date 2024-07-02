<template>
  <a-form class="page-query" layout="inline">
    <a-row :gutter="gutter">
      <query-item
        :key="i"
        v-show="i < defaultItemCount || toggleSearchStatus"
        v-for="(field, i) in fields"
        :field="field"
        :md="defaultItemMd"
        :query-params="queryParams"
        @enter-query="query"
      />
      <a-col :md="defaultItemMd" :sm="24">
        <a-space>
          <a-button type="primary" :disabled="disabledQuery" @click="query">查询</a-button>
          <a-button @click="reset">重置</a-button>
        </a-space>
        <a
          v-show="fields.length > defaultItemCount"
          @click="handleToggleSearch"
          style="margin-left: 8px"
        >
          {{ toggleSearchStatus ? '收起' : '展开' }}
          <up-outlined v-if="toggleSearchStatus" />
          <down-outlined v-else />
        </a>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
  import QueryItem from './QueryItem.vue'
  import { ref } from 'vue'
  import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
  import { QueryField } from './Query'
  // 切换搜索条件展开状态
  let toggleSearchStatus = ref(false)

  withDefaults(
    defineProps<{
      // 字段
      fields: QueryField[]
      // 查询条件
      queryParams: object
      // 默认展示几个
      defaultItemCount?: number
      // 所占栅格宽度
      defaultItemMd?: number
      // 禁用查询
      disabledQuery?: boolean
      // gutter
      gutter?: number
    }>(),
    {
      defaultItemCount: 2,
      defaultItemMd: 6,
      disabledQuery: false,
      gutter: 10,
    },
  )
  const emits = defineEmits(['update:modelValue', 'query', 'reset'])
  /**
   * 查询
   */
  function query() {
    emits('query')
  }
  /**
   * 重置
   */
  function reset() {
    emits('reset')
  }
  /**
   * 切换搜索条件展开状态
   */
  function handleToggleSearch() {
    toggleSearchStatus.value = !toggleSearchStatus.value
  }
</script>

<style lang="less" scoped></style>
