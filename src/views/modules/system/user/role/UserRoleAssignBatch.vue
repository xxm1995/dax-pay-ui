<template>
  <basic-modal
    v-bind="$attrs"
    title="用户角色批量分配"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-spin :spinning="confirmLoading">
      <a-row>
        <a-col span="16" offset="5">
          <a-alert style="margin-bottom: 20px" message="注意！会清空用户原有分配的角色" banner closable />
        </a-col>
      </a-row>
      <a-form class="small-from-item" ref="formRef" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
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
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { $ref } from 'vue/macros'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { findAll as roleList } from '/@/views/modules/system/role/Role.api'
  import { dropdownTranslate } from '/@/utils/dataUtil'
  import { nextTick } from 'vue'
  import { addUserRoleBatch } from '/@/views/modules/system/user/UserAssign.api'
  const { createMessage } = useMessage()
  const { initFormEditType, handleCancel, search, labelCol, wrapperCol, modalWidth, confirmLoading, visible } = useFormEdit()

  const formRef = $ref<FormInstance>()
  let roles = $ref<LabeledValue[]>([])

  let form = $ref({
    userIds: [] as string[],
    roleIds: [] as string[],
  })

  async function init(ids) {
    visible.value = true
    confirmLoading.value = true
    await nextTick(() => {
      formRef?.resetFields()
    })
    // 获取角色列表
    await roleList().then(({ data }) => {
      roles = dropdownTranslate(data, 'name', 'id')
    })
    form.userIds = ids
    confirmLoading.value = false
  }

  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      await addUserRoleBatch(form)
      createMessage.success('批量分配角色成功')
      confirmLoading.value = false
      visible.value = false
    })
  }

  defineExpose({ init })
</script>

<style scoped></style>
