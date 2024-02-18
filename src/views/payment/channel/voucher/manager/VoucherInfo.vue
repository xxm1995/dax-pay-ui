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
        <a-descriptions-item label="钱包ID">
          {{ voucher.id }}
        </a-descriptions-item>
        <a-descriptions-item label="卡号">
          {{ voucher.cardNo }}
        </a-descriptions-item>
        <a-descriptions-item label="余额">
          {{ voucher.balance }}
        </a-descriptions-item>
        <a-descriptions-item label="余额">
          {{ voucher.balance }}
        </a-descriptions-item>
        <a-descriptions-item label="余额(分)">
          {{ voucher.balance }}
        </a-descriptions-item>
        <a-descriptions-item label="长期有效">
          <a-tag>{{ voucher.enduring ? '长期' : '期限' }}</a-tag>
        </a-descriptions-item>
        <template v-if="!voucher.enduring">
          <a-descriptions-item label="开始时间">
            {{ voucher.startTime }}
          </a-descriptions-item>
          <a-descriptions-item label="结束时间">
            {{ voucher.endTime }}
          </a-descriptions-item>
        </template>
        <a-descriptions-item label="状态">
          <a-tag>{{ dictConvert('VoucherStatus', voucher.status) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="导入时间">
          {{ voucher.createTime }}
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import { get, Voucher } from './Voucher.api'
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
  let voucher = $ref<Voucher>({})

  /**
   * 入口
   */
  function init(record: Voucher) {
    visible.value = true
    voucher = record
    initData(record.id as string)
  }

  /**
   * 初始化数据
   */
  async function initData(voucherId) {
    loading = true
    const { data } = await get(voucherId)
    loading = false
    voucher = data
  }

  defineExpose({ init })
</script>

<style scoped lang="less"></style>
