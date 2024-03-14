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
          {{ unionPayRecord.title }}
        </a-descriptions-item>
        <a-descriptions-item label="金额(分)">
          {{ unionPayRecord.amount }}
        </a-descriptions-item>
        <a-descriptions-item label="本地订单号">
          {{ unionPayRecord.orderId }}
        </a-descriptions-item>
        <a-descriptions-item label="网关订单号">
          {{ unionPayRecord.gatewayOrderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="业务类型">
          <a-tag>{{ dictConvert('UnionPayRecordType', unionPayRecord.type) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="网关时间">
          {{ unionPayRecord.gatewayTime }}
        </a-descriptions-item>
        <a-descriptions-item label="记录时间">
          {{ unionPayRecord.createTime }}
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import { get, UnionPayRecord } from './UnionPayRecord.api'
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
  let unionPayRecord = $ref<UnionPayRecord>({})

  /**
   * 入口
   */
  function init(record: UnionPayRecord) {
    visible.value = true
    unionPayRecord = record
    initData(record.id as string)
  }

  /**
   * 初始化数据
   */
  async function initData(alipayId) {
    loading = true
    const { data } = await get(alipayId)
    loading = false
    unionPayRecord = data
  }

  defineExpose({ init })
</script>

<style scoped lang="less"></style>
