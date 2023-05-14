<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
            <a-dropdown v-if="batchOperateFlag">
              <a-button pre-icon="ant-design:down-outlined">批量操作</a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a @click="updateBatchEnable(true)">批量启用</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="updateBatchEnable(false)">批量停用</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="removeDataScopeBatch">批量删除</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-popconfirm title="是否同步系统请求资源" @confirm="sync()" okText="是" cancelText="否">
              <a-button pre-icon="ant-design:sync-outlined">同步系统资源</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table
        row-id="id"
        ref="xTable"
        :data="pagination.records"
        :loading="loading"
        @checkbox-all="selectAllEvent"
        @checkbox-change="selectChangeEvent"
      >
        <vxe-column type="checkbox" width="50" />
        <vxe-column field="path" title="请求路径" />
        <vxe-column field="name" title="权限名称" />
        <vxe-column field="code" title="权限标识" />
        <vxe-column field="groupName" title="分组名称" />
        <vxe-column field="requestType" title="请求类型" />
        <vxe-column field="enable" title="启用状态">
          <template #="{ row }">
            <a-tag v-if="row.enable" color="green">启用</a-tag>
            <a-tag v-else color="red">停用</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="generate" title="系统生成">
          <template #default="{ row }">
            <a-tag v-if="row.generate" color="red">是</a-tag>
            <a-tag v-else color="green">否</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="描述" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="150" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a href="javascript:" @click="show(row)">查看</a>
            </span>
            <a-divider type="vertical" />
            <span>
              <a href="javascript:" @click="edit(row)">编辑</a>
            </span>
            <a-divider type="vertical" />
            <a-popconfirm title="是否删除" @confirm="remove(row)" okText="是" cancelText="否">
              <a href="javascript:" style="color: red">删除</a>
            </a-popconfirm>
          </template>
        </vxe-column>
      </vxe-table>
      <vxe-pager
        size="medium"
        :loading="loading"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @page-change="handleTableChange"
      />
      <perm-path-edit ref="permPathEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { del, delBatch, batchUpdateEnable, page, syncSystem } from './PermPath.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import PermPathEdit from './PermPathEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { STRING } from '/@/components/Bootx/Query/Query'
  import Icon from '/@/components/Icon/src/Icon.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading, batchOperateFlag } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()

  // 查询条件
  const fields = [
    { field: 'path', type: STRING, name: '权限路径', placeholder: '请输入权限路径' },
    { field: 'code', type: STRING, name: '权限标识', placeholder: '请输入流程名称' },
    { field: 'name', type: STRING, name: '权限名称', placeholder: '请输入权限名称' },
    { field: 'groupName', type: STRING, name: '权限分组', placeholder: '请输入权限分组' },
  ]
  const permPathEdit = $ref<any>()
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  // 分页查询
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
      selectChangeEvent()
    })
  }
  // 新增
  function add() {
    permPathEdit.init(null, FormEditType.Add)
  }
  // 查看
  function edit(record) {
    permPathEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    permPathEdit.init(record.id, FormEditType.Show)
  }

  // 删除
  function remove(record) {
    del(record.id).then(() => {
      notification.success({ message: '删除成功' })
    })
    queryPage()
  }
  // 批量删除
  function removeDataScopeBatch() {
    const ids = xTable.getCheckboxRecords().map((o) => o.id)

    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否批量删除选中的数据',
      onOk: () => {
        delBatch(ids).then(() => {
          queryPage()
          createMessage.success('批量删除成功')
        })
      },
    })
  }
  // 选中全部
  function selectAllEvent() {
    const records = xTable.getCheckboxRecords()
    batchOperateFlag.value = !!records.length
  }
  // 选择事件
  function selectChangeEvent() {
    nextTick(() => {
      const records = xTable.getCheckboxRecords()
      batchOperateFlag.value = !!records.length
    })
  }
  // 批量启停用
  function updateBatchEnable(type) {
    const ids = xTable.getCheckboxRecords().map((o) => o.id)
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: type ? '是否批量启用' : '是否批量停用',
      onOk: async function () {
        batchUpdateEnable(ids, type).then(() => {
          queryPage()
          createMessage.success('批量修改状态成功')
        })
      },
    })
  }
  // 同步
  function sync() {
    syncSystem().then(() => {
      createMessage.success('同步中，请稍后重新查看路径权限信息')
    })
  }
</script>

<style lang="less" scoped></style>
