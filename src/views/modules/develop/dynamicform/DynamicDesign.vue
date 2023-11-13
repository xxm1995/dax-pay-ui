<template>
  <vxe-modal v-model="visible" title="表单设计器" fullscreen destroy-on-close>
    <a-spin :spinning="confirmLoading">
      <EDesigner ref="designer" @save="save" />
    </a-spin>
  </vxe-modal>
</template>

<script lang="ts" setup>
  import 'epic-designer/dist/style.css'

  import { EDesigner } from 'epic-designer'
  import { $ref } from 'vue/macros'
  import { DynamicForm, get } from './DynamicForm.api'
  import { toStringJSON } from 'xe-utils'
  import { VxeModal } from 'vxe-table'

  let designer = $ref<any>()
  let form = $ref<DynamicForm>()

  let visible = $ref(false)
  let confirmLoading = $ref(false)
  /**
   * 初始化
   */
  function init(id) {
    visible = true
    confirmLoading = true
    get(id).then((res) => {
      form = res.data
      if (form.value) {
        designer.setData(toStringJSON(form.value))
      }
      confirmLoading = false
    })
  }

  /**
   * 保存
   */
  function save(json) {
    // TODO 等后续更新
  }
  defineExpose({ init })
</script>

<style scoped lang="less"></style>
