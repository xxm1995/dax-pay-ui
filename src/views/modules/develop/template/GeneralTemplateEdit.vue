<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="40%"
    :title="title"
    :destroyOnClose="true"
    :maskClosable="false"
    :visible="visible"
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
        <a-form-item label="模板代码" name="code">
          <a-input v-model:value="form.code" :disabled="showable" placeholder="请输入模板代码" />
        </a-form-item>
        <a-form-item label="模板名称" name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入模板名称" />
        </a-form-item>
        <a-form-item label="模板文件" name="fileId">
          <a-upload
            v-if="!form.fileId"
            :disabled="showable"
            name="file"
            :multiple="false"
            :action="uploadAction"
            :headers="tokenHeader"
            @change="handleChange"
            :showUploadList="false"
          >
            <a-button type="primary" preIcon="carbon:cloud-upload"> 模板文件上传 </a-button>
          </a-upload>
          <a-input v-else defaultValue="模板文件" disabled>
            <template #addonAfter v-if="!showable">
              <a-tooltip>
                <template #title> 删除上传的模板文件 </template>
                <icon @click="removeFile" icon="ant-design:close-circle-outlined" :size="20" />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="使用类型" name="useType">
          <a-select v-model:value="form.useType" :disabled="showable" :options="useTypes" placeholder="请选择数据库类型" />
        </a-form-item>
        <a-form-item label="是否启用" name="state">
          <a-switch
            :disabled="showable"
            checked-children="是"
            checked-value="enable"
            un-checked-children="否"
            un-checked-value="disable"
            v-model:checked="form.state"
          />
        </a-form-item>
        <template v-if="form.fileId">
          <a-form-item label="文件类型" name="fileType">
            <a-input disabled v-model:value="form.fileType" />
          </a-form-item>
          <a-form-item label="模板后缀名" name="fileSuffix">
            <a-input disabled v-model:value="form.fileSuffix" />
          </a-form-item>
          <a-form-item label="备注" name="remark">
            <a-textarea :rows="3" v-model:value="form.remark" :disabled="showable" placeholder="请输入备注" />
          </a-form-item>
        </template>
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
  import { add, get, update, existsByCode, existsByCodeNotId, GeneralTemplate } from './GeneralTemplate.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useUpload } from '/@/hooks/bootx/useUpload'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useValidate } from '/@/hooks/bootx/useValidate'
  import { useDict } from '/@/hooks/bootx/useDict'
  import Icon from '/@/components/Icon'
  import { addDynamicDataSourceById } from '/@/views/modules/develop/dynamicsource/DynamicDataSource.api'
  import { UpdateFileInfo } from '/@/api/common/FileUpload'
  import { Result } from '/#/axios'
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
  const { tokenHeader, uploadAction } = useUpload('/file/upload')
  const { createMessage, createConfirm } = useMessage()
  const { existsByServer } = useValidate()
  const { dictDropDown } = useDict()

  let useTypes = $ref<LabeledValue[]>([])

  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref<GeneralTemplate>({
    id: null,
    name: '',
    code: '',
    useType: undefined,
    fileType: '',
    fileSuffix: '',
    state: 'enable',
    fileId: '',
    remark: '',
  })
  // 校验
  const rules = reactive({
    name: [{ required: true, message: '模板名称不可为空' }],
    fileId: [{ required: true, message: '模板文件不可为空' }],
    useType: [{ required: true, message: '请选择类型' }],
    state: [{ required: true, message: '请选择是否启用' }],
    code: [
      { required: true, message: '模板代码不可为空' },
      { required: true, validator: validateCode, trigger: 'blur' },
    ],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
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
    useTypes = await dictDropDown('GeneralTemplateUseType')
  }

  /**
   * 获取信息
   */
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form = data
        confirmLoading.value = false
        console.log(confirmLoading.value)
      })
    }
  }
  /**
   * 校验编码重复
   */
  async function validateCode() {
    const { code, id } = form
    return existsByServer(code, id, formEditType, existsByCode, existsByCodeNotId)
  }
  /**
   * 上传完成回调
   */
  function handleChange(info) {
    if (info.file.status === 'done') {
      if (!info.file.response.code) {
        // 回写数据
        const { data: fileInfo } = info.file.response as Result<UpdateFileInfo>
        form.fileId = fileInfo.id
        form.fileSuffix = fileInfo.fileSuffix
        form.fileType = fileInfo.fileType
        console.log(form)
        createMessage.success(`${info.file.name} 上传成功!`)
      } else {
        createMessage.error(`${info.file.response.msg}`)
      }
    } else if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  /**
   * 删除上传的模板文件
   */
  function removeFile() {
    createConfirm({
      iconType: 'warning',
      title: '删除',
      content: '是否删除上传的模板文件',
      onOk: () => {
        form.fileId = undefined
      },
    })
  }

  /**
   * 保存
   */
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
