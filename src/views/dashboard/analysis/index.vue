<template>
  <div class="p-4">
    <!--  订单数  -->
    <OrderCount :loading="loading" :data="orderListData" class="enter-y" />
    <!--  占比图  -->
    <div class="md:flex !my-4 enter-y">
      <!--   支付   -->
      <VisitSource class="md:w-1/2 !md:my-0 !my-4 w-full" :loading="loading" :data="payChannelLine" />
      <!--   退款   -->
      <SalesProductPie class="md:w-1/2 !md:mx-4 w-full" :loading="loading" />
    </div>
    <!--  订单  -->
    <SiteAnalysis class="!my-4 enter-y" :loading="loading" />
  </div>
</template>
<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import OrderCount from './components/OrderCount.vue'
  import SiteAnalysis from './components/SiteAnalysis.vue'
  import VisitSource from './components/VisitSource.vue'
  import SalesProductPie from './components/SalesProductPie.vue'
  import dayjs, { OpUnitType } from 'dayjs'
  import {
    CockpitReportQuery,
    getPayAmount,
    getPayChannelInfo,
    getPayOrderCount,
    getRefundAmount,
    getRefundOrderCount,
  } from '/@/views/dashboard/analysis/components/CockpitReport.api'
  import { $ref } from 'vue/macros'

  const loading = ref(false)

  let param = $ref<CockpitReportQuery>({ startTime: '', endTime: '' })

  /**
   * 初始化
   */
  onMounted(() => {
    initTime()
    initOrderCount()
    initPayChannelInfo()
  })

  /**
   * 初始化时间
   */
  function initTime() {
    const now = dayjs()
    param.startTime = now.startOf('day').format('YYYY-MM-DD HH:mm:ss')
    param.endTime = now.endOf('day').format('YYYY-MM-DD HH:mm:ss')
  }

  // 订单数量信息
  let payAmount = $ref<number>(0)
  let refundAmount = $ref<number>(0)
  let payCount = $ref<number>(0)
  let refundCount = $ref<number>(0)
  const orderListData = computed(() => [
    {
      title: '支付金额',
      value: payAmount,
      icon: 'total-sales|svg',
      action: '单位(元)',
      decimals: 2,
    },
    {
      title: '支付订单数',
      value: refundAmount,
      icon: 'transaction|svg',
      action: '',
      decimals: 0,
    },
    {
      title: '退款金额',
      value: payCount,
      icon: 'total-sales|svg',
      action: '单位(元)',
      decimals: 2,
    },
    {
      title: '退款订单数',
      value: refundCount,
      icon: 'transaction|svg',
      action: '',
      decimals: 0,
    },
  ])
  /**
   * 初始化订单信息
   */
  function initOrderCount() {
    getPayAmount(param).then(({ data }) => (payAmount = data / 10.0))
    getRefundAmount(param).then(({ data }) => (refundAmount = data))
    getPayOrderCount(param).then(({ data }) => (payCount = data / 10.0))
    getRefundOrderCount(param).then(({ data }) => (refundCount = data))
  }

  let payChannelLine = $ref<any>()

  /**
   * 初始化退款订单
   */
  function initPayChannelInfo() {
    getPayChannelInfo(param).then(({ data }) => {
      payChannelLine = data.map((o) => {
        return { name: o.channelName, value: o.orderAmount }
      })
    })
  }
</script>
