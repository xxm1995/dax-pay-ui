<template>
  <basic-drawer showFooter v-bind="$attrs" title="用户部门分配" width="40%" :visible="visible" @close="handleCancel">
    <a-spin :spinning="loading">
      <a-input style="margin-bottom: 8px" placeholder="筛选" allowClear v-model:vallue="searchName" @change="search" />
      <a-tree
        ref="treeRef"
        :checkable="true"
        :checkStrictly="true"
        v-model:checkedKeys="checkedKeys"
        v-model:expandedKeys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :tree-data="treeData"
        @check="onCheck"
        @expand="onExpand"
      >
        <template #title="{ title }">
          <span v-if="title.indexOf(searchName) > -1">
            {{ title.substr(0, title.indexOf(searchName)) }}
            <span style="color: #f50">{{ searchName }}</span>
            {{ title.substr(title.indexOf(searchName) + searchName.length) }}
          </span>
          <span v-else>{{ title }}</span>
        </template>
      </a-tree>
    </a-spin>
    <template #footer>
      <a-dropdown :trigger="['click']">
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="checkALL">全部勾选</a-menu-item>
            <a-menu-item key="2" @click="cancelCheckALL">取消全选</a-menu-item>
            <a-menu-item key="3" @click="expandAll">展开所有</a-menu-item>
            <a-menu-item key="4" @click="closeAll">合并所有</a-menu-item>
          </a-menu>
        </template>
        <a-button post-icon="ant-design:up-outlined"> 操作 </a-button>
      </a-dropdown>
      <a-button @click="handleCancel()">取消</a-button>
      <a-button @click="handleSubmit()" type="primary" :loading="loading" style="margin-right: 0.8rem">保存</a-button>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { $ref } from 'vue/macros'
  import XEUtils from 'xe-utils'
  import { treeDataTranslate } from '/@/utils/dataUtil'
  import { tree } from '/@/views/modules/system/dept/Dept.api'
  import { addUserDept, findDeptIdsByUser } from '/@/views/modules/system/user/UserAssign.api'

  let loading = $ref(false)
  let visible = $ref(false)
  let userId = $ref<string>()
  let searchName = $ref<string>()
  let allTreeKeys = $ref<string[]>([])
  let expandedKeys = $ref<string[]>([])
  let checkedKeys = $ref<any>([])
  let tableData = $ref<string[]>([])
  let autoExpandParent = $ref(false)
  let treeData = $ref<any[]>([])
  let treeList = $ref<any[]>([])
  let treeRef = $ref<any>()

  // 入口
  async function init(id) {
    visible = true
    loading = true
    userId = id
    expandedKeys = []
    // 权限树
    await tree().then(({ data }) => {
      treeData = treeDataTranslate(data, 'id', 'deptName')
      generateTreeList(data)
    })
    // 当前用户已经分配的部门
    await findDeptIdsByUser(userId).then(({ data }) => {
      checkedKeys = data
    })
    // 所有的key值
    allTreeKeys = treeList.map((item) => item.id)
    loading = false
  }

  // 展开/收起节点时触发
  function onExpand(keys) {
    expandedKeys = keys
    autoExpandParent = false
  }
  // 点击复选框触发
  function onCheck(keys) {
    checkedKeys = keys
  }
  // 展开全部
  function expandAll() {
    expandedKeys = allTreeKeys
  }
  // 合并全部
  function closeAll() {
    expandedKeys = []
  }
  // 全选
  function checkALL() {
    checkedKeys = allTreeKeys
  }
  // 全不选
  function cancelCheckALL() {
    checkedKeys = []
  }
  // 提交
  function handleSubmit() {
    loading = true
    addUserDept({
      userId,
      deptIds: checkedKeys.checked,
    }).then(() => {
      handleCancel()
    })
  }
  // 搜索
  function search() {
    const sn = XEUtils.toValueString(searchName).toLowerCase()
    expandedKeys = treeList
      .map((node) => {
        if (sn && node.parentId && XEUtils.toValueString(node.deptName).toLowerCase().indexOf(sn) > -1) {
          return node.parentId
        }
      })
      .filter((item, i, self) => item && self.indexOf(item) === i)
  }
  // 树数据铺平
  function generateTreeList(treeData) {
    for (let i = 0; i < treeData.length; i++) {
      const node = treeData[i]
      treeList.push(node)
      if (node.children) {
        generateTreeList(node.children)
      }
    }
  }
  /**
   * 关闭
   */
  function handleCancel() {
    visible = false
    loading = false
  }

  defineExpose({
    init,
  })
</script>

<style scoped></style>
