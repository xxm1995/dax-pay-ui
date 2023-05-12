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
        <vxe-column field="data" title="模板数据" />
        <vxe-column field="type" title="模板类型">
          <template #default="{ row }">
            {{ dictConvert('MessageTemplateCode', row.type) }}
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="160" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a href="javascript:" @click="show(row)">查看</a>
            </span>
            <a-divider type="vertical" />
            <span>
              <a href="javascript:" @click="edit(row)">编辑</a>
            </span>
            <a-divider type="vertical" />
            <a-dropdown>
              <a> 更多 <icon icon="ant-design:down-outlined" :size="12" /></a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:" @click="render(row)">渲染测试</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:" @click="remove(row)" style="color: red">删除</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
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
      <message-template-edit ref="messageTemplateEdit" @ok="queryPage" />
      <template-render ref="templateRender" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { del, page } from './MessageTemplate.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import MessageTemplateEdit from './MessageTemplateEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import TemplateRender from './TemplateRender.vue'
  import { useDict } from '/@/hooks/bootx/useDict'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()
  // 查询条件
  const fields = [
    { field: 'code', type: STRING, name: '编码', placeholder: '请输入编码' },
    { field: 'name', type: STRING, name: '名称', placeholder: '请输入名称' },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const messageTemplateEdit = $ref<any>()
  const templateRender = $ref<any>()

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
    messageTemplateEdit.init(null, FormEditType.Add)
  }
  // 编辑
  function edit(record) {
    messageTemplateEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    messageTemplateEdit.init(record.id, FormEditType.Show)
  }
  // 渲染测试
  function render(record) {
    templateRender.init(record)
  }

  // 删除
  function remove(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否删除该表单',
      onOk: () => {
        del(record.id).then(() => {
          notification.success({ message: '删除成功' })
          queryPage()
        })
      },
    })
  }
</script>

<style lang="less" scoped></style>
