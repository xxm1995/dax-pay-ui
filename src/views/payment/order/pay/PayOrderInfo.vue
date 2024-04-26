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
        <a-descriptions-item label="标题" :span="3">
          {{ order.title }}
        </a-descriptions-item>
        <a-descriptions-item :span="1" label="订单号">
          {{ order.orderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="商户订单号" :span="1">
          {{ order.bizOrderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="三方系统交易号" :span="1">
          {{ order.outOrderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="描述">
          {{ order.description }}
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
        <a-descriptions-item label="支持分账">
          {{ order.allocation ? '是' : '否' }}
        </a-descriptions-item>
        <a-descriptions-item label="分账状态">
          {{ dictConvert('AllocationOrderStatus', order.allocationStatus) }}
        </a-descriptions-item>
        <a-descriptions-item label="错误信息">
          {{ order.errorMsg }}
        </a-descriptions-item>
        <a-descriptions-item label="是否通知">
          {{ orderExtra.notNotify ? '否' : '是' }}
        </a-descriptions-item>
        <a-descriptions-item label="客户IP">
          {{ orderExtra.clientIp }}
        </a-descriptions-item>
        <a-descriptions-item label="通知地址" ::span="3">
          {{ orderExtra.notifyUrl }}
        </a-descriptions-item>
        <a-descriptions-item label="商户扩展参数" :span="3">
          {{ orderExtra.attach }}
        </a-descriptions-item>
        <a-descriptions-item label="请求时间">
          {{ orderExtra.reqTime }}
        </a-descriptions-item>
        <a-descriptions-item label="支付时间">
          {{ order.payTime }}
        </a-descriptions-item>
        <a-descriptions-item label="过期时间">
          {{ order.expiredTime }}
        </a-descriptions-item>
        <a-descriptions-item label="关闭时间">
          {{ order.closeTime }}
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
  import { PayOrder, PayOrderExtra, getOrderByOrderNo } from './PayOrder.api'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  const { handleCancel, confirmLoading, visible, showable } = useFormEdit()
  const { dictConvert } = useDict()

  let order = $ref<PayOrder>({})
  let orderExtra = $ref<PayOrderExtra>({})
  // 入口
  async function init(orderNo: string) {
    visible.value = true
    confirmLoading.value = true
    await getOrderByOrderNo(orderNo).then(({ data }) => {
      order = data.payOrder
      orderExtra = data.payOrderExtra
    })
    confirmLoading.value = false
  }
  // 获取信息
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
