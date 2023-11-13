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
      <a-form-item label="敏感词" name="word">
        <a-input v-model:value="form.word" :disabled="showable" placeholder="请输入敏感词" />
      </a-form-item>
      <a-form-item label="分类" name="type">
        <a-input v-model:value="form.type" :disabled="showable" placeholder="请输入分类" />
      </a-form-item>
      <a-form-item label="类型" name="white">
        <a-select v-model:value="form.white" :disabled="showable" placeholder="请选择敏感词类型">
          <a-select-option value="false">黑名单</a-select-option>
          <a-select-option value="true">白名单</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="是否启用" name="enable">
        <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.enable" />
      </a-form-item>
      <a-form-item label="描述" name="description">
        <a-textarea :row="3" v-model:value="form.description" :disabled="showable" placeholder="请输入描述" />
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
  import { add, get, update, ChinaWord } from './ChinaWord.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/src/components/Modal'
  import { databaseTypes } from '/@/views/modules/develop/dynamicsource/DynamicDataSource.api'
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
  let form = $ref<ChinaWord>({
    id: null,
    word: '',
    type: '',
    description: '',
    enable: true,
    white: 'false',
  })
  // 校验
  const rules = reactive({
    word: [{ required: true, message: '请输入敏感词' }],
    enable: [{ required: true, message: '请选择是否启用' }],
    white: [{ required: true, message: '请选择类型' }],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
  }

  /**
   * 获取信息
   */
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

  /**
   * 保存
   */
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

  /**
   * 重置表单
   */
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
