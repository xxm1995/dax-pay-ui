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
    <a-spin :spinning="confirmLoading">
      <a-form
        class="small-from-item"
        ref="formRef"
        :model="form"
        :validate-trigger="['blur', 'change']"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="通道编码" name="code">
          <span>{{ form.code }}</span>
        </a-form-item>
        <a-form-item label="通道名称" name="name">
          <span>{{ form.name }}</span>
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea :disabled="showable" placeholder="请输入备注" v-model:value="form.remark" />
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { nextTick } from 'vue'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { get, PayChannelConfig, update } from './ChannelConfig.api'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'

  const {
    initFormEditType,
    handleCancel,
    labelCol,
    wrapperCol,
    modalWidth,
    title,
    confirmLoading,
    visible,
    showable,
  } = useFormEdit()
  const { createMessage } = useMessage()

  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref<PayChannelConfig>({
    code: '',
    name: '',
  })

  const emits = defineEmits(['ok'])

  // 入口
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    getInfo(id)
  }

  // 获取信息
  function getInfo(id) {
    confirmLoading.value = true
    get(id).then(({ data }) => {
      form = data
      confirmLoading.value = false
    })
  }
  // 保存
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      await update(form)
      confirmLoading.value = false
      emits('ok')
      handleCancel()
    })
  }

  // 重置表单
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
