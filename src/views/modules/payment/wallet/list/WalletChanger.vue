<template>
  <basic-modal
    v-bind="$attrs"
    title="余额调整"
    :width="640"
    :loading="confirmLoading"
    :mask-closable="showable"
    :visible="visible"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :validate-trigger="['blur', 'change']"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="名称" name="amount">
        <a-input-number
          :precision="2"
          :max="99999999999"
          :min="-99999999999"
          v-model:value="form.amount"
          placeholder="输入正数增加, 负数减少"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">提交</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { $ref } from 'vue/macros'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { nextTick } from 'vue'
  import { changerBalance } from '/@/views/modules/payment/wallet/list/Wallet.api'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'

  const { handleCancel, labelCol, wrapperCol, modalWidth, title, confirmLoading, visible, editable, showable, formEditType } = useFormEdit()
  const { createMessage } = useMessage()

  const formRef = $ref<FormInstance>()
  const form = $ref({
    walletId: null,
    amount: null,
  })

  const rules = $ref<Record<string, Rule[]>>({
    amount: [{ required: true, message: '请输入要调整的金额!' }],
  })

  const emits = defineEmits(['ok'])
  function init(walletId) {
    visible.value = true
    nextTick(() => {
      formRef?.resetFields()
    })
    form.walletId = walletId
    form.amount = null
  }
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      await changerBalance(form)
      confirmLoading.value = false
      visible.value = false
      createMessage.success('余额调整成功')
      emits('ok')
    })
  }
  defineExpose({ init })
</script>

<style scoped></style>
