<template>
  <basic-modal
    title="退款申请"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :open="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="form"
      :label-col="labelCol"
      :rules="{ amount: [{ required: true, message: '请输入退款金额' }] }"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="标题">
        {{ order.title }}
      </a-form-item>
      <a-form-item label="订单号">
        <a-tag>{{ order.orderNo }}</a-tag>
      </a-form-item>
      <a-form-item label="商户订单号">
        <a-tag>{{ order.bizOrderNo }}</a-tag>
      </a-form-item>
      <a-form-item label="退款金额(元)" name="amount">
        <a-input-number
          :min="0.01"
          :max="order.refundableBalance"
          :precision="2"
          placeholder="请输入退款金额(元)"
          v-model:value="form.amount"
        />
      </a-form-item>
      <a-form-item label="原因" name="reason">
        <a-textarea v-model:value="form.reason" :rows="3" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk"
          >确定</a-button
        >
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { refund } from '../refund/RefundOrder.api'
  import BasicModal from '@/components/Modal/src/BasicModal.vue'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { useMessage } from '@/hooks/web/useMessage'
  import { nextTick, ref } from 'vue'
  import { getOrder, PayOrder } from './PayOrder.api'

  const { handleCancel, labelCol, wrapperCol, modalWidth, confirmLoading, visible, showable } =
    useFormEdit()
  const { createMessage, createConfirm } = useMessage()

  let order = ref<PayOrder>({})

  const formRef = ref<FormInstance>()
  let form = ref({
    // 订单号
    orderNo: '',
    // 原因
    reason: '',
    // 退款金额
    amount: 0.01,
  })
  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  async function init(id) {
    resetForm()
    confirmLoading.value = true
    visible.value = true
    getOrder(id).then(({ data }) => {
      order.value = data
      form.value.orderNo = data.orderNo as string
      form.value.amount = data.refundableBalance as number
      confirmLoading.value = false
    })
  }

  /**
   * 退款
   */
  function handleOk() {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '确实要申请退款!',
      onOk: () => {
        confirmLoading.value = true
        refund(form.value).then(() => {
          visible.value = false
          createMessage.success('退款请求已提交')
          emits('ok')
        })
      },
    })
  }
  /**
   * 重置表单
   */
  function resetForm() {
    nextTick(() => {
      formRef.value?.resetFields()
    })
  }
  defineExpose({ init })
</script>

<style scoped></style>
