<template>
  <basic-modal
    title="退款订单"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1200"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-descriptions   bordered>
      <a-descriptions-item label="退款号" :span="3">
        {{ form.refundNo }}
      </a-descriptions-item>
      <a-descriptions-item label="退款原因" :span="3">
        {{ form.reason }}
      </a-descriptions-item>
      <a-descriptions-item label="原业务号" :span="2">
        {{ form.businessNo }}
      </a-descriptions-item>
      <a-descriptions-item label="网关订单号">
        {{ form.gatewayOrderNo }}
      </a-descriptions-item>
      <a-descriptions-item label="原支付标题" :span="3">
        {{ form.title }}
      </a-descriptions-item>
      <a-descriptions-item label="原支付单号" :span="3">
        {{ form.orderNo }}
      </a-descriptions-item>
     
      <a-descriptions-item label="退款金额(元)">
        {{ form.amount?(form.amount/100).toFixed(2):0 }}
      </a-descriptions-item>
      <a-descriptions-item label="剩余可退款金额(元)">
        {{ form.refundableBalance?(form.refundableBalance/100).toFixed(2):0 }}

      </a-descriptions-item>
      <a-descriptions-item label="订单金额信息">
        <a-tag v-for="o in refundChannelOrders" :key="o.channel">{{ dictConvert('PayChannel', o.channel) }}: {{ o.orderAmount }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="退款信息">
        <a-tag v-for="o in refundChannelOrders" :key="o.channel">{{ dictConvert('PayChannel', o.channel) }}: {{ o.amount }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="退款完成时间">
        {{ form.refundTime }}
      </a-descriptions-item>
      <a-descriptions-item label="退款状态">
        <a-tag>{{ dictConvert('RefundStatus', form.status) }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="退款终端ip">
        {{ form.clientIp }}
      </a-descriptions-item>
      <a-descriptions-item v-if="form.errorCode" label="错误码">
        {{ form.errorCode }}
      </a-descriptions-item>
      <a-descriptions-item v-if="form.errorMsg" label="错误信息">
        {{ form.errorMsg }}
      </a-descriptions-item>
    </a-descriptions>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { get, listByChannel, RefundChannelOrder, RefundOrder } from './RefundOrder.api'
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
  let form = $ref<RefundOrder>({})
  let refundChannelOrders = $ref<RefundChannelOrder[]>([])

  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  async function init(id) {
    visible.value = true
    confirmLoading.value = true
    await get(id).then(({ data }) => {
      form = data
    })
    await listByChannel(id).then(({ data }) => {
      refundChannelOrders = data
    })
    confirmLoading.value = false
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
