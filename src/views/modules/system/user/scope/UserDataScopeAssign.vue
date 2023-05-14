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
        <a-form-item label="数据权限" name="dataScopeId">
          <a-select
            allowClear
            v-model:value="form.dataScopeId"
            style="width: 100%"
            :default-value="form.dataScopeId"
            :filter-option="search"
            :options="dataScopes"
            placeholder="选择数据权限"
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
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { UserInfo } from '/@/views/modules/system/user/User.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { nextTick } from 'vue'
  import { dropdownTranslate } from '/@/utils/dataUtil'
  import { addUserRole, getDataScopeIdByUser } from '/@/views/modules/system/user/UserAssign.api'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { findAll as dataScopeList } from '/@/views/modules/system/scope/DataScope.api'

  const { createMessage } = useMessage()
  const { initFormEditType, handleCancel, search, labelCol, wrapperCol, modalWidth, confirmLoading, visible } = useFormEdit()
  let formRef = $ref<FormInstance>()
  let userInfo = $ref<UserInfo>({
    name: '',
    username: '',
  })
  let dataScopes = $ref<LabeledValue[]>([])
  let form = $ref({
    userId: '',
    dataScopeId: undefined as undefined | string,
  })

  async function init(info: UserInfo) {
    userInfo = info
    visible.value = true
    confirmLoading.value = true
    await nextTick(() => {
      formRef?.resetFields()
    })
    form.userId = info.id as string
    // 获取数据权限列表
    await dataScopeList().then(({ data }) => {
      dataScopes = dropdownTranslate(data, 'name', 'id')
    })

    // 获取关联权限信息
    await getDataScopeIdByUser(userInfo.id).then(({ data }) => {
      form.dataScopeId = data || undefined
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
