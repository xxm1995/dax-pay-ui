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
        <a-form-item label="默认支付超时配置(分钟)" name="expireTime">
          <a-input-number :disabled="showable" placeholder="请输入超时配置" v-model:value="form.expireTime" />
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
  import { MchAppPayConfigResult } from '/@/views/modules/payment/app/MchApplication.api'
  import { dropdownTranslate } from '/@/utils/dataUtil'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useUpload } from '/@/hooks/bootx/useUpload'
  import { useMessage } from '/@/hooks/web/useMessage'
  import Icon from '/@/components/Icon/src/Icon.vue'
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
  // 读取证书内容
  const { tokenHeader, uploadAction } = useUpload('/alipay/readPem')
  const { createMessage } = useMessage()

  const formRef = $ref<FormInstance>()

  let editType = $ref<FormEditType>()
  let payWayList = $ref<LabeledValue[]>([])
  let form = $ref({
    // name: '',
    appId: '',
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
    expireTime: 15,
    payWayList: [],
    sandbox: false,
    remark: '',
  } as AlipayConfig)
  let rawForm
  // 校验
  const rules = computed(() => {
    return {
      // name: [{ required: true, message: '请输入配置名称' }],
      appId: [{ required: true, message: '请输入AppId' }],
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
      payWayList: [{ required: true, message: '请选择支持的支付类型' }],
    } as Record<string, Rule[]>
  })
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(record: MchAppPayConfigResult) {
    findPayWayList().then(({ data }) => {
      payWayList = dropdownTranslate(data, 'value', 'key')
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
          ...diffForm(rawForm, form, 'appId', 'alipayPublicKey', 'appCert', 'alipayCert', 'alipayRootCert', 'privateKey'),
        })
      }
      confirmLoading.value = false
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
