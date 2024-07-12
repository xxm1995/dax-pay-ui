<template>
  <basic-modal
    :loading="confirmLoading"
    v-bind="$attrs"
    :width="750"
    :title="title"
    :open="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        class="small-from-item"
        :model="form"
        ref="formRef"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="编码" validate-first name="code">
          <a-input
            v-model:value="form.code"
            :disabled="showable || form.internal"
            placeholder="请输入编码"
          />
        </a-form-item>
        <a-form-item label="名称" validate-first name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="系统内置" name="internal" v-if="!addable">
          <a-tag v-if="form.internal" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="form.remark" :disabled="showable" placeholder="请输入描述" />
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
  </basic-modal>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, ref } from 'vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { add, Client, existsByCode, existsByCodeNotId, get, update } from './Client.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { useValidate } from '@/hooks/bootx/useValidate'
  import BasicModal from '@/components/Modal/src/BasicModal.vue'

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
  const { existsByServer } = useValidate()

  const form = ref({
    id: null,
    code: '',
    name: '',
  } as Client)
  // 校验状态
  const rules = reactive({
    code: [
      { required: true, message: '请输入终端编码' },
      { validator: validateCode, trigger: 'blur' },
    ],
    name: [{ required: true, message: '请输入终端名称', trigger: ['blur', 'change'] }],
  } as Record<string, Rule[]>)
  const formRef = ref<FormInstance>()

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
        form.value = data
        confirmLoading.value = false
      })
    } else {
      confirmLoading.value = false
    }
  }
  // 保存
  function handleOk() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(form.value).finally(() => (confirmLoading.value = false))
      } else if (formEditType.value === FormEditType.Edit) {
        await update(form.value).finally(() => (confirmLoading.value = false))
      }
      handleCancel()
      emits('ok')
    })
  }

  // 重置表单的校验
  function resetForm() {
    nextTick(() => {
      formRef.value?.resetFields()
    })
  }

  // 校验编码重复
  async function validateCode() {
    const { code, id } = form.value
    return existsByServer(code, id, formEditType, existsByCode, existsByCodeNotId)
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped>
  .vben-basic-title {
    font-size: 14px;
  }
</style>
