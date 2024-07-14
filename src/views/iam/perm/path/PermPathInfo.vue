<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1000"
    title="查看"
    :open="visible"
    @cancel="visible = false"
  >
    <description :column="1" size="small" :data="data" :schema="schema" />
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="visible = false">取消</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { get, PermPath } from './PermPath.api'
  import { BasicModal } from '@/components/Modal'
  import { DescItem, Description } from '@/components/Description'
  import { ref } from 'vue'


  let data = ref<PermPath>({})
  let visible = ref(false)
  let confirmLoading = ref(false)
  let schema = [
    { field: 'id', label: '主键', labelMinWidth: 100 },
    { field: 'parentCode', label: '上级标识' },
    { field: 'name', label: '权限名称' },
    { field: 'method', label: '请求类型' },
    { field: 'path', label: '请求路径' },
  ] as DescItem[]

  function show(id) {
    visible.value = true
    confirmLoading.value = true
    get(id).then((res) => {
      data.value = res.data
      confirmLoading.value = false
    })
  }

  defineExpose({
    show,
  })
</script>

<style lang="less" scoped></style>
