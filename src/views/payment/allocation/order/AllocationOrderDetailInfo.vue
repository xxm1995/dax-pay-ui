<template>
  <basic-modal
    title="查看分账单信息"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1000"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions title="" bordered :column="{ md: 2, sm: 1, xs: 1 }">
        <a-descriptions-item label="接收方编号">
          {{ order.receiverNo }}
        </a-descriptions-item>
        <a-descriptions-item label="接收方姓名">
          {{ order.receiverName }}
        </a-descriptions-item>
        <a-descriptions-item label="分账接收方类型">
          <a-tag>{{ dictConvert('AllocReceiverType', order.receiverType) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="分账比例"> {{ order.rate / 100.0 }}% </a-descriptions-item>
        <a-descriptions-item label="分账金额(元)"> {{ order.amount ? (order.amount / 100).toFixed(2) : 0 }} </a-descriptions-item>
        <a-descriptions-item label="分账结果">
          <a-tag>{{ dictConvert('AllocDetailResult', order.result) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="完成时间">
          {{ order.finishTime }}
        </a-descriptions-item>
        <a-descriptions-item label="错误代码" v-if="order.errorCode">
          {{ order.errorCode }}
        </a-descriptions-item>
        <a-descriptions-item label="错误原因" v-if="order.errorMsg">
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
