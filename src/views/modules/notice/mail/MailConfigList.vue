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
        <vxe-column field="code" title="编号" />
        <vxe-column field="name" title="名称" />
        <vxe-column field="host" title="地址" />
        <vxe-column field="port" title="端口" />
        <vxe-column field="username" title="账号" />
        <vxe-column field="sender" title="发送人" />
        <vxe-column field="from" title="from" />
        <vxe-column field="activity" title="启用状态">
          <template #default="{ row }">
            <a-tag v-if="row.activity" color="green">启用</a-tag>
            <a-tag v-else color="red">未启用</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="securityType" title="安全传输方式">
          <template #default="{ row }">
            {{ dictConvert('MailSecurityCode', row.securityType) }}
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="170" :showOverflow="false" title="操作">
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
              <a> 更多 <icon icon="ant-design:down-outlined" :size="12" /> </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:" @click="setUpActivityData(row)">设为默认</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a-popconfirm title="是否删除配置" @confirm="remove(row)" okText="是" cancelText="否">
                      <a href="javascript:" @click="remove(row)" style="color: red">删除</a>
                    </a-popconfirm>
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
      <mail-config-edit ref="mailConfigEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { del, page, setUpActivity } from './MailConfig.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import MailConfigEdit from './MailConfigEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import Icon from '/@/components/Icon/src/Icon.vue'

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
  const mailConfigEdit = $ref<any>()

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
    mailConfigEdit.init(null, FormEditType.Add)
  }
  // 编辑
  function edit(record) {
    mailConfigEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    mailConfigEdit.init(record.id, FormEditType.Show)
  }

  // 删除
  function remove(record) {
    queryPage()
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否删除配置',
      onOk: () => {
        del(record.id).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }
  // 设置默认配置
  function setUpActivityData(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否设为默认配置',
      onOk: () => {
        setUpActivity(record.id).then(() => {
          createMessage.success('设置成功')
          queryPage()
        })
      },
    })
  }
</script>

<style lang="less" scoped></style>
