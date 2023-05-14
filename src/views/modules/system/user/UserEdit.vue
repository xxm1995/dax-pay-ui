<template>
  <basic-drawer
    showFooter
    title="用户信息修改"
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
        <a-form-item label="关联应用" name="clientIdList">
          <a-select
            allowClear
            mode="multiple"
            v-model:value="form.clientIdList"
            :filter-option="search"
            :options="clients"
            placeholder="请选择关联适用的终端"
          />
        </a-form-item>
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="form.phone" placeholder="请输入用户手机号" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
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
  import { computed, nextTick, onMounted, reactive } from 'vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { findAll as findClients } from '/@/views/modules/system/client/Client.api'
  import { dropdownTranslate } from '/@/utils/dataUtil'
  import { get, update, UserInfo } from './User.api'
  import { existsEmailNotId, existsPhoneNotId, existsUsernameNotId } from '/@/api/sys/userAssist'
  import { validateEmail, validateMobile } from '/@/utils/validate'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useValidate } from '/@/hooks/bootx/useValidate'

  const {
    initFormEditType,
    handleCancel,
    diffForm,
    search,
    labelCol,
    wrapperCol,
    modalWidth,
    title,
    confirmLoading,
    visible,
    formEditType,
  } = useFormEdit()
  const { createMessage } = useMessage()

  const formRef = $ref<FormInstance>()
  let form = $ref<UserInfo>({
    id: null,
    name: '',
    username: '',
    phone: '',
    email: '',
    clientIdList: [],
  })
  let rawForm: any = {}

  let clients = $ref<LabeledValue[]>([])
  // 校验
  const rules = computed(() => {
    return {
      name: [{ required: true, message: '请输入名称' }],
      username: [
        { required: true, message: '请输入账号' },
        { validator: checkUsername, trigger: 'blur' },
      ],
      phone: rawForm.phone !== form.phone ? [{ validator: validatePhone }, { validator: validateBindPhone, trigger: 'blur' }] : [],
      email: rawForm.email !== form.email ? [{ validator: validateEmailRule }, { validator: validateBindEmail, trigger: 'blur' }] : [],
    } as Record<string, Rule[]>
  })
  // 事件
  const emits = defineEmits(['ok'])

  onMounted(() => {
    initData()
  })

  // 初始化终端列表数据
  async function initData() {
    findClients().then(({ data }) => {
      clients = dropdownTranslate(data, 'name', 'id')
    })
  }

  // 入口
  function init(id) {
    visible.value = true
    confirmLoading.value = true
    nextTick(() => {
      formRef?.resetFields()
    })
    get(id).then(({ data }) => {
      rawForm = { ...data }
      form = data
      confirmLoading.value = false
    })
  }

  // 保存
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      await update({ ...form, ...diffForm(rawForm, form, 'username', 'password') })
      createMessage.success('用户更改成功')
      confirmLoading.value = false
      emits('ok')
      handleCancel()
    })
  }

  /**
   * 用户名检查
   */
  async function checkUsername() {
    const { data } = await existsUsernameNotId(form.username, form.id)
    return data ? Promise.reject('用户名已存在!') : Promise.resolve()
  }

  /**
   * 校验邮箱号
   */
  function validateEmailRule() {
    const { email } = form
    if (rawForm.email === email) {
      return Promise.resolve()
    }
    const { msg, result } = validateEmail(email)
    return result ? Promise.resolve() : Promise.reject(msg)
  }
  /**
   * 后台校验邮箱号是否被使用
   */
  async function validateBindEmail() {
    const { email, id } = form
    if (rawForm.email === email) {
      return Promise.resolve()
    }
    const { data } = await existsEmailNotId(email, id)
    return data ? Promise.reject('邮箱已被使用') : Promise.resolve()
  }
  /**
   * 校验手机号
   */
  function validatePhone() {
    const { phone } = form
    // if (rawForm.phone === phone) {
    //   return Promise.resolve()
    // }
    const { msg, result } = validateMobile(phone)
    return result ? Promise.resolve() : Promise.reject(msg)
  }
  /**
   * 后台校验手机号是否被使用
   */
  async function validateBindPhone() {
    const { phone, id } = form
    // if (rawForm.phone === phone) {
    //   return Promise.resolve()
    // }
    const { data } = await existsPhoneNotId(phone, id)
    return data ? Promise.reject('手机号已被使用') : Promise.resolve()
  }
  defineExpose({ init })
</script>

<style scoped></style>
