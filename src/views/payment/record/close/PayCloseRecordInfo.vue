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
        <a-descriptions-item label="支付记录id">
          {{ form.paymentId }}
        </a-descriptions-item>
        <a-descriptions-item label="业务号">
          {{ form.businessNo }}
        </a-descriptions-item>
        <a-descriptions-item label="异步支付通道">
          {{ dictConvert('PayChannel', form.asyncChannel) }}
        </a-descriptions-item>
        <a-descriptions-item label="是否关闭成功">
          {{ form.closed ? '是' : '否' }}
        </a-descriptions-item>
        <a-descriptions-item label="错误消息" v-if="form.errorMsg">
          {{ form.errorMsg }}
        </a-descriptions-item>
        <a-descriptions-item label="客户端IP">
          {{ form.clientIp }}
        </a-descriptions-item>
        <a-descriptions-item label="关闭时间">
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
  import { get, PayCloseRecord } from './PayCloseRecord.api'
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
  let form = $ref<PayCloseRecord>({})
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
