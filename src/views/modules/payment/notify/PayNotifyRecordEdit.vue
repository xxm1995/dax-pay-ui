<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :title="title"
    :width="modalWidth"
    :visible="visible"
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
        <a-form-item label="主键" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="支付号" name="paymentId">
          <a-input v-model:value="form.paymentId" :disabled="showable" placeholder="请输入支付号" />
        </a-form-item>
        <a-form-item label="通知消息" name="notifyInfo">
          <a-input v-model:value="form.notifyInfo" :disabled="showable" placeholder="请输入通知消息" />
        </a-form-item>
        <a-form-item label="支付通道" name="payChannel">
          <a-input v-model:value="form.payChannel" :disabled="showable" placeholder="请输入支付通道" />
        </a-form-item>
        <a-form-item label="处理状态" name="status">
          <a-input v-model:value="form.status" :disabled="showable" placeholder="请输入处理状态" />
        </a-form-item>
        <a-form-item label="提示信息" name="msg">
          <a-input v-model:value="form.msg" :disabled="showable" placeholder="请输入提示信息" />
        </a-form-item>
        <a-form-item label="回调时间" name="notifyTime">
          <a-input v-model:value="form.notifyTime" :disabled="showable" placeholder="请输入回调时间" />
        </a-form-item>
      </a-form>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { nextTick, reactive } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, get, update, PayNotifyRecord } from './PayNotifyRecord.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
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
  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref<PayNotifyRecord>({
    id: null,
    paymentId: null,
    notifyInfo: null,
    payChannel: null,
    status: null,
    msg: null,
    notifyTime: null,
  })
  // 校验
  const rules = reactive({} as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
  }
  // 获取信息
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
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
      formRef.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
