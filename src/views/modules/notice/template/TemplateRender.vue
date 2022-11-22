<template>
  <basic-modal v-bind="$attrs" width="60%" title="渲染测试" :loading="confirmLoading" :visible="visible" @cancel="handleCancel">
    <a-form ref="formRef" layout="vertical">
      <a-form-item label="模板名称">
        <a-input v-model:value="templateInfo.name" disabled />
      </a-form-item>
      <a-form-item label="模板数据">
        <code-editor style="height: 100px" readonly v-model:value="templateInfo.data" :mode="MODE.HTML" />
      </a-form-item>
      <a-form-item label="测试参数(json格式)">
        <div style="border: 1px solid #ccc">
          <code-editor style="height: 150px" v-model:value="param" :mode="MODE.JSON" />
        </div>
      </a-form-item>
      <a-form-item label="渲染内容">
        <div style="border: 1px solid #ccc">
          <div class="editor-content-view" v-html="renderContent"></div>
        </div>
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">渲染</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import CodeEditor from '/@/components/CodeEditor/src/CodeEditor.vue'
  import { MODE } from '/@/components/CodeEditor'
  import { $ref } from 'vue/macros'
  import { get, MessageTemplate, render } from '/@/views/modules/notice/template/MessageTemplate.api'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { useMessage } from '/@/hooks/web/useMessage'

  const { createMessage } = useMessage()

  let confirmLoading = $ref(false)
  let visible = $ref(false)
  let param = $ref('')
  let templateInfo = $ref<MessageTemplate>({})
  let renderContent = $ref<string>('')

  function init(info: MessageTemplate) {
    visible = true
    templateInfo = info
    renderContent = ''
    param = ''
    confirmLoading = true
    get(info.id).then(({ data }) => {
      templateInfo = data
      confirmLoading = false
    })
  }

  function handleOk() {
    let json
    try {
      json = JSON.parse(param || '{}')
    } catch (err) {
      createMessage.error('测试数据格式不不正确，请检查是否是json格式数据')
      return
    }
    render(templateInfo.code, json).then(({ data }) => {
      renderContent = data
    })
  }

  function handleCancel() {
    visible = false
  }

  defineExpose({ init })
</script>

<style scoped></style>
