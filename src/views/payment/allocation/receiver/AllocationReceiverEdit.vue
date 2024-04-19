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
        :rules="rules"
        :validate-trigger="['blur', 'change']"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="账号别名" name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入账号别名" />
        </a-form-item>
        <a-form-item label="所属通道" name="channel">
          <a-select
            style="width: 100%"
            v-model:value="form.channel"
            :disabled="!addable"
            :options="payChannelList"
            placeholder="请选择所属通道"
            @change="channelChange"
          />
        </a-form-item>
        <a-form-item v-if="form.channel" label="接收方类型" name="receiverType">
          <a-select
            style="width: 100%"
            v-model:value="form.receiverType"
            :disabled="showable || form.sync"
            :options="receiverTypeList"
            placeholder="请选择接收方类型"
          />
        </a-form-item>
        <a-form-item label="接收方账号" name="receiverAccount">
          <a-input v-model:value="form.receiverAccount" :disabled="showable || form.sync" placeholder="请输入接收方账号" />
        </a-form-item>
        <a-form-item label="接收方姓名" name="receiverName">
          <a-input v-model:value="form.receiverName" :disabled="showable || form.sync" placeholder="请输入接收方姓名" />
        </a-form-item>
        <a-form-item label="分账关系类型" name="relationType">
          <a-select
            style="width: 100%"
            v-model:value="form.relationType"
            :disabled="showable || form.sync"
            :options="relationTypeList"
            placeholder="请选择分账关系类型"
          />
        </a-form-item>
        <a-form-item v-if="form.relationType === 'CUSTOM'" label="接收者关系名称" name="relationName">
          <a-input v-model:value="form.relationName" :disabled="showable || form.sync" placeholder="请输入接收者关系名称" />
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
  import { useValidate } from '/@/hooks/bootx/useValidate'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { computed, nextTick } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { add, get, AllocationReceiver, update, findChannels, findReceiverTypeByChannel } from './AllocationReceiver.api'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'

  const {
    initFormEditType,
    handleCancel,
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
  const { existsByServer } = useValidate()
  const { createMessage } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref<AllocationReceiver>({})
  let rawForm = $ref<AllocationReceiver>({})
  let payChannelList = $ref<LabeledValue[]>([])
  let receiverTypeList = $ref<LabeledValue[]>([])
  let relationTypeList = $ref<LabeledValue[]>([])

  // 校验
  const rules = computed(() => {
    return {
      name: [{ required: true, message: '请输入账号别名' }],
      channel: [{ required: true, message: '请选择所属通道' }],
      receiverType: [{ required: true, message: '请选择分账接收方类型' }],
      receiverAccount: [{ required: true, message: '请输入接收方账号' }],
      relationType: [{ required: true, message: '请选择分账关系类型' }],
      relationName: [{ required: form.relationType === 'CUSTOM', message: '请输入类型关系名称' }],
    } as Record<string, Rule[]>
  })

  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  function init(record, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    initData()
    getInfo(record, editType)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    findChannels().then(({ data }) => (payChannelList = data))
    relationTypeList = await dictDropDown('AllocationRelationType')
  }

  /**
   * 获取信息
   */
  async function getInfo(record, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      await get(record.id).then(({ data }) => {
        form = data
        rawForm = { ...form }
      })
      confirmLoading.value = false
      findReceiverTypeByChannel(form.channel).then(({ data }) => (receiverTypeList = data))
    } else {
      confirmLoading.value = false
    }
  }

  /**
   * 通道变动
   */
  function channelChange() {
    findReceiverTypeByChannel(form.channel).then(({ data }) => (receiverTypeList = data))
    form.receiverType = undefined
  }

  /**
   * 保存
   */
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      try {
        if (formEditType.value === FormEditType.Add) {
          await add(form)
        } else if (formEditType.value === FormEditType.Edit) {
          await update({ ...form, ...diffForm(rawForm, form, 'receiverAccount', 'receiverName') })
        }
      } finally {
        confirmLoading.value = false
      }
      emits('ok')
      handleCancel()
    })
  }

  /**
   * 重置表单
   */
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
