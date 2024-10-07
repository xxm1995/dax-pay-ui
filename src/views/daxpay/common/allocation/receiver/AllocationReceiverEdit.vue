<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="900"
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
        <a-form-item label="接收方编号" validate-first name="receiverNo">
          <a-input v-model:value="form.receiverNo" :disabled="!addable" placeholder="请输入接收方编号" />
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
            :disabled="!addable"
            :options="receiverTypeList"
            placeholder="请选择接收方类型"
          />
        </a-form-item>
        <a-form-item label="接收方账号" name="receiverAccount">
          <a-input v-model:value="form.receiverAccount" :disabled="!addable" placeholder="请输入接收方账号">
            <template v-if="['open_id'].includes(form.receiverType as string) && addable" #suffix>
              <icon icon="ant-design:qrcode-outlined" @click="showQrCode" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="接收方姓名" name="receiverName">
          <a-input v-model:value="form.receiverName" :disabled="!addable" placeholder="请输入接收方姓名" />
        </a-form-item>
        <a-form-item label="分账关系类型" name="relationType">
          <a-select
            style="width: 100%"
            v-model:value="form.relationType"
            :disabled="!addable"
            :options="relationTypeList"
            placeholder="请选择分账关系类型"
          />
        </a-form-item>
        <a-form-item v-if="form.relationType === 'CUSTOM'" label="接收者关系名称" name="relationName">
          <a-input v-model:value="form.relationName" :disabled="!addable" placeholder="请输入接收者关系名称" />
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
    <open-id-qr-code ref="openIdQrCode"  @close="pauseFun" />
  </basic-modal>
</template>

<script setup lang="ts">
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { useMessage } from '@/hooks/web/useMessage'
  import {computed, nextTick, ref} from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { add, get, AllocReceiver, update, findChannels, findReceiverTypeByChannel, existsByNo } from './AllocationReceiver.api'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { BasicModal } from '@/components/Modal'
  import { useDict } from '@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { Icon } from '@/components/Icon'
  import OpenIdQrCode from './OpenIdQrCode.vue'

  const {
    initFormEditType,
    handleCancel,
    diffForm,
    labelCol,
    wrapperCol,
    title,
    confirmLoading,
    visible,
    addable,
    showable,
    formEditType,
  } = useFormEdit()
  const { createMessage } = useMessage()
  const { dictDropDown } = useDict()

  let pauseFun = () => {}
  // 表单
  const formRef = ref<FormInstance>()
  const form = ref<AllocReceiver>({})
  const rawForm = ref<AllocReceiver>({})
  const payChannelList = ref<LabeledValue[]>([])
  const receiverTypeList = ref<LabeledValue[]>([])
  const relationTypeList = ref<LabeledValue[]>([])

  const openIdQrCode = ref<any>()

  // 校验
  const rules = computed(() => {
    return {
      receiverNo: [
        { required: true, message: '请输入账号编号' },
        { trigger: 'blur', validator: validateCode },
      ],
      channel: [{ required: true, message: '请选择所属通道' }],
      receiverType: [{ required: true, message: '请选择分账接收方类型' }],
      receiverAccount: [{ required: true, message: '请输入接收方账号' }],
      relationType: [{ required: true, message: '请选择分账关系类型' }],
      relationName: [{ required: form.value.relationType === 'CUSTOM', message: '请输入类型关系名称' }],
    } as Record<string, Rule[]>
  })

  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  function init(record, editType: FormEditType, appId) {
    initFormEditType(editType)
    resetForm()
    form.value.appId = appId
    initData()
    getInfo(record, editType)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    findChannels().then(({ data }) => (payChannelList.value = data))
    relationTypeList.value = await dictDropDown('AllocRelationType')
  }

  /**
   * 获取信息
   */
  async function getInfo(record, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      await get(record.id).then(({ data }) => {
        form.value = data
        rawForm.value = { ...form.value }
      })
      confirmLoading.value = false
      findReceiverTypeByChannel(form.value.channel).then(({ data }) => (receiverTypeList.value = data))
    } else {
      confirmLoading.value = false
    }
  }

  /**
   * 通道变动
   */
  function channelChange() {
    findReceiverTypeByChannel(form.value.channel).then(({ data }) => (receiverTypeList.value = data))
    form.value.receiverType = undefined
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
          await update({ ...form.value, ...diffForm(rawForm.value, form.value, 'receiverAccount', 'receiverName') })
        }
      } finally {
        confirmLoading.value = false
      }
      emits('ok')
      handleCancel()
    })
  }

  /**
   * 显示扫码窗口
   */
  function showQrCode() {}

  /**
   * 校验编码重复
   */
  async function validateCode() {
    const { receiverNo,appId } = form.value
    const res = await existsByNo(receiverNo,appId)
    return res.data ? Promise.reject('该接收方编号已经存在') : Promise.resolve()
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
