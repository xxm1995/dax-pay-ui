<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:sync-outlined" @click="syncInfo">同步微信模板</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="name" title="名称" />
        <vxe-column field="code" title="编码" />
        <vxe-column field="templateId" title="模板ID" />
        <vxe-column field="title" title="模板标题" />
        <vxe-column field="primaryIndustry" title="模板所属行业的一级行业" />
        <vxe-column field="deputyIndustry" title="模板所属行业的二级行业" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="100" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a href="javascript:" @click="show(row)">查看</a>
            </span>
            <a-divider type="vertical" />
            <span>
              <a href="javascript:" @click="edit(row)">编辑</a>
            </span>
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
      <wechat-template-edit ref="wechatTemplateEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { $ref } from 'vue/macros'
  import { del, page, sync } from './WechatTemplate.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import WechatTemplateEdit from './WechatTemplateEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()

  // 查询条件
  const fields = [
    { field: 'code', type: STRING, name: '编码', placeholder: '请输入编码' },
    { field: 'name', type: STRING, name: '名称', placeholder: '请输入名称' },
    { field: 'templateId', type: STRING, name: '模板ID', placeholder: '请输入模板ID' },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const wechatTemplateEdit = $ref<any>()

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
  // 编辑
  function edit(record) {
    wechatTemplateEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    wechatTemplateEdit.init(record.id, FormEditType.Show)
  }

  // 删除
  function remove(record) {
    del(record.id).then(() => {
      createMessage.success('删除成功')
    })
    queryPage()
  }
  // 同步
  function syncInfo() {
    createConfirm({
      iconType: 'info',
      title: '同步',
      content: '是否同步消息模板',
      onOk: () => {
        sync().then(() => {
          createMessage.info('开始同步微信消息模板')
        })
      },
    })
  }
</script>

<style lang="less" scoped></style>
