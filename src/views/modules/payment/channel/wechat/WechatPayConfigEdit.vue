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
        <a-form-item label="商户号" name="mchId">
          <a-input v-model:value="form.mchId" :disabled="showable" placeholder="请输入商户号" />
        </a-form-item>
        <a-form-item label="应用编号" name="appId">
          <a-input v-model:value="form.appId" :disabled="showable" placeholder="请输入微信应用AppId" />
        </a-form-item>
        <a-form-item label="AppSecret" name="appSecret">
          <a-input v-model:value="form.appSecret" :disabled="showable" placeholder="APPID对应的接口密码，用于获取接口调用凭证时使用" />
        </a-form-item>
        <a-form-item label="超时配置" name="expireTime">
          <a-input-number :min="1" :max="12000" :step="1" :disabled="showable" v-model:value="form.expireTime" />
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
        <a-form-item label="是否沙箱环境" name="sandbox">
          <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.sandbox" :disabled="showable" />
        </a-form-item>
        <a-form-item label="是否启用" v-show="showable" name="activity">
          <a-tag>{{ form.activity ? '启用' : '未启用' }}</a-tag>
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
            @change="handleChange"
          >
            <a-button type="primary" preIcon="carbon:cloud-upload"> p12证书上传 </a-button>
          </a-upload>
          <a-input v-else v-model:value="form.p12" disabled>
            <template #addonAfter v-if="!showable">
              <a-tooltip>
                <template #title> 删除上传的证书文件 </template>
                <icon @click="form.p12 = null" icon="ant-design:close-circle-outlined" :size="20" />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="APIv2密钥" name="apiKeyV2">
          <a-textarea :disabled="showable" v-model:value="form.apiKeyV2" placeholder="请输入APIv2密钥" />
        </a-form-item>
        <a-form-item label="APIv3密钥" name="apiKeyV3">
          <a-textarea :disabled="showable" v-model:value="form.apiKeyV3" placeholder="请输入APIv3密钥" />
        </a-form-item>
        <a-form-item label="证书(cert.pem)" name="certPem">
          <a-textarea :disabled="showable" v-model:value="form.certPem" placeholder="请填入证书内容" />
        </a-form-item>
        <a-form-item label="私钥(key.pem)" name="keyPem">
          <a-input v-model:value="form.keyPem" :disabled="showable" placeholder="请填入私钥内容" />
        </a-form-item>
        <a-form-item label="异步通知UR" name="notifyUrl">
          <a-input v-model:value="form.notifyUrl" :disabled="showable" placeholder="请输入服务器异步通知页面路径" />
        </a-form-item>
        <a-form-item label="同步通知URL" name="returnUrl">
          <a-input v-model:value="form.returnUrl" :disabled="showable" placeholder="请输入页面跳转同步通知页面路径" />
        </a-form-item>
        <a-form-item label="应用域名" name="domain">
          <a-input v-model:value="form.domain" :disabled="showable" placeholder="请输入应用域名，回调中会使用此参数" />
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
  import { add, get, update, findPayWayList, WechatPayConfig } from './WechatPayConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicDrawer } from '/@/components/Drawer'
  import { KeyValue } from '/#/web'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import { useUpload } from '/@/hooks/bootx/useUpload'
  import { useMessage } from '/@/hooks/web/useMessage'

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
  const { tokenHeader, uploadAction } = useUpload('/file/upload')
  const { createMessage } = useMessage()

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

  let payWayList = $ref<KeyValue[]>([])

  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType) {
    findPayWayList().then(({ data }) => {
      payWayList = data
      console.log(payWayList)
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
        await update({ ...form, ...diffForm(rawForm, form, 'mchId', 'appId', 'appSecret', 'apiKeyV2', 'apiKeyV3', 'keyPem', 'certPem') })
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
  function handleChange(info) {
    // 上传完毕
    if (info.file.status === 'done') {
      const res = info.file.response
      if (!res.code) {
        form.p12 = res.data.id
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
