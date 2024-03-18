<template>
  <Card :tab-list="tabListTitle" v-bind="$attrs" :active-tab-key="activeKey" @tab-change="onTabChange">
    <p v-if="activeKey === 't1'">
      <VisitAnalysis :head="payHead" :data="payAmount" :max="payMax" />
    </p>
    <p v-if="activeKey === 't2'">
      <VisitAnalysis :head="refundHead" :data="refundAmount" :max="refundMax" />
    </p>
  </Card>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { Card } from 'ant-design-vue'
  import VisitAnalysis from './VisitAnalysis.vue'

  const activeKey = ref('t1')
  const tabListTitle = [
    {
      key: 't1',
      tab: '支付金额',
    },
    {
      key: 't2',
      tab: '退款金额',
    },
  ]

  const prop = defineProps({
    payOrder: {
      type: Array<object>,
    },
    refundOrder: {
      type: Array<object>,
    },
  })

  // 表头
  const payHead = computed(() => (prop.payOrder as any).map((o) => o.name))
  const refundHead = computed(() => (prop.refundOrder as any).map((o) => o.name))

  // 订单金额
  const payAmount = computed(() => (prop.payOrder as any).map((o) => o.value))
  const refundAmount = computed(() => (prop.refundOrder as any).map((o) => o.value))

  // 最大值
  const payMax = computed(() => Math.max(...(prop.payOrder as any).map((o) => o.value)))
  const refundMax = computed(() => Math.max(...(prop.refundOrder as any).map((o) => o.value)))

  function onTabChange(key) {
    activeKey.value = key
  }
</script>
