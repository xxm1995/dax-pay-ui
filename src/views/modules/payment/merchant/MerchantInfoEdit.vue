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
      <a-form-item v-if="editable || showable" label="商户号" name="mchNo">
        <a-input disabled v-model:value="form.mchNo" placeholder="请输入商户号" />
      </a-form-item>
      <a-form-item label="商户名称" name="mchName">
        <a-input v-model:value="form.mchName" :disabled="showable" placeholder="请输入商户名称" />
      </a-form-item>
      <a-form-item label="商户简称" name="mchShortName">
        <a-input v-model:value="form.mchShortName" :disabled="showable" placeholder="请输入商户简称" />
      </a-form-item>
      <a-form-item label="类型" name="type">
        <a-input v-model:value="form.type" :disabled="showable" placeholder="请输入类型" />
      </a-form-item>
      <a-form-item label="联系人姓名" name="contactName">
        <a-input v-model:value="form.contactName" :disabled="showable" placeholder="请输入联系人姓名" />
      </a-form-item>
      <a-form-item label="联系人手机号" name="contactTel">
        <a-input v-model:value="form.contactTel" :disabled="showable" placeholder="请输入联系人手机号" />
      </a-form-item>
      <a-form-item label="是否停用" name="deactivate">
        <a-input v-model:value="form.deactivate" :disabled="showable" placeholder="请输入是否停用" />
      </a-form-item>
      <a-form-item label="商户备注" name="remark">
        <a-input v-model:value="form.remark" :disabled="showable" placeholder="请输入商户备注" />
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
  import { add, get, update, MerchantInfo } from './MerchantInfo.api'
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
  let form = $ref<MerchantInfo>({
    id: null,
    mchNo: '',
    mchName: '',
    mchShortName: '',
    type: '',
    contactName: '',
    contactTel: '',
    deactivate: '',
    remark: '',
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
      formRef?.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
