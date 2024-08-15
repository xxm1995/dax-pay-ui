<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="50%"
    :title="title"
    :mask-closable="showable"
    :open="visible"
    @close="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        class="small-from-item"
        :model="form"
        ref="formRef"
        :validate-trigger="['blur', 'change']"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="商户号" name="mchNo" v-show="!addable">
          <a-input v-model:value="form.mchNo" disabled />
        </a-form-item>
        <a-form-item label="商户名称" name="mchName">
          <a-input v-model:value="form.mchName" :disabled="showable" placeholder="请输入商户名称" />
        </a-form-item>
        <a-form-item label="公司名称" name="companyName">
          <a-input
            v-model:value="form.companyName"
            :disabled="showable"
            placeholder="请输入公司名称"
          />
        </a-form-item>
        <a-form-item label="公司联系方式" name="companyContact">
          <a-input
            v-model:value="form.companyContact"
            :disabled="showable"
            placeholder="请输入公司联系方式"
          />
        </a-form-item>
        <a-form-item label="公司信用编码" name="companyCode">
          <a-input
            v-model:value="form.companyCode"
            :disabled="showable"
            placeholder="请输入公司信用编码"
          />
        </a-form-item>
        <a-form-item label="公司地址" name="companyAddress">
          <a-textarea
            v-model:value="form.companyAddress"
            :disabled="showable"
            placeholder="请输入公司地址"
          />
        </a-form-item>
        <a-form-item label="法人名称" name="legalPerson">
          <a-input
            v-model:value="form.legalPerson"
            :disabled="showable"
            placeholder="请输入法人名称"
          />
        </a-form-item>
        <a-form-item label="证件号" name="idNo">
          <a-input v-model:value="form.idNo" :disabled="showable" placeholder="请输入证件号" />
        </a-form-item>
        <a-form-item label="联系方式" name="contact">
          <a-input v-model:value="form.contact" :disabled="showable" placeholder="请输入联系方式" />
        </a-form-item>

        <a-form-item label="法人证件号码" name="idNo">
          <a-input
            v-model:value="form.idNo"
            :disabled="showable"
            placeholder="请输入法人证件号码"
          />
        </a-form-item>
      </a-form>
    </a-spin>
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
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, ref, unref } from 'vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { add, get, Merchant, update } from './Merchant.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { BasicDrawer } from '@/components/Drawer'
  import { useDict } from '@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'

  const {
    initFormEditType,
    handleCancel,
    labelCol,
    wrapperCol,
    title,
    confirmLoading,
    visible,
    addable,
    showable,
    formEditType,
  } = useFormEdit()

  // 表单
  const formRef = ref<FormInstance>()
  let form = ref<Merchant>({})

  const { dictDropDown } = useDict()
  const idTypes = ref<LabeledValue[]>([])

  // 校验
  const rules = reactive({
    mchName: [{ required: true, message: '请输入商户名称' }],
    companyName: [{ required: true, message: '请输入公司名称' }],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType) {
    initData()
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
  }

  /**
   * 初始化数据
   */
  function initData() {
    dictDropDown('id_type').then((data) => {
      idTypes.value = data
    })
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
    } else if (editType === FormEditType.Add) {
      confirmLoading.value = false
    }
  }
  // 保存
  function handleOk() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(unref(form)).finally(() => (confirmLoading.value = false))
      } else if (formEditType.value === FormEditType.Edit) {
        await update(unref(form)).finally(() => (confirmLoading.value = false))
      }
      handleCancel()
      emits('ok')
    })
  }

  /**
   * 重置表单的校验
   */
  function resetForm() {
    nextTick(() => formRef.value?.resetFields())
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
