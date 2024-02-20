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
          {{ wechatPayRecord.title }}
        </a-descriptions-item>
        <a-descriptions-item label="金额(分)">
          {{ wechatPayRecord.amount }}
        </a-descriptions-item>
        <a-descriptions-item label="本地订单号">
          {{ wechatPayRecord.orderId }}
        </a-descriptions-item>
        <a-descriptions-item label="网关订单号">
          {{ wechatPayRecord.gatewayOrderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="业务类型">
          <a-tag>{{ dictConvert('WechatPayRecordType', wechatPayRecord.type) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="记录时间">
          {{ wechatPayRecord.createTime }}
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import { get, WechatPayRecord } from './WechatPayRecord.api'
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
  let wechatPayRecord = $ref<WechatPayRecord>({})

  /**
   * 入口
   */
  function init(record: WechatPayRecord) {
    visible.value = true
    wechatPayRecord = record
    initData(record.id as string)
  }

  /**
   * 初始化数据
   */
  async function initData(wechatPayId) {
    loading = true
    const { data } = await get(wechatPayId)
    loading = false
    wechatPayRecord = data
  }

  defineExpose({ init })
</script>

<style scoped lang="less"></style>
