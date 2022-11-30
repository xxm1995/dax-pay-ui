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
    <a-spin :spinning="confirmLoading">
      <a-form ref="formRef" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <template :key="o.payChannel" v-for="o in form.refundModeParams">
          <a-form-item :label="dictConvert('PayChannel', o.payChannel)" name="name">
            <a-input-number :min="0.01" :max="o.amount" :precision="2" v-model:value="o.amount" />
          </a-form-item>
        </template>
      </a-form>
    </a-spin>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { get } from '/@/views/modules/payment/order/payment/Payment.api'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { refund } from '/@/api/common/Pay'
  import { RefundableInfo } from '/@/views/modules/payment/order/refund/RefundRecord.api'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { useMessage } from '/@/hooks/web/useMessage'

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
    businessId: '',
    // 可退款明细
    refundModeParams: [] as RefundableInfo[],
  })
  const emits = defineEmits(['ok'])

  function init(id) {
    confirmLoading.value = true
    visible.value = true
    get(id).then(({ data }) => {
      const { businessId, refundableInfo } = data
      form.businessId = businessId as string
      form.refundModeParams = [...(refundableInfo as RefundableInfo[])]
      confirmLoading.value = false
    })
  }
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
    confirmLoading.value = true
  }
  defineExpose({ init })
</script>

<style scoped></style>
