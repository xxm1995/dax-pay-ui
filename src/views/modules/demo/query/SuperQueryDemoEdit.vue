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
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="年龄" name="age">
        <a-input v-model:value="form.age" :disabled="showable" placeholder="请输入年龄" />
      </a-form-item>
      <a-form-item label="是否vip" name="vip">
        <a-input v-model:value="form.vip" :disabled="showable" placeholder="请输入是否vip" />
      </a-form-item>
      <a-form-item label="生日" name="birthday">
        <a-input v-model:value="form.birthday" :disabled="showable" placeholder="请输入生日" />
      </a-form-item>
      <a-form-item label="上班时间" name="workTime">
        <a-input v-model:value="form.workTime" :disabled="showable" placeholder="请输入上班时间" />
      </a-form-item>
      <a-form-item label="注册时间" name="registrationTime">
        <a-input v-model:value="form.registrationTime" :disabled="showable" placeholder="请输入注册时间" />
      </a-form-item>
      <a-form-item label="政治面貌" name="political">
        <a-input v-model:value="form.political" :disabled="showable" placeholder="请输入政治面貌" />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-input v-model:value="form.remark" :disabled="showable" placeholder="请输入备注" />
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
  let form = $ref({
    id: null,
    name: null,
    age: null,
    vip: null,
    birthday: null,
    workTime: null,
    registrationTime: null,
    political: null,
    remark: null,
  } as SuperQuery)
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
