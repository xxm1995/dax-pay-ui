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
    <a-descriptions title="" :column="{ md: 2, sm: 1, xs: 1 }">
      <a-descriptions-item label="原支付号">
        {{ form.paymentId }}
      </a-descriptions-item>
      <a-descriptions-item label="原业务号">
        {{ form.businessNo }}
      </a-descriptions-item>
      <a-descriptions-item label="退款号">
        {{ form.refundNo }}
      </a-descriptions-item>
      <a-descriptions-item label="原支付标题">
        {{ form.title }}
      </a-descriptions-item>
      <a-descriptions-item label="退款金额">
        {{ form.amount }}
      </a-descriptions-item>
      <a-descriptions-item label="剩余可退款金额">
        {{ form.refundableBalance }}
      </a-descriptions-item>
      <a-descriptions-item label="退款时间">
        {{ form.refundTime }}
      </a-descriptions-item>
      <a-descriptions-item label="退款状态">
        <a-tag>{{ dictConvert('PayRefundStatus', form.status) }}</a-tag>
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
  import { get, RefundOrder } from './RefundOrder.api'
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

  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id) {
    visible.value = true
    confirmLoading.value = true
    get(id).then(({ data }) => {
      form = data
      confirmLoading.value = false
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
