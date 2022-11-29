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
        <a-form-item label="支付记录id" name="paymentId">
          <a-input v-model:value="form.paymentId" :disabled="showable" placeholder="请输入支付记录id" />
        </a-form-item>
        <a-form-item label="关联业务id" name="businessId">
          <a-input v-model:value="form.businessId" :disabled="showable" placeholder="请输入关联业务id" />
        </a-form-item>
        <a-form-item label="异步方式关联退款请求号" name="refundRequestNo">
          <a-input v-model:value="form.refundRequestNo" :disabled="showable" placeholder="请输入异步方式关联退款请求号" />
        </a-form-item>
        <a-form-item label="用户id" name="userId">
          <a-input v-model:value="form.userId" :disabled="showable" placeholder="请输入用户id" />
        </a-form-item>
        <a-form-item label="标题" name="title">
          <a-input v-model:value="form.title" :disabled="showable" placeholder="请输入标题" />
        </a-form-item>
        <a-form-item label="金额" name="amount">
          <a-input v-model:value="form.amount" :disabled="showable" placeholder="请输入金额" />
        </a-form-item>
        <a-form-item label="剩余可退款金额" name="refundableBalance">
          <a-input v-model:value="form.refundableBalance" :disabled="showable" placeholder="请输入剩余可退款金额" />
        </a-form-item>
        <a-form-item label="可退款信息" name="refundableInfo">
          <a-input v-model:value="form.refundableInfo" :disabled="showable" placeholder="请输入可退款信息" />
        </a-form-item>
        <a-form-item label="退款状态" name="refundStatus">
          <a-input v-model:value="form.refundStatus" :disabled="showable" placeholder="请输入退款状态" />
        </a-form-item>
        <a-form-item label="支付时间" name="refundTime">
          <a-input v-model:value="form.refundTime" :disabled="showable" placeholder="请输入支付时间" />
        </a-form-item>
        <a-form-item label="客户ip" name="clientIp">
          <a-input v-model:value="form.clientIp" :disabled="showable" placeholder="请输入客户ip" />
        </a-form-item>
        <a-form-item label="错误码" name="errorCode">
          <a-input v-model:value="form.errorCode" :disabled="showable" placeholder="请输入错误码" />
        </a-form-item>
        <a-form-item label="错误信息" name="errorMsg">
          <a-input v-model:value="form.errorMsg" :disabled="showable" placeholder="请输入错误信息" />
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
  import { add, get, update, RefundRecord } from './RefundRecord.api'
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
  let form = $ref<RefundRecord>({
    id: null,
    paymentId: null,
    businessId: null,
    refundRequestNo: null,
    userId: null,
    title: null,
    amount: null,
    refundableBalance: null,
    refundableInfo: null,
    refundStatus: null,
    refundTime: null,
    clientIp: null,
    errorCode: null,
    errorMsg: null,
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
