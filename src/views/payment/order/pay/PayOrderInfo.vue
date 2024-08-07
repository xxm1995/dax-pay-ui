<template>
  <basic-modal
    title="查看支付单"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1200"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions title="" bordered>
        <a-descriptions-item label="标题" :span="1">
          {{ order.title }}
        </a-descriptions-item>
        <a-descriptions-item label="金额(元)">
          {{ order.amount ? (order.amount / 100).toFixed(2) : 0 }}
        </a-descriptions-item>
        <a-descriptions-item label="可退余额(元)">
          {{ order.refundableBalance ? (order.refundableBalance / 100).toFixed(2) : 0 }}
        </a-descriptions-item>
        <a-descriptions-item label="支付状态">
          {{ dictConvert('PayStatus', order.status) }}
        </a-descriptions-item>
        <a-descriptions-item :span="2" label="订单号">
          {{ order.orderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="支持分账">
          {{ order.allocation ? '是' : '否' }}
        </a-descriptions-item>
        <a-descriptions-item label="商户订单号" :span="2">
          {{ order.bizOrderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="分账状态">
          {{ dictConvert('PayOrderAllocStatus', order.allocStatus) || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="三方系统交易号" :span="2">
          {{ order.outOrderNo || '无' }}
        </a-descriptions-item>
        <a-descriptions-item v-if="order.errorCode" label="错误编码" :span="1">
          {{ order.errorCode }}
        </a-descriptions-item>
        <a-descriptions-item v-if="order.errorMsg" label="错误信息" :span="2">
          {{ order.errorMsg }}
        </a-descriptions-item>
        <a-descriptions-item label="退款状态">
          {{ dictConvert('PayOrderRefundStatus', order.refundStatus) || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="通知地址" :span="2">
          {{ order.notifyUrl || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="自动分账" :span="1">
          {{ order.autoAllocation || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="描述" :span="2">
          {{ order.description }}
        </a-descriptions-item>
        <a-descriptions-item label="客户IP">
          {{ order.clientIp }}
        </a-descriptions-item>
        <a-descriptions-item label="商户扩展参数" :span="2">
          {{ order.attach || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="请求时间">
          {{ order.reqTime || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="支付时间">
          {{ order.payTime || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="过期时间">
          {{ order.expiredTime || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="关闭时间">
          {{ order.closeTime || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ order.createTime }}
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
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { PayOrder, getOrderByOrderNo } from './PayOrder.api'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  const { handleCancel, confirmLoading, visible, showable } = useFormEdit()
  const { dictConvert } = useDict()

  let order = $ref<PayOrder>({})
  // 入口
  async function init(orderNo: string) {
    visible.value = true
    confirmLoading.value = true
    await getOrderByOrderNo(orderNo).then(({ data }) => {
      order = data
    })
    confirmLoading.value = false
  }
  // 获取信息
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
