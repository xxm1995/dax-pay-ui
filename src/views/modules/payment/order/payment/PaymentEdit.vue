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
        <a-form-item label="用户id" name="userId">
          <a-input v-model:value="form.userId" :disabled="showable" placeholder="请输入用户id" />
        </a-form-item>
        <a-form-item label="业务id" name="businessId">
          <a-input v-model:value="form.businessId" :disabled="showable" placeholder="请输入业务id" />
        </a-form-item>
        <a-form-item label="标题" name="title">
          <a-input v-model:value="form.title" :disabled="showable" placeholder="请输入标题" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-input v-model:value="form.description" :disabled="showable" placeholder="请输入描述" />
        </a-form-item>
        <a-form-item label="金额" name="amount">
          <a-input v-model:value="form.amount" :disabled="showable" placeholder="请输入金额" />
        </a-form-item>
        <a-form-item label="可退款余额" name="refundableBalance">
          <a-input v-model:value="form.refundableBalance" :disabled="showable" placeholder="请输入可退款余额" />
        </a-form-item>
        <a-form-item label="支付状态" name="payStatus">
          <a-input v-model:value="form.payStatus" :disabled="showable" placeholder="请输入支付状态" />
        </a-form-item>
        <a-form-item label="错误码" name="errorCode">
          <a-input v-model:value="form.errorCode" :disabled="showable" placeholder="请输入错误码" />
        </a-form-item>
        <a-form-item label="错误信息" name="errorMsg">
          <a-input v-model:value="form.errorMsg" :disabled="showable" placeholder="请输入错误信息" />
        </a-form-item>
        <a-form-item label="支付信息" name="payTypeInfo">
          <a-input v-model:value="form.payTypeInfo" :disabled="showable" placeholder="请输入支付信息" />
        </a-form-item>
        <a-form-item label="是否是异步支付" name="asyncPayMode">
          <a-input v-model:value="form.asyncPayMode" :disabled="showable" placeholder="请输入是否是异步支付" />
        </a-form-item>
        <a-form-item label="异步支付方式" name="asyncPayChannel">
          <a-input v-model:value="form.asyncPayChannel" :disabled="showable" placeholder="请输入异步支付方式" />
        </a-form-item>
        <a-form-item label="支付通道信息列表" name="payChannelInfo">
          <a-input v-model:value="form.payChannelInfo" :disabled="showable" placeholder="请输入支付通道信息列表" />
        </a-form-item>
        <a-form-item label="可退款信息" name="refundableInfo">
          <a-input v-model:value="form.refundableInfo" :disabled="showable" placeholder="请输入可退款信息" />
        </a-form-item>
        <a-form-item label="支付时间" name="payTime">
          <a-input v-model:value="form.payTime" :disabled="showable" placeholder="请输入支付时间" />
        </a-form-item>
        <a-form-item label="过期时间" name="expiredTime">
          <a-input v-model:value="form.expiredTime" :disabled="showable" placeholder="请输入过期时间" />
        </a-form-item>
        <a-form-item label="客户ip" name="clientIp">
          <a-input v-model:value="form.clientIp" :disabled="showable" placeholder="请输入客户ip" />
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
  import { add, get, update, Payment } from './Payment.api'
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
  let form = $ref<Payment>({
    id: null,
    userId: null,
    businessId: null,
    title: null,
    description: null,
    amount: null,
    refundableBalance: null,
    payStatus: null,
    errorCode: null,
    errorMsg: null,
    payTypeInfo: null,
    asyncPayMode: null,
    asyncPayChannel: null,
    payChannelInfo: null,
    refundableInfo: null,
    payTime: null,
    expiredTime: null,
    clientIp: null,
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
