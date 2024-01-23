<template>
  <basic-modal
    title="退款订单"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="750"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-descriptions bordered title="" :column="{ md: 1, sm: 1, xs: 1 }">
      <a-descriptions-item label="订单金额">
        {{ form.totalAmount }}
      </a-descriptions-item>
      <a-descriptions-item label="退款金额">
        {{ form.amount }}
      </a-descriptions-item>
      <a-descriptions-item label="通道支付单ID">
        {{ form.payChannelId }}
      </a-descriptions-item>
      <a-descriptions-item label="退款通道">
        {{ form.gatewayOrderNo }}
      </a-descriptions-item>
    </a-descriptions>

    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>
<script setup lang="ts">
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { getDetail, RefundChannelOrder } from './RefundOrder.api'
  import { FormInstance } from 'ant-design-vue/lib/form'
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
  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref<RefundChannelOrder>({})

  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id) {
    visible.value = true
    confirmLoading.value = true
    getDetail(id).then(({ data }) => {
      form = data
      confirmLoading.value = false
    })
  }
  defineExpose({
    init,
  })
</script>
<style scoped lang="less"></style>
