<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    :width="modalWidth"
    :title="title"
    :visible="visible"
    :mask-closable="showable"
    @close="handleCancel"
  >
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
        <a-form-item v-if="editable || showable" label="商户号" name="mchNo">
          <a-input disabled v-model:value="form.mchNo" placeholder="请输入商户号" />
        </a-form-item>
        <a-form-item label="商户名称" name="mchName">
          <a-input v-model:value="form.mchName" :disabled="showable" placeholder="请输入商户名称" />
        </a-form-item>
        <a-form-item label="商户简称" name="mchShortName">
          <a-input v-model:value="form.mchShortName" :disabled="showable" placeholder="请输入商户简称" />
        </a-form-item>
        <a-form-item label="联系人姓名" name="contactName">
          <a-input v-model:value="form.contactName" :disabled="showable" placeholder="请输入联系人姓名" />
        </a-form-item>
        <a-form-item label="联系人手机号" name="contactTel">
          <a-input v-model:value="form.contactTel" :disabled="showable" placeholder="请输入联系人手机号" />
        </a-form-item>
        <a-form-item label="商户状态" name="state">
          <a-select
            placeholder="请选择商户状态"
            style="width: 100%"
            v-model:value="form.state"
            :disabled="showable"
            :options="[
              { label: '启用', value: 'enable' },
              { label: '停用', value: 'disable' },
            ]"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="商户备注" name="remark">
          <a-textarea :row="3" v-model:value="form.remark" :disabled="showable" placeholder="请输入商户备注" />
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
  import { nextTick, reactive } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, get, update, MerchantInfo } from './MerchantInfo.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
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
    state: undefined,
    remark: '',
  })
  // 校验
  const rules = reactive({
    mchName: [{ required: true, message: '商户名称不可为空' }],
    mchShortName: [{ required: true, message: '商户简称不可为空' }],
    contactName: [{ required: true, message: '联系人姓名不可为空' }],
    contactTel: [{ required: true, message: '联系人手机号不可为空' }],
    state: [{ required: true, message: '商户状态不可为空' }],
  } as Record<string, Rule[]>)
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
