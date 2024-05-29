<template>
  <basic-modal
    title="查看分账单信息"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1200"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions title="" bordered>
        <a-descriptions-item label="支付订单标题" :span="2">
          {{ order.title }}
        </a-descriptions-item>
        <a-descriptions-item label="所属通道" :span="2">
          {{ dictConvert('PayChannel', order.channel) }}
        </a-descriptions-item>
        <a-descriptions-item label="总分账金额(元)" :span="2">
          {{ order.amount ? (order.amount / 100).toFixed(2) : 0 }}
        </a-descriptions-item>
        <a-descriptions-item label="状态" :span="2">
          {{ dictConvert('AllocOrderStatus', order.status) }}
        </a-descriptions-item>
        <a-descriptions-item label="处理结果" :span="2">
          {{ dictConvert('AllocOrderResult', order.result) }}
        </a-descriptions-item>
        <a-descriptions-item label="分账描述" :span="2">
          {{ order.description }}
        </a-descriptions-item>
        <a-descriptions-item label="分账号" :span="2">
          {{ order.allocationNo }}
        </a-descriptions-item>
        <a-descriptions-item label="支付订单号" :span="2">
          {{ order.orderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="商户分账号" :span="2">
          {{ order.allocationNo }}
        </a-descriptions-item>
        <a-descriptions-item label="商户支付订单号" :span="2">
          {{ order.bizOrderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="通道分账号" :span="2">
          {{ order.outAllocationNo || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="通道支付订单号" :span="2">
          {{ order.outOrderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">
          {{ order.createTime }}
        </a-descriptions-item>
        <a-descriptions-item label="完成时间" :span="2">
          {{ order.finishTime }}
        </a-descriptions-item>
        <a-descriptions-item v-if="order.errorCode" label="错误编码" :span="2">
          {{ order.errorMsg }}
        </a-descriptions-item>
        <a-descriptions-item v-if="order.errorMsg" label="错误原因" :span="2">
          {{ order.errorMsg }}
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
  import { get, AllocationOrder } from './AllocationOrder.api'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  const {
    handleCancel,
    confirmLoading,
    visible,
    showable,
  } = useFormEdit()
  const { dictConvert } = useDict()

  let order = $ref<AllocationOrder>({})
  // 入口
  async function init(record: AllocationOrder) {
    visible.value = true
    order = record
    confirmLoading.value = true
    await get(record.id).then(({ data }) => {
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
