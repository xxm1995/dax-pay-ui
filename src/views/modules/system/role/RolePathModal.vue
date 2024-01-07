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
  import { findPathIdsByRole, findPathsByRole, RoleTree, saveRolePath } from './Role.api'
  import XEUtils from 'xe-utils'
  import { useMessage } from '/@/hooks/web/useMessage'

  const { createMessage, createConfirm } = useMessage()

  const xTable = $ref<VxeTableInstance>()

  let loading = $ref(false)
  let roleId = $ref('')
  let currentRole = $ref<RoleTree>({})
  let visible = $ref(false)
  let checkedKeys = $ref<string[]>([])
  let tableData = $ref<string[]>([])

  async function init(record: RoleTree) {
    visible = true
    loading = true
    currentRole = record
    initAssign()
  }

  /**
   * 初始化分配信息
   */
  async function initAssign() {
    // 已经勾选的
    await findPathIdsByRole(currentRole.id).then(({ data }) => {
      checkedKeys = data
    })
    // 可以被分配的
    await findPathsByRole(currentRole.id).then(({ data }) => {
      const result = [] as any[]
      // 对数据进行分组
      XEUtils.each(XEUtils.groupBy(data, 'groupName'), (children, key) => {
        result.push({
          name: key,
          children: children,
        })
      })
      tableData = result
      xTable?.reloadData(tableData)
      loading = false
    })
  }

  /**
   * 保存
   */
  function handleSubmit() {
    loading = true
    // 是否级联更新子角色
    if (currentRole.children) {
      createConfirm({
        iconType: 'warning',
        title: '警告',
        cancelText: '不应用',
        okText: '应用',
        content: '将新增的权限应用到下级子角色中，注意：删除权限时无论如何选择，都将会下级角色的权限被级联删除',
        onOk: () => {
          save(true)
        },
        onCancel: () => {
          save(false)
        },
      })
    } else {
      save(false)
    }
  }

  /**
   * 保存
   */
  function save(updateChildren: boolean) {
    loading = true
    const checkedKeys = xTable
      ?.getCheckboxRecords()
      .map((res) => res.id)
      .filter((id) => id.indexOf('row_') === -1)
    saveRolePath({
      roleId: currentRole.id,
      updateChildren,
      permissionIds: checkedKeys,
    }).then(() => {
      createMessage.success('保存成功')
      handleCancel()
    })
  }

  /**
   * 取消
   */
  function handleCancel() {
    visible = false
  }

  defineExpose({ init })
</script>

<style scoped></style>
