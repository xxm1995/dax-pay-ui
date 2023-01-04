<template>
  <basic-modal
    v-bind="$attrs"
    title="用户角色分配"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-spin :spinning="confirmLoading">
      <a-form class="small-from-item" ref="formRef" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="账号" name="account">
          <a-input :disabled="true" v-model:value="userInfo.username" />
        </a-form-item>
        <a-form-item label="用户名称" name="name">
          <a-input :disabled="true" v-model:value="userInfo.name" />
        </a-form-item>
        <a-form-item label="角色" name="roleIds">
          <a-select
            allowClear
            mode="multiple"
            v-model:value="form.roleIds"
            :options="roles"
            :filter-option="search"
            style="width: 100%"
            placeholder="选择角色"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { useMessage } from '/@/hooks/web/useMessage'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { $ref } from 'vue/macros'
  import { UserInfo } from '/@/views/modules/system/user/User.api'
  import { nextTick } from 'vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { addUserRole, getRoleIds } from '/@/views/modules/system/user/UserAssign.api'
  import { findAll as roleList } from '/@/views/modules/system/role/Role.api'
  import { dropdownTranslate } from '/@/utils/dataUtil'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'

  const { createMessage } = useMessage()
  const { initFormEditType, handleCancel, search, labelCol, wrapperCol, modalWidth, confirmLoading, visible } = useFormEdit()
  let formRef = $ref<FormInstance>()
  let userInfo = $ref<UserInfo>({
    name: '',
    username: '',
  })
  let roles = $ref<LabeledValue[]>([])
  let form = $ref({
    userId: '',
    roleIds: [] as string[],
  })

  async function init(info: UserInfo) {
    userInfo = info
    visible.value = true
    confirmLoading.value = true
    await nextTick(() => {
      formRef?.resetFields()
    })
    form.userId = info.id as string
    // 获取角色列表
    await roleList().then(({ data }) => {
      roles = dropdownTranslate(data, 'name', 'id')
    })

    // 获取角色信息
    await getRoleIds(userInfo.id).then(({ data }) => {
      form.roleIds = data
    })
    confirmLoading.value = false
  }

  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      await addUserRole(form)
      createMessage.success('保存成功')
      confirmLoading.value = false
      visible.value = false
    })
  }
  defineExpose({ init })
</script>

<style scoped></style>
