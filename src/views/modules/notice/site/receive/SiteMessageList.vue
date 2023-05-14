<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom zoom :refresh="{ queryMethod: queryPage }" />
      <vxe-table ref="xTable" row-id="id" :loading="loading" :data="pagination.records">
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="title" title="标题">
          <template #default="{ row }">
            <a href="javascript:" @click="show(row)">{{ row.title }}</a>
          </template>
        </vxe-column>
        <vxe-column field="senderTime" title="发送时间" />
        <vxe-column field="haveRead" title="是否已读">
          <template #default="{ row }">
            <a-tag color="green" v-if="row.haveRead">已读</a-tag>
            <a-tag v-else color="red">未读</a-tag>
          </template>
        </vxe-column>
        <vxe-column fixed="right" width="70" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a href="javascript:" @click="show(row)">查看</a>
            </span>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <vxe-pager
      border
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"
    />
    <notice-reader ref="noticeReader" />
  </div>
</template>

<script lang="ts" setup>
  import NoticeReader from '/@/layouts/default/header/components/notify/NoticeReader.vue'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { $ref } from 'vue/macros'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { onMounted } from 'vue'
  import { pageByReceive } from '/@/views/modules/notice/site/SiteMessage.api'

  const { handleTableChange, resetQueryParams, pageQueryResHandel, pagination, pages, model, loading } = useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()

  const noticeReader = $ref<InstanceType<typeof NoticeReader>>(null)
  // 查询条件
  const fields = [
    { field: 'code', type: STRING, name: '流程编号', placeholder: '请输入流程编号' },
    { field: 'code', type: STRING, name: '流程名称', placeholder: '请输入流程名称' },
  ] as QueryField[]
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  function queryPage() {
    loading.value = true
    pageByReceive({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }
  function show(record) {
    noticeReader.init(record)
  }
</script>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'SiteMessageListReceive',
  })
</script>

<style scoped></style>
