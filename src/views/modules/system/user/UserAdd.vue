<template>
  <basic-drawer
    showFooter
    title="添加用户"
    v-bind="$attrs"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="false"
    @ok="handleOk"
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
        <a-form-item label="用户账号" name="username">
          <a-input v-model:value="form.username" placeholder="请输入用户账号" />
        </a-form-item>
        <a-form-item label="用户名称" name="name">
          <a-input v-model:value="form.name" placeholder="请输入用户名称" />
        </a-form-item>
        <a-form-item label="登录密码" name="password">
          <strength-meter v-model:value="form.password" placeholder="请输入登录密码" @change="validateToNextPassword" />
        </a-form-item>
        <a-form-item label="确认密码" name="confirmPassword">
          <a-input-password v-model:value="form.confirmPassword" placeholder="请重新输入登录密码" />
        </a-form-item>
        <a-form-item label="关联应用" name="clientIds">
          <a-select
            allowClear
            mode="multiple"
            v-model:value="form.clientIds"
            :default-value="form.clientIds"
            :filter-option="search"
            :options="clients"
            placeholder="请选择关联适用的终端"
          />
        </a-form-item>
        <a-form-item label="手机号" validate-first name="phone">
          <a-input v-model:value="form.phone" placeholder="请输入用户手机号" />
        </a-form-item>
        <a-form-item label="邮箱" validate-first name="email">
          <a-input v-model:value="form.email" placeholder="请输入用户邮箱" />
        </a-form-item>
      </a-form>
    </a-spin>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { $ref } from 'vue/macros'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { nextTick, onMounted, reactive } from 'vue'
  import StrengthMeter from '/@/components/StrengthMeter/src/StrengthMeter.vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { validateEmail, validateMobile } from '/@/utils/validate'
  import { existsEmail, existsPhone, existsUsername } from '/@/api/sys/userAssist'
  import { findAll as findClients } from '/@/views/modules/system/client/Client.api'
  import { dropdownTranslate } from '/@/utils/dataUtil'
  import { add, UserInfo } from './User.api'
  import { useMessage } from '/@/hooks/web/useMessage'

  const { initFormEditType, handleCancel, search, labelCol, wrapperCol, modalWidth, confirmLoading, visible, formEditType } = useFormEdit()
  const { createMessage } = useMessage()
  const formRef = $ref<FormInstance>()
  let form = $ref<UserInfo>({
    name: '',
    username: '',
    phone: '',
    email: '',
    clientIds: [],
    password: '',
    confirmPassword: '',
  })
  // 校验
  const rules = reactive({
    name: [{ required: true, message: '请输入用户名称' }],
    username: [
      { required: true, message: '请输入用户账号' },
      { validator: checkUsername, trigger: 'blur' },
    ],
    password: [{ required: true, message: '请输入登录密码!' }],
    confirmPassword: [{ required: true, message: '请重新输入登录密码!' }, { validator: compareToFirstPassword }],
    phone: [{ validator: validatePhone }, { validator: validateBindPhone, trigger: 'blur' }],
    email: [{ validator: validateEmailRule }, { validator: validateBindEmail, trigger: 'blur' }],
  } as Record<string, Rule[]>)

  let clients = $ref<LabeledValue[]>([])
  let confirmDirty = $ref(false)

  // 事件
  const emits = defineEmits(['ok'])

  onMounted(() => {
    initData()
  })

  async function initData() {
    findClients().then(({ data }) => {
      clients = dropdownTranslate(data, 'name', 'id')
    })
  }

  function init() {
    visible.value = true
    confirmLoading.value = false
    nextTick(() => {
      formRef?.resetFields()
    })
  }

  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      await add(form)
      createMessage.success('添加用户成功')
      confirmLoading.value = false
      emits('ok')
      handleCancel()
    })
  }

  /**
   * 用户名检查
   */
  async function checkUsername() {
    const { data } = await existsUsername(form.username)
    return data ? Promise.reject('用户名已存在!') : Promise.resolve()
  }
  /**
   * 密码检查
   */
  function validateToNextPassword() {
    if (confirmDirty) {
      formRef?.validateFields(['confirmPassword'])
    }
  }
  function compareToFirstPassword() {
    if (form.confirmPassword !== form.password) {
      confirmDirty = true
      return Promise.reject('密码不一致')
    } else {
      return Promise.resolve()
    }
  }

  /**
   * 校验邮箱号
   */
  function validateEmailRule() {
    const { email } = form
    if (!email) {
      return Promise.resolve()
    }
    const { msg, result } = validateEmail(email)
    return result ? Promise.resolve() : Promise.reject(msg)
  }
  /**
   * 后台校验邮箱号是否被使用
   */
  async function validateBindEmail() {
    const { email } = form
    const { data } = await existsEmail(email)
    return data ? Promise.reject('邮箱已被使用') : Promise.resolve()
  }
  /**
   * 校验手机号
   */
  function validatePhone() {
    const { phone } = form
    if (!phone) {
      return Promise.resolve()
    }
    const { msg, result } = validateMobile(phone)
    return result ? Promise.resolve() : Promise.reject(msg)
  }
  /**
   * 后台校验手机号是否被使用
   */
  async function validateBindPhone() {
    const { phone } = form
    const { data } = await existsPhone(phone)
    return data ? Promise.reject('手机号已被使用') : Promise.resolve()
  }
  defineExpose({ init })
</script>

<style scoped></style>
