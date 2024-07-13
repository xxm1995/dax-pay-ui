<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
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
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add"
              >新建</a-button
            >
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table ref="xTable" key-field="id" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="mchNo" title="编码" />
        <vxe-column field="mchName" title="名称" />
        <vxe-column field="companyName" title="公司名称" />
        <vxe-column field="idType" title="证件类型">
          <template #default="{ row }">
            <a-tag v-if="row.idType === '0'" color="green">身份证</a-tag>
            <a-tag v-else-if="row.idType === '1'" color="blue">护照</a-tag>
            <a-tag v-else-if="row.idType === '2'" color="red">港澳通行证</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="tel" title="联系方式" />
        <vxe-column field="legalPerson" title="法人名称" />
        <vxe-column field="tel" title="联系方式" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="150" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a-link @click="show(row)">查看</a-link>
            </span>
            <a-divider type="vertical" />
            <span>
              <a-link @click="edit(row)">编辑</a-link>
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
      <MerchantEdit ref="merchantEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { del, page } from './Merchant.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import MerchantEdit from './MerchantEdit.vue'
  import BQuery from '@/components/Bootx/Query/BQuery.vue'
  import { STRING } from '@/components/Bootx/Query/Query'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { useMessage } from '@/hooks/web/useMessage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import ALink from '@/components/Link/Link.vue'

  // 使用hooks
  const {
    handleTableChange,
    pageQueryResHandel,
    resetQueryParams,
    pagination,
    pages,
    model,
    loading,
  } = useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()
  // 查询条件
  const fields = [
    { field: 'code', formType: STRING, name: '编码', placeholder: '请输入终端编码' },
    { field: 'name', formType: STRING, name: '名称', placeholder: '请输入终端名称' },
  ]
  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const merchantEdit: any = ref()

  onMounted(() => {
    vxeBind()
    queryPage()
  })

  function vxeBind() {
    xTable.value?.connect(xToolbar.value as VxeToolbarInstance)
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
    merchantEdit.value.init(null, FormEditType.Add)
  }
  // 查看
  function edit(record) {
    merchantEdit.value.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    merchantEdit.value.init(record.id, FormEditType.Show)
  }

  // 删除
  function remove(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否删除该条数据',
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
