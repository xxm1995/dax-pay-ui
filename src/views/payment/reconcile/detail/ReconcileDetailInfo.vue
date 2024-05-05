<template>
  <basic-modal
    title="对账明细详情"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="750"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-descriptions bordered title="" :column="{ md: 1, sm: 1, xs: 1 }">
      <a-descriptions-item label="订单名称">
        {{ form.title }}
      </a-descriptions-item>
      <a-descriptions-item label="交易金额">
        {{ form.amount }}
      </a-descriptions-item>
      <a-descriptions-item label="本地订单ID">
        {{ form.orderId }}
      </a-descriptions-item>
      <a-descriptions-item label="外部订单号">
        {{ form.gatewayOrderNo }}
      </a-descriptions-item>
      <a-descriptions-item label="交易类型">
        <a-tag>{{ dictConvert('ReconcileTrade', form.type) }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ form.createTime }}
      </a-descriptions-item>
    </a-descriptions>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>
<script setup lang="ts">
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { get, ReconcileDetail } from './ReconcileDetail.api'
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
  let form = $ref<ReconcileDetail>({})

  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(record) {
    visible.value = true
    confirmLoading.value = true
    get(record.id).then(({ data }) => {
      form = data
      confirmLoading.value = false
    })
  }
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
