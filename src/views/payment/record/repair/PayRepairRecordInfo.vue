<template>
  <basic-modal
    title="查看"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1200"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions bordered title="" :column="{ md: 2, sm: 1, xs: 1 }">
        <a-descriptions-item label="修复单号">
          {{ form.repairNo }}
        </a-descriptions-item>
        <a-descriptions-item label="本地订单ID">
          {{ form.tradeId }}
        </a-descriptions-item>
        <a-descriptions-item label="本地 号">
          {{ form.tradeNo }}
        </a-descriptions-item>
        <a-descriptions-item label="修复类型">
          <a-tag>{{ dictConvert('PaymentType', form.repairType) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="修复通道">
          <a-tag>{{ dictConvert('PayChannel', form.channel) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="修复来源">
          <a-tag>{{ dictConvert('PayRepairSource', form.repairSource) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="修复方式">
          <a-tag v-if="form.repairType === 'pay'">{{ dictConvert('PayRepairWay', form.repairWay) }}</a-tag>
          <a-tag v-else>{{ dictConvert('RefundRepairWay', form.repairWay) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="修复前订单状态">
          <a-tag v-if="form.repairType === 'pay'">{{ dictConvert('PayStatus', form.beforeStatus) }}</a-tag>
          <a-tag v-else>{{ dictConvert('RefundStatus', form.beforeStatus) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="修复后订单状态">
          <a-tag v-if="form.repairType === 'pay'">{{ dictConvert('PayStatus', form.afterStatus) }}</a-tag>
          <a-tag v-else>{{ dictConvert('RefundStatus', form.afterStatus) }}</a-tag>
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
    handleCancel,
    modalWidth,
    confirmLoading,
    visible,
    showable,
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
