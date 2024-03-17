<template>
  <div class="md:flex">
    <template v-for="(item, index) in data" :key="item.title">
      <Card
        size="small"
        :loading="loading"
        :title="item.title"
        class="md:w-1/4 w-full !md:mt-0"
        :class="{ '!md:mr-4': index + 1 < 4, '!mt-4': index > 0 }"
      >
        <template v-if="item.action" #extra>
          <Tag>{{ item.action }}</Tag>
        </template>
        <div class="py-4 px-4 flex justify-between items-center">
          <CountTo :startVal="0" :decimals="item.decimals" :endVal="item.value" class="text-2xl" />
          <Icon :icon="item.icon" :size="40" />
        </div>
      </Card>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { CountTo } from '/@/components/CountTo'
  import { Tag, Card } from 'ant-design-vue'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import { OrderCountData } from '/@/views/dashboard/analysis/data'

  defineProps({
    loading: {
      type: Boolean,
    },
    data: {
      type: Array<OrderCountData>,
    },
  })
</script>
