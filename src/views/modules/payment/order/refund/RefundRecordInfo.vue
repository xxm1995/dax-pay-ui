<template>
  <basic-modal
    title="查看"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-descriptions bordered title="" :column="{ md: 1, sm: 1, xs: 1 }">
      <a-descriptions-item label="付款记录ID">
        {{ form.paymentId }}
      </a-descriptions-item>
      <a-descriptions-item label="业务ID">
        {{ form.businessId }}
      </a-descriptions-item>
      <a-descriptions-item label="多次退款业务号">
        {{ form.refundRequestNo }}
      </a-descriptions-item>
      <a-descriptions-item label="标题">
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
        <a-tag>{{ form.refundStatus ? '成功' : '失败' }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="退款终端ip">
        {{ form.clientIp }}
      </a-descriptions-item>
      <a-descriptions-item label="退款信息">
        <a-tag v-for="o in form.refundableInfo" :key="o.payChannel">{{ dictConvert('PayChannel', o.payChannel) }}: {{ o.amount }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="错误码">
        {{ form.errorCode }}
      </a-descriptions-item>
      <a-descriptions-item label="错误信息">
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
  import { get, RefundRecord } from './RefundRecord.api'
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
  let form = $ref<RefundRecord>({
    id: null,
    paymentId: '',
    refundRequestNo: '',
    userId: '',
    title: '',
    amount: 0,
    refundableInfo: [],
    refundStatus: 0,
    refundTime: '',
    clientIp: '',
    errorCode: '',
    errorMsg: '',
  })

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
