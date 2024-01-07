<template>
  <basic-drawer showFooter v-bind="$attrs" width="60%" :title="title" :visible="visible" :maskClosable="false" @close="handleCancel">
    <a-spin :spinning="confirmLoading">
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
        <a-form-item label="默认余额" name="defaultBalance">
          <a-input-number :disabled="showable" placeholder="请输入默认余额" v-model:value="form.defaultBalance" />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="form.remark" :disabled="showable" placeholder="请输入备注" />
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { computed, nextTick, reactive } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, get, update, WalletConfig } from './WalletConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicDrawer } from '/@/components/Drawer'
  import { MchAppPayConfigResult } from '/@/views/modules/payment/app/MchApplication.api'
  import { useMessage } from '/@/hooks/web/useMessage'
  const {
    initFormEditType,
    handleCancel,
    search,
    diffForm,
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
  const { createMessage } = useMessage()

  const formRef = $ref<FormInstance>()

  let editType = $ref<FormEditType>()
  let form = $ref({
    defaultBalance: 0,
    remark: '',
  } as WalletConfig)
  // 校验
  const rules = {
    defaultBalance: [{ required: true, message: '请输入默认余额' }],
  } as Record<string, Rule[]>
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(record: MchAppPayConfigResult) {
    editType = record.configId ? FormEditType.Edit : FormEditType.Add
    initFormEditType(editType)
    resetForm()
    form.mchCode = record.mchCode
    form.mchAppCode = record.mchAppCode
    getInfo(record.configId, editType)
  }
  // 获取信息
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form = data
        confirmLoading.value = false
      })
    } else {
      confirmLoading.value = false
    }
  }
  // 保存
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(form)
      } else if (formEditType.value === FormEditType.Edit) {
        await update(form)
      }
      confirmLoading.value = false
      handleCancel()
      emits('ok')
    })
  }

  // 重置表单
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
