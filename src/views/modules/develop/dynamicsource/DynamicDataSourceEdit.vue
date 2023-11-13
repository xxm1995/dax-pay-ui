<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    title="数据源管理"
    width="40%"
    :destroyOnClose="true"
    :maskClosable="false"
    :visible="visible"
    @close="handleCancel"
  >
    <a-form class="small-from-item" ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="主键" name="id" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item label="编码" name="code">
        <a-input validateFirst v-model:value="form.code" :disabled="showable" placeholder="请输入数据源编码" />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入数据源名称" />
      </a-form-item>
      <a-form-item label="数据库类型" name="databaseType">
        <a-select
          v-model:value="form.databaseType"
          :disabled="showable"
          :options="databaseTypes"
          @change="changeDatabaseType"
          placeholder="请选择数据库类型"
        />
      </a-form-item>
      <a-form-item label="驱动类" name="dbDriver">
        <a-input v-model:value="form.dbDriver" :disabled="showable" placeholder="请输入驱动类" />
      </a-form-item>
      <a-form-item label="地址" name="dbUrl">
        <a-input v-model:value="form.dbUrl" :disabled="showable" placeholder="请输入数据库地址" />
      </a-form-item>
      <a-form-item label="用户名" name="dbUsername">
        <a-input v-model:value="form.dbUsername" :disabled="showable" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="密码" name="dbPassword">
        <a-input-password v-model:value="form.dbPassword" :disabled="showable" placeholder="请输入密码" />
      </a-form-item>
      <a-form-item label="自动加载" name="autoLoad">
        <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.autoLoad" />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea :rows="2" v-model:value="form.remark" :disabled="showable" placeholder="请输入备注" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="addable" preIcon="ant-design:api-outlined" @click="testConnectionInfo">测试连接</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { nextTick, reactive } from 'vue'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import {
    add,
    get,
    update,
    DynamicDataSource,
    testConnection,
    existsByCode,
    existsByCodeNotId,
    databaseTypes,
    databaseTypeMap,
  } from './DynamicDataSource.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useValidate } from '/@/hooks/bootx/useValidate'
  import { $ref } from 'vue/macros'

  const {
    initFormEditType,
    handleCancel,
    search,
    diffForm,
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
  const { createMessage } = useMessage()
  const { existsByServer } = useValidate()

  // 表单
  const formRef = $ref<FormInstance>()

  let form = $ref<DynamicDataSource>({
    id: null,
    code: '',
    name: '',
    databaseType: undefined,
    dbDriver: '',
    dbUrl: '',
    dbUsername: '',
    dbPassword: '',
    autoLoad: true,
    remark: '',
  })
  let rawForm
  // 校验
  const rules = reactive({
    code: [
      { required: true, message: '编码不可为空' },
      { validator: validateCode, trigger: 'blur' },
    ],
    name: [{ required: true, message: '名称不可为空' }],
    databaseType: [{ required: true, message: '请选择数据库类型' }],
    dbDriver: [{ required: true, message: '驱动不可为空' }],
    dbUrl: [{ required: true, message: '数据源地址不可为空' }],
    dbUsername: [{ required: true, message: '用户名不可为空' }],
    dbPassword: [{ required: true, message: '密码不可为空' }],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
  }
  // 编码更新
  function validateCode() {
    const { code, id } = form
    return existsByServer(code, id, formEditType, existsByCode, existsByCodeNotId)
  }
  // 获取信息
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form = data
        rawForm = { ...data }
        confirmLoading.value = false
      })
    } else {
      confirmLoading.value = false
    }
  }
  // 测试连接
  function testConnectionInfo() {
    formRef?.validateFields(['dbDriver', 'dbUrl', 'dbUsername', 'dbPassword']).then(async () => {
      createMessage.info('测试连接中....')
      const { data } = await testConnection(form)
      if (data) {
        createMessage.warn(data)
      } else {
        createMessage.success('连接成功')
      }
    })
  }
  // 数据源类型变换回调
  function changeDatabaseType() {
    const e = form.databaseType as string
    form.dbDriver = databaseTypeMap[e]?.dbDriver
    form.dbUrl = databaseTypeMap[e]?.dbUrl
  }
  // 保存
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(form)
      } else if (formEditType.value === FormEditType.Edit) {
        await update({ ...form, ...diffForm(rawForm, form, 'webhookKey') })
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
