<template>
  <Card :tab-list="tabListTitle" v-bind="$attrs" :active-tab-key="activeKey" @tab-change="onTabChange">
    <p v-if="activeKey === 't1'">
      <VisitAnalysis />
    </p>
    <p v-if="activeKey === 't2'">
      <VisitAnalysis />
    </p>
  </Card>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { Card } from 'ant-design-vue'
  import VisitAnalysis from './VisitAnalysis.vue'

  const activeKey = ref('t1')

  const tabListTitle = [
    {
      key: 't1',
      tab: '支付情况',
    },
    {
      key: 't2',
      tab: '退款情况',
    },
  ]

  function onTabChange(key) {
    activeKey.value = key
  }
</script>
