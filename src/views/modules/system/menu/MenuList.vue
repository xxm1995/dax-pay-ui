<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <a-form class="page-query" layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="终端">
              <a-select v-model:value="clientCode" @change="queryPage" :default-value="clientCode" style="width: 100%">
                <a-select-option v-for="o in clients" :key="o.code">{{ o.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="查询">
              <a-input-search
                v-model:value="searchName"
                @search="search"
                @keyup.enter="search"
                allow-clear
                placeholder="请输入菜单名称、路由名称、请求路径或组件名称"
              />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="同时显示权限码">
              <a-radio-group v-model:value="showPermCode">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-button type="primary" @click="queryPage">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom zoom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-button type="primary" @click="add()"> 新建 </a-button>
          <a-button style="margin-left: 8px" @click="allTreeExpand(true)">展开所有</a-button>
          <a-button style="margin-left: 8px" @click="allTreeExpand(false)">关闭所有</a-button>
        </template>
      </vxe-toolbar>
      <vxe-table
        resizable
        ref="xTable"
        border="inner"
        :stripe="false"
        :loading="loading"
        :tree-config="{ children: 'children' }"
        :data="tableData"
      >
        <vxe-column field="title" title="菜单名称" tree-node />
        <vxe-column field="name" title="路由名称" />
        <vxe-column field="menuType" title="菜单类型" :visible="false">
          <template #default="{ row }">
            <span v-show="String(row.menuType) === '0'">一级菜单</span>
            <span v-show="String(row.menuType) === '1'">子菜单</span>
            <span v-show="String(row.menuType) === '2'">按钮/权限</span>
          </template>
        </vxe-column>
        <vxe-column field="path" title="请求路径" />
        <vxe-column field="sortNo" title="排序" :visible="false" />
        <vxe-column field="component" title="组件" />
        <vxe-column field="icon" title="图标">
          <template #default="{ row }">
            <div v-if="row.icon">
              <icon :icon="row.icon" />
            </div>
          </template>
        </vxe-column>
        <vxe-column title="操作" fixed="right" width="220" :showOverflow="false">
          <template #default="{ row }">
            <a href="javascript:" @click="show(row)">查看</a>
            <template v-if="String(row.menuType) !== '2'">
              <a-divider type="vertical" />
              <a href="javascript:" v-if="!row.admin" @click="edit(row)">编辑</a>
              <a href="javascript:" v-else disabled>编辑</a>
              <a-divider type="vertical" />
              <a href="javascript:" @click="resourcePage(row)">权限码</a>
              <a-divider type="vertical" />
              <a-dropdown>
                <a> 更多 <icon icon="ant-design:down-outlined" :size="12" /> </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a @click="addChildren(row)">添加下级</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a @click="copy(row.id)">复制</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:" v-if="!row.admin" @click="remove(row)" style="color: red">删除</a>
                      <a href="javascript:" v-else disabled>删除</a>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </template>
        </vxe-column>
      </vxe-table>
      <menu-edit ref="menuEdit" @ok="queryPage" />
      <resource-list ref="resourceList" />
      <resource-edit ref="resourceEdit" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { getAppEnvConfig } from '/@/utils/env'
  import { $ref } from 'vue/macros'
  import { nextTick, onMounted } from 'vue'
  import { Client, findAll } from '/@/views/modules/system/client/Client.api'
  import XEUtils from 'xe-utils'
  import { menuTree, Menu, del, allTree } from './Menu.api'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import MenuEdit from './MenuEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import ResourceList from './ResourceList.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import Icon from '/@/components/Icon'
  import ResourceEdit from './ResourceEdit.vue'

  const { VITE_GLOB_APP_CLIENT } = getAppEnvConfig()
  const { createConfirm, notification } = useMessage()
  let showPermCode = $ref(false)
  let clientCode = $ref(VITE_GLOB_APP_CLIENT)
  let searchName = $ref()
  let loading = $ref(false)
  let treeExpand = $ref(false)
  let clients = $ref([] as Client[])
  let remoteTableData = $ref([] as Menu[])
  let tableData = $ref([] as Menu[])
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  let menuEdit = $ref<any>()
  let resourceList = $ref<any>()
  let resourceEdit = $ref<any>()

  onMounted(() => {
    vxeBind()
    initClients()
    queryPage()
  })

  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  async function initClients() {
    const { data } = await findAll()
    clients = data
  }

  async function queryPage() {
    loading = true
    if (showPermCode) {
      const { data } = await allTree(clientCode)
      remoteTableData = data
    } else {
      const { data } = await menuTree(clientCode)
      remoteTableData = data
    }
    search()
    loading = false
  }

  function add() {
    menuEdit.init(null, FormEditType.Add, clientCode)
  }
  function edit(record: Menu) {
    menuEdit.init(record.id, FormEditType.Edit, clientCode)
  }
  function show(record: Menu) {
    if (String(record.menuType) === '2') {
      resourceEdit.init(record.id, FormEditType.Show)
    } else {
      menuEdit.init(record.id, FormEditType.Show, clientCode)
    }
  }
  function addChildren(row) {
    menuEdit.init(null, FormEditType.Other, clientCode, row)
  }
  function copy(id) {
    menuEdit.init(id, FormEditType.Other, clientCode)
  }
  function resourcePage(record: Menu) {
    resourceList.init(record)
  }

  function remove(record: Menu) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否删除该条数据',
      onOk: () => {
        del(record.id).then(() => {
          notification.success({ message: '删除成功' })
          queryPage()
        })
      },
    })
  }

  /**
   * 搜索
   */
  function search() {
    const search = XEUtils.toValueString(searchName).trim().toLowerCase()
    if (search) {
      const searchProps = ['name', 'title', 'path', 'component']
      tableData = XEUtils.searchTree(remoteTableData, (item) =>
        searchProps.some((key) => XEUtils.toValueString(item[key]).toLowerCase().indexOf(search) > -1),
      )
      // 搜索状态默认展开
      treeExpand = true
    } else {
      tableData = remoteTableData
    }
    nextTick(() => {
      xTable?.setAllTreeExpand(treeExpand)
    })
  }
  /**
   * 展开or关闭
   */
  function allTreeExpand(value) {
    nextTick(() => {
      xTable?.setAllTreeExpand(treeExpand)
    })
    treeExpand = value
  }
</script>

<style lang="less" scoped></style>
