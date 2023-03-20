<template>
  <div>
    <a-row :gutter="24">
      <a-col :span="24">
        <a-card title="基本信息" style="margin-bottom: 20px" :bordered="false">
          <table class="table">
            <tr>
              <td>Redis版本</td>
              <td>{{ info.redis_version }}</td>
              <td>运行模式</td>
              <td>{{ info.redis_mode === 'standalone' ? '单机' : '集群' }}</td>
              <td>端口</td>
              <td>{{ info.tcp_port }}</td>
            </tr>
            <tr>
              <td>客户端数</td>
              <td>{{ info.connected_clients }}</td>
              <td>运行时间(天)</td>
              <td>{{ info.uptime_in_days }}</td>
              <td>使用内存</td>
              <td>{{ info.used_memory_human }}</td>
            </tr>
            <tr>
              <td>使用CPU</td>
              <td>{{ parseFloat(info.used_cpu_user_children).toFixed(2) }}</td>
              <td>内存配置</td>
              <td>{{ info.maxmemory_human }}</td>
              <td>AOF是否开启</td>
              <td>{{ info.aof_enabled === '0' ? '否' : '是' }}</td>
            </tr>
            <tr>
              <td>RDB是否成功</td>
              <td>{{ info.rdb_last_bgsave_status }}</td>
              <td>Key数量</td>
              <td>{{ dbSize }} </td>
              <td>网络入口/出口</td>
              <td>{{ info.instantaneous_input_kbps }}kps/{{ info.instantaneous_output_kbps }}kps</td>
            </tr>
          </table>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="命令统计">
          <div ref="commandStatsChartRef" style="height: 400px"></div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="内存信息">
          <div ref="memoryUsedChartRef" style="height: 400px"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
  import { ref, Ref, onMounted, onBeforeUnmount } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'
  import { getRedisInfo } from '/@/views/modules/monitor/redis/RedisInfoMonitor.api'
  import { $ref } from 'vue/macros'
  import { useIntervalFn } from '@vueuse/core'

  const commandStatsChartRef = ref<HTMLDivElement | null>(null)
  const commandStatsChart = useECharts(commandStatsChartRef as Ref<HTMLDivElement>, 'light')

  const memoryUsedChartRef = ref<HTMLDivElement | null>(null)
  const memoryUsedChart = useECharts(memoryUsedChartRef as Ref<HTMLDivElement>, 'light')

  let interval: any = null
  let loading = $ref(false)
  let info = $ref<any>({})
  let commandStats = $ref<any>({})
  let dbSize = $ref<any>({})

  function drawChart() {
    // 命令统计
    const commandData = commandStats.map((row) => {
      return {
        name: row.key,
        value: row.value,
      }
    })
    commandStatsChart.setOptions({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      series: [
        {
          name: '命令',
          type: 'pie',
          roseType: 'radius',
          radius: [15, 95],
          center: ['50%', '38%'],
          data: commandData,
          animationEasing: 'cubicInOut',
          animationDuration: 1000,
        },
      ],
    })
    // 内存图表
    memoryUsedChart.setOptions({
      tooltip: {
        formatter: '{b} <br/>{a} : ' + info.used_memory_human,
      },
      series: [
        {
          name: '峰值',
          type: 'gauge',
          min: 0,
          max: 1000,
          detail: {
            formatter: info.used_memory_human,
          },
          data: [
            {
              value: parseFloat(info.used_memory_human),
              name: '内存消耗',
            },
          ],
        },
      ],
    })
  }

  /**
   * 定时任务
   */
  const { pause, resume } = useIntervalFn(() => getInfo(), 1000 * 5, { immediate: true })

  /**
   * 加载页面
   */
  onMounted(() => {
    resume()
  })

  /**
   * 卸载页面
   */
  onBeforeUnmount(() => {
    pause()
  })

  /**
   * 获取Redis服务信息
   */
  function getInfo() {
    getRedisInfo().then(({ data }) => {
      loading = false
      info = data.info
      commandStats = data.commandStats
      dbSize = data.dbSize
      // 图表
      drawChart()
    })
  }
</script>
<style lang="less" scoped>
  .table {
    width: 100%;
    min-height: 30px;
    line-height: 30px;
    text-align: center;
    td {
      border-bottom: 1px solid rgba(232, 232, 232, 0.99);
    }
  }
</style>
