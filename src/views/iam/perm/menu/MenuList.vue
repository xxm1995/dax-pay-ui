<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <a-form class="page-query">
        <a-row :gutter="10">
          <a-col :md="4" :sm="24">
            <a-form-item label="终端">
              <a-select
                v-model:value="clientCode"
                @change="queryPage"
                :default-value="clientCode"
                style="width: 100%"
              >
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
      <vxe-toolbar ref="xToolbar" custom zoom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add()">
              新建
            </a-button>
            <a-button @click="allTreeExpand(true)">展开所有</a-button>
            <a-button @click="allTreeExpand(false)">关闭所有</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <div class="h-70vh">
        <vxe-table
          resizable
          height="auto"
          ref="xTable"
          border="inner"
          :stripe="false"
          :loading="loading"
          :tree-config="{ childrenField: 'children' }"
          :data="tableData"
        >
          <vxe-column field="title" title="菜单名称" tree-node />
          <vxe-column field="name" title="路由名称" />
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
                <a href="javascript:" v-if="!row.internal" @click="edit(row)">编辑</a>
                <a href="javascript:" v-else disabled>编辑</a>
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
                        <a
                          href="javascript:"
                          v-if="!row.internal"
                          @click="remove(row)"
                          style="color: red"
                          >删除</a
                        >
                        <a href="javascript:" v-else disabled>删除</a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </template>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <MenuEdit ref="menuEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { getAppEnvConfig } from '@/utils/env'
  import { nextTick, onMounted, ref } from 'vue'
  import { Client, findAll } from '@/views/iam/client/Client.api'
  import XEUtils from 'xe-utils'
  import { menuTree, Menu, del } from './Menu.api'
  import { FormEditType } from '@/enums/formTypeEnum'
  import MenuEdit from './MenuEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '@/hooks/web/useMessage'
  import { Icon } from '@/components/Icon'

  const { VITE_GLOB_APP_CLIENT } = getAppEnvConfig()
  const { createConfirm, notification } = useMessage()

  const clientCode = ref(VITE_GLOB_APP_CLIENT)
  const searchName = ref()
  const loading = ref(false)
  const treeExpand = ref(false)
  const clients = ref([] as Client[])
  const remoteTableData = ref([] as Menu[])
  const tableData = ref([] as Menu[])
  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  let menuEdit = ref<any>()

  onMounted(() => {
    vxeBind()
    initClients()
    queryPage()
  })

  function vxeBind() {
    xTable.value?.connect(xToolbar.value as VxeToolbarInstance)
  }

  async function initClients() {
    const { data } = await findAll()
    clients.value = data
  }

  async function queryPage() {
    loading.value = true
    const { data } = await menuTree(clientCode.value)
    remoteTableData.value = data
    search()
    loading.value = false
  }

  function add() {
    menuEdit.value.init(null, FormEditType.Add, clientCode.value)
  }
  function edit(record: Menu) {
    menuEdit.value.init(record.id, FormEditType.Edit, clientCode.value)
  }
  function show(record: Menu) {
    menuEdit.value.init(record.id, FormEditType.Show, clientCode.value)
  }
  function addChildren(row: Menu) {
    menuEdit.value.init(null, FormEditType.Other, clientCode.value, row)
  }
  function copy(id) {
    menuEdit.value.init(id, FormEditType.Other, clientCode.value)
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
    const search = XEUtils.toValueString(searchName.value).trim().toLowerCase()
    if (search) {
      const searchProps = ['name', 'title', 'path', 'component']
      tableData.value = XEUtils.searchTree(remoteTableData.value, (item) =>
        searchProps.some(
          (key) => XEUtils.toValueString(item[key]).toLowerCase().indexOf(search) > -1,
        ),
      )
      // 搜索状态默认展开
      treeExpand.value = true
    } else {
      tableData.value = remoteTableData.value
    }
    nextTick(() => {
      xTable.value?.setAllTreeExpand(treeExpand.value)
    })
  }
  /**
   * 展开or关闭
   */
  function allTreeExpand(value) {
    nextTick(() => {
      xTable.value?.setAllTreeExpand(treeExpand.value)
    })
    treeExpand.value = value
  }
</script>

<style lang="less" scoped></style>
