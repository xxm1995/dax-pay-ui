<template>
  <div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="username" title="账号" />
        <vxe-column field="name" title="名称" />
        <vxe-column field="phone" title="手机号" />
        <vxe-column field="email" title="邮箱" />
        <vxe-column field="status" title="用户状态">
          <template #default="{ row }">
            {{ dictConvert('UserStatusCode', row.status) }}
          </template>
        </vxe-column>
        <vxe-column fixed="right" width="170" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link>查看</a-link>
            <a-divider type="vertical" />
            <a-link danger @click="logout(row.id)">登出</a-link>
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
    </div>
  </div>
</template>

<script setup lang="ts">
  // 使用hooks
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { page } from './OnlineUser.api'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { onMounted } from 'vue'
  import ALink from '/@/components/Link/Link.vue'

  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  /**
   * 页面加载函数
   */
  onMounted(() => {
    queryPage()
  })

  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }

  /**
   *
   * @param userId
   */
  function logout(userId) {
    createConfirm({
      iconType: 'warning',
      title: '确认登出',
      content: '是否确认登出？',
      onOk: () => {
        loading.value = true
        createMessage.success('登出成功')
        queryPage()
      },
    })
  }
</script>

<style scoped lang="less"></style>
