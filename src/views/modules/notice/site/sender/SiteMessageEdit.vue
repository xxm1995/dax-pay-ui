<template>
  <basic-modal
    defaultFullscreen
    v-bind="$attrs"
    width="60%"
    title="发布系统通知消息"
    :loading="confirmLoading"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-form layout="vertical" ref="formRef" :validate-trigger="['blur', 'change']" :model="form" :rules="rules">
      <a-form-item label="标题" name="title">
        <a-input v-model:value="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item ref="content" label="内容" name="content">
        <div style="border: 1px solid #ccc">
          <a-form-item-rest>
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="{}" mode="simple" />
          </a-form-item-rest>
          <Editor
            style="height: 300px; max-height: 650px"
            v-model="form.content"
            :defaultConfig="{ placeholder: '请输入内容...' }"
            mode="simple"
            @onCreated="handleCreated"
          />
        </div>
      </a-form-item>
      <a-form-item label="截止有效期" name="efficientTime">
        <a-date-picker style="width: 100%" placeholder="请选择消息截止有效期" valueFormat="YYYY-MM-DD" v-model:value="form.efficientTime" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import '@wangeditor/editor/dist/css/style.css' // 引入 css
  import { nextTick, onBeforeUnmount, reactive, shallowRef } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { saveOrUpdate, get } from '../SiteMessage.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
  import { SiteMessage } from '/@/views/modules/notice/site/SiteMessage.api'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import XEUtils from 'xe-utils'

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

  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef()
  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref<SiteMessage>({
    title: '',
    content: '',
    efficientTime: null,
    receiveType: 'all',
  })
  // 校验
  const rules = reactive({
    title: [{ required: true, message: '标题不可为空!' }],
    content: [{ required: true, message: '内容不可为空!' }],
    efficientTime: [{ required: true, message: '截止有效期不可为空!' }],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])

  // 记录 editor 实例，重要！
  const handleCreated = (editor) => {
    editorRef.value = editor
  }

  // 入口
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
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
      const date = XEUtils.getWhatDay(new Date(), 30)
      form.efficientTime = XEUtils.toDateString(date, 'yyyy-MM-dd')
    }
  }
  // 保存
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      await saveOrUpdate(form)
      confirmLoading.value = false
      handleCancel()
      emits('ok')
    })
  }

  // 重置表单的校验
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
