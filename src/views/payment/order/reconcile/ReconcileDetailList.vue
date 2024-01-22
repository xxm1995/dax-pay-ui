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
      <vxe-column field="title" title="商品名称" />
      <vxe-column field="orderId" title="本地订单号" />
      <vxe-column field="gatewayOrderNo" title="字典项名称" />
      <vxe-column field="type" title="交易类型">
        <template #default="{ row }">
          <a-tag v-if="row.type" color="green">启用</a-tag>
          <a-tag v-else color="red">停用</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="amount" title="交易金额" />
      <vxe-column field="remark" title="备注" />
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column fixed="right" width="60" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
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
    <reconcile-detail-info ref="reconcileDetailInfo" />"
  </basic-drawer>
</template>

<script setup lang="ts">
  import { nextTick, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page } from './ReconcileOrder.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import ReconcileDetailInfo from './ReconcileDetailInfo.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
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
  const reconcileDetailInfo = $ref<any>()

  nextTick(() => {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  })

  onMounted(() => {
    initData()
  })

  /**
   * 初始化基础数据
   */
  function initData() {}
  /**
   * 入口
   * @param record
   */
  function init(record) {
    visible = true
    dictInfo = record
    queryPage()
  }

  /**
   * 分页查询
   */
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
  /**
   * 查看
   */
  function show(record) {
    reconcileDetailInfo.init(record)
  }
  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
