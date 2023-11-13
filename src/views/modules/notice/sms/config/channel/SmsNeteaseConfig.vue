<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="60%"
    title="网易云短信配置"
    :visible="visible"
    :maskClosable="false"
    @close="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        class="small-from-item"
        ref="formRef"
        :rules="rules"
        :model="form"
        :validate-trigger="['blur', 'change']"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="AccessKey" name="accessKey">
          <a-input v-model:value="form.accessKey" :disabled="showable" placeholder="请输入短信AccessKey" />
        </a-form-item>
        <a-form-item label="AccessSecret" name="accessSecret">
          <a-input v-model:value="form.accessSecret" :disabled="showable" placeholder="请输入短信AccessSecret" />
        </a-form-item>
        <a-form-item label="启用状态" name="state">
          <a-switch
            checked-children="启用"
            checked-value="normal"
            un-checked-children="停用"
            un-checked-value="forbidden"
            v-model:checked="form.state"
            :disabled="showable"
          />
        </a-form-item>
        <a-form-item label="排序" name="sortNo">
          <a-input-number placeholder="请输入排序，可以是小数" :disabled="showable" v-model:value="form.sortNo" style="width: 200px" />
        </a-form-item>

        <a-form-item label="模板变量" name="templateName">
          <a-input v-model:value="form.templateName" :disabled="showable" placeholder="请输入短信模板变量" />
        </a-form-item>
        <a-form-item label="模板短信请求地址" name="templateUrl">
          <a-input v-model:value="form.templateUrl" :disabled="showable" placeholder="请输入模板短信请求地址" />
        </a-form-item>
        <a-form-item label="验证码短信请求地址" name="codeUrl">
          <a-input v-model:value="form.codeUrl" :disabled="showable" placeholder="请输入验证码短信请求地址" />
        </a-form-item>
        <a-form-item label="验证码验证请求地址" name="verifyUrl">
          <a-input v-model:value="form.verifyUrl" :disabled="showable" placeholder="请输入验证码验证请求地址" />
        </a-form-item>
        <a-form-item label="短信上行" name="needUp">
          <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.state" :disabled="showable" />
        </a-form-item>

        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="form.remark" :disabled="showable" placeholder="请输入备注" />
        </a-form-item>
        <a-form-item label="logo图" name="image">
          <a-input v-model:value="form.value" v-show="false" />
          <a-form-item-rest>
            <a-upload
              v-if="!showable"
              name="file"
              :multiple="false"
              :action="uploadAction"
              :headers="tokenHeader"
              :showUploadList="false"
              @change="handleChange"
            >
              <a-button preIcon="ant-design:cloud-upload-outlined" type="primary"> 上传图片 </a-button>
            </a-upload>
          </a-form-item-rest>
          <a-form-item-rest v-if="form.image">
            <div style="margin-top: 15px">
              <a-image :src="urlPrefix + form.image" />
            </div>
          </a-form-item-rest>
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button key="forward" type="primary" :loading="confirmLoading" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-drawer>
</template>

<script setup lang="ts">
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { Rule } from '/@/components/Form'
  import { add, update, get, SmsChannelConfig } from '../SmsChannelConfig.api'
  import { useUpload } from '/@/hooks/bootx/useUpload'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { getFilePreviewUrlPrefix } from '/@/api/common/FileUpload'
  import { smsChannelEnum } from '/@/enums/notice/smsChannelEnum'
  import { toJSONString, toStringJSON } from 'xe-utils'
  import { nextTick } from 'vue'

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

  const formRef = $ref<FormInstance>()
  let urlPrefix = $ref<string>()

  let editType = $ref<FormEditType>()
  let rawForm: any = null

  let form = $ref<any>({
    sortNo: 0,
    state: 'normal',
    templateUrl: 'https://api.netease.im/sms/sendtemplate.action',
    codeUrl: 'https://api.netease.im/sms/sendcode.action',
    verifyUrl: 'https://api.netease.im/sms/verifycode.action',
  })

  const rules = {
    accessKey: [{ required: true, message: '请输入短信AccessKey' }],
    accessSecret: [{ required: true, message: '请输入短信accessSecret' }],
    sortNo: [{ required: true, message: '请输入排序' }],
    state: [{ required: true, message: '请选择启用状态' }],
  } as Record<string, Rule[]>
  // 事件
  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  function init(record: SmsChannelConfig) {
    editType = record.id ? FormEditType.Edit : FormEditType.Add
    initFormEditType(editType)
    initData()
    resetForm()
    getInfo(record.id, editType)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    const result = await getFilePreviewUrlPrefix()
    urlPrefix = result.data
  }

  /**
   * 获取数据
   * @param id
   * @param editType
   */
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit].includes(editType)) {
      confirmLoading.value = true
      // config配置进行反序列化, 同时追加到表单中
      get(id).then(({ data }) => {
        form = data
        if (form.config) {
          form = { ...form, ...toStringJSON(form.config) }
        }
        rawForm = { ...form }
        confirmLoading.value = false
      })
    }
  }

  /**
   * 文件上传
   */
  function handleChange(info) {
    // 上传完毕
    if (info.file.status === 'done') {
      const res = info.file.response
      if (!res.code) {
        form.image = res.data.id
        createMessage.success(`${info.file.name} 上传成功!`)
      } else {
        createMessage.error(`${res.msg}`)
      }
    } else if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  /**
   * 保存
   */
  function handleOk() {
    form.code = smsChannelEnum.NETEASE
    form.name = '网易云短信'
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(form)
      } else if (formEditType.value === FormEditType.Edit) {
        await update({ ...form, ...diffForm(rawForm, form, 'accessKey', 'accessSecret') })
      }
      confirmLoading.value = false
      handleCancel()
      emits('ok')
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
  defineExpose({ init })
</script>

<style scoped lang="less"></style>
