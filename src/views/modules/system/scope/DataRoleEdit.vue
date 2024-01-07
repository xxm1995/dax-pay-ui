<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :title="title"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-form class="small-from-item" ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="主键" name="id" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="编码" name="code">
        <a-input v-model:value="form.code" :disabled="showable" placeholder="请输入编码" />
      </a-form-item>
      <a-form-item label="权限类型" name="type">
        <a-select
          :disabled="showable"
          :options="dataScopeTypes"
          v-model:value="form.type"
          style="width: 100%"
          placeholder="选择管理数据权限类型"
        />
      </a-form-item>
      <a-form-item label="说明" name="remark">
        <a-input v-model:value="form.remark" :disabled="showable" placeholder="请输入说明" />
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
  import { add, get, update, existsByCode, existsByCodeNotId, existsByName, existsByNameNotId, DataRole } from './DataRole.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
  import { useValidate } from '/@/hooks/bootx/useValidate'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useDict } from '/@/hooks/bootx/useDict'

  const { existsByServer } = useValidate()
  const { dictDropDown } = useDict()
  const {
    initFormEditType,
    handleCancel,
    search,
    labelCol,
    wrapperCol,
    title,
    modalWidth,
    confirmLoading,
    visible,
    addable,
    editable,
    showable,
    formEditType,
  } = useFormEdit()
  let dataScopeTypes = $ref<LabeledValue[]>([])
  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref({
    code: '',
    name: '',
    type: undefined,
    remark: '',
  } as DataRole)
  // 校验
  const rules = reactive({
    name: [
      { required: true, message: '请输入数据权限名称' },
      { validator: validateName, trigger: 'blur' },
    ],
    code: [
      { required: true, message: '请输入数据权限编码' },
      { validator: validateCode, trigger: 'blur' },
    ],
    type: [{ required: true, message: '请选择数据权限范围' }],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 入口
   */
  async function init(id, editType: FormEditType) {
    dataScopeTypes = await dictDropDown('DataScopePerm')
    console.log(dataScopeTypes)
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

  // 重置表单的校验
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  async function validateCode() {
    const { code, id } = form
    return existsByServer(code, id, formEditType.value, existsByCode, existsByCodeNotId)
  }
  async function validateName() {
    const { name, id } = form
    return existsByServer(name, id, formEditType.value, existsByName, existsByNameNotId)
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
