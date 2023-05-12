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
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="code" title="编码" />
        <vxe-column field="name" title="名称" />
        <vxe-column field="system" title="系统内置">
          <template #default="{ row }">
            <a-tag v-if="row.system" color="green">是</a-tag>
            <a-tag v-else color="red">否</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="captcha" title="启用验证码">
          <template #default="{ row }">
            <a-tag v-if="row.captcha" color="green">开启</a-tag>
            <a-tag v-else color="red">关闭</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="enable" title="启用状态">
          <template #default="{ row }">
            <a-tag v-if="row.enable" color="green">启用</a-tag>
            <a-tag v-else color="red">停用</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="description" title="描述" />
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
              <a href="javascript:" v-if="!row.system" style="color: red">删除</a>
              <a href="javascript:" v-else disabled>删除</a>
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
      <login-type-edit ref="loginTypeEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { del, LoginType, page } from './LoginType.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import LoginTypeEdit from './LoginTypeEdit.vue'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { STRING } from '/@/components/Bootx/Query/Query'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  // 查询条件
  const fields = [
    { field: 'code', formType: STRING, name: '编码', placeholder: '请输入登录方式编码' },
    { field: 'name', formType: STRING, name: '名称', placeholder: '请输入登录方式名称' },
  ]
  const xTable: VxeTableInstance = $ref()
  const xToolbar: VxeToolbarInstance = $ref()
  const loginTypeEdit: any = $ref()

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
    })
    return Promise.resolve()
  }
  // 新增
  function add() {
    loginTypeEdit.init(null, FormEditType.Add)
  }
  // 查看
  function edit(record: LoginType) {
    loginTypeEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record: LoginType) {
    loginTypeEdit.init(record.id, FormEditType.Show)
  }

  // 删除
  const { notification } = useMessage()
  function remove(record) {
    del(record.id).then(() => {
      notification.success({ message: '删除成功' })
    })
    queryPage()
  }
</script>

<style lang="less" scoped></style>
