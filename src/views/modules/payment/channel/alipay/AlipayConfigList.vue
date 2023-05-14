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
        <vxe-column field="name" title="名称" />
        <vxe-column field="appId" title="商户appId" />
        <vxe-column field="authType" title="认证方式">
          <template #default="{ row }">
            <a-tag v-show="row.authType === 1">公钥</a-tag>
            <a-tag v-show="row.authType === 2">证书</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="signType" title="签名类型" />
        <vxe-column field="sandbox" title="沙箱">
          <template #default="{ row }">
            <a-tag v-if="row.sandbox">是</a-tag>
            <a-tag v-else>否</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="activity" title="活动状态">
          <template #default="{ row }">
            <a-tag color="green" v-if="row.activity">启用</a-tag>
            <a-tag color="red" v-else>未启用</a-tag>
          </template>
        </vxe-column>
        <vxe-column fixed="right" width="180" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link @click="edit(row)">编辑</a-link>
            <a-divider type="vertical" />
            <a-dropdown>
              <a> 更多 <icon icon="ant-design:down-outlined" :size="12" /></a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-link v-if="!row.activity" @click="setup(row)">启用</a-link>
                    <a-link v-else danger @click="clear(row)">停用</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="remove(row)" style="color: red">删除</a-link>
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
      <alipay-config-edit ref="alipayConfigEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { clearActivity, del, page, setUpActivity } from './AlipayConfig.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import AlipayConfigEdit from './AlipayConfigEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import ALink from '/@/components/Link/Link.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()

  // 查询条件
  const fields = [
    { field: 'name', type: 'string', name: '名称', placeholder: '请输入名称' },
    { field: 'appId', type: 'string', name: 'AppId', placeholder: '请输入AppId' },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const alipayConfigEdit = $ref<any>()

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
    alipayConfigEdit.init(null, FormEditType.Add)
  }
  // 编辑
  function edit(record) {
    alipayConfigEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    alipayConfigEdit.init(record.id, FormEditType.Show)
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
  function setup(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否启用此配置',
      onOk: () => {
        loading.value = true
        setUpActivity(record.id).then(() => {
          queryPage()
        })
      },
    })
  }
  function clear(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否停用此配置',
      onOk: () => {
        loading.value = true
        clearActivity(record.id).then(() => {
          queryPage()
        })
      },
    })
  }
</script>

<style lang="less" scoped></style>
