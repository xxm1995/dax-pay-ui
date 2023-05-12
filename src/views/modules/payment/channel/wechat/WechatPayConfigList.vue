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
        <vxe-column field="mchId" title="商户号" />
        <vxe-column field="appId" title="应用编号" />
        <!--      <vxe-column field="apiVersion" title="API版本" >-->
        <!--        <template v-slot="{row}">-->
        <!--          {{ dictConvert('wechatApiVersion',row.apiVersion) }}-->
        <!--        </template>-->
        <!--      </vxe-column>-->
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
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="180" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a-link @click="show(row)">查看</a-link>
            </span>
            <a-divider type="vertical" />
            <span>
              <a-link @click="edit(row)">编辑</a-link>
            </span>
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
                    <a-link danger @click="remove(row)">删除</a-link>
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
      <wechat-pay-config-edit ref="wechatPayConfigEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { del, page, clearActivity, setUpActivity } from './WechatPayConfig.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import WechatPayConfigEdit from './WechatPayConfigEdit.vue'
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
    { field: 'name', type: STRING, name: '名称', placeholder: '请输入名称' },
    { field: 'appId', type: STRING, name: 'AppId', placeholder: '请输入AppId' },
    { field: 'mchId', type: STRING, name: '商户号', placeholder: '请输入商户号' },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const wechatPayConfigEdit = $ref<any>()

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
    wechatPayConfigEdit.init(null, FormEditType.Add)
  }
  // 编辑
  function edit(record) {
    wechatPayConfigEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    wechatPayConfigEdit.init(record.id, FormEditType.Show)
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
