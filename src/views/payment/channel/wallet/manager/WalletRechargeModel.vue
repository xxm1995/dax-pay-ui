<template>
  <basic-modal
    title="退款申请"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="钱包名称" name="name">
        {{ wallet.name }}
      </a-form-item>
      <a-form-item label="余额(分)" name="balance">
        {{ wallet.balance }}
      </a-form-item>
      <a-form-item label="充值金额(分)" name="amount">
        <a-input-number :min="1" :precision="0" v-model:value="form.amount" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">确定</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { useDict } from '/@/hooks/bootx/useDict'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { nextTick } from 'vue'
  import { get, recharge, Wallet } from './Wallet.api'

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
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  const formRef = $ref<FormInstance>()

  let wallet = $ref<Wallet>({})
  let form = $ref({
    amount: 1,
  })

  const rules = {
    amount: [{ required: true, message: '充值金额不能为空' }],
  } as Record<string, Rule[]>

  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  function init(walletId: string) {
    resetForm()
    visible.value = true
    initData(walletId)
  }

  /**
   * 初始化数据
   */
  async function initData(walletId: string) {
    confirmLoading.value = true
    const { data } = await get(walletId)
    confirmLoading.value = false
    wallet = data
  }

  /**
   * 充值
   */
  function handleOk() {
    formRef?.validate().then(() => {
      createConfirm({
        iconType: 'warning',
        title: '警告',
        content: '确实对钱包进行充值!',
        onOk: async () => {
          confirmLoading.value = true
          const params = {
            ...form,
            walletId: wallet?.id,
          }
          await recharge(params)
          confirmLoading.value = false
          visible.value = false
          emits('ok')
        },
      })
    })
  }

  /**
   * 重置表单
   */
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  defineExpose({ init })
</script>

<style scoped lang="less"></style>
