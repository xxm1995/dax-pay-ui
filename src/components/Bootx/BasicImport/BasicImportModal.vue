<template>
  <basic-modal v-bind="$attrs" :loading="confirmLoading" :title="title" :width="modalWidth" :visible="visible" @cancel="handleCancel">
    <a-form ref="formRef">
      <!--   模板下载区域    -->
      <a-form-item label="导入模板">
        <a-button @click="downTemplate">下载</a-button>
      </a-form-item>
      <!--   文件上传区域   -->
      <a-form-item label="文件导入">
        <a-upload :file-list="fileList" :max-count="1" :before-upload="beforeUpload" @remove="handleRemove">
          <a-button preIcon="ant-design:upload-outlined" type="primary">选择文件</a-button>
        </a-upload>
      </a-form-item>
      <!--   选择重复情况下的处理方式   -->
      <a-form-item label="数据重复处理方式">
        <a-select v-model:value="repeatType">
          <a-select-option value="skip">跳过</a-select-option>
          <a-select-option value="cover">覆盖</a-select-option>
          <a-select-option value="error">报错</a-select-option>
        </a-select>
      </a-form-item>
      <!--   上传报错的回显   -->
      <a-form-item label="上传结果">
        <a-textarea :rows="3" v-model:value="result.msg" disabled />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button key="forward" :disabled="!fileList.length" :loading="confirmLoading" type="primary" @click="handleOk">导入</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { $ref } from 'vue/macros'
  import { Result } from '/#/axios'
  import { defHttp } from '/@/utils/http/axios'
  import { getAppEnvConfig } from '/@/utils/env'
  import { downloadByData } from '/@/utils/file/download'

  const { VITE_GLOB_API_URL } = getAppEnvConfig()

  const props = withDefaults(
    defineProps<{
      // 宽度
      modalWidth?: number | string
      // 模板下载地址
      templateUrl: string
      // 模板名称
      templateName?: string
      // 名称
      title?: string
      // 上传地址
      uploadUrl: string
      // 上传时附加的参数
      uploadParam?: object
    }>(),
    { title: '通用导入', modalWidth: 640, templateName: '导入模板.xls' },
  )

  let visible = $ref(false)
  let confirmLoading = $ref(false)
  // 处理方式
  let repeatType = $ref('skip')
  let result = $ref<Result>({} as Result)

  let fileList = $ref<any>([])

  /**
   * 初始化
   */
  function init() {
    visible = true
    confirmLoading = false
    repeatType = 'skip'
    fileList = []
    result = {} as Result
  }

  /**
   * 添加要上传的文件
   */
  function beforeUpload(file) {
    fileList = [file]
    return false
  }

  /**
   * 删除上传的文件
   * @param file
   */
  function handleRemove(file) {
    const index = fileList.indexOf(file)
    const newFileList = fileList.slice()
    newFileList.splice(index, 1)
    fileList = newFileList
  }

  /**
   * 下载模板
   */
  function downTemplate() {
    defHttp
      .get({
        url: props.templateUrl,
        responseType: 'blob',
      })
      .then((response) => {
        downloadByData(response, props.templateName)
      })
  }

  /**
   * 关闭
   */
  function handleCancel() {
    visible = false
  }

  /**
   * 上传
   */
  function handleOk() {
    confirmLoading = true
    defHttp
      .uploadFile({ url: VITE_GLOB_API_URL + props.uploadUrl }, { data: { ...props.uploadParam, repeatType }, file: fileList[0] })
      .then(({ data }) => {
        result = data
        confirmLoading = false
      })
  }

  defineExpose({ init })
</script>

<style scoped lang="less"></style>
