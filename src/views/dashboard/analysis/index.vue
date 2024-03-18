<template>
  <div class="p-4">
    <!--  订单数  -->
    <OrderCount :loading="loading" :data="orderListData" class="enter-y" />
    <!--  占比图  -->
    <div class="md:flex !my-4 enter-y">
      <!--   支付   -->
      <VisitSource class="md:w-1/2 !md:my-0 !my-4 w-full" :loading="loading" :data="payOrderChannelCount" />
      <!--   退款   -->
      <SalesProductPie class="md:w-1/2 !md:mx-4 w-full" :loading="loading" :data="refundOrderChannelCount" />
    </div>
    <!--  订单折线图  -->
    <SiteAnalysis class="!my-4 enter-y" :loading="loading" :payOrder="payOrderChannelAmount" :refundOrder="refundOrderChannelAmount" />
  </div>
</template>
<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import OrderCount from './components/OrderCount.vue'
  import SiteAnalysis from './components/SiteAnalysis.vue'
  import VisitSource from './components/VisitSource.vue'
  import SalesProductPie from './components/SalesProductPie.vue'
  import dayjs from 'dayjs'
  import {
    CockpitReportQuery,
    getPayAmount,
    getPayChannelInfo,
    getPayOrderCount,
    getRefundAmount,
    getRefundChannelInfo,
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
    initRefundChannelInfo()
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
  // 支付订单通道数量分布
  let payOrderChannelCount = $ref<any>([])
  // 退款订单通道数量分布
  let refundOrderChannelCount = $ref<any>([])
  // 支付订单通道金额分布
  let payOrderChannelAmount = $ref<any>([])
  // 退款订单通道金额分布
  let refundOrderChannelAmount = $ref<any>([])

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
      value: payCount,
      icon: 'transaction|svg',
      action: '',
      decimals: 0,
    },
    {
      title: '退款金额',
      value: refundAmount,
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
    getPayAmount(param).then(({ data }) => (payAmount = data / 100.0))
    getRefundAmount(param).then(({ data }) => (refundAmount = data / 100.0))
    getPayOrderCount(param).then(({ data }) => (payCount = data))
    getRefundOrderCount(param).then(({ data }) => (refundCount = data))
  }

  /**
   * 初始化支付通道订单数量
   */
  function initPayChannelInfo() {
    getPayChannelInfo(param).then(({ data }) => {
      payOrderChannelCount = data.map((o) => {
        return { name: o.channelName, value: o.orderCount }
      })
      payOrderChannelAmount = data.map((o) => {
        return { name: o.channelName, value: o.orderAmount }
      })
    })
  }

  /**
   * 初始化退款通道订单数量
   */
  function initRefundChannelInfo() {
    getRefundChannelInfo(param).then(({ data }) => {
      refundOrderChannelCount = data.map((o) => {
        return { name: o.channelName, value: o.orderCount }
      })
      refundOrderChannelAmount = data.map((o) => {
        return { name: o.channelName, value: o.orderAmount }
      })
    })
  }
</script>
