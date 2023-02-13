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
        :validate-trigger="['blur', 'change']"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="名称" name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="编码" name="code">
          <a-input v-model:value="form.code" :disabled="showable" placeholder="请输入编码" />
        </a-form-item>
        <a-form-item label="是否启用" name="enable">
          <a-tag color="green" v-if="form.enable">是</a-tag>
          <a-tag color="red" v-else>否</a-tag>
        </a-form-item>
        <a-form-item label="模板ID" name="templateId">
          <a-tag>{{ form.templateId }}</a-tag>
        </a-form-item>
        <a-form-item label="模板标题" name="title">
          <span>{{ form.title }}</span>
        </a-form-item>
        <a-form-item label="所属一级行业" name="primaryIndustry">
          <span>{{ form.primaryIndustry }}</span>
        </a-form-item>
        <a-form-item label="所属二级行业" name="deputyIndustry">
          <span>{{ form.deputyIndustry }}</span>
        </a-form-item>
        <a-form-item label="模板内容" name="content">
          <div class="content">{{ form.content }}</div>
        </a-form-item>
        <a-form-item label="示例" name="example">
          <div class="content">{{ form.example }}</div>
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
  import { add, get, update, existsByCode, existsByCodeNotId, WechatTemplate } from './WechatTemplate.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useValidate } from '/@/hooks/bootx/useValidate'
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
  const { existsByServer } = useValidate()

  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref({
    id: null,
    name: '',
    code: '',
    enable: true,
    templateId: '',
    title: '',
    primaryIndustry: '',
    deputyIndustry: '',
    content: '',
    example: '',
  } as WechatTemplate)
  // 校验
  const rules = reactive({
    name: [{ required: true, message: '请输入微信消息模板名称!' }],
    code: [
      { required: true, message: '请输入微信消息模板编码!' },
      { validator: validateCode, trigger: 'blur' },
    ],
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

  // 重置表单的校验
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  function validateCode() {
    const { code, id } = form
    return existsByServer(code, id, formEditType, existsByCode, existsByCodeNotId)
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped>
  .content {
    border: 1px solid gray;
    padding-left: 10px;
  }
</style>
