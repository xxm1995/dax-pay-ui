<template>
  <basic-modal
    title="查看对账单信息"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions title="" :column="{ md: 2, sm: 1, xs: 1 }">
        <a-descriptions-item label="分账订单号">
          {{ order.orderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="支付订单ID">
          {{ order.paymentId }}
        </a-descriptions-item>
        <a-descriptions-item label="支付订单标题">
          {{ order.title }}
        </a-descriptions-item>
        <a-descriptions-item label="网关支付订单号">
          {{ order.gatewayPayOrderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="网关分账单号">
          {{ order.gatewayAllocationNo }}
        </a-descriptions-item>
        <a-descriptions-item label="分账单号">
          {{ order.allocationNo }}
        </a-descriptions-item>
        <a-descriptions-item label="所属通道">
          <a-tag>{{ dictConvert('PayChannel', order.channel) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="总分账金额">
          {{ order.amount }}
        </a-descriptions-item>
        <a-descriptions-item label="请求时间">
          {{ dictConvert('AllocationStatus', order.status) }}
        </a-descriptions-item>
        <a-descriptions-item label="错误原因">
          {{ order.errorMsg }}
        </a-descriptions-item>
        <a-descriptions-item label="完成时间">
          {{ order.finishTime }}
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
  import { get, AllocationOrder } from './AllocationOrder.api'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  const {
    initFormEditType,
    handleCancel,
    search,
    labelCol,
    wrapperCol,
    modalWidth,
    title,
    confirmLoading,
    visible,
    editable,
    showable,
    formEditType,
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
