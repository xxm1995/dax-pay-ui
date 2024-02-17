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
      <a-form-item validate-first label="用户ID" name="userId">
        <a-input v-model:value="form.userId" placeholder="请输入要开通的用户ID" />
      </a-form-item>
      <a-form-item label="钱包名称" name="name">
        <a-input v-model:value="form.name" placeholder="请输入钱包名称" />
      </a-form-item>
      <a-form-item label="余额(分)" name="balance">
        <a-input-number :min="0" :precision="0" v-model:value="form.balance" />
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
  import { create, existsByUserId } from '/@/views/payment/channel/wallet/manager/Wallet.api'

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
  let form = $ref({
    userId: '',
    name: '',
    balance: 0,
  })

  const rules = {
    userId: [
      { required: true, message: '用户ID不能为空' },
      { validator: validateBindPhone, trigger: 'blur' },
    ],
    name: [{ required: true, message: '钱包名称不能为空' }],
    balance: [{ required: true, message: '钱包余额不能为空' }],
  } as Record<string, Rule[]>

  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  async function init() {
    resetForm()
    visible.value = true
  }

  /**
   * 开通钱包
   */
  function handleOk() {
    formRef?.validate().then(() => {
      createConfirm({
        iconType: 'warning',
        title: '警告',
        content: '确实要开通钱包!',
        onOk: async () => {
          confirmLoading.value = true
          await create(form)
          confirmLoading.value = false
          visible.value = false
          emits('ok')
        },
      })
    })
  }

  /**
   * 后台校验手机号是否被使用
   */
  async function validateBindPhone() {
    const { data } = await existsByUserId(form.userId)
    return data ? Promise.reject('该用户已经开通钱包') : Promise.resolve()
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
