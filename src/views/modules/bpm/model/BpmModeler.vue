<template>
  <vxe-modal fullscreen v-model="visible" :title="title" destroy-on-close :show-header="isView" :esc-closable="isView" :show-footer="false">
    <process-design ref="processDesign" @save="save" @cancel="cancel" />
  </vxe-modal>
</template>

<script lang="ts" setup>
  import { $ref } from 'vue/macros'
  import ProcessDesign from '/@/views/modules/bpm/design/ProcessDesign.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { BpmModel, get, uploadBpmn } from './Model.api'
  import { PUBLISHED } from '/@/views/modules/bpm/model/node/BpmModelNodeCode'

  const { createConfirm, createMessage } = useMessage()

  let processDesign = $ref<any>()

  let visible = $ref<boolean>(false)
  let isEdit = $ref<boolean>(true)
  let isView = $ref<boolean>(false)
  let bpmModel = $ref<BpmModel>({})

  let title = $ref<string>('')

  function design(id, view: boolean) {
    visible = true
    isView = view
    get(id).then((res) => {
      bpmModel = res.data
      isEdit = bpmModel.publish !== PUBLISHED
      title = `查看 ${bpmModel.name} 流程图`
      processDesign.renderer(bpmModel.modelEditorXml, isEdit, isView)
    })
  }

  /**
   * 保存
   */
  function save(xml: string) {
    createConfirm({
      iconType: 'info',
      title: '保存',
      content: '是否保存该流程图',
      onOk: () => {
        uploadBpmn(bpmModel.id, xml)
        createMessage.success('保存成功')
        visible = false
      },
    })
  }

  /**
   * 关闭
   */
  function cancel() {
    console.log(isEdit)
    if (isEdit) {
      createConfirm({
        iconType: 'info',
        title: '警告',
        content: '关闭后后将不对编辑的内容进行保存!',
        okText: '关闭',
        onOk: () => {
          reset()
        },
      })
    } else {
      reset()
    }
  }

  function reset() {
    visible = false
    // isEdit = false
    // isView = false
  }

  defineExpose({
    design,
  })
</script>

<style scoped></style>
