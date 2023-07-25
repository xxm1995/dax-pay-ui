<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :maskClosable="false"
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
        <a-form-item label="应用编码" v-show="editable || showable" name="code">
          <a-input v-model:value="form.code" disabled />
        </a-form-item>
        <a-form-item label="商户" name="mchCode">
          <a-select allow-clear :options="mchList" :disabled="!addable || mchCode" v-model:value="form.mchCode" placeholder="请选择商户" />
        </a-form-item>
        <a-form-item label="名称" name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="应用状态" name="state">
          <a-select
            placeholder="请选择应用状态"
            style="width: 100%"
            v-model:value="form.state"
            :disabled="showable"
            :options="dictDropDown('MchAndAppCode')"
          />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea :row="3" v-model:value="form.remark" :disabled="showable" placeholder="请输入备注" />
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
  import { add, get, update, MchApplication } from './MchApplication.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicDrawer } from '/@/components/Drawer'
  import { dropdown } from '/@/views/modules/payment/merchant/MerchantInfo.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useDict } from '/@/hooks/bootx/useDict'
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
    addable,
    editable,
    showable,
    formEditType,
  } = useFormEdit()

  const { dictDropDown } = useDict()

  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref<MchApplication>({
    id: null,
    code: undefined,
    name: '',
    mchCode: undefined,
    state: undefined,
    remark: '',
  })
  let mchList = $ref<LabeledValue[]>([])
  let mchCode = $ref<string>()

  // 校验
  const rules = reactive({
    name: [{ required: true, message: '请输入应用名称' }],
    mchCode: [{ required: true, message: '请选择商户' }],
    state: [{ required: true, message: '请选择状态' }],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType, mchCode) {
    initFormEditType(editType)
    resetForm()
    initData(mchCode)
    getInfo(id, editType)
  }
  /**
   * 初始化
   */
  function initData(mchCodeValue) {
    if (mchCodeValue) {
      mchCode = mchCodeValue
      form.mchCode = mchCodeValue
    }
    // 列表
    dropdown().then(({ data }) => {
      mchList = data
    })
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
