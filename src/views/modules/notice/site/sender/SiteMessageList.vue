<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">发布消息</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="title" title="消息标题">
          <template #default="{ row }">
            <a href="javascript:" @click="show(row)">{{ row.title }}</a>
          </template>
        </vxe-column>
        <vxe-column field="receiveType" title="消息类型">
          <template #default="{ row }">
            {{ dictConvert('SiteMessageReceive', row.receiveType) }}
          </template>
        </vxe-column>
        <vxe-column field="sendState" title="发布状态">
          <template #default="{ row }">
            {{ dictConvert('SiteMessageState', row.sendState) }}
          </template>
        </vxe-column>
        <vxe-column field="senderTime" title="发送时间" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="200" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a href="javascript:" @click="show(row)">查看</a>
            </span>
            <template v-if="row.sendState === 'draft'">
              <a-divider type="vertical" />
              <span>
                <a href="javascript:" @click="edit(row)">编辑</a>
              </span>
              <a-divider type="vertical" />
              <a-popconfirm title="是否发送消息" @confirm="sendMessage(row)" okText="是" cancelText="否">
                <a href="javascript:">发送</a>
              </a-popconfirm>
            </template>
            <template v-if="row.sendState === 'sent'">
              <a-divider type="vertical" />
              <a-popconfirm title="是否撤回消息" @confirm="cancelMessage(row)" okText="是" cancelText="否">
                <a href="javascript:" style="color: red">撤回</a>
              </a-popconfirm>
            </template>
            <template v-if="['draft'].includes(row.sendState)">
              <a-divider type="vertical" />
              <a-popconfirm title="是否删除消息" @confirm="remove(row)" okText="是" cancelText="否">
                <a href="javascript:" style="color: red">删除</a>
              </a-popconfirm>
            </template>
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
      <site-message-edit ref="siteMessageEdit" @ok="queryPage" />
      <notice-reader ref="noticeReader" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { $ref } from 'vue/macros'
  import { cancel, del, pageBySender, send } from '../SiteMessage.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import SiteMessageEdit from './SiteMessageEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import NoticeReader from '/@/layouts/default/header/components/notify/NoticeReader.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()
  // 查询条件
  const fields = [] as QueryField[]

  const noticeReader = $ref<any>()
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const siteMessageEdit = $ref<any>()

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
    pageBySender({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }
  // 新增
  function add() {
    siteMessageEdit.init(null, FormEditType.Add)
  }
  // 编辑
  function edit(record) {
    siteMessageEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    noticeReader.init(record)
  }

  // 删除
  function remove(record) {
    del(record.id).then(() => {
      createMessage.success('删除成功')
    })
    queryPage()
  }

  //发送
  function sendMessage(record) {
    loading.value = true
    send(record.id).then(() => {
      createMessage.success('发送成功')
      queryPage()
    })
  }
  // 撤回消息
  function cancelMessage(record) {
    cancel(record.id).then(() => {
      createMessage.success('撤回成功')
      queryPage()
    })
  }
</script>

<style lang="less" scoped></style>
