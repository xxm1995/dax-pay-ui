<template>
  <div>
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
        <vxe-column field="chineseName" title="中文名字" />
        <vxe-column field="password" title="密码" />
        <vxe-column field="idCard" title="身份证号" />
        <vxe-column field="mobilePhone" title="手机号" />
        <vxe-column field="carLicense" title="车牌号" />
        <vxe-column field="email" title="电子邮件" />
        <vxe-column field="other" title="其他" />
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
            <a-popconfirm title="是否删除" @confirm="remove(row)" okText="是" cancelText="否">
              <a-link danger>删除</a-link>
            </a-popconfirm>
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
      <data-sensitive-demo-edit ref="dataSensitiveDemoEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { del, page } from './DataSensitiveDemo.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import DataSensitiveDemoEdit from './DataSensitiveDemoEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()

  // 查询条件
  const fields = [] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const dataSensitiveDemoEdit = $ref<any>()

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
    dataSensitiveDemoEdit.init(null, FormEditType.Add)
  }
  // 编辑
  function edit(record) {
    dataSensitiveDemoEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    dataSensitiveDemoEdit.init(record.id, FormEditType.Show)
  }

  // 删除
  function remove(record) {
    del(record.id).then(() => {
        createMessage.success('删除成功')
        queryPage()
      })
    }
</script>

<style lang="less" scoped></style>
