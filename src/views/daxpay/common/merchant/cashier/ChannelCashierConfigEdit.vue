<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :title="title"
    :open="visible"
    :mask-closable="showable"
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
      <a-form-item label="主键" name="id" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item label="收银台类型" validate-first name="cashierType">
        <a-select
          style="width: 300px"
          v-model:value="form.cashierType"
          :disabled="showable"
          :options="cashierTypeList"
          allow-clear
          placeholder="请选择收银台类型"
        />
      </a-form-item>
      <a-form-item label="收银台名称" name="cashierName">
        <a-input
          v-model:value="form.cashierName"
          :disabled="showable"
          placeholder="请输入收银台名称"
        />
      </a-form-item>
      <a-form-item label="支付通道" name="channel">
        <a-select
          style="width: 300px"
          v-model:value="form.channel"
          :disabled="showable"
          :options="channelList"
          allow-clear
          placeholder="请选择支付通道"
        />
      </a-form-item>
      <a-form-item label="支付方式" name="payMethod">
        <a-select
          style="width: 300px"
          v-model:value="form.payMethod"
          :disabled="showable"
          :options="methodList"
          allow-clear
          placeholder="请选择支付方式"
        />
      </a-form-item>
      <a-form-item label="是否开启分账" name="allocation">
        <a-switch
          checked-children="启用"
          un-checked-children="停用"
          v-model:checked="form.allocation"
          :disabled="showable"
        />
      </a-form-item>
      <a-form-item label="自动分账" name="autoAllocation">
        <a-switch
          checked-children="启用"
          un-checked-children="停用"
          v-model:checked="form.autoAllocation"
          :disabled="showable"
        />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="form.remark" :disabled="showable" placeholder="请输入备注" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button
          v-if="!showable"
          key="forward"
          :loading="confirmLoading"
          type="primary"
          @click="handleOk"
          >保存</a-button
        >
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, reactive, ref, unref } from 'vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { BasicModal } from '@/components/Modal'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import {
    get,
    add,
    update,
    existsByType,
    existsByTypeNotId,
    ChannelCashierConfig,
  } from './ChannelCashierConfig.api'
  import { useDict } from '@/hooks/bootx/useDict'
  import { MchApp } from '@/views/daxpay/common/merchant/app/MchApp.api'

  const {
    initFormEditType,
    handleCancel,
    labelCol,
    wrapperCol,
    modalWidth,
    title,
    confirmLoading,
    visible,
    showable,
    formEditType,
  } = useFormEdit()

  const { dictDropDown } = useDict()

  // 表单
  const formRef = ref<FormInstance>()

  const cashierTypeList = ref<LabeledValue[]>([])
  const channelList = ref<LabeledValue[]>([])
  const methodList = ref<LabeledValue[]>([])

  let form = ref<ChannelCashierConfig>({
    allocation: false,
    autoAllocation: false,
  })
  // 校验
  const rules = reactive({
    cashierType: [
      { required: true, message: '请选择收银台类型' },
      { validator: validateCode, trigger: 'blur' },
    ],
    cashierName: [{ required: true, message: '请输入收银台名称' }],
    name: [{ required: true, message: '请输入字典项名称' }],
  } as Record<string, Rule[]>)

  // 事件
  const emits = defineEmits(['ok'])

  onMounted(() => {
    initData()
  })

  /**
   * 初始化数据
   */
  async function initData() {
    cashierTypeList.value = await dictDropDown('cashier_type')
    channelList.value = await dictDropDown('channel')
    methodList.value = await dictDropDown('pay_method')
  }

  /**
   * 入口
   */
  function init(id, editType: FormEditType, mchApp: MchApp) {
    initFormEditType(editType)
    resetForm()
    form.value.appId = unref(mchApp.appId)
    getInfo(id, editType)
  }
  /**
   * 获取信息
   */
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form.value = data
        confirmLoading.value = false
      })
    } else {
      confirmLoading.value = false
    }
  }
  /**
   * 保存
   */
  function handleOk() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(form.value).finally(() => (confirmLoading.value = false))
      } else if (formEditType.value === FormEditType.Edit) {
        await update(form.value).finally(() => (confirmLoading.value = false))
      }
      handleCancel()
      emits('ok')
    })
  }

  /**
   * 校验编码重复
   */
  async function validateCode() {
    const { cashierType, appId, id } = form.value
    if (id) {
      const res = await existsByTypeNotId(appId, cashierType, id)
      return res.data ? Promise.reject('该收银台类型已存在') : Promise.resolve()
    } else {
      const res = await existsByType(appId, cashierType)
      return res.data ? Promise.reject('该收银台类型已存在') : Promise.resolve()
    }
  }

  // 重置表单的校验
  function resetForm() {
    nextTick(() => {
      formRef.value?.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
