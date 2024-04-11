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
      <a-descriptions title="" :column="{ md: 1, sm: 1, xs: 1 }">
        <a-descriptions-item label="接收方姓名">
          {{ order.receiverName }}
        </a-descriptions-item>
        <a-descriptions-item label="分账接收方类型">
          <a-tag>{{ dictConvert('AllocationReceiverType', order.receiverType) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="分账比例"> {{ order.rate / 100.0 }}% </a-descriptions-item>
        <a-descriptions-item label="分账金额"> {{ order.amount / 100.0 }}元 </a-descriptions-item>
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
  import { AllocationOrderDetail, detail } from './AllocationOrder.api'
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

  let order = $ref<AllocationOrderDetail>({})
  // 入口
  async function init(record: AllocationOrderDetail) {
    visible.value = true
    order = record
    confirmLoading.value = true
    await detail(record.id).then(({ data }) => {
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
