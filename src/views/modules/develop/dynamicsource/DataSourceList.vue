<template>
  <basic-drawer forceRender showFooter v-bind="$attrs" title="字典列表" width="35%" :visible="visible" @close="visible = false">
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ query: query }" />
      <vxe-table row-id="id" ref="xTable" :data="records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="code" title="数据源" />
        <vxe-column fixed="right" width="50" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-popconfirm title="是否删除" @confirm="remove(row)" okText="是" cancelText="否">
              <a-link danger>删除</a-link>
            </a-popconfirm>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { $ref } from 'vue/macros'
  import {
    addDynamicDataSourceById
  } from "/@/views/modules/develop/dynamicsource/DynamicDataSource.api";
  import { useMessage } from "/@/hooks/web/useMessage";

  const { notification, createMessage, createConfirm } = useMessage()

  let records = $ref<string[]>([])
  let loading = $ref(false)
  function query(){

  }
  function remove(record){
    createConfirm({
      iconType: 'warning',
      title: '重新添加',
      content: '该数据源配置已经应用，是否进行更新',
      onOk: () => {
        addDynamicDataSourceById(record.id).then(() => {
          createMessage.success('更新成功')
        })
      },
    })
  }
</script>

<style scoped></style>
