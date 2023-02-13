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
      <a-form-item label="编号" name="code">
        <a-input v-model:value="form.code" :disabled="showable" placeholder="请输入编号" />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="邮件服务器地址" name="host">
        <a-input v-model:value="form.host" :disabled="showable" placeholder="请输入邮件服务器地址" />
      </a-form-item>
      <a-form-item label="端口" name="port">
        <a-input-number :min="0" :precision="0" :max="65535" :step="1" v-model:value="form.port" :disabled="showable" placeholder="端口" />
      </a-form-item>
      <a-form-item label="发送人账号" name="username">
        <a-input v-model:value="form.username" :disabled="showable" placeholder="请输入发送人账号" />
      </a-form-item>
      <a-form-item label="发送人密码" name="password">
        <a-input v-model:value="form.password" :disabled="showable" :placeholder="addable ? '请输入密码' : '为空不修改密码'" />
      </a-form-item>
      <a-form-item label="发送人sender" name="sender">
        <a-input v-model:value="form.sender" :disabled="showable" placeholder="请输入邮箱服务器 sender">
          <template #suffix>
            <a-tooltip title="发送时发送人的名称"><Icon icon="ant-design:question-circle-outlined" /></a-tooltip>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="邮箱from" name="from">
        <a-input v-model:value="form.from" :disabled="showable" placeholder="请输入邮箱from">
          <template #suffix>
            <a-tooltip title="发送时发送人邮箱账号"><Icon icon="ant-design:question-circle-outlined" /></a-tooltip>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="安全传输方式" name="securityType">
        <a-select
          :disabled="showable"
          allowClear
          :options="securityTypes"
          v-model:value="form.securityType"
          style="width: 100%"
          placeholder="选择安全方式"
        />
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
  import { computed, nextTick, reactive } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, get, update, MailConfig, existsByCode, existsByCodeNotId } from './MailConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useValidate } from '/@/hooks/bootx/useValidate'

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
  const { dictDropDownNumber } = useDict()
  const { existsByServer } = useValidate()
  // 表单
  const formRef = $ref<FormInstance>()
  let rawForm
  let form = $ref<MailConfig>({
    id: null,
    code: '',
    name: '',
    host: '',
    port: 465,
    username: '',
    password: '',
    sender: '',
    from: '',
    activity: 0,
    securityType: 1,
  })

  let securityTypes = $ref<LabeledValue[]>()
  // 校验
  const rules = reactive({
    code: [
      { required: true, message: '请输入配置编码' },
      { validator: validateCode, trigger: 'blur' },
    ],
    name: [{ required: true, message: '请输入配置名称' }],
    host: [{ required: true, message: '请输入邮件服务器地址' }],
    port: [{ required: true, message: '请输入邮件服务器端口' }],
    username: [{ required: true, message: '请输入邮件发送人账号' }],
    password: [{ required: true, message: '请输入邮件发送人密码' }],
    sender: [{ required: true, message: '请输入邮件发送人Sender' }],
    from: [
      { required: true, message: '请输入邮件From信息' },
      { type: 'email', message: '邮件格式不正确' },
    ],
    securityType: [{ required: true, message: '请选择安全方式' }],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType) {
    initData()
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
  }
  // 初始化基础数据
  function initData() {
    securityTypes = dictDropDownNumber('MailSecurityCode')
  }
  // 获取信息
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        rawForm = { ...data }
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
        await update({ ...form, ...diffForm(rawForm, form, 'phone', 'email') })
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

<style lang="less" scoped></style>
