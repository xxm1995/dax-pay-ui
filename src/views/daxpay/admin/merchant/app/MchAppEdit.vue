<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="50%"
    :title="title"
    :mask-closable="showable"
    :open="visible"
    @close="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        class="small-from-item"
        :model="form"
        ref="formRef"
        :validate-trigger="['blur', 'change']"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="商户号" name="mchNo">
          <a-select
            v-model:value="form.mchNo"
            :disabled="showable"
            placeholder="请选择商户"
            :options="mchNoOptions"
          />
        </a-form-item>
        <a-form-item label="应用号" name="appId" v-if="!addable">
          <a-tag> {{ form.appId }}</a-tag>
        </a-form-item>
        <a-form-item label="应用名称" name="appName">
          <a-input v-model:value="form.appName" :disabled="showable" placeholder="请输入应用名称" />
        </a-form-item>
        <a-form-item label="请求验签" name="reqSign">
          <a-switch
            :disabled="showable"
            v-model:checked="form.reqSign"
            checked-children="启用"
            un-checked-children="停用"
          />
        </a-form-item>
        <a-form-item label="支付限额(元)" name="limitAmount">
          <a-input-number
            v-model:value="form.limitAmount"
            :min="0.01"
            :precision="2"
            :disabled="showable"
            placeholder="请输入支付限额(元)"
          />
        </a-form-item>
        <a-form-item label="订单超时时间(分钟)" name="orderTimeout">
          <a-input-number
            v-model:value="form.orderTimeout"
            :min="5"
            :precision="0"
            :disabled="showable"
            placeholder="请输入订单默认超时时间(分钟)"
          />
        </a-form-item>
        <a-form-item label="签名方式" name="signType">
          <a-radio-group v-model:value="form.signType" :disabled="showable" button-style="solid">
            <a-radio-button value="HMAC_SHA256">HMAC_SHA256</a-radio-button>
            <a-radio-button value="SM3">SM3</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="签名秘钥" name="signSecret">
          <a-textarea
            v-model:value="form.signSecret"
            :disabled="showable"
            placeholder="请输入公钥"
          />
          <a-button v-if="addable" type="link" @click="genSignSecret">生成秘钥</a-button>
        </a-form-item>
        <a-form-item label="通知方式" name="notifyType">
          <a-radio-group v-model:value="form.notifyType" :disabled="showable" button-style="solid">
            <a-radio-button value="none">不启用</a-radio-button>
            <a-radio-button value="http">http</a-radio-button>
            <a-radio-button value="websocket">websocket</a-radio-button>
            <a-radio-button disabled value="mq">消息队列</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="通知地址" name="notifyUrl" v-if="form.notifyType !== 'none'">
          <a-input
            v-model:value="form.notifyUrl"
            :disabled="showable"
            placeholder="请输入通知地址"
          />
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
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, ref, unref } from 'vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { add, get, MchApp, update } from './MchApp.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { BasicDrawer } from '@/components/Drawer'
  import { buildUUID } from '@/utils/uuid'
  import { dropdown as merchantDropdown } from '@/views/daxpay/admin/merchant/info/Merchant.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'

  const {
    initFormEditType,
    handleCancel,
    labelCol,
    wrapperCol,
    title,
    confirmLoading,
    visible,
    addable,
    showable,
    formEditType,
  } = useFormEdit()

  // 表单
  const formRef = ref<FormInstance>()
  const form = ref<MchApp>({
    notifyType: 'none',
    signType: 'HMAC_SHA256',
    limitAmount: 200.0,
    orderTimeout: 5,
    reqSign: true,
  })
  const mchNoOptions = ref<LabeledValue[]>([])

  // 校验
  const rules = reactive({
    mchNo: [{ required: true, message: '请选择所属商户' }],
    appName: [{ required: true, message: '请输入应用名称' }],
    signType: [{ required: true, message: '请选择签名方式' }],
    signSecret: [{ required: true, message: '请输入签名秘钥' }],
    reqSign: [{ required: true, message: '请选择是否验签' }],
    limitAmount: [{ required: true, message: '请输入支付限额(元)' }],
    orderTimeout: [{ required: true, message: '请输入订单默认超时时间(分钟)' }],
    notifyType: [{ required: true, message: '请选择消息通知方式' }],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  function init(id, editType: FormEditType) {
    initMerchant()
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
  }

  /**
   * 初始化商户列表信息
   */
  function initMerchant() {
    merchantDropdown().then(({ data }) => {
      mchNoOptions.value = data
    })
  }

  /**
   * 获取信息
   */
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form.value = data
        confirmLoading.value = false
      })
    } else if (editType === FormEditType.Add) {
      genSignSecret()
      confirmLoading.value = false
    }
  }
  // 保存
  function handleOk() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(unref(form)).finally(() => (confirmLoading.value = false))
      } else if (formEditType.value === FormEditType.Edit) {
        await update(unref(form)).finally(() => (confirmLoading.value = false))
      }
      handleCancel()
      emits('ok')
    })
  }

  /**
   * 生成秘钥
   */
  function genSignSecret() {
    form.value.signSecret = buildUUID() + buildUUID()
  }
  /**
   * 重置表单的校验
   */
  function resetForm() {
    nextTick(() => formRef.value?.resetFields())
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
