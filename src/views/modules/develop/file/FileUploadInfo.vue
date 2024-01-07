<template>
  <basic-modal v-bind="$attrs" :loading="confirmLoading" width="50%" title="查看" :visible="visible" @cancel="visible = false">
    <description :column="1" :data="data" :schema="schema" />
    <template #footer>
      <a-button key="cancel" @click="visible = false">取消</a-button>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { DescItem, Description } from '/@/components/Description'
  import { UpdateFileInfo } from '/@/api/common/FileUpload'
  import { get } from '/@/views/modules/develop/file/FileUpload.api'
  import { $ref } from 'vue/macros'

  let data = $ref<UpdateFileInfo>({})
  let confirmLoading = $ref<boolean>(false)
  let visible = $ref<boolean>(false)
  let schema = [
    { field: 'id', label: '主键' },
    { field: 'filename', label: '文件储存名称' },
    { field: 'originalFilename', label: '原始文件名' },
    { field: 'ext', label: '文件扩展名' },
    { field: 'contentType', label: 'MIME类型' },
    { field: 'platform', label: '存储平台' },
    { field: 'objectId', label: '关联外部ID' },
    { field: 'createTime', label: '创建时间' },
  ] as DescItem[]

  /**
   * 初始化数据
   */
  function init(id) {
    visible = true
    get(id).then((res) => {
      data = res.data
    })
  }
  defineExpose({ init })
</script>

<style scoped lang="less"></style>
