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
        <a-form-item label="主键" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="名称" name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="微信应用AppId" name="appId">
          <a-input v-model:value="form.appId" :disabled="showable" placeholder="请输入微信应用AppId" />
        </a-form-item>
        <a-form-item label="商户号" name="mchId">
          <a-input v-model:value="form.mchId" :disabled="showable" placeholder="请输入商户号" />
        </a-form-item>
        <a-form-item label="服务商应用编号" name="apiVersion">
          <a-input v-model:value="form.apiVersion" :disabled="showable" placeholder="请输入服务商应用编号" />
        </a-form-item>
        <a-form-item label="商户平台「API安全」中的 APIv2 密钥" name="apiKeyV2">
          <a-input v-model:value="form.apiKeyV2" :disabled="showable" placeholder="请输入商户平台「API安全」中的 APIv2 密钥" />
        </a-form-item>
        <a-form-item label="商户平台「API安全」中的 APIv3 密钥" name="apiKeyV3">
          <a-input v-model:value="form.apiKeyV3" :disabled="showable" placeholder="请输入商户平台「API安全」中的 APIv3 密钥" />
        </a-form-item>
        <a-form-item label="APPID对应的接口密码，用于获取接口调用凭证access_token时使用" name="appSecret">
          <a-input
            v-model:value="form.appSecret"
            :disabled="showable"
            placeholder="请输入APPID对应的接口密码，用于获取接口调用凭证access_token时使用"
          />
        </a-form-item>
        <a-form-item label="p12的文件id" name="p12">
          <a-input v-model:value="form.p12" :disabled="showable" placeholder="请输入p12的文件id" />
        </a-form-item>
        <a-form-item label="API 证书中的 cert.pem" name="certPem">
          <a-input v-model:value="form.certPem" :disabled="showable" placeholder="请输入API 证书中的 cert.pem" />
        </a-form-item>
        <a-form-item label="API 证书中的 key.pem" name="keyPem">
          <a-input v-model:value="form.keyPem" :disabled="showable" placeholder="请输入API 证书中的 key.pem" />
        </a-form-item>
        <a-form-item label="应用域名，回调中会使用此参数" name="domain">
          <a-input v-model:value="form.domain" :disabled="showable" placeholder="请输入应用域名，回调中会使用此参数" />
        </a-form-item>
        <a-form-item label="服务器异步通知页面路径" name="notifyUrl">
          <a-input v-model:value="form.notifyUrl" :disabled="showable" placeholder="请输入服务器异步通知页面路径" />
        </a-form-item>
        <a-form-item label="页面跳转同步通知页面路径" name="returnUrl">
          <a-input v-model:value="form.returnUrl" :disabled="showable" placeholder="请输入页面跳转同步通知页面路径" />
        </a-form-item>
        <a-form-item label="支持的支付类型" name="payWays">
          <a-input v-model:value="form.payWays" :disabled="showable" placeholder="请输入支持的支付类型" />
        </a-form-item>
        <a-form-item label="是否沙箱环境" name="sandbox">
          <a-input v-model:value="form.sandbox" :disabled="showable" placeholder="请输入是否沙箱环境" />
        </a-form-item>
        <a-form-item label="超时配置" name="expireTime">
          <a-input v-model:value="form.expireTime" :disabled="showable" placeholder="请输入超时配置" />
        </a-form-item>
        <a-form-item label="是否启用" name="activity">
          <a-input v-model:value="form.activity" :disabled="showable" placeholder="请输入是否启用" />
        </a-form-item>
        <a-form-item label="状态" name="state">
          <a-input v-model:value="form.state" :disabled="showable" placeholder="请输入状态" />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-input v-model:value="form.remark" :disabled="showable" placeholder="请输入备注" />
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
  import { add, get, update, WechatPayConfig } from './WechatPayConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicDrawer } from '/@/components/Drawer'
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
  let rawForm
  let form = $ref({
    id: null,
    name: '',
    mchId: '',
    appId: '',
    appSecret: '',
    apiVersion: 'api_v2',
    p12: null,
    apiKeyV2: '',
    apiKeyV3: '',
    keyPem: '',
    certPem: '',
    domain: '',
    notifyUrl: '',
    returnUrl: '',
    expireTime: 15,
    payWayList: [],
    sandbox: false,
    remark: '',
  } as WechatPayConfig)
  // 校验
  const rules = computed(() => {
    return {
      name: [{ required: true, message: '请输入配置名称' }],
      mchId: [{ required: true, message: '请输入商户号' }],
      appId: [{ required: true, message: '请输入应用编号' }],
      notifyUrl: [{ required: true, message: '请输入异步通知页面地址' }],
      returnUrl: [{ required: true, message: '请输入同步通知页面地址' }],
      domain: [{ required: true, message: '请输入请求应用域名' }],
      // apiVersion: [ { required: true, message: '请选择API版本' } ],
      apiKeyV2: [{ required: form.apiVersion === 'api_v2', message: '请输入V2秘钥' }],
      apiKeyV3: [{ required: form.apiVersion === 'api_v3', message: '请输入V3秘钥' }],
      // keyPem: [ { required: true, message: '请填入私钥内容' } ],
      // certPem: [ { required: true, message: '请填入证书内容' } ],
      sandbox: [{ required: true, message: '请选择是否为沙箱环境' }],
      expireTime: [{ required: true, message: '请输入默认超时配置' }],
      payWayList: [{ required: true, message: '请选择支持的支付类型' }],
    } as Record<string, Rule[]>
  })
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
        await update({ ...form, ...diffForm(rawForm, form, 'phone', 'email') })
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
