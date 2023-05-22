<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
        :default-item-md="6"
        :default-item-count="3"
        :query-params="model.queryParam"
        :fields="fields"
        @query="queryPage"
        @reset="resetQueryParams"
      />
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
        <vxe-column field="mchNo" title="商户号" />
        <vxe-column field="mchName" title="商户名称" />
        <vxe-column field="contactTel" title="手机号" />
        <vxe-column field="mchShortName" title="商户简称" />
        <vxe-column field="state" title="商户状态">
          <template #default="{ row }">
            <a-tag>{{ row.state === 'enable' ? '启用' : '停用' }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="商户备注" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="220" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a-link @click="show(row)">查看</a-link>
            </span>
            <a-divider type="vertical" />
            <span>
              <a-link @click="edit(row)">编辑</a-link>
            </span>
            <a-divider type="vertical" />
            <span>
              <a-link @click="showApps(row)">应用列表</a-link>
            </span>
            <a-divider type="vertical" />
            <a-link danger @click="remove(row)">删除</a-link>
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
      <merchant-info-edit ref="merchantInfoEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { del, page } from './MerchantInfo.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import MerchantInfoEdit from './MerchantInfoEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import { router } from '/@/router'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()

  // 查询条件
  const fields = [
    { field: 'mchNo', name: '商户号' },
    { field: 'mchName', name: '商户名称' },
    { field: 'contactTel', name: '手机号' },
    {
      field: 'state',
      name: '商户状态',
      type: 'list',
      selectList: [
        { label: '启用', value: 'enable' },
        { label: '停用', value: 'disable' },
      ],
    },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const merchantInfoEdit = $ref<any>()

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
    merchantInfoEdit.init(null, FormEditType.Add)
  }
  // 编辑
  function edit(record) {
    merchantInfoEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    merchantInfoEdit.init(record.id, FormEditType.Show)
  }
  // 查看
  function showApps(record) {
    router.push({})
  }

  // 删除
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
</script>

<style lang="less" scoped></style>
