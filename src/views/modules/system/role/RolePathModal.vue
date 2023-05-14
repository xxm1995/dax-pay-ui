<template>
  <basic-drawer forceRender showFooter v-bind="$attrs" title="请求资源权限配置" width="40%" :visible="visible" @close="handleCancel">
    <a-spin :spinning="loading">
      <vxe-table
        row-id="id"
        border="none"
        ref="xTable"
        size="small"
        :loading="loading"
        :data="tableData"
        :showHeader="true"
        :tree-config="{ children: 'children' }"
        :checkbox-config="{ labelField: 'name', checkRowKeys: checkedKeys }"
      >
        <vxe-column type="checkbox" title="权限名称" tree-node />
        <vxe-column field="code" title="权限代码" />
      </vxe-table>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button @click="handleCancel()">取消</a-button>
        <a-button @click="handleSubmit()" type="primary" :loading="loading">保存</a-button>
      </a-space>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { $ref } from 'vue/macros'
  import { VxeTableInstance } from 'vxe-table'
  import { findPathIdsByRole, findPathsByUser, saveRoleMenu, saveRolePath } from "./Role.api";
  import XEUtils from 'xe-utils'

  const xTable = $ref<VxeTableInstance>()

  let loading = $ref(false)
  let roleId = $ref('')
  let visible = $ref(false)
  let checkedKeys = $ref<string[]>([])
  let tableData = $ref<string[]>([])

  async function init(id) {
    visible = true
    loading = true
    roleId = id
    await findPathIdsByRole(roleId).then(({ data }) => {
      checkedKeys = data
    })
    await findPathsByUser().then(({ data }) => {
      const result = [] as any[]
      // 对数据进行分组
      XEUtils.each(XEUtils.groupBy(data, 'groupName'), (children, key) => {
        result.push({
          name: key,
          children: children,
        })
      })
      tableData = result
      xTable.reloadData(tableData)
      loading = false
    })
  }

  // 保存
  function handleSubmit() {
    loading = true
    const checkedKeys = xTable
      .getCheckboxRecords()
      .map((res) => res.id)
      .filter((id) => id.indexOf('row_') === -1)
    saveRolePath({
      roleId,
      permissionIds: checkedKeys,
    }).then(() => {
      handleCancel()
    })
  }

  // 取消
  function handleCancel() {
    visible = false
  }

  defineExpose({ init })
</script>

<style scoped></style>
