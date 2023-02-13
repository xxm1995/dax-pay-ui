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
      <a-form-item label="主键" name="id" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="年龄" name="age">
        <a-input-number v-model:value="form.age" :disabled="showable" :precision="0" />
      </a-form-item>
      <a-form-item label="是否vip" name="vip">
        <a-switch :disabled="showable" checkedChildren="是" unCheckedChildren="否" v-model:checked="form.vip" />
      </a-form-item>
      <a-form-item label="生日" name="birthday">
        <a-date-picker placeholder="请选择日期" valueFormat="YYYY-MM-DD" :disabled="showable" v-model:value="form.birthday" />
      </a-form-item>
      <a-form-item label="上班时间" name="workTime">
        <a-time-picker placeholder="请选择时间" valueFormat="HH:mm:ss" :disabled="showable" v-model:value="form.workTime" />
      </a-form-item>
      <a-form-item label="政治面貌" name="political">
        <a-select v-model:value="form.political" :disabled="showable" :options="politicalList" placeholder="请选择政治面貌" />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="form.remark" :disabled="showable" placeholder="请输入备注" />
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
  import { add, get, update, SuperQuery } from './SuperQueryDemo.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
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
    editable,
    showable,
    formEditType,
  } = useFormEdit()

  const { dictDropDownNumber } = useDict()
  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref<SuperQuery>({
    id: null,
    name: '',
    age: 18,
    vip: true,
    birthday: '',
    workTime: '',
    registrationTime: '',
    political: 13,
    remark: '',
  })
  // 校验
  const rules = reactive({
    name: [{ required: true, message: '请输入名称' }],
    age: [{ required: true, message: '请输入年龄' }],
    vip: [{ required: true, message: '请选择是否vip' }],
    birthday: [{ required: true, message: '请选择出生日期' }],
    workTime: [{ required: true, message: '请选择工作时间' }],
    political: [{ required: true, message: '请选择政治面貌' }],
  } as Record<string, Rule[]>)

  const politicalList = $ref(dictDropDownNumber('Political'))

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
