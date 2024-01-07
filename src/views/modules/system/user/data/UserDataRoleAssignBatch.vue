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
      <a-row>
        <a-col span="16" offset="4">
          <a-alert style="margin-bottom: 20px" message="注意！会清空用户原有分配的数据权限" banner closable />
        </a-col>
      </a-row>
      <a-form class="small-from-item" ref="formRef" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="数据权限" name="dataRoleId">
          <a-select
            allowClear
            v-model:value="form.dataRoleId"
            style="width: 100%"
            :default-value="form.dataRoleId"
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
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { $ref } from 'vue/macros'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { nextTick } from 'vue'
  import { findAll as dataRoleList } from '/@/views/modules/system/scope/DataRole.api'
  import { dropdownTranslate } from '/@/utils/dataUtil'
  import { addUserDataScopeBatch } from '/@/views/modules/system/user/UserAssign.api'

  const { createMessage } = useMessage()
  const { initFormEditType, handleCancel, search, labelCol, wrapperCol, modalWidth, confirmLoading, visible } = useFormEdit()
  let formRef = $ref<FormInstance>()
  let dataScopes = $ref<LabeledValue[]>([])
  let form = $ref({
    userIds: [],
    dataRoleId: undefined as undefined | string,
  })
  async function init(ids) {
    visible.value = true
    confirmLoading.value = true
    await nextTick(() => {
      formRef?.resetFields()
    })
    form.userIds = ids
    // 获取数据权限列表
    await dataRoleList().then(({ data }) => {
      dataScopes = dropdownTranslate(data, 'name', 'id')
    })
    confirmLoading.value = false
  }
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      await addUserDataScopeBatch(form)
      createMessage.success('保存成功')
      confirmLoading.value = false
      visible.value = false
    })
  }
  defineExpose({ init })
</script>

<style scoped></style>
