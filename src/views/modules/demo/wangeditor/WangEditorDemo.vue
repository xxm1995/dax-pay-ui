<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="{}" mode="simple" />
        <Editor style="height: 500px; overflow-y: hidden" v-model="html" :defaultConfig="{}" mode="simple" @onCreated="handleCreated" />
        <a-textarea disabled v-model:value="html" />
        <div class="editor-content-view" v-html="html"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import '@wangeditor/editor/dist/css/style.css' // 引入 css
  import { onBeforeUnmount, shallowRef } from 'vue'
  import { $ref } from 'vue/macros'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef()
  const html = $ref<string>('')

  // 记录 editor 实例，重要！
  const handleCreated = (editor) => {
    editorRef.value = editor
  }

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })
</script>

<style scoped></style>
