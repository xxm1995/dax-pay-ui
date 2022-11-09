<template>
  <basic-drawer
    showFooter
    title="用户信息修改"
    v-bind="$attrs"
    :width="modalWidth"
    :loading="confirmLoading"
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
        <a-form-item label="关联应用" name="appIdList">
          <a-select
            allowClear
            mode="multiple"
            v-model:value="form.appIdList"
            :filter-option="search"
            :options="clients"
            placeholder="请重新输入登录密码"
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
  import { nextTick, onMounted, reactive } from "vue";
  import { LabeledValue } from "ant-design-vue/lib/select";
  import { findAll as findClients } from "/@/views/modules/system/client/Client.api";
  import { dropdownTranslate } from "/@/utils/dataUtil";
  import { get } from "/@/views/modules/system/user/User.api";

  const { initFormModel, handleCancel, search, labelCol, wrapperCol, modalWidth, title, confirmLoading, visible, formEditType } =
    useFormEdit()
  let clients = $ref<LabeledValue[]>([])


  const formRef = $ref<FormInstance>()
  let form = $ref({
    name: '',
    username: '',
    phone: '',
    email: '',
    appIdList: [],
  })
  // 校验
  const rules = reactive({
    name: [{ required: true, message: '请输入名称' }],
    username: [
      { required: true, message: '请输入账号' },
      { validator: validateUsername, trigger: 'blur' },
    ],
    phone: [
      { validator: validatePhone, trigger: 'blur' },
      { validator: validateBindPhone, trigger: 'blur' },
    ],
    email: [
      { validator: validateEmail, trigger: 'blur' },
      { validator: validateBindEmail, trigger: 'blur' },
    ],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])

  onMounted(() => {
    initData()
  })

  async function initData() {
    findClients().then(({ data }) => {
      clients = dropdownTranslate(data)
    })
  }

  function init(id) {
    visible.value = true
    nextTick(() => {
      formRef.resetFields()
    })
    get(id).then()
  }


</script>

<style scoped></style>
