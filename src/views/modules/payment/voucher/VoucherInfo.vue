<template>
  <basic-modal
    title="查看"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="false"
    @cancel="handleCancel"
  >
    <a-descriptions bordered title="" :column="{ md: 1, sm: 1, xs: 1 }">
      <a-descriptions-item label="卡号">
        {{ form.cardNo }}
      </a-descriptions-item>
      <a-descriptions-item label="生成批次号">
        {{ form.batchNo }}
      </a-descriptions-item>
      <a-descriptions-item label="面值">
        {{ form.faceValue }}
      </a-descriptions-item>
      <a-descriptions-item label="余额">
        {{ form.balance }}
      </a-descriptions-item>
      <a-descriptions-item label="有效期">
        {{ form.enduring ? '长期' : '期限' }}
      </a-descriptions-item>
      <a-descriptions-item label="开始时间">
        {{ form.startTime }}
      </a-descriptions-item>
      <a-descriptions-item label="结束时间">
        {{ form.endTime }}
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
  import { get, Voucher } from './Voucher.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  const { handleCancel, modalWidth, confirmLoading, visible } = useFormEdit()
  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref<Voucher>({
    id: null,
    cardNo: '',
    batchNo: '',
    faceValue: 0,
    balance: 0,
    enduring: true,
    startTime: '',
    endTime: '',
    status: 0,
  })
  // 入口
  function init(id) {
    confirmLoading.value = true
    visible.value = true
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
