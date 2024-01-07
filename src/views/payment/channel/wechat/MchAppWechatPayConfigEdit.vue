<template>
  <basic-drawer showFooter v-bind="$attrs" width="60%" :title="title" :visible="visible" :maskClosable="false" @close="handleCancel">
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
        <a-form-item label="API版本" name="apiVersion">
          <a-radio-group v-model:value="form.apiVersion" button-style="solid">
            <a-radio-button value="apiV2"> Api_V2 </a-radio-button>
            <a-radio-button value="apiV3"> Api_V3 </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="AppSecret" name="appSecret">
          <a-input v-model:value="form.appSecret" :disabled="showable" placeholder="APPID对应的接口密码，用于获取接口调用凭证时使用" />
        </a-form-item>
        <a-form-item label="超时配置(分钟)" name="expireTime">
          <a-input-number
            placeholder="请输入默认超时配置"
            :min="1"
            :max="12000"
            :step="1"
            :disabled="showable"
            v-model:value="form.expireTime"
          />
        </a-form-item>
        <a-form-item label="异步通知UR" name="notifyUrl">
          <a-input v-model:value="form.notifyUrl" :disabled="showable" placeholder="请输入服务器异步通知页面路径" />
        </a-form-item>
        <a-form-item label="同步通知URL" name="returnUrl">
          <a-input v-model:value="form.returnUrl" :disabled="showable" placeholder="请输入页面跳转同步通知页面路径" />
        </a-form-item>
        <a-form-item label="支持支付方式" name="payWayList">
          <a-select
            allowClear
            mode="multiple"
            :disabled="showable"
            :options="payWayList"
            v-model:value="form.payWayList"
            style="width: 100%"
            placeholder="选择支付方式"
          />
        </a-form-item>
        <a-form-item label="是否启用" v-show="showable" name="activity">
          <a-tag>{{ form.activity ? '启用' : '未启用' }}</a-tag>
        </a-form-item>
        <a-form-item label="APIv2密钥" name="apiKeyV2">
          <a-textarea :rows="3" :disabled="showable" v-model:value="form.apiKeyV2" placeholder="请输入APIv2密钥" />
        </a-form-item>
        <a-form-item label="APIv3密钥" name="apiKeyV3">
          <a-textarea :rows="3" :disabled="showable" v-model:value="form.apiKeyV3" placeholder="请输入APIv3密钥" />
        </a-form-item>
        <a-form-item label="p12证书" name="p12">
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
  import { computed, nextTick } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, get, update, findPayWayList, WechatPayConfig } from './WechatPayConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicDrawer } from '/@/components/Drawer'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import { useUpload } from '/@/hooks/bootx/useUpload'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { MchAppPayConfigResult } from '/@/views/modules/payment/app/MchApplication.api'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import BasicTitle from '/@/components/Basic/src/BasicTitle.vue'

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
  // 文件上传
  const { tokenHeader, uploadAction } = useUpload('/wechat/pay/toBase64')
  const { createMessage } = useMessage()

  let editType = $ref<FormEditType>()

  // 表单
  const formRef = $ref<FormInstance>()
  let rawForm
  let form = $ref<WechatPayConfig>({
    id: null,
    wxMchId: '',
    wxAppId: '',
    appSecret: '',
    p12: null,
    apiKeyV2: '',
    apiKeyV3: '',
    apiVersion: 'apiV2',
    notifyUrl: '',
    returnUrl: '',
    expireTime: 15,
    payWayList: [],
    // sandbox: false,
    remark: '',
  })
  // 校验
  const rules = computed(() => {
    return {
      wxMchId: [{ required: true, message: '请输入商户号' }],
      wxAppId: [{ required: true, message: '请输入应用编号' }],
      appSecret: [{ required: true, message: '请输入AppSecret' }],
      notifyUrl: [{ required: true, message: '请输入异步通知页面地址' }],
      returnUrl: [{ required: true, message: '请输入同步通知页面地址' }],
      apiVersion: [{ required: true, message: '请选择支付API版本' }],
      apiKeyV2: [{ required: form.apiVersion === 'apiV2', message: '请输入V2秘钥' }],
      apiKeyV3: [{ required: form.apiVersion === 'apiV3', message: '请输入V3秘钥' }],
      p12: [{ required: form.apiVersion === 'apiV3', message: '请上传p12证书' }],
      expireTime: [{ required: true, message: '请输入默认超时配置' }],
      payWayList: [{ required: true, message: '请选择支持的支付类型' }],
    } as Record<string, Rule[]>
  })

  let payWayList = $ref<LabeledValue[]>([])

  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(record: MchAppPayConfigResult) {
    findPayWayList().then(({ data }) => {
      payWayList = data
    })
    editType = record.configId ? FormEditType.Edit : FormEditType.Add
    initFormEditType(editType)
    resetForm()
    form.mchCode = record.mchCode
    form.mchAppCode = record.mchAppCode
    getInfo(record.configId, editType)
  }
  // 获取信息
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit].includes(editType)) {
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
          ...diffForm(rawForm, form, 'wxMchId', 'wxAppId', 'p12', 'appSecret', 'apiKeyV2', 'apiKeyV3', 'keyPem', 'certPem'),
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
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped>
  .vben-basic-title {
    font-size: 14px;
  }
</style>
