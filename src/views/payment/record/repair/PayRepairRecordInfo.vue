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
    <a-spin :spinning="confirmLoading">
      <a-descriptions bordered title="" :column="{ md: 1, sm: 1, xs: 1 }">
        <a-descriptions-item label="主键ID">
          {{ form.id }}
        </a-descriptions-item>
        <a-descriptions-item label="修复号">
          {{ form.repairId }}
        </a-descriptions-item>
        <a-descriptions-item label="本地订单ID">
          {{ form.orderId }}
        </a-descriptions-item>
        <a-descriptions-item label="本地业务号">
          {{ form.orderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="修复类型">
          <a-tag>{{ dictConvert('PaymentType', form.repairType) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="修复通道">
          <a-tag>{{ dictConvert('AsyncPayChannel', form.asyncChannel) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="修复来源">
          <a-tag>{{ dictConvert('PayRepairSource', form.repairSource) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="修复方式">
          <a-tag v-if="form.repairType === 'pay'">{{ dictConvert('PayRepairWay', form.repairWay) }}</a-tag>
          <a-tag v-else>{{ dictConvert('RefundRepairWay', form.repairWay) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="修复前订单状态">
          <a-tag>{{ dictConvert('PayStatus', form.beforeStatus) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="修复后订单状态">
          <a-tag>{{ dictConvert('PayStatus', form.afterStatus) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="修复时间">
          {{ form.createTime }}
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { get, PayRepairRecord } from './PayRepairRecord.api'
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
  let form = $ref<PayRepairRecord>({})
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
