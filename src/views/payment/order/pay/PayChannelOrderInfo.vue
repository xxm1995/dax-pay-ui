<template>
  <basic-modal
    title="通道支付订单详情"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="750"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-descriptions bordered title="" :column="{ md: 1, sm: 1, xs: 1 }">
      <a-descriptions-item label="通道支付单ID">
        {{ form.id }}
      </a-descriptions-item>
      <a-descriptions-item label="支付通道">
        {{ dictConvert('PayChannel', form.channel) }}
      </a-descriptions-item>
      <a-descriptions-item label="异步支付">
        <span v-if="form.async" style="color: green">是</span>
        <span v-else style="color: red">否</span>
      </a-descriptions-item>
      <a-descriptions-item label="支付方式">
        {{ dictConvert('PayWay', form.payWay) }}
      </a-descriptions-item>
      <a-descriptions-item label="订单金额">
        {{ form.amount }}
      </a-descriptions-item>
      <a-descriptions-item label="支付状态">
        <span :style="dynamicStyle(form.status)"> {{ dictConvert('PayStatus', form.status) }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="支付时间">
        {{ form.payTime }}
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
  function init(record) {
    visible.value = true
    confirmLoading.value = true
    getChannel(record.id).then(({ data }) => {
      form = data
      confirmLoading.value = false
    })
  }
  function dynamicStyle(item: string) {
    if (item == 'success') {
      return { color: 'green' }
    }
    if (item == 'fail') {
      return { color: 'red' }
    }
    if (item == 'progress') {
      return { color: 'orange' }
    }
    if (item == 'close') {
      return { color: 'gray' }
    }
    return { color: 'red' }
  }
  defineExpose({
    init,
  })
</script>
<style scoped lang="less"></style>
