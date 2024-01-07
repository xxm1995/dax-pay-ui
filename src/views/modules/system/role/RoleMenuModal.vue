<template>
  <basic-drawer showFooter v-bind="$attrs" title="角色菜单和权限码配置" width="40%" :visible="visible" @close="handleCancel">
    <a-spin :spinning="loading">
      <a-input style="margin-bottom: 8px" placeholder="筛选" allowClear v-model:value="searchName" @change="search" />
      <a-tree
        :checkable="true"
        v-model:checkedKeys="checkedKeys"
        v-model:expandedKeys="expandedKeys"
        :checkStrictly="checkStrictly"
        :auto-expand-parent="autoExpandParent"
        :tree-data="treeData"
        @check="onCheck"
        @expand="onExpand"
      >
        <template #title="{ title, raw }">
          <span v-if="title.toLowerCase().indexOf(searchName.toLowerCase()) > -1">
            {{ searchRenderStart(title, searchName) }}
            <span style="color: #f50">
              {{ searchRenderMiddle(title, searchName) }}
            </span>
            {{ searchRenderEnd(title, searchName) }}
          </span>
          <span v-else>{{ title }}</span>
          <span v-show="raw.menuType === 2" style="color: #a63434"> (权限码)</span>
        </template>
      </a-tree>
    </a-spin>
    <template #footer>
      <a-select style="min-width: 100px" @change="clientSwitch" v-model:value="clientCode">
        <a-select-option v-for="o in clients" :key="o.code">{{ o.name }}</a-select-option>
      </a-select>
      <a-dropdown style="margin-left: 5px" :trigger="['click']" placement="topCenter">
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="checkALL">全部勾选</a-menu-item>
            <a-menu-item key="2" @click="cancelCheckALL">取消全选</a-menu-item>
            <a-menu-item key="3" @click="expandAll">展开所有</a-menu-item>
            <a-menu-item key="4" @click="closeAll">合并所有</a-menu-item>
            <a-menu-item key="5" @click="switchCheckStrictly(false)">父子关联</a-menu-item>
            <a-menu-item key="6" @click="switchCheckStrictly(true)">取消关联</a-menu-item>
          </a-menu>
        </template>
        <a-button post-icon="ant-design:up-outlined"> 操作 </a-button>
      </a-dropdown>
      <a-button @click="visible = false" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleSubmit()" type="primary" :loading="loading" style="margin-right: 0.8rem">保存</a-button>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { BasicDrawer } from '/@/components/Drawer'
  import { $ref } from 'vue/macros'
  import { findAll as findClients, Client } from '/@/views/modules/system/client/Client.api'
  import { getAppEnvConfig } from '/@/utils/env'
  import { findPermissionIdsByRole, findTreeByRole, RoleTree, saveRoleMenu } from '/@/views/modules/system/role/Role.api'
  import { Tree, treeDataTranslate } from '/@/utils/dataUtil'
  import XEUtils from 'xe-utils'
  import { MenuTree } from '/@/views/modules/system/menu/Menu.api'
  import { useMessage } from '/@/hooks/web/useMessage'

  const { VITE_GLOB_APP_CLIENT } = getAppEnvConfig()
  const { createMessage, createConfirm } = useMessage()

  let loading = $ref(false)
  let currentRole = $ref<RoleTree>({})
  let visible = $ref(false)
  // 终端列表
  let clients = $ref([] as Client[])
  let clientCode = $ref(VITE_GLOB_APP_CLIENT)
  let searchName = $ref('')
  // 父子选项默认不受控
  let checkStrictly = $ref(true)
  // 所有的key
  let allTreeKeys = $ref<string[]>([])
  // 展开的key
  let expandedKeys = $ref<string[]>([])
  // 被选中的key
  let checkedKeys = $ref<string[]>([])
  let autoExpandParent = $ref(false)
  //菜单树信息
  let treeData = $ref<Tree[]>([])
  let treeList = $ref<MenuTree[]>([])

  function init(record: RoleTree) {
    currentRole = record
    initData()
    initAssign()
  }

  /**
   * 初始化终端列表
   */
  function initData() {
    findClients().then(({ data }) => {
      clients = data
    })
  }

  /**
   * 初始化菜单分配信息
   */
  async function initAssign() {
    visible = true
    loading = true
    searchName = ''
    expandedKeys = []
    // 当前角色的菜单和权限码树
    await findTreeByRole(currentRole.id, clientCode).then((res) => {
      treeData = treeDataTranslate(res.data, 'id', 'title')
      generateTreeList(res.data)
    })
    // 当前角色已经选择的
    await findPermissionIdsByRole(currentRole.id, clientCode).then((res) => {
      checkedKeys = res.data
    })
    // 所有的key值
    allTreeKeys = treeList.map((item) => item.id) as string[]
    loading = false
  }

  /**
   * 保存
   */
  function handleSubmit() {
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

  function save(updateChildren: boolean) {
    loading = true
    saveRoleMenu({
      roleId: currentRole.id,
      clientCode,
      updateChildren,
      permissionIds: checkedKeys,
    }).then(() => {
      createMessage.success('保存成功')
      handleCancel()
    })
  }

  // 取消
  function handleCancel() {
    visible = false
  }
  // 树数据铺平
  function generateTreeList(treeData) {
    if (!treeData) {
      return
    }
    for (let i = 0; i < treeData.length; i++) {
      const node = treeData[i]
      treeList.push(node)
      if (node.children) {
        generateTreeList(node.children)
      }
    }
  }
  // 搜索
  function search() {
    const value = XEUtils.toValueString(searchName).toLowerCase()
    expandedKeys = treeList
      .map((node) => {
        if (searchName && node.parentId && XEUtils.toValueString(node.title).toLowerCase().indexOf(value) > -1) {
          return node.parentId
        }
      })
      .filter((item, i, self) => item && self.indexOf(item) === i) as string[]
  }
  // 渲染搜索项目数据开始段
  function searchRenderStart(title, searchName) {
    return title.substring(0, title.toLowerCase().indexOf(searchName.toLowerCase()))
  }
  // 渲染搜索项目数据中间段
  function searchRenderMiddle(title, searchName) {
    return title.substring(
      title.toLowerCase().indexOf(searchName.toLowerCase()),
      title.toLowerCase().indexOf(searchName.toLowerCase()) + searchName.length,
    )
  }
  // 渲染搜索项目数据结束段
  function searchRenderEnd(title, searchName) {
    return title.substring(title.toLowerCase().indexOf(searchName.toLowerCase()) + searchName.length)
  }
  // 展开/收起节点时触发
  function onExpand(keys) {
    expandedKeys = keys
    autoExpandParent = false
  }
  // 点击复选框触发
  function onCheck(key) {
    if (checkStrictly) {
      checkedKeys = key.checked
    } else {
      checkedKeys = key
    }
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
  // 切换父子受控状态
  function switchCheckStrictly(v) {
    checkStrictly = v
  }
  // 终端切换
  function clientSwitch(item) {
    clientCode = item
    initAssign()
  }
  defineExpose({ init })
</script>
<style scoped></style>
