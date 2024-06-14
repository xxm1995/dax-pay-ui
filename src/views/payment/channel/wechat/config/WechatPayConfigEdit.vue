<template>
  <basic-drawer showFooter v-bind="$attrs" width="60%" title="微信支付配置" :visible="visible" :maskClosable="false" @close="handleCancel">
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
        <a-form-item label="商户号" name="wxMchId">
          <a-input v-model:value="form.wxMchId" :disabled="showable" placeholder="请输入商户号" />
        </a-form-item>
        <a-form-item label="应用编号" name="wxAppId">
          <a-input v-model:value="form.wxAppId" :disabled="showable" placeholder="请输入微信应用AppId" />
        </a-form-item>
        <a-form-item label="AppSecret" name="appSecret">
          <a-input v-model:value="form.appSecret" :disabled="showable" placeholder="APPID对应的接口密码，用于获取接口调用凭证时使用" />
        </a-form-item>
        <a-form-item label="是否启用" name="enable">
          <a-switch checked-children="启用" un-checked-children="停用" v-model:checked="form.enable" />
        </a-form-item>
        <a-form-item label="支持分账" name="allocation">
          <a-switch checked-children="启用" un-checked-children="停用" v-model:checked="form.allocation" />
        </a-form-item>
        <a-form-item label="单次支付限额(分)" name="singleLimit">
          <a-input-number :precision="0" :min="1" v-model:value="form.singleLimit" placeholder="请输入单次支付限额(分)" />
        </a-form-item>
        <a-form-item name="notifyUrl">
          <template #label>
            <basic-title helpMessage="此处为本网关接收通知的地址, 而不是客户系统接收通知所需的地址"> 异步通知地址 </basic-title>
          </template>
          <a-input v-model:value="form.notifyUrl" placeholder="请输入异步通知URL" style="width: calc(100% - 80px)" />
          <a-button class="w-80px" type="primary" @click="genNotifyUrl">自动生成</a-button>
        </a-form-item>
        <a-form-item name="returnUrl">
          <template #label>
            <basic-title helpMessage="此处为本网关接收通知的地址, 而不是客户系统接收通知所需的地址"> 同步通知地址 </basic-title>
          </template>
          <a-input v-model:value="form.returnUrl" placeholder="请输入同步通知URL" style="width: calc(100% - 80px)" />
          <a-button class="w-80px" type="primary" @click="genReturnUrl">自动生成</a-button>
        </a-form-item>
        <a-form-item label="支持支付方式" name="payWays">
          <a-select
            allowClear
            mode="multiple"
            :disabled="showable"
            :options="payWayList"
            v-model:value="form.payWays"
            style="width: 100%"
            placeholder="选择支付方式"
          />
        </a-form-item>
        <a-form-item label="沙箱环境" name="sandbox">
          <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.sandbox" />
        </a-form-item>
        <a-form-item label="API版本" name="apiVersion">
          <a-radio-group v-model:value="form.apiVersion" button-style="solid">
            <a-radio-button value="apiV2"> Api_V2 </a-radio-button>
            <a-radio-button value="apiV3"> Api_V3 </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="APIv2密钥" name="apiKeyV2">
          <a-textarea :rows="3" :disabled="showable" v-model:value="form.apiKeyV2" placeholder="请输入APIv2密钥" />
        </a-form-item>
        <a-form-item label="APIv3密钥" name="apiKeyV3">
          <a-textarea :rows="3" :disabled="showable" v-model:value="form.apiKeyV3" placeholder="请输入APIv3密钥" />
        </a-form-item>
        <a-form-item name="p12">
          <template #label>
            <basic-title helpMessage="例如退款、转账时，必须要配置p12证书才可以执行"> p12证书 </basic-title>
          </template>
          <a-upload
            v-if="!form.p12"
            :disabled="showable"
            name="file"
            :multiple="false"
            :action="uploadAction"
            :headers="tokenHeader"
            :showUploadList="false"
            @change="(info) => handleChange(info, 'p12')"
          >
            <a-button type="primary" preIcon="carbon:cloud-upload"> p12证书上传 </a-button>
          </a-upload>
          <a-input v-else defaultValue="apiclient_cert.p12" disabled>
            <template #addonAfter v-if="!showable">
              <a-tooltip>
                <template #title> 删除上传的证书文件 </template>
                <icon @click="form.p12 = ''" icon="ant-design:close-circle-outlined" :size="20" />
              </a-tooltip>
            </template>
          </a-input>
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
  import { computed, nextTick } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { getConfig, update, findPayWayList, generateNotifyUrl, generateReturnUrl, WechatPayConfig } from './WechatPayConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { BasicDrawer } from '/@/components/Drawer'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import { useUpload } from '/@/hooks/bootx/useUpload'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import BasicTitle from '/@/components/Basic/src/BasicTitle.vue'

  const { handleCancel, diffForm, labelCol, wrapperCol, confirmLoading, visible, showable } = useFormEdit()
  // 文件上传
  const { tokenHeader, uploadAction } = useUpload('/wechat/pay/config/toBase64')
  const { createMessage } = useMessage()

  // 表单
  const formRef = $ref<FormInstance>()
  let rawForm: any
  let form = $ref<WechatPayConfig>({
    id: null,
    enable: false,
    allocation: false,
    singleLimit: 20000,
    apiVersion: 'apiV2',
    wxMchId: '',
    wxAppId: '',
    appSecret: '',
    p12: null,
    apiKeyV2: '',
    apiKeyV3: '',
    notifyUrl: '',
    returnUrl: '',
    payWays: [],
    sandbox: false,
    remark: '',
  })
  // 校验
  const rules = computed(() => {
    return {
      wxMchId: [{ required: true, message: '请输入商户号' }],
      singleLimit: [{ required: true, message: '请选择单次支付限额' }],
      wxAppId: [{ required: true, message: '请输入应用编号' }],
      appSecret: [{ required: true, message: '请输入AppSecret' }],
      enable: [{ required: true, message: '请选择是否启用' }],
      allocation: [{ required: true, message: '请选择是否启用分账支持' }],
      notifyUrl: [{ required: true, message: '请输入异步通知页面地址' }],
      returnUrl: [{ required: true, message: '请输入同步通知页面地址' }],
      sandbox: [{ required: true, message: '请选择是否为沙箱环境' }],
      apiVersion: [{ required: true, message: '请选择支付API版本' }],
      apiKeyV2: [{ required: form.apiVersion === 'apiV2', message: '请输入V2秘钥' }],
      apiKeyV3: [{ required: form.apiVersion === 'apiV3', message: '请输入V3秘钥' }],
      // p12: [{ required: true, message: '请上传p12证书' }],
      payWays: [{ required: true, message: '请选择支持的支付类型' }],
    } as Record<string, Rule[]>
  })

  let payWayList = $ref<LabeledValue[]>([])

  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 入口
   */
  function init() {
    visible.value = true
    resetForm()
    getInfo()
  }
  // 获取信息
  function getInfo() {
    confirmLoading.value = true
    findPayWayList().then(({ data }) => {
      payWayList = data
    })
    getConfig().then(({ data }) => {
      rawForm = { ...data }
      form = data
      confirmLoading.value = false
    })
  }
  // 保存
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      await update({
        ...form,
        ...diffForm(rawForm, form, 'wxMchId', 'wxAppId', 'p12', 'appSecret', 'apiKeyV2', 'apiKeyV3'),
      })
      confirmLoading.value = false
      handleCancel()
      createMessage.success('保存成功')
      emits('ok')
    })
  }

  // 重置表单
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  /**
   * 文件上传
   */
  function handleChange(info, fieldName) {
    // 上传完毕
    if (info.file.status === 'done') {
      const res = info.file.response
      if (!res.code) {
        form[fieldName] = res.data
        createMessage.success(`${info.file.name} 上传成功!`)
      } else {
        createMessage.error(`${res.msg}`)
      }
    } else if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }
  /**
   * 生成异步通知地址
   */
  function genNotifyUrl() {
    generateNotifyUrl().then(({ data }) => {
      form.notifyUrl = data
      formRef?.validateFields(['notifyUrl'])
    })
  }

  /**
   * 生成同步通知地址
   */
  function genReturnUrl() {
    generateReturnUrl().then(({ data }) => {
      form.returnUrl = data
      formRef?.validateFields(['returnUrl'])
    })
  }

  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
