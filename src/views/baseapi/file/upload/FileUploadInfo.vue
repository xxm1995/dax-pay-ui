<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1000"
    title="查看"
    :open="visible"
    @cancel="visible = false"
  >
    <description :column="1" :data="data" :schema="schema" />
    <template #footer>
      <a-button key="cancel" @click="visible = false">取消</a-button>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { DescItem, Description } from '@/components/Description'
  import { get, UpdateFileInfo } from './FileUpload.api'
  import { ref } from 'vue'

  let data = ref<UpdateFileInfo>({})
  let confirmLoading = ref<boolean>(false)
  let visible = ref<boolean>(false)
  let schema = [
    { field: 'id', label: '主键' },
    { field: 'originalFilename', label: '原始文件名' },
    { field: 'filename', label: '文件储存名称' },
    { field: 'url', label: '存储和访问路径' },
    { field: 'ext', label: '文件扩展名' },
    { field: 'contentType', label: 'MIME类型' },
    { field: 'platform', label: '存储平台' },
    { field: 'createTime', label: '创建时间' },
  ] as DescItem[]

  /**
   * 初始化数据
   */
  function init(id) {
    visible.value = true
    get(id).then((res) => {
      data.value = res.data
    })
  }
  defineExpose({ init })
</script>

<style scoped lang="less"></style>
