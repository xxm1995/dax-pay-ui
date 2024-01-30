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
        <a-descriptions-item label="本地订单ID">
          {{ form.orderId }}
        </a-descriptions-item>
        <a-descriptions-item label="支付网关订单号">
          {{ form.gatewayOrderNo }}
        </a-descriptions-item>
        <a-descriptions-item label="支付通道">
          <a-tag>{{ dictConvert('PayChannel', form.payChannel) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="支付通道">
          <a-tag>{{ dictConvert('PaymentType', form.callbackType) }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="通知消息">
          <json-preview :data="JSON.parse(form.notifyInfo || '{}')" />
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          {{ dictConvert('PayCallbackStatus', form.status) }}
        </a-descriptions-item>
        <a-descriptions-item label="提示消息" v-if="form.msg">
          {{ form.msg }}
        </a-descriptions-item>
        <a-descriptions-item label="通知时间">
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
  import { get, PayCallbackRecord } from './PayCallbackRecord.api'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  import JsonPreview from '/@/components/CodeEditor/src/json-preview/JsonPreview.vue'
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
  let form = $ref<PayCallbackRecord>({})
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
