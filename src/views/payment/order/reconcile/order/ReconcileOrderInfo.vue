<template>
  <basic-modal
    title="对账订单详情"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="750"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-descriptions bordered title="" :column="{ md: 1, sm: 1, xs: 1 }">
      <a-descriptions-item label="日期">
        {{ form.date }}
      </a-descriptions-item>
      <a-descriptions-item label="批次号">
        {{ form.batchNo }}
      </a-descriptions-item>
      <a-descriptions-item label="支付通道">
        <a-tag>{{ dictConvert('PayChannel', form.channel) }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="对账单下载">
        <a-tag v-if="form?.down" color="green">已下载</a-tag>
        <a-tag v-else color="red">未下载</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="对账单比对">
        <a-tag v-if="form?.compare" color="green">已比对</a-tag>
        <a-tag v-else color="red">未比对</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="错误信息">
        {{ form.errorMsg }}
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
  import { get, ReconcileOrder } from './ReconcileOrder.api'
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
  let form = $ref<ReconcileOrder>({})

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
