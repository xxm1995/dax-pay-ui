<template>
  <basic-drawer forceRender showFooter v-bind="$attrs" title="数据源列表" width="35%" :visible="visible" @close="visible = false">
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: query }" />
    <vxe-table row-id="key" ref="xTable" :data="records" :loading="loading">
      <vxe-column type="seq" width="60" />
      <vxe-column field="key" title="数据源" />
      <vxe-column fixed="right" width="50" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <a-link danger @click="remove(row)">删除</a-link>
        </template>
      </vxe-column>
    </vxe-table>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { $ref } from 'vue/macros'
  import { findAllDataSource, removeDataSourceByKey } from './DynamicDataSource.api'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { KeyValue } from '/#/web'

  const { notification, createMessage, createConfirm } = useMessage()

  let records = $ref<KeyValue[]>([])
  let loading = $ref(false)
  let visible = $ref(false)
  // 打开列表
  function show() {
    visible = true
    query()
  }
  // 查询数据
  function query() {
    loading = true
    findAllDataSource().then(({ data }) => {
      records = data
      loading = false
    })
    return Promise.resolve()
  }
  // 移除数据源
  function remove(record) {
    createConfirm({
      iconType: 'warning',
      title: '移除',
      content: '是否将该数据源从系统中移除',
      onOk: () => {
        removeDataSourceByKey(record.key).then(() => {
          createMessage.success('移除成功')
          query()
        })
      },
    })
  }
  defineExpose({
    show,
  })
</script>

<style scoped></style>
