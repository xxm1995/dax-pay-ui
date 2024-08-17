<template>
  <basic-modal
    title="查看支付单"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1200"
    :open="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions title="" :column="24" bordered>
        <a-descriptions-item label="标题" :span="8">
          {{ order.title }}
        </a-descriptions-item>
        <a-descriptions-item label="金额(元)" :span="8">
          {{ order.amount }}
        </a-descriptions-item>
        <a-descriptions-item label="可退余额(元)" :span="8">
          {{ order.refundableBalance }}
        </a-descriptions-item>
        <a-descriptions-item label="支付状态" :span="8">
          {{ dictConvert('pay_status', order.status) }}
        </a-descriptions-item>
        <a-descriptions-item label="订单号" :span="16">
          {{ order.orderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="分账状态" :span="8">
          {{ dictConvert('pay_alloc_status', order.allocStatus) || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="通道交易号" :span="16">
          {{ order.outOrderNo || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="退款状态" :span="8">
          {{ dictConvert('pay_refund_status', order.refundStatus) || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="商户订单号" :span="16">
          {{ order.bizOrderNo || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="自动分账" :span="8">
          {{ order.autoAllocation || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="通知地址" :span="16">
          {{ order.notifyUrl || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="错误编码" v-if="order.errorMsg" :span="8">
          {{ order.errorCode || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="错误信息" v-if="order.errorMsg" :span="16">
          {{ order.errorMsg || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="客户IP" :span="8">
          {{ order.clientIp }}
        </a-descriptions-item>
        <a-descriptions-item label="描述" :span="16">
          {{ order.description }}
        </a-descriptions-item>
        <a-descriptions-item label="商户扩展参数" :span="24">
          {{ order.attach || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="请求时间" :span="8">
          {{ order.reqTime || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="过期时间" :span="8">
          {{ order.expiredTime || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="支付时间" :span="8">
          {{ order.payTime || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="关闭时间" :span="8">
          {{ order.closeTime || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="8">
          {{ order.createTime }}
        </a-descriptions-item>
        <a-descriptions-item label="商户号" :span="8">
          {{ order.mchNo }}
        </a-descriptions-item>
        <a-descriptions-item label="应用AppId" :span="8">
          {{ order.appId }}
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { PayOrder, getOrderByOrderNo } from './PayOrder.api'
  import { BasicModal } from '@/components/Modal'
  import { useDict } from '@/hooks/bootx/useDict'
  import { ref } from 'vue'

  const { handleCancel, confirmLoading, visible, showable } = useFormEdit()
  const { dictConvert } = useDict()

  let order = ref<PayOrder>({})
  // 入口
  async function init(orderNo: string) {
    visible.value = true
    confirmLoading.value = true
    await getOrderByOrderNo(orderNo).then(({ data }) => {
      order.value = data
    })
    confirmLoading.value = false
  }
  // 获取信息
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
