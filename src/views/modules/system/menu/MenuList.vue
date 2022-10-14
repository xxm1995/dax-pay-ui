<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <a-form class="query" layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="终端">
              <a-select v-model:value="clientCode" @change="init" :default-value="clientCode" style="width: 100%">
                <a-select-option v-for="o in clients" :key="o.code">{{ o.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
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
        </a-row>
      </a-form>
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar zoom :refresh="{ query: init }">
        <template #buttons>
          <a-button type="primary" @click="add()"> 新建 </a-button>
          <a-button style="margin-left: 8px" @click="allTreeExpand(true)">展开所有</a-button>
          <a-button style="margin-left: 8px" @click="allTreeExpand(false)">关闭所有</a-button>
        </template>
      </vxe-toolbar>
      <vxe-table
        resizable
        :stripe="false"
        show-overflow
        border="inner"
        ref="xTree"
        :loading="loading"
        :tree-config="{ children: 'children' }"
        :data="tableData"
      >
        <vxe-column field="title" title="菜单名称" tree-node />
        <vxe-column field="name" title="路由名称" />
        <vxe-column field="menuType" title="菜单类型">
          <template #default="{ row }">
            <span v-show="String(row.menuType) === '0'">一级菜单</span>
            <span v-show="String(row.menuType) === '1'">子菜单</span>
            <span v-show="String(row.menuType) === '2'">按钮/权限</span>
          </template>
        </vxe-column>
        <vxe-column field="path" title="请求路径" />
        <vxe-column field="sortNo" title="排序" :visible="false" />
        <vxe-column field="component" title="组件" />
        <vxe-column field="icon" title="图标" :visible="false">
          <template #default="{ row }">
            <div v-if="row.icon !== ''">
<!--              <a-icon :type="row.icon" />-->
            </div>
          </template>
        </vxe-column>
        <vxe-column title="操作" fixed="right" width="240" :showOverflow="false">
          <template #default="{ row }">
            <a href="javascript:" @click="show(row)">查看</a>
            <a-divider type="vertical" />
            <a href="javascript:" v-if="!row.admin" @click="edit(row)">编辑</a>
            <a href="javascript:" v-else disabled>编辑</a>
            <a-divider type="vertical" />
            <a href="javascript:" @click="resourceList(row)">权限资源</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link"> 更多 </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a @click="addChildren(row)">添加下级</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="copy(row.id)">复制</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a-popconfirm title="是否删除菜单或权限" @confirm="remove(row)" okText="是" cancelText="否">
                      <a href="javascript:" v-if="!row.admin" style="color: red">删除</a>
                      <a href="javascript:" v-else disabled>删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </vxe-column>
      </vxe-table>
      <menu-edit ref="menuEdit" @ok="init" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { getAppEnvConfig } from '/@/utils/env'

  import { $ref } from 'vue/macros'
  import { nextTick, onMounted, ref } from 'vue'
  import { Client, findAll } from '/@/views/modules/system/client/Client.api'
  import XEUtils from 'xe-utils'
  import { menuTree, Menu } from './Menu.api'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import MenuEdit from './MenuEdit.vue'
  const { VITE_GLOB_APP_CLIENT } = getAppEnvConfig()
  let clientCode = $ref(VITE_GLOB_APP_CLIENT)
  let searchName = $ref()
  let loading = $ref(false)
  let treeExpand = $ref(false)
  let clients = $ref([] as Client[])
  let remoteTableData = $ref([] as Menu[])
  let tableData = $ref([] as Menu[])
  let xTree = ref()
  let menuEdit = ref()

  onMounted(() => {
    initClients()
    init()
  })

  async function initClients() {
    const { data } = await findAll()
    clients = data
  }

  async function init() {
    loading = true
    menuTree(clientCode).then((res) => {
      remoteTableData = res.data
      search()
      loading = false
    })
  }

  function add() {
    menuEdit.value.init(null, FormEditType.Add)
  }
  function edit(record: Menu) {
    menuEdit.value.init(record.id, FormEditType.Edit)
  }
  function show(record: Menu) {
    menuEdit.value.init(record.id, FormEditType.Show)
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
      xTree.value.setAllTreeExpand(treeExpand)
    })
  }
  /**
   * 展开or关闭
   */
  function allTreeExpand(value) {
    nextTick(() => {
      xTree.value.setAllTreeExpand(treeExpand)
    })
    treeExpand = value
  }
</script>

<style lang="less" scoped>
  .query {
    .ant-form-item {
      margin-bottom: 8px;
    }
    .ant-row {
      width: 100%;
    }
  }
</style>
