<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="60%"
    title="云闪付支付配置"
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
        <a-form-item label="商户号" name="machId">
          <a-input v-model:value="form.machId" :disabled="showable" placeholder="请输入商户号" />
        </a-form-item>
        <a-form-item label="是否启用" name="enable">
          <a-switch checked-children="启用" un-checked-children="停用" v-model:checked="form.enable" />
        </a-form-item>
        <a-form-item name="limitAmount">
          <template #label>
            <basic-title helpMessage="每次发起支付的金额不能超过该值，如果同时配置了全局支付限额，则以额度低的为准">
              支付限额(元)
            </basic-title>
          </template>
          <a-input-number :precision="2" :min="0.01" v-model:value="form.limitAmount" placeholder="请输入支付限额(元)" />
        </a-form-item>
        <a-form-item label="签名类型" name="signType">
          <a-select
            allowClear
            :disabled="showable"
            :options="signTypeList"
            v-model:value="form.signType"
            style="width: 100%"
            placeholder="选择支付方式"
          />
        </a-form-item>
        <a-form-item name="keyPrivateCert" label="应用私钥证书">
          <a-upload
            v-if="!form.keyPrivateCert"
            :disabled="showable"
            name="file"
            :multiple="false"
            :action="uploadAction"
            :headers="tokenHeader"
            :showUploadList="false"
            @change="(info) => handleChange(info, 'keyPrivateCert')"
          >
            <a-button type="primary" preIcon="carbon:cloud-upload"> 证书上传 </a-button>
          </a-upload>
          <a-input v-else defaultValue="acp_enc.cer" disabled>
            <template #addonAfter v-if="!showable">
              <a-tooltip>
                <template #title> 删除上传的证书文件 </template>
                <icon @click="form.keyPrivateCert = ''" icon="ant-design:close-circle-outlined" :size="20" />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="私钥证书密码" name="keyPrivateCertPwd">
          <a-input allow-clear v-model:value="form.keyPrivateCertPwd" :disabled="showable" placeholder="请输入私钥证书密码" />
        </a-form-item>
        <a-form-item name="acpMiddleCert" label="中级证书">
          <a-upload
            v-if="!form.acpMiddleCert"
            :disabled="showable"
            name="file"
            :multiple="false"
            :action="uploadAction"
            :headers="tokenHeader"
            :showUploadList="false"
            @change="(info) => handleChange(info, 'acpMiddleCert')"
          >
            <a-button type="primary" preIcon="carbon:cloud-upload"> 证书上传 </a-button>
          </a-upload>
          <a-input v-else defaultValue="acp_middle.cer" disabled>
            <template #addonAfter v-if="!showable">
              <a-tooltip>
                <template #title> 删除上传的证书文件 </template>
                <icon @click="form.acpMiddleCert = ''" icon="ant-design:close-circle-outlined" :size="20" />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="acpRootCert" label="根证书">
          <a-upload
            v-if="!form.acpRootCert"
            :disabled="showable"
            name="file"
            :multiple="false"
            :action="uploadAction"
            :headers="tokenHeader"
            :showUploadList="false"
            @change="(info) => handleChange(info, 'acpRootCert')"
          >
            <a-button type="primary" preIcon="carbon:cloud-upload"> 证书上传 </a-button>
          </a-upload>
          <a-input v-else defaultValue="acp_root.cer" disabled>
            <template #addonAfter v-if="!showable">
              <a-tooltip>
                <template #title> 删除上传的证书文件 </template>
                <icon @click="form.acpRootCert = ''" icon="ant-design:close-circle-outlined" :size="20" />
              </a-tooltip>
            </template>
          </a-input>
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
        <a-form-item label="测试环境" name="sandbox">
          <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.sandbox" />
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
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { BasicDrawer } from '/@/components/Drawer'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import { useUpload } from '/@/hooks/bootx/useUpload'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import BasicTitle from '/@/components/Basic/src/BasicTitle.vue'
  import { getConfig, update, findPayWayList, generateNotifyUrl, generateReturnUrl, UnionPayConfig } from './UnionPayConfig.api'
  import { useDict } from '/@/hooks/bootx/useDict'

  const { handleCancel, search, diffForm, labelCol, wrapperCol, modalWidth, title, confirmLoading, visible, editable, showable } =
    useFormEdit()
  // 文件上传
  const { tokenHeader, uploadAction } = useUpload('/union/pay/config/toBase64')
  const { createMessage } = useMessage()
  const { dictDropDown } = useDict()

  // 表单
  const formRef = $ref<FormInstance>()
  let rawForm: any
  let form = $ref<UnionPayConfig>({
    id: null,
    seller: '',
    limitAmount: 20000,
    enable: false,
    notifyUrl: '',
    returnUrl: '',
    payWays: [],
    sandbox: false,
  })
  // 校验
  const rules = computed(() => {
    return {
      machId: [{ required: true, message: '请输入商户号' }],
      wxAppId: [{ required: true, message: '请输入应用编号' }],
      limitAmount: [{ required: true, message: '请输入单次支付限额' }],
      // certSign: [{ required: true, message: '请选择是否为证书签名' }],
      signType: [{ required: true, message: '请选择签名类型' }],
      keyPrivateCert: [{ required: true, message: '请上传应用私钥证书' }],
      keyPrivateCertPwd: [{ required: true, message: '请输入应用私钥证书密码' }],
      acpMiddleCert: [{ required: true, message: '请上传中级证书' }],
      acpRootCert: [{ required: true, message: '请上传根证书' }],
      enable: [{ required: true, message: '请选择是否启用' }],
      notifyUrl: [{ required: true, message: '请输入异步通知页面地址' }],
      returnUrl: [{ required: true, message: '请输入同步通知页面地址' }],
      apiVersion: [{ required: true, message: '请选择支付API版本' }],
      apiKeyV2: [{ required: true, message: '请输入V2秘钥' }],
      sandbox: [{ required: true, message: '请选择是否为沙箱环境' }],
      payWays: [{ required: true, message: '请选择支持的支付类型' }],
    } as Record<string, Rule[]>
  })

  let payWayList = $ref<LabeledValue[]>([])
  let signTypeList = $ref<LabeledValue[]>([])

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
  async function getInfo() {
    confirmLoading.value = true
    findPayWayList().then(({ data }) => {
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
    signTypeList = await dictDropDown('UnionPaySignType')
  }
  // 保存
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
        ...diffForm(rawForm, form, 'keyPrivateCert', 'keyPrivateCertPwd', 'acpMiddleCert', 'acpRootCert'),
      }).finally(() => {
        confirmLoading.value = false
      })
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
