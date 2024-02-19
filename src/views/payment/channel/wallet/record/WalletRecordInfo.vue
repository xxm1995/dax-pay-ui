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
        <a-descriptions-item label="金额(分)">
          {{ walletRecord.amount }}
        </a-descriptions-item>
        <a-descriptions-item label="变动前金额(分)">
          {{ walletRecord.oldAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="变动后金额(分)">
          {{ walletRecord.newAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="交易订单号">
          {{ walletRecord.orderId }}
        </a-descriptions-item>
        <a-descriptions-item label="业务类型">
          <a-tag>{{ dictConvert('WalletRecordType', walletRecord.type) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="备注">
          {{ walletRecord.remark }}
        </a-descriptions-item>
        <a-descriptions-item label="记录时间">
          {{ walletRecord.createTime }}
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import { get, WalletRecord } from './WalletRecord.api'
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
  let walletRecord = $ref<WalletRecord>({})

  /**
   * 入口
   */
  function init(record: WalletRecord) {
    visible.value = true
    walletRecord = record
    initData(record.id as string)
  }

  /**
   * 初始化数据
   */
  async function initData(walletId) {
    loading = true
    const { data } = await get(walletId)
    loading = false
    walletRecord = data
  }

  defineExpose({ init })
</script>

<style scoped lang="less"></style>
