<template>
  <a-spin :spinning="confirmLoading">
    <a-form layout="vertical" ref="formRef" :validate-trigger="['blur', 'change']" :model="form" :rules="rules">
      <a-form-item label="标题" name="subject">
        <a-input v-model:value="form.subject" placeholder="请输入邮件名称" />
      </a-form-item>
      <a-form-item validateFirst label="邮箱" name="email">
        <a-input v-model:value="form.email" placeholder="请输入用户邮箱" />
      </a-form-item>
      <a-form-item ref="content" label="内容" name="message">
        <div style="border: 1px solid #ccc">
          <a-form-item-rest>
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="{}" mode="simple" />
          </a-form-item-rest>
          <Editor
            style="height: 300px; max-height: 650px"
            v-model="form.message"
            :defaultConfig="{ placeholder: '请输入内容...' }"
            mode="simple"
            @onCreated="handleCreated"
          />
        </div>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button @click="resetForm">重置</a-button>
          <a-button :loading="confirmLoading" type="primary" @click="send">发送</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script lang="ts" setup>
  import '@wangeditor/editor/dist/css/style.css' // 引入 css
  import { $ref } from 'vue/macros'
  import { validateEmail } from '/@/utils/validate'
  import { nextTick, onBeforeUnmount, shallowRef } from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { renderHtml } from '/@/utils/lib/wangEditorUtil'
  import { sentSimpleMail } from '/@/views/modules/demo/notice/email/emailSenderDemo.api'
  import { useMessage } from '/@/hooks/web/useMessage'

  const { createMessage } = useMessage()
  let confirmLoading = $ref(false)
  let formRef = $ref<FormInstance>()
  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef()
  let form = $ref({
    subject: '',
    email: '',
    message: '',
  })
  const rules = {
    subject: [{ required: true, message: '请输入标题' }],
    email: [{ required: true, message: '请输入要发送的邮箱地址' }, { validator: validateEmailRule }],
    message: [{ required: true, message: '请输入邮件内容' }],
  }

  // 记录 editor 实例，重要！
  const handleCreated = (editor) => {
    editorRef.value = editor
  }

  /**
   * 发送
   */
  function send() {
    formRef?.validate().then(() => {
      // 渲染邮件样式
      const message = renderHtml(form.message)
      confirmLoading = true
      sentSimpleMail({
        ...form,
        message,
      })
        .then(() => {
          createMessage.success('发送成功')
          resetForm()
        })
        .catch(() => {
          confirmLoading = false
        })
    })
  }
  function resetForm() {
    nextTick(() => {
      form.resetFields()
      this.confirmLoading = false
    })
  }

  function validateEmailRule(rule, value, callback) {
    const { msg, result } = validateEmail(value)
    result ? callback() : callback(msg)
  }

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })
</script>

<style scoped></style>
