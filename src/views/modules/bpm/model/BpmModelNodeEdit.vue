<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-form
      class="small-from-item"
      ref="formRef"
      :model="form"
      :rules="rules"
      :validate-trigger="['blur', 'change']"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="主键" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item label="关联模型id" name="modelId">
        <a-input v-model:value="form.modelId" :disabled="showable" placeholder="请输入关联模型id" />
      </a-form-item>
      <a-form-item label="流程定义id" name="defId">
        <a-input v-model:value="form.defId" :disabled="showable" placeholder="请输入流程定义id" />
      </a-form-item>
      <a-form-item label="流程key" name="defKey">
        <a-input v-model:value="form.defKey" :disabled="showable" placeholder="请输入流程key" />
      </a-form-item>
      <a-form-item label="任务节点id" name="nodeId">
        <a-input v-model:value="form.nodeId" :disabled="showable" placeholder="请输入任务节点id" />
      </a-form-item>
      <a-form-item label="任务节点名称" name="nodeName">
        <a-input v-model:value="form.nodeName" :disabled="showable" placeholder="请输入任务节点名称" />
      </a-form-item>
      <a-form-item label="是否多任务" name="multi">
        <a-input v-model:value="form.multi" :disabled="showable" placeholder="请输入是否多任务" />
      </a-form-item>
      <a-form-item label="是否串签" name="sequential">
        <a-input v-model:value="form.sequential" :disabled="showable" placeholder="请输入是否串签" />
      </a-form-item>
      <a-form-item label="是否是或签" name="orSign">
        <a-input v-model:value="form.orSign" :disabled="showable" placeholder="请输入是否是或签" />
      </a-form-item>
      <a-form-item label="是否比例通过" name="ratioPass">
        <a-input v-model:value="form.ratioPass" :disabled="showable" placeholder="请输入是否比例通过" />
      </a-form-item>
      <a-form-item label="通过比例" name="passRatio">
        <a-input v-model:value="form.passRatio" :disabled="showable" placeholder="请输入通过比例" />
      </a-form-item>
      <a-form-item label="是否允许驳回" name="reject">
        <a-input v-model:value="form.reject" :disabled="showable" placeholder="请输入是否允许驳回" />
      </a-form-item>
      <a-form-item label="是否允许回退" name="back">
        <a-input v-model:value="form.back" :disabled="showable" placeholder="请输入是否允许回退" />
      </a-form-item>
      <a-form-item label="是否允许取回" name="retrieve">
        <a-input v-model:value="form.retrieve" :disabled="showable" placeholder="请输入是否允许取回" />
      </a-form-item>
      <a-form-item label="是否跳过当前节点" name="skip">
        <a-input v-model:value="form.skip" :disabled="showable" placeholder="请输入是否跳过当前节点" />
      </a-form-item>
      <a-form-item label="关联表单" name="formId">
        <a-input v-model:value="form.formId" :disabled="showable" placeholder="请输入关联表单" />
      </a-form-item>
      <a-form-item label="分配类型" name="assignType">
        <a-input v-model:value="form.assignType" :disabled="showable" placeholder="请输入分配类型" />
      </a-form-item>
      <a-form-item label="分配的原始数据" name="assignRaw">
        <a-input v-model:value="form.assignRaw" :disabled="showable" placeholder="请输入分配的原始数据" />
      </a-form-item>
      <a-form-item label="分配的数据的展示" name="assignShow">
        <a-input v-model:value="form.assignShow" :disabled="showable" placeholder="请输入分配的数据的展示" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { nextTick, reactive } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, get, update, BpmModelNode } from './ModelNode.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
  const {
    initFormEditType,
    handleCancel,
    search,
    labelCol,
    wrapperCol,
    modalWidth,
    title,
    confirmLoading,
    visible,
    editable,
    showable,
    formEditType,
  } = useFormEdit()
  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref({
    id: null,
    modelId: null,
    defId: null,
    defKey: null,
    nodeId: null,
    nodeName: null,
    multi: null,
    sequential: null,
    orSign: null,
    ratioPass: null,
    passRatio: null,
    reject: null,
    back: null,
    retrieve: null,
    skip: null,
    formId: null,
    assignType: null,
    assignRaw: null,
    assignShow: null,
  } as BpmModelNode)
  // 校验
  const rules = reactive({} as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
  }
  // 获取信息
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form = data
        confirmLoading.value = false
      })
    } else {
      confirmLoading.value = false
    }
  }
  // 保存
  function handleOk() {
    formRef.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(form)
      } else if (formEditType.value === FormEditType.Edit) {
        await update(form)
      }
      confirmLoading.value = false
      handleCancel()
      emits('ok')
    })
  }

  // 重置表单
  function resetForm() {
    nextTick(() => {
      formRef.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
