<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="60%"
    title="支付宝支付配置"
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
          <a-input v-model:value="form.id" />
        </a-form-item>
        <a-form-item label="AppId" name="appId">
          <a-input v-model:value="form.appId" placeholder="请输入支付宝商户AppId" />
        </a-form-item>
        <a-form-item label="是否启用" name="enable">
          <a-switch checked-children="启用" un-checked-children="停用" v-model:checked="form.enable" />
        </a-form-item>
        <a-form-item label="支持分账" name="allocation">
          <a-switch checked-children="启用" un-checked-children="停用" v-model:checked="form.allocation" />
        </a-form-item>
        <a-form-item name="limitAmount">
          <template #label>
            <basic-title helpMessage="每次发起支付的金额不能超过该值，如果同时配置了全局支付限额，则以额度低的为准">
              支付限额(元)
            </basic-title>
          </template>
          <a-input-number :precision="2" :min="0.01" v-model:value="form.limitAmount" placeholder="请输入支付限额(元)" />
        </a-form-item>
        <a-form-item name="alipayUserId">
          <template #label>
            <basic-title
              helpMessage="是商家与支付宝签约后，商家获得的支付宝商家唯一识别码，以 2088 开头的 16 位数字组成，在开放平台中账户中心获取"
              >合作者身份ID
            </basic-title>
          </template>
          <a-input v-model:value="form.alipayUserId" placeholder="请输入合作者身份ID" />
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
        <a-form-item label="支付网关URL" name="serverUrl">
          <a-input v-model:value="form.serverUrl" placeholder="请输入支付网关URL" />
        </a-form-item>
        <a-form-item label="支持支付方式" name="payWays">
          <a-select
            allowClear
            mode="multiple"
            v-model:value="form.payWays"
            :disabled="showable"
            :options="payWayList"
            style="width: 100%"
            placeholder="选择支付方式"
          />
        </a-form-item>
        <a-form-item label="沙箱环境" name="sandbox">
          <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.sandbox" />
        </a-form-item>
        <a-form-item label="认证方式" name="authType">
          <a-select allowClear v-model:value="form.authType" style="width: 100%" placeholder="选择认证方式">
            <a-select-option key="key">公钥模式</a-select-option>
            <a-select-option key="cart">证书模式</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="签名类型" name="signType">
          <a-select allowClear v-model:value="form.signType" style="width: 100%" placeholder="选择签名类型">
            <a-select-option key="RSA2">RSA2秘钥</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-show="form.authType === 'key'" label="支付宝公钥" name="alipayPublicKey">
          <a-textarea :rows="5" v-model:value="form.alipayPublicKey" placeholder="请输入支付宝公钥" />
        </a-form-item>
        <a-form-item v-show="form.authType === 'cart'" label="应用公钥证书" name="appCert">
          <a-upload
            v-if="!form.appCert"
            :disabled="showable"
            name="file"
            :multiple="false"
            :action="uploadAction"
            :headers="tokenHeader"
            :showUploadList="false"
            @change="(info) => handleChange(info, 'appCert')"
          >
            <a-button type="primary" preIcon="carbon:cloud-upload"> 应用证书上传 </a-button>
          </a-upload>
          <a-input v-else defaultValue="apiclient_cert" disabled>
            <template #addonAfter v-if="!showable">
              <a-tooltip>
                <template #title> 删除上传的证书文件 </template>
                <icon @click="form.appCert = ''" icon="ant-design:close-circle-outlined" :size="20" />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item v-show="form.authType === 'cart'" label="支付宝公钥证书" name="alipayCert">
          <a-upload
            v-if="!form.alipayCert"
            :disabled="showable"
            name="file"
            :multiple="false"
            :action="uploadAction"
            :headers="tokenHeader"
            :showUploadList="false"
            @change="(info) => handleChange(info, 'alipayCert')"
          >
            <a-button type="primary" preIcon="carbon:cloud-upload"> 公钥证书上传 </a-button>
          </a-upload>
          <a-input v-else defaultValue="alipay.cert" disabled>
            <template #addonAfter v-if="!showable">
              <a-tooltip>
                <template #title> 删除上传的证书文件 </template>
                <icon @click="form.alipayCert = ''" icon="ant-design:close-circle-outlined" :size="20" />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item v-show="form.authType === 'cart'" label="支付宝CA根证书" name="alipayRootCert">
          <a-upload
            v-if="!form.alipayRootCert"
            :disabled="showable"
            name="file"
            :multiple="false"
            :action="uploadAction"
            :headers="tokenHeader"
            :showUploadList="false"
            @change="(info) => handleChange(info, 'alipayRootCert')"
          >
            <a-button type="primary" preIcon="carbon:cloud-upload"> CA根证书上传 </a-button>
          </a-upload>
          <a-input v-else defaultValue="alipayRootCert" disabled>
            <template #addonAfter v-if="!showable">
              <a-tooltip>
                <template #title> 删除上传的证书文件 </template>
                <icon @click="form.alipayRootCert = ''" icon="ant-design:close-circle-outlined" :size="20" />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="应用私钥" name="privateKey">
          <a-textarea :rows="5" v-model:value="form.privateKey" placeholder="请输入应用私钥" />
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
  import { update, AlipayConfig, findPayWays, getConfig, generateNotifyUrl, generateReturnUrl } from './AlipayConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { BasicDrawer } from '/@/components/Drawer'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useUpload } from '/@/hooks/bootx/useUpload'
  import { useMessage } from '/@/hooks/web/useMessage'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import BasicTitle from '/@/components/Basic/src/BasicTitle.vue'
  const { handleCancel, diffForm, labelCol, wrapperCol, confirmLoading, visible, showable } = useFormEdit()
  // 读取证书内容
  const { tokenHeader, uploadAction } = useUpload('/alipay/config/readPem')
  const { createMessage } = useMessage()

  const formRef = $ref<FormInstance>()

  let payWayList = $ref<LabeledValue[]>([])
  let form = $ref({
    appId: '',
    enable: false,
    allocation: false,
    limitAmount: 20000,
    notifyUrl: '',
    returnUrl: '',
    serverUrl: '',
    authType: 'key',
    signType: 'RSA2',
    alipayPublicKey: '',
    appCert: '',
    alipayCert: '',
    alipayRootCert: '',
    privateKey: '',
    payWays: [],
    sandbox: false,
    remark: '',
  } as AlipayConfig)
  let rawForm: any
  // 校验
  const rules = computed(() => {
    return {
      appId: [{ required: true, message: '请输入AppId' }],
      enable: [{ required: true, message: '请选择是否启用' }],
      allocation: [{ required: true, message: '请选择是否启用分账支持' }],
      limitAmount: [{ required: true, message: '请输入单次支付限额' }],
      notifyUrl: [{ required: true, message: '请输入异步通知页面地址' }],
      returnUrl: [{ required: true, message: '请输入同步通知页面地址' }],
      serverUrl: [{ required: true, message: '请输入请求网关地址' }],
      authType: [{ required: true, message: '请选择认证方式' }],
      signType: [{ required: true, message: '请选择加密类型' }],
      alipayPublicKey: [{ required: form.authType === 'key', message: '请输入支付宝公钥' }],
      appCert: [{ required: form.authType === 'cart', message: '请输入应用证书' }],
      alipayCert: [{ required: form.authType === 'cart', message: '请输入支付宝证书' }],
      alipayRootCert: [{ required: form.authType === 'cart', message: '请输入支付宝CA根证书' }],
      privateKey: [{ required: true, message: '请输入支付私钥' }],
      sandbox: [{ required: true, message: '请选择是否为沙箱环境' }],
      expireTime: [{ required: true, message: '请输入默认超时配置' }],
      payWays: [{ required: true, message: '请选择支持的支付类型' }],
    } as Record<string, Rule[]>
  })
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
  /**
   * 获取信息
   */
  function getInfo() {
    confirmLoading.value = true
    findPayWays().then(({ data }) => {
      payWayList = data
    })
    getConfig().then(({ data }) => {
      rawForm = { ...data }
      // 分转元
      if (data.limitAmount) {
        data.limitAmount = data.limitAmount / 100
      }
      form = data
      confirmLoading.value = false
    })
  }
  /**
   * 更新
   */
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      const updateFrom = { ...form }
      // 元转分
      if (updateFrom.limitAmount) {
        updateFrom.limitAmount = updateFrom.limitAmount * 100
      }
      await update({
        ...updateFrom,
        ...form,
        ...diffForm(rawForm, form, 'appId', 'alipayPublicKey', 'appCert', 'alipayCert', 'alipayRootCert', 'privateKey'),
      })
      confirmLoading.value = false
      createMessage.success('保存成功')
      handleCancel()
      emits('ok')
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

<style lang="less" scoped></style>
