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
        <a-form-item label="通道编码" name="code">
          <a-input v-model:value="form.code" :disabled="showable" placeholder="请输入通道编码" />
        </a-form-item>
        <a-form-item label="支付通道名称" name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入支付通道名称" />
        </a-form-item>
        <a-form-item label="排序" name="sortNo">
          <a-input-number placeholder="请输入排序，可以是小数" :disabled="showable" v-model:value="form.sortNo" style="width: 200px" />
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
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { nextTick, reactive } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, get, update, existsByCode, existsByCodeNotId, PayChannelConfig } from './PayChannelConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicDrawer } from '/@/components/Drawer'
  import { useValidate } from '/@/hooks/bootx/useValidate'
  import { useUpload } from '/@/hooks/bootx/useUpload'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { getFilePreviewUrlPrefix } from '/@/api/common/FileUpload'
  const {
    initFormEditType,
    handleCancel,
    search,
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
  const { existsByServer } = useValidate()
  const { tokenHeader, uploadAction } = useUpload('/file/upload')
  const { createMessage } = useMessage()

  // 表单
  const formRef = $ref<FormInstance>()
  let urlPrefix = $ref<string>()
  let form = $ref<PayChannelConfig>({
    id: null,
    code: '',
    name: '',
    sortNo: 0,
    image: undefined,
  })
  // 校验
  const rules = reactive({
    code: [
      { required: true, message: '请输入支付通道编码' },
      { validator: validateCode, trigger: 'blur' },
    ],
    name: [{ required: true, message: '请输入支付通道编码' }],
    sortNo: [{ required: true, message: '请输入支付通道编码' }],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    initData()
    resetForm()
    getInfo(id, editType)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    const result = await getFilePreviewUrlPrefix()
    urlPrefix = result.data
  }

  // 获取信息
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
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
        await update(form)
      }
      confirmLoading.value = false
      handleCancel()
      emits('ok')
    })
  }
  // 校验编码重复
  async function validateCode() {
    const { code, id } = form
    return existsByServer(code, id, formEditType, existsByCode, existsByCodeNotId)
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
