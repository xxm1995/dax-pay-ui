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
        <a-descriptions-item label="标题">
          {{ cashRecord.title }}
        </a-descriptions-item>
        <a-descriptions-item label="金额(分)">
          {{ cashRecord.amount }}
        </a-descriptions-item>
        <a-descriptions-item label="交易订单号">
          {{ cashRecord.orderId }}
        </a-descriptions-item>
        <a-descriptions-item label="业务类型">
          <a-tag>{{ dictConvert('CashRecordType', cashRecord.type) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="备注">
          {{ cashRecord.remark }}
        </a-descriptions-item>
        <a-descriptions-item label="交易时间">
          {{ cashRecord.createTime }}
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import { get, CashRecord } from './CashRecord.api'
  import { $ref } from 'vue/macros'
  import { BasicModal } from '/@/components/Modal'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
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

  let loading = $ref(false)
  let cashRecord = $ref<CashRecord>({})

  /**
   * 入口
   */
  function init(record: CashRecord) {
    visible.value = true
    cashRecord = record
    initData(record.id as string)
  }

  /**
   * 初始化数据
   */
  async function initData(cashId) {
    loading = true
    const { data } = await get(cashId)
    loading = false
    cashRecord = data
  }

  defineExpose({ init })
</script>

<style scoped lang="less"></style>
