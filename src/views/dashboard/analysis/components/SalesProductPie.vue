<template>
  <Card title="退款各通道分布" :loading="loading">
    <div ref="chartRef" :style="{ width: '100%', height: '300px' }"></div>
  </Card>
</template>
<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue'
  import { Card } from 'ant-design-vue'
  import { useECharts } from '/@/hooks/web/useECharts'

  const props = defineProps({
    loading: Boolean,
    data: {
      type: Array,
    },
  })

  const chartRef = ref<HTMLDivElement | null>(null)
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>)

  watch(
    () => props.data,
    () => {
      setOptions({
        tooltip: {
          trigger: 'item',
        },

        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: props.data as any,
            roseType: 'radius',
            animationType: 'scale',
            animationEasing: 'exponentialInOut',
            animationDelay: function () {
              return Math.random() * 400
            },
          },
        ],
      })
    },
    { immediate: true },
  )
</script>
