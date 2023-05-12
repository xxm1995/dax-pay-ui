<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
        :query-params="model.queryParam"
        :disabled-query="superQueryFlag"
        :fields="fields"
        @query="queryPage"
        @reset="resetQueryParams"
      />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
            <b-super-query :fields="superFields" :query-state="superQueryFlag" @query="superQuery" @reset="resetQueryParams" />
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="name" title="名称" />
        <vxe-column field="age" title="年龄" />
        <vxe-column field="vip" title="是否vip">
          <template #default="{ row }">
            <a-tag v-if="row.vip" color="green">是</a-tag>
            <a-tag v-else color="red">否</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="birthday" title="生日" />
        <vxe-column field="workTime" title="上班时间" />
        <vxe-column field="registrationTime" title="注册时间" />
        <vxe-column field="political" title="政治面貌">
          <template #default="{ row }">
            {{ dictConvert('Political', row.political) }}
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注" />
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
      <super-query-demo-edit ref="superQueryDemoEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { del, page, superPage } from './SuperQueryDemo.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { BOOLEAN, DATE, DATE_TIME, LIST, NUMBER, QueryField, STRING, TIME } from '/@/components/Bootx/Query/Query'
  import SuperQueryDemoEdit from './SuperQueryDemoEdit.vue'
  import { useDict } from '/@/hooks/bootx/useDict'
  import BSuperQuery from '/@/components/Bootx/SuperQuery/BSuperQuery.vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'

  // 使用hooks
  const { handleTableChange, superQueryFlag, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDownNumber } = useDict()

  let politicalList = $ref<LabeledValue[]>(dictDropDownNumber('Political'))

  // 查询条件
  const fields = [
    { field: 'name', name: '姓名', type: STRING },
    { field: 'remark', name: '备注', type: STRING },
  ] as QueryField[]
  const superFields = computed(() => {
    return [
      { field: 'name', name: '姓名', type: STRING },
      { field: 'age', name: '年龄', type: NUMBER },
      { field: 'vip', name: '是否vip', type: BOOLEAN },
      { field: 'birthday', name: '生日', type: DATE },
      { field: 'workTime', name: '上班时间', type: TIME },
      { field: 'registrationTime', name: '注册时间', type: DATE_TIME },
      { field: 'political', name: '政治面貌', type: LIST, selectList: politicalList },
    ] as QueryField[]
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const superQueryDemoEdit = $ref<any>()

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
  // 超级查询
  function superQuery(queryParams) {
    superQueryFlag.value = true
    loading.value = true
    superPage(pages, { queryParams }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }
  // 新增
  function add() {
    superQueryDemoEdit.init(null, FormEditType.Add)
  }
  // 编辑
  function edit(record) {
    superQueryDemoEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    superQueryDemoEdit.init(record.id, FormEditType.Show)
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
