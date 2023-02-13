<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :maskClosable="false"
    @close="handleCancel"
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
        <a-form-item label="名称" name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="AppId" name="appId">
          <a-input v-model:value="form.appId" :disabled="showable" placeholder="请输入支付宝商户AppId" />
        </a-form-item>
        <a-form-item label="异步通知URL" name="notifyUrl">
          <a-input v-model:value="form.notifyUrl" :disabled="showable" placeholder="请输入异步通知URL" />
        </a-form-item>
        <a-form-item label="同步通知URL" name="returnUrl">
          <a-input v-model:value="form.returnUrl" :disabled="showable" placeholder="请输入同步通知URL" />
        </a-form-item>
        <a-form-item label="支付网关URL" name="serverUrl">
          <a-input v-model:value="form.serverUrl" :disabled="showable" placeholder="请输入支付网关URL" />
        </a-form-item>
        <a-form-item label="默认支付超时配置(分钟)" name="expireTime">
          <a-input-number
            :min="1"
            :max="12000"
            :step="1"
            :disabled="showable"
            placeholder="请输入超时配置"
            v-model:value="form.expireTime"
          />
        </a-form-item>
        <a-form-item label="支持支付方式" name="payWayList">
          <a-select
            allowClear
            mode="multiple"
            v-model:value="form.payWayList"
            :disabled="showable"
            :options="payWayList"
            style="width: 100%"
            placeholder="选择支付方式"
          />
        </a-form-item>
        <a-form-item label="沙箱环境" name="sandbox">
          <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.sandbox" :disabled="showable" />
        </a-form-item>
        <a-form-item v-show="showable" label="是否启用" name="activity">
          <a-tag>{{ form.activity ? '启用' : '未启用' }}</a-tag>
        </a-form-item>
        <a-form-item label="认证方式" name="authType">
          <a-select allowClear :disabled="showable" v-model:value="form.authType" style="width: 100%" placeholder="选择认证方式">
            <a-select-option :key="1">公钥模式</a-select-option>
            <a-select-option :key="2">证书模式</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="签名类型" name="signType">
          <a-select allowClear :disabled="showable" v-model:value="form.signType" style="width: 100%" placeholder="选择签名类型">
            <a-select-option key="RSA2">RSA2秘钥</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-show="form.authType === 1" label="支付宝公钥" name="alipayPublicKey">
          <a-textarea v-model:value="form.alipayPublicKey" :disabled="showable" placeholder="请输入支付宝公钥" />
        </a-form-item>
        <a-form-item v-show="form.authType === 2" label="应用公钥证书" name="appCert">
          <a-textarea v-model:value="form.appCert" :disabled="showable" placeholder="请输入应用公钥证书内容" />
        </a-form-item>
        <a-form-item v-show="form.authType === 2" label="支付宝公钥证书" name="alipayCert">
          <a-textarea v-model:value="form.alipayCert" :disabled="showable" placeholder="请输入支付宝公钥证书内容" />
        </a-form-item>
        <a-form-item v-show="form.authType === 2" label="支付宝CA根证书" name="alipayRootCert">
          <a-textarea v-model:value="form.alipayRootCert" :disabled="showable" placeholder="请输入支付宝CA根证书" />
        </a-form-item>
        <a-form-item label="应用私钥" name="privateKey">
          <a-textarea v-model:value="form.privateKey" :disabled="showable" placeholder="请输入应用私钥" />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="form.remark" :disabled="showable" placeholder="请输入备注" />
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { computed, nextTick, reactive } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, get, update, AlipayConfig, findPayWayList } from './AlipayConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicDrawer } from '/@/components/Drawer'
  import { KeyValue } from '/#/web'
  const {
    initFormEditType,
    handleCancel,
    search,
    diffForm,
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

  let payWayList = $ref<KeyValue[]>([])
  let form = $ref({
    name: '',
    appId: '',
    notifyUrl: '',
    returnUrl: '',
    serverUrl: '',
    authType: 1,
    signType: 'RSA2',
    alipayPublicKey: '',
    appCert: '',
    alipayCert: '',
    alipayRootCert: '',
    privateKey: '',
    expireTime: 15,
    payWayList: [],
    sandbox: false,
    remark: '',
  } as AlipayConfig)
  let rawForm
  // 校验
  const rules = computed(() => {
    return {
      name: [{ required: true, message: '请输入配置名称' }],
      appId: [{ required: true, message: '请输入AppId' }],
      notifyUrl: [{ required: true, message: '请输入异步通知页面地址' }],
      returnUrl: [{ required: true, message: '请输入同步通知页面地址' }],
      serverUrl: [{ required: true, message: '请输入请求网关地址' }],
      authType: [{ required: true, message: '请选择认证方式' }],
      signType: [{ required: true, message: '请选择加密类型' }],
      alipayPublicKey: [{ required: form.authType === 1, message: '请输入支付宝公钥' }],
      appCert: [{ required: form.authType === 2, message: '请输入应用证书' }],
      alipayCert: [{ required: form.authType === 2, message: '请输入支付宝证书' }],
      alipayRootCert: [{ required: form.authType === 2, message: '请输入支付宝CA根证书' }],
      privateKey: [{ required: true, message: '请输入支付私钥' }],
      sandbox: [{ required: true, message: '请选择是否为沙箱环境' }],
      expireTime: [{ required: true, message: '请输入默认超时配置' }],
      payWayList: [{ required: true, message: '请选择支持的支付类型' }],
    } as Record<string, Rule[]>
  })
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType) {
    findPayWayList().then(({ data }) => {
      payWayList = data
    })
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
  }
  // 获取信息
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        rawForm = { ...data }
        form = data
        confirmLoading.value = false
      })
    } else {
      confirmLoading.value = false
    }
  }
  // 保存
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(form)
      } else if (formEditType.value === FormEditType.Edit) {
        await update({
          ...form,
          ...diffForm(rawForm, form, 'appId', 'alipayPublicKey', 'appCert', 'alipayCert', 'alipayRootCert', 'privateKey'),
        })
      }
      confirmLoading.value = false
      handleCancel()
      emits('ok')
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

<style lang="less" scoped></style>
