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
      <template :key="o.channel" v-for="o in form.refundChannels">
        <a-form-item :label="dictConvert('PayChannel', o.channel)" name="name">
          <a-input-number :min="0" :max="o.maxAmount" :precision="0" v-model:value="o.amount" />
        </a-form-item>
      </template>
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
  import { listByChannel } from './PayOrder.api'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { refund, RefundableInfo } from '../refund/RefundOrder.api'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { nextTick } from 'vue'

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
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  const formRef = $ref<FormInstance>()
  let form = $ref({
    // 支付id
    paymentId: '',
    // 原因
    reason: '',
    // 可退款明细
    refundChannels: [] as any,
  })
  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  async function init(id) {
    resetForm()
    confirmLoading.value = true
    visible.value = true
    form.paymentId = id
    listByChannel(id).then(({ data }) => {
      form.refundChannels = data.map((item) => {
        return {
          channel: item.channel,
          amount: item.refundableBalance,
          maxAmount: item.refundableBalance,
        }
      })
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
