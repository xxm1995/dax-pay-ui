<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <a-form class="page-query">
        <a-row :gutter="10">
          <a-col :md="8" :sm="24">
            <a-form-item label="查询">
              <a-input-search
                v-model:value="searchName"
                @search="search"
                @keyup.enter="search"
                allow-clear
                placeholder="请输入角色名称或编码"
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
          :stripe="false"
          ref="xTable"
          border="inner"
          :loading="loading"
          :tree-config="{ childrenField: 'children' }"
          :data="tableData"
        >
          <vxe-column field="name" title="名称" :min-width="200" tree-node>
            <template #default="{ row }">
              <a-link @click="show(row)">{{ row.name }}</a-link>
            </template>
          </vxe-column>
          <vxe-column field="code" title="编码" :min-width="150" />
          <vxe-column field="remark" title="备注" :min-width="200" />
          <vxe-column fixed="right" width="270" :showOverflow="false" title="操作">
            <template #default="{ row }">
              <a-link @click="addChildren(row)">添加子角色</a-link>
              <a-divider type="vertical" />
              <a-link @click="edit(row)">编辑</a-link>
              <template v-if="!row.internal">
                <a-divider type="vertical" />
                <a-link danger @click="remove(row)">删除</a-link>
              </template>
              <a-divider type="vertical" />
              <a-dropdown>
                <a> 授权 <Icon icon="ant-design:down-outlined" :size="12" :min-width="280" /> </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a-link @click="handleRoleMenu(row)">菜单权限</a-link>
                    </a-menu-item>
                    <a-menu-item>
                      <a-link @click="handleRolePath(row)">请求权限</a-link>
                    </a-menu-item>
                    <a-menu-item>
                      <a-link @click="handleRoleCode(row)">权限码</a-link>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <RoleEdit ref="roleEdit" @ok="queryPage" />
      <RoleMenuModal ref="roleMenuModal" />
      <RoleCodeModal ref="roleCodeModal" />
      <RolePathModal ref="rolePathModal" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, ref, unref } from 'vue'
  import { del, RoleTree, tree } from './Role.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import RoleEdit from './RoleEdit.vue'
  import RoleMenuModal from './RoleMenuModal.vue'
  import RoleCodeModal from './RoleCodeModal.vue'
  import RolePathModal from './RolePathModal.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { useMessage } from '@/hooks/web/useMessage'
  import { Icon } from '@/components/Icon'
  import ALink from '@/components/Link/Link.vue'
  import XEUtils from 'xe-utils'

  // 使用hooks
  const { loading } = useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()

  let searchName = ref<string>()
  let tableData = ref<RoleTree[]>([])
  let remoteTableData = ref<RoleTree[]>([])
  let treeExpand = ref(false)
  const roleEdit = ref<any>()
  const roleMenuModal = ref<any>()
  const rolePathModal = ref<any>()
  const roleCodeModal = ref<any>()
  // 查询条件
  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable.value?.connect(xToolbar.value as VxeToolbarInstance)
  }

  /**
   * 菜单树查询
   */
  function queryPage() {
    loading.value = true
    tree().then(({ data }) => {
      remoteTableData.value = data
      search()
      loading.value = false
    })
    return Promise.resolve()
  }
  /**
   * 新增
   */
  function add() {
    roleEdit.value.init(null, FormEditType.Add)
  }
  /**
   * 添加子角色
   */
  function addChildren(record) {
    roleEdit.value.init(null, FormEditType.Add, record.id)
  }
  /**
   * 编辑
   */
  function edit(record) {
    roleEdit.value.init(record.id, FormEditType.Edit)
  }
  /**
   * 查看
   */
  function show(record) {
    roleEdit.value.init(record.id, FormEditType.Show)
  }
  /**
   * 菜单授权处理
   */
  function handleRoleMenu(record) {
    roleMenuModal.value.init(record)
  }
  /**
   * 请求授权处理
   */
  function handleRolePath(record) {
    rolePathModal.value.init(record)
  }
  /**
   * 权限码处理
   */
  function handleRoleCode(record) {
    roleCodeModal.value.init(record)
  }
  /**
   * 删除
   */
  function remove(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否删除该数据',
      onOk: () => {
        del(record.id).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }

  /**
   * 搜索
   */
  function search() {
    const search = XEUtils.toValueString(unref(searchName)).trim().toLowerCase()
    if (search) {
      const searchProps = ['name', 'code']
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
