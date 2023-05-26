<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :default-item-count="3" :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ query: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="appNo" title="应用编码">
          <template #default="{ row }">
            <a-link @click="show(row)">{{ row.appNo }}</a-link>
          </template>
        </vxe-column>
        <vxe-column field="name" title="名称" />
        <vxe-column field="mchNo" title="商户号" />
        <vxe-column field="state" title="状态">
          <template #default="{ row }">
            <a-tag>{{ row.state === 'enable' ? '启用' : '停用' }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="170" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a-link @click="edit(row)">编辑</a-link>
            </span>
            <a-divider type="vertical" />
            <span>
              <a-link @click="config(row)">支付配置</a-link>
            </span>
            <a-divider type="vertical" />
            <span>
              <a-link danger @click="remove(row)">删除</a-link>
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
      <mch-application-edit ref="mchApplicationEdit" @ok="queryPage" />
      <pay-config ref="payConfig" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onActivated, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { del, page } from './MchApplication.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import MchApplicationEdit from './MchApplicationEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance, VxeTable, VxeColumn, VxePager, VxeToolbar } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import { useRoute } from 'vue-router'
  import { useTabs } from '/@/hooks/web/useTabs'
  import { useTitle } from '@vueuse/core'
  import ALink from '/@/components/Link/Link.vue'
  import PayConfig from './MchAppPayConfigList.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, pagination, pages, model, loading, superQueryFlag } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const route = useRoute()
  const { setTitle } = useTabs()

  let mchNo = $ref<string>()

  // 查询条件
  const fields = computed<QueryField[]>(() => [
    { field: 'mchNo', name: '商户号', placeholder: '请输入商户号', disable: !!mchNo },
    { field: 'appId', name: 'APPID', placeholder: '请输入应用APPID' },
    { field: 'name', name: '名称', placeholder: '请输入应用名称' },
  ])

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const mchApplicationEdit = $ref<any>()
  const payConfig = $ref<any>()

  onMounted(() => {
    vxeBind()
    initData()
    queryPage()
  })
  onActivated(() => {
    if (mchNo) {
      setupTitle()
    }
  })

  /**
   * 绑定
   */
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 初始化数据
   */
  function initData() {
    mchNo = route.query.mchNo as string
    model.queryParam['mchNo'] = mchNo
    setupTitle()
  }

  /**
   * 设置标题
   */
  function setupTitle() {
    if (mchNo) {
      // 标签标题
      setTitle(`商户应用(${mchNo})`)
      // 浏览器标题
      useTitle(`商户 ${mchNo} 的应用列表`)
    }
  }

  /**
   * 查询初始化
   */
  function resetQueryParams() {
    superQueryFlag.value = false
    model.queryParam = {
      mchNo,
    }
  }

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
  // 新增
  function add() {
    mchApplicationEdit.init(null, FormEditType.Add, mchNo)
  }
  // 编辑
  function edit(record) {
    mchApplicationEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    mchApplicationEdit.init(record.id, FormEditType.Show)
  }
  // 支付配置
  function config(record) {
    payConfig.show(record)
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
