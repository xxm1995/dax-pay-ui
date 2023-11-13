<template>
  <basic-drawer forceRender v-bind="$attrs" title="字典列表" width="60%" :visible="visible" @close="visible = false">
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
      <template #buttons>
        <a-space>
          <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
      <vxe-column type="seq" width="60" />
      <vxe-column field="code" title="字典项编码" />
      <vxe-column field="name" title="字典项名称" />
      <vxe-column field="enable" title="启用状态">
        <template #default="{ row }">
          <a-tag v-if="row.enable" color="green">启用</a-tag>
          <a-tag v-else color="red">停用</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="sortNo" title="排序" />
      <vxe-column field="remark" title="备注" />
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
    <dict-item-edit ref="dictItemEdit" @ok="queryPage" />
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, ref } from 'vue'
  import { $ref } from 'vue/macros'
  import { del, page } from './DictItem.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import DictItemEdit from './DictItemEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import { Dict } from '/@/views/modules/system/dict/Dict.api'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage } = useMessage()

  // 查询条件
  const fields = [] as QueryField[]
  let visible = $ref(false)
  let dictInfo = $ref<Dict>()

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const dictItemEdit = $ref<any>()

  nextTick(() => {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  })

  function init(dict) {
    visible = true
    dictInfo = dict
    queryPage()
  }

  // 分页查询
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...pages,
      dictId: dictInfo?.id,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }
  // 新增
  function add() {
    dictItemEdit.init(null, FormEditType.Add, dictInfo)
  }
  // 查看
  function edit(record) {
    dictItemEdit.init(record.id, FormEditType.Edit, dictInfo)
  }
  // 查看
  function show(record) {
    dictItemEdit.init(record.id, FormEditType.Show, dictInfo)
  }

  // 删除
  function remove(record) {
    del(record.id).then(() => {
      createMessage.success('删除成功')
    })
    queryPage()
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
