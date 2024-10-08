<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :title="title"
    :open="visible"
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
        <a-form-item label="分账组编号" name="groupNo">
          <a-input
            v-model:value="form.groupNo"
            :disabled="!addable"
            placeholder="请输入分账组编号"
          />
        </a-form-item>
        <a-form-item label="所属通道" name="channel">
          <a-select
            style="width: 100%"
            v-model:value="form.channel"
            :disabled="!addable"
            :options="payChannelList"
            placeholder="请选择所属通道"
          />
        </a-form-item>
        <a-form-item label="分账组名称" name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入分账组名称" />
        </a-form-item>
        <a-form-item label="默认分账组" name="defaultGroup" v-if="!addable">
          <a-tag color="green" v-if="form.defaultGroup">是</a-tag>
          <a-tag v-else>否</a-tag>
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea :disabled="showable" placeholder="请输入备注" v-model:value="form.remark" />
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button
          v-if="!showable"
          key="forward"
          :loading="confirmLoading"
          type="primary"
          @click="handleOk"
          >保存</a-button
        >
      </a-space>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { computed, nextTick, ref } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { get, add, update, AllocGroup, existsByNo } from './AllocationGroup.api'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { BasicModal } from '@/components/Modal'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { findChannels } from '../receiver/AllocationReceiver.api'

  const {
    initFormEditType,
    handleCancel,
    labelCol,
    wrapperCol,
    modalWidth,
    title,
    confirmLoading,
    visible,
    addable,
    showable,
    formEditType,
  } = useFormEdit()

  // 表单
  const formRef = ref<FormInstance>()
  let form = ref<AllocGroup>({})
  let payChannelList = ref<LabeledValue[]>([])

  // 校验
  const rules = computed(() => {
    return {
      groupNo: [
        { required: true, message: '请输入分账组编号' },
        { trigger: 'blur', validator: validateCode },
      ],
      channel: [{ required: true, message: '请选择所属通道' }],
    } as Record<string, Rule[]>
  })

  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  function init(record, editType: FormEditType, appId) {
    initFormEditType(editType)
    resetForm()
    initData()
    form.value.appId = appId
    getInfo(record, editType)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    findChannels().then(({ data }) => (payChannelList.value = data))
  }

  /**
   * 获取信息
   */
  async function getInfo(record: AllocGroup, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      await get(record.id).then(({ data }) => (form.value = data))
    }
    confirmLoading.value = false
  }

  /**
   * 保存
   */
  function handleOk() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      try {
        if (formEditType.value === FormEditType.Add) {
          await add(form.value)
        } else if (formEditType.value === FormEditType.Edit) {
          await update(form.value)
        }
        emits('ok')
      } catch (error) {
        confirmLoading.value = false
      }
      handleCancel()
    })
  }

  /**
   * 校验编码重复
   */
  async function validateCode() {
    const { groupNo, appId } = form.value
    const res = await existsByNo(groupNo, appId)
    return res.data ? Promise.reject('该分账组编号已经存在') : Promise.resolve()
  }

  /**
   * 重置表单
   */
  function resetForm() {
    nextTick(() => {
      formRef.value?.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
