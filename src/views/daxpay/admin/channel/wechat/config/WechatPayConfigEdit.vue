<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="60%"
    title="微信支付配置"
    :open="visible"
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
        <a-form-item label="商户号" name="wxMchId">
          <a-input v-model:value="form.wxMchId" :disabled="showable" placeholder="请输入商户号" />
        </a-form-item>
        <a-form-item label="应用编号(AppId)" name="wxAppId">
          <a-input
            v-model:value="form.wxAppId"
            :disabled="showable"
            placeholder="请输入微信应用AppId"
          />
        </a-form-item>
        <a-form-item label="AppSecret" name="appSecret">
          <a-input
            v-model:value="form.appSecret"
            :disabled="showable"
            placeholder="APPID对应的接口密码，用于获取接口调用凭证时使用"
          />
        </a-form-item>
        <a-form-item label="是否启用" name="enable">
          <a-switch
            checked-children="启用"
            un-checked-children="停用"
            v-model:checked="form.enable"
          />
        </a-form-item>
        <a-form-item name="limitAmount">
          <template #label>
            <basic-title
              helpMessage="每次发起支付的金额不能超过该值，如果同时配置了全局支付限额，则以额度低的为准"
            >
              支付限额(元)
            </basic-title>
          </template>
          <a-input-number
            :precision="2"
            :min="0.01"
            v-model:value="form.limitAmount"
            placeholder="请输入支付限额(元)"
          />
        </a-form-item>
        <a-form-item label="沙箱环境" name="sandbox">
          <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.sandbox" />
        </a-form-item>
        <a-form-item label="API版本" name="apiVersion">
          <a-radio-group v-model:value="form.apiVersion" button-style="solid">
            <a-radio-button value="apiV2"> API_V2 </a-radio-button>
            <a-radio-button value="apiV3"> API_V3 </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item name="apiKeyV2" label="APIv2密钥">
          <a-textarea
            :rows="3"
            :disabled="showable"
            v-model:value="form.apiKeyV2"
            placeholder="请输入APIv2密钥"
          />
        </a-form-item>
        <a-form-item label="APIv3密钥" name="apiKeyV3">
          <a-textarea
            :rows="3"
            :disabled="showable"
            v-model:value="form.apiKeyV3"
            placeholder="请输入APIv3密钥"
          />
        </a-form-item>
        <a-form-item label="证书序列号" name="certSerialNo">
          <a-input
            :disabled="showable"
            v-model:value="form.certSerialNo"
            placeholder="请输入证书序列号"
          />
        </a-form-item>
        <a-form-item name="privateKey">
          <template #label>
            <basic-title helpMessage="微信商户平台Api接口中的apiclient_key.pem证书">
              私钥Key
            </basic-title>
          </template>
          <a-upload
            v-if="!form.privateKey"
            :disabled="showable"
            name="file"
            :multiple="false"
            :action="uploadAction"
            :headers="tokenHeader"
            :showUploadList="false"
            @change="(info) => handleChange(info, 'privateKey')"
          >
            <a-button type="primary" preIcon="carbon:cloud-upload"> 私钥Key上传 </a-button>
          </a-upload>
          <a-input v-else defaultValue="apiclient_key.pem" disabled>
            <template #addonAfter v-if="!showable">
              <a-tooltip>
                <template #title> 删除上传的证书文件 </template>
                <icon
                  @click="form.privateKey = ''"
                  icon="ant-design:close-circle-outlined"
                  :size="20"
                />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="privateCert">
          <template #label>
            <basic-title helpMessage="微信商户平台Api接口中的apiclient_cert.pem证书">
              私钥证书
            </basic-title>
          </template>
          <a-upload
            v-if="!form.privateCert"
            :disabled="showable"
            name="file"
            :multiple="false"
            :action="uploadAction"
            :headers="tokenHeader"
            :showUploadList="false"
            @change="(info) => handleChange(info, 'privateCert')"
          >
            <a-button type="primary" preIcon="carbon:cloud-upload"> 私钥Key上传 </a-button>
          </a-upload>
          <a-input v-else defaultValue="apiclient_cert.pem" disabled>
            <template #addonAfter v-if="!showable">
              <a-tooltip>
                <template #title> 删除上传的证书文件 </template>
                <icon
                  @click="form.privateCert = ''"
                  icon="ant-design:close-circle-outlined"
                  :size="20"
                />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="p12">
          <template #label>
            <basic-title helpMessage="V2版本中例如退款、转账时，必须要配置p12证书才可以执行">
              p12证书
            </basic-title>
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
  import { computed, nextTick, ref } from 'vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { getConfig, saveOrUpdate, WechatPayConfig } from './WechatPayConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { BasicDrawer } from '@/components/Drawer'
  import Icon from '@/components/Icon/Icon.vue'
  import { useUpload } from '@/hooks/bootx/useUpload'
  import { useMessage } from '@/hooks/web/useMessage'
  import BasicTitle from '@/components/Basic/src/BasicTitle.vue'
  import { ChannelConfig } from '@/views/daxpay/admin/merchant/channel/ChannelConfig.api'

  const { handleCancel, diffForm, labelCol, wrapperCol, confirmLoading, visible, showable } =
    useFormEdit()
  // 文件上传
  const { tokenHeader, uploadAction } = useUpload('/readBase64')
  const { createMessage } = useMessage()

  // 表单
  const formRef = ref<FormInstance>()
  let rawForm: any = {}
  let form = ref<WechatPayConfig>({
    id: null,
    enable: false,
    limitAmount: 20000,
    apiVersion: 'apiV2',
    wxMchId: '',
    wxAppId: '',
    appSecret: '',
    p12: null,
    apiKeyV2: '',
    apiKeyV3: '',
    notifyUrl: '',
    returnUrl: '',
    sandbox: false,
    remark: '',
  })

  const channelConfig = ref<ChannelConfig>({})

  // 校验
  const rules = computed(() => {
    return {
      wxMchId: [{ required: true, message: '请输入商户号' }],
      limitAmount: [{ required: true, message: '请输入单次支付限额' }],
      wxAppId: [{ required: true, message: '请输入应用编号' }],
      // appSecret: [{ required: true, message: '请输入AppSecret' }],
      enable: [{ required: true, message: '请选择是否启用' }],
      notifyUrl: [{ required: true, message: '请输入异步通知页面地址' }],
      returnUrl: [{ required: true, message: '请输入同步通知页面地址' }],
      sandbox: [{ required: true, message: '请选择是否为沙箱环境' }],
      apiVersion: [{ required: true, message: '请选择支付API版本' }],
      apiKeyV2: [{ required: form.value.apiVersion === 'apiV2', message: '请输入V2秘钥' }],
      apiKeyV3: [{ required: form.value.apiVersion === 'apiV3', message: '请输入V3秘钥' }],
      certSerialNo: [{ required: form.value.apiVersion === 'apiV3', message: '请输入证书序列号' }],
      privateKey: [
        {
          required: form.value.apiVersion === 'apiV3',
          message: '请上传私钥证书(apiclient_key.pem)',
        },
      ],
      privateCert: [
        {
          required: form.value.apiVersion === 'apiV3',
          message: '请上传私钥Key(apiclient_cert.pem)',
        },
      ],
      payWays: [{ required: true, message: '请选择支持的支付类型' }],
    } as Record<string, Rule[]>
  })

  // 事件
  const emits = defineEmits(['ok'])
  /**
   * 入口
   */
  function init(config: ChannelConfig) {
    channelConfig.value = config
    visible.value = true
    resetForm()
    getInfo()
  }
  /**
   * 获取信息
   */
  function getInfo() {
    if (channelConfig.value.id) {
      confirmLoading.value = true
      getConfig(channelConfig.value.id).then(({ data }) => {
        rawForm = { ...data }
        form.value = data
        confirmLoading.value = false
      })
    }
  }
  /**
   * 保存
   */
  function handleOk() {
    formRef.value?.validate().then(() => {
      confirmLoading.value = true
      saveOrUpdate({
        ...form.value,
        ...diffForm(
          rawForm,
          form.value,
          'p12',
          'appSecret',
          'apiKeyV2',
          'apiKeyV3',
          'privateKey',
          'privateCert',
        ),
        mchNo: channelConfig.value.mchNo,
        appId: channelConfig.value.appId,
      })
        .then(() => {
          handleCancel()
          createMessage.success('保存成功')
          emits('ok')
        })
        .finally(() => {
          confirmLoading.value = false
        })
    })
  }

  // 重置表单
  function resetForm() {
    nextTick(() => {
      formRef.value?.resetFields()
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
        form.value[fieldName] = res.data
        createMessage.success(`${info.file.name} 上传成功!`)
      } else {
        createMessage.error(`${res.msg}`)
      }
    } else if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
