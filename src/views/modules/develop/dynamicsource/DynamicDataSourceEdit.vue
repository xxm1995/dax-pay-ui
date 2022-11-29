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
      <a-form-item label="主键" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item label="数据源编码" name="code">
        <a-input v-model:value="form.code" :disabled="showable" placeholder="请输入数据源编码" />
      </a-form-item>
      <a-form-item label="数据源名称" name="name">
        <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入数据源名称" />
      </a-form-item>
      <a-form-item label="数据库类型" name="databaseType">
        <a-input v-model:value="form.databaseType" :disabled="showable" placeholder="请输入数据库类型" />
      </a-form-item>
      <a-form-item label="驱动类" name="dbDriver">
        <a-input v-model:value="form.dbDriver" :disabled="showable" placeholder="请输入驱动类" />
      </a-form-item>
      <a-form-item label="数据库地址" name="dbUrl">
        <a-input v-model:value="form.dbUrl" :disabled="showable" placeholder="请输入数据库地址" />
      </a-form-item>
      <a-form-item label="数据库名称" name="dbName">
        <a-input v-model:value="form.dbName" :disabled="showable" placeholder="请输入数据库名称" />
      </a-form-item>
      <a-form-item label="用户名" name="dbUsername">
        <a-input v-model:value="form.dbUsername" :disabled="showable" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="密码" name="dbPassword">
        <a-input v-model:value="form.dbPassword" :disabled="showable" placeholder="请输入密码" />
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
  import { add, get, update, DynamicDataSource } from './DynamicDataSource.api'
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
    code: null,
    name: null,
    databaseType: null,
    dbDriver: null,
    dbUrl: null,
    dbName: null,
    dbUsername: null,
    dbPassword: null,
    remark: null,
  } as DynamicDataSource)
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

  // 重置表单的校验
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
