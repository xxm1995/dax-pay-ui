<template>
  <basic-modal
    title="退款申请"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item :label="dictConvert('PayChannel', order.channel)" name="name">
        <a-input-number :min="0" :max="order.amount" :precision="0" v-model:value="form.amount" />
      </a-form-item>
      <a-form-item label="原因" name="reason">
        <a-textarea v-model:value="form.reason" :rows="3" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">确定</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { refund } from '../refund/RefundOrder.api'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { nextTick } from 'vue'
  import { getOrder, PayOrder } from './PayOrder.api'

  const { handleCancel, labelCol, wrapperCol, modalWidth, confirmLoading, visible, showable } = useFormEdit()
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  let order = $ref<PayOrder>({})

  const formRef = $ref<FormInstance>()
  let form = $ref({
    // 订单号
    orderNo: '',
    // 原因
    reason: '',
    // 退款金额
    amount: 1,
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
      order = data
      form.orderNo = data.orderNo as string
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
        refund(form).then(() => {
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
      formRef?.resetFields()
    })
  }
  defineExpose({ init })
</script>

<style scoped></style>
