<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <a-form class="page-query" layout="inline">
        <a-row :gutter="10">
          <a-col :md="8" :sm="24">
            <a-form-item label="查询">
              <a-input-search
                allow-clear
                v-model:value="searchName"
                @search="search"
                @keyup.enter="search"
                placeholder="请输入部门名称或编码"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
            <a-button @click="allTreeExpand(true)">展开所有</a-button>
            <a-button @click="allTreeExpand(false)">关闭所有</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table
        resizable
        row-id="id"
        ref="xTable"
        border="inner"
        :tree-config="{ children: 'children' }"
        :data="tableData"
        :loading="loading"
      >
        <vxe-column field="deptName" title="机构/部门名称" tree-node />
        <vxe-column field="orgCategory" title="机构类别">
          <template #default="{ row }">
            <span v-show="row.orgCategory === 1">公司</span>
            <span v-show="row.orgCategory === 2">部门</span>
          </template>
        </vxe-column>
        <vxe-column field="orgCode" title="机构编码" />
        <vxe-column title="操作">
          <template #default="{ row }">
            <a href="javascript:" @click="edit(row)">编辑</a>
            <a-divider type="vertical" />
            <a href="javascript:" @click="show(row)">查看</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link"> 更多 <icon icon="ant-design:down-outlined" :size="12" /> </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a @click="addChildren(row)">添加下级</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a-popconfirm title="是否删除该部门组织" @confirm="remove(row)" okText="是" cancelText="否">
                      <a href="javascript:">删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </vxe-column>
      </vxe-table>
      <dept-edit ref="deptEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted } from 'vue'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { del, DeptTree, tree } from './Dept.api'
  import DeptEdit from './DeptEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import XEUtils from 'xe-utils'
  import Icon from '/@/components/Icon/src/Icon.vue'

  // 使用hooks
  const { notification, createMessage, createConfirm } = useMessage()

  let searchName = $ref<string>()
  let treeExpand = $ref<boolean>(false)
  let loading = $ref(false)
  let tableData = $ref<DeptTree[]>([])
  let remoteTableData = $ref<DeptTree[]>([])

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const deptEdit = $ref<any>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  // 分页查询
  function queryPage() {
    loading = true
    tree().then(({ data }) => {
      remoteTableData = data
      search()
      loading = false
    })
  }
  // 新增
  function add() {
    deptEdit.init(null, FormEditType.Add)
  }
  // 编辑
  function edit(record) {
    deptEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    deptEdit.init(record.id, FormEditType.Show)
  }
  function addChildren(row) {
    deptEdit.init(null, FormEditType.Add, row)
  }
  // 删除
  function remove(record) {
    del(record.id).then(() => {
      createMessage.success('删除成功')
      queryPage()
    })
  }
  /**
   * 展开or关闭
   */
  function allTreeExpand(expand) {
    nextTick(() => {
      xTable.setAllTreeExpand(expand)
    })
    treeExpand = expand
  }
  /**
   * 搜索
   */
  function search() {
    const sn = XEUtils.toValueString(searchName).trim().toLowerCase()
    if (sn) {
      const searchProps = ['deptName', 'orgCode']
      tableData = XEUtils.searchTree(remoteTableData, (item) =>
        searchProps.some((key) => XEUtils.toValueString(item[key]).toLowerCase().indexOf(sn) > -1),
      )
      // 搜索状态默认展开
      treeExpand = true
    } else {
      tableData = remoteTableData
    }
    nextTick(() => {
      xTable.setAllTreeExpand(treeExpand)
    })
  }
</script>

<style lang="less" scoped></style>
