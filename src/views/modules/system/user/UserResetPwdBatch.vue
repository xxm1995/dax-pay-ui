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
      <a-form
        class="small-from-item"
        ref="formRef"
        :model="form"
        :rules="rules"
        :validate-trigger="['blur', 'change']"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item name="newPassword" label="重置密码">
          <a-input-password v-model:value="form.newPassword" placeholder="请输入密码" />
        </a-form-item>
      </a-form>
    </a-spin>
  </basic-modal>
</template>

<script setup lang="ts">
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { $ref } from 'vue/macros'
  import { Rule } from 'ant-design-vue/lib/form'
  import { restartPasswordBatch } from './User.api'

  const { initFormEditType, handleCancel, search, labelCol, wrapperCol, modalWidth, confirmLoading, visible } = useFormEdit()
  const { createConfirm, createMessage } = useMessage()
  let formRef = $ref<any>()

  let form = $ref<any>({
    newPassword: '',
  })
  let userIds = $ref<string[]>()

  const rules = {
    newPassword: [{ required: true, message: '重置密码不得为空' }],
  } as Record<string, Rule[]>

  /**
   * 初始化
   */
  function init(ids) {
    userIds = ids
    visible.value = true
  }

  function handleOk() {
    formRef?.validate().then(async () => {
      createConfirm({
        iconType: 'info',
        title: '警告',
        content: '是否重置选中用户的密码',
        onOk: () => {
          confirmLoading.value = true
          restartPasswordBatch(userIds, form.newPassword).then(() => {
            createMessage.success('密码重置成功')
            confirmLoading.value = true
            visible.value = false
          })
        },
      })
    })
  }
  defineExpose({ init })
</script>

<style scoped lang="less"></style>
