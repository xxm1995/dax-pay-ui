<template>
  <basic-modal
    v-bind="$attrs"
    title="开通钱包"
    :width="modalWidth"
    :loading="confirmLoading"
    :visible="visible"
    :mask-closable="false"
    @cancel="handleCancel"
  >
    <a-form
      class="small-from-item"
      ref="formRef"
      :model="form"
      :rules="rules"
      :validate-trigger="['blur', 'change']"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="商户号" name="mchCode">
        <a-select allow-clear :options="mchList" v-model:value="form.mchCode" placeholder="请选择商户" @change="mchAppChange" />
      </a-form-item>
      <a-form-item label="应用号" name="mchAppCode" v-show="form.mchCode">
        <a-select allow-clear :options="mchAppList" v-model:value="form.mchAppCode" placeholder="请选择商户应用" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">下一步</a-button>
    </template>
  </basic-modal>
  <b-user-select-modal ref="userSelectModal" multiple :data-source="userPageByNotWallet" @ok="createBatchWallet" />
</template>

<script setup lang="ts">
  import { createWalletBatch, pageByNotWallet, Wallet } from '/@/views/modules/payment/channel/wallet/Wallet.api'
  import BUserSelectModal from '/@/components/Bootx/UserSelectModal/BUserSelectModal.vue'
  import { BasicModal } from '/@/components/Modal'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { $ref } from 'vue/macros'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { dropdown as mchDrop } from '/@/views/modules/payment/merchant/MerchantInfo.api'
  import { dropdown as mchAppDrop } from '/@/views/modules/payment/app/MchApplication.api'
  import { PageResult, Result } from '/#/axios'
  import { nextTick } from 'vue'
  import { useMessage } from '/@/hooks/web/useMessage'

  const { handleCancel, labelCol, wrapperCol, modalWidth, title, confirmLoading, visible, editable, showable, formEditType } = useFormEdit()
  const { createMessage } = useMessage()

  // 商户和应用下拉列表
  let mchList = $ref<LabeledValue[]>()
  let mchAppList = $ref<LabeledValue[]>()

  const userSelectModal = $ref<any>()

  // 表单
  const formRef = $ref<FormInstance>()
  const form = $ref({
    mchCode: undefined,
    mchAppCode: undefined,
  })

  const rules = {
    mchCode: [{ required: true, message: '请选择商户' }],
    mchAppCode: [{ required: true, message: '请选择商户对应的应用' }],
  } as Record<string, Rule[]>

  const emits = defineEmits(['ok'])

  /**
   * 初始化
   */
  function init() {
    visible.value = true
    resetForm()
    // 商户下拉列表
    mchDrop().then(({ data }) => {
      mchList = data
    })
    confirmLoading.value = false
  }

  /**
   * 商户应用下拉列表
   */
  function mchAppChange() {
    mchAppDrop(form.mchCode).then(({ data }) => {
      form.mchAppCode = ''
      mchAppList = data
    })
  }

  /**
   * 待开通的用户列表
   */
  async function userPageByNotWallet(param): Promise<Result<PageResult<Wallet>>> {
    return await pageByNotWallet({ ...param, ...form })
  }

  /**
   * 下一步
   */
  function handleOk() {
    formRef?.validate().then(async () => {
      visible.value = false
      userSelectModal.init()
    })
  }

  /**
   * 获取选中的用户并进行创建
   */
  function createBatchWallet(userIds: string[]) {
    createMessage.success('批量开通钱包中')
    createWalletBatch({ mchCode: form.mchCode, mchAppCode: form.mchAppCode }, userIds)
      .then(() => emits('ok'))
  }

  /**
   * 重置表单
   */
  function resetForm() {
    mchAppList = undefined
    nextTick(() => {
      formRef?.resetFields()
    })
  }

  defineExpose({ init })
</script>

<style scoped lang="less"></style>
