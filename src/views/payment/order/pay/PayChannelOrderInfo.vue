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
      <a-descriptions-item label="支付通道">
        <a-tag>{{ dictConvert('PayChannel', form.channel) }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="支付通道">
        <a-tag v-if="form.async" color="green">是</a-tag>
        <a-tag v-else color="red">否</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="支付方式">
        <a-tag>{{ dictConvert('PayWay', form.payWay) }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="订单金额">
        {{ form.amount }}
      </a-descriptions-item>
      <a-descriptions-item label="支付状态">
        <a-tag>{{ dictConvert('PayStatus', form.status) }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="关联网关退款号">
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
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { getChannel, PayChannelOrder } from '/@/views/payment/order/pay/PayOrder.api'
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
  let form = $ref<PayChannelOrder>({})

  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id) {
    visible.value = true
    confirmLoading.value = true
    getChannel(id).then(({ data }) => {
      form = data
      confirmLoading.value = false
    })
  }
  defineExpose({
    init,
  })
</script>
<style scoped lang="less"></style>
