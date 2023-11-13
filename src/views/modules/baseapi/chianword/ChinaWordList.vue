<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :default-item-count="3" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
            <a-button v-if="batchOperateFlag" @click="removeBatch">批量删除</a-button>
            <a-dropdown>
              <a-button post-icon="ant-design:down-outlined"> 更多操作 </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-link @click="importData">导入数据</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="refreshAll">刷新缓存</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link pre-icon="ant-design:form-outlined" @click="verify">测试敏感词</a-link>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table
        row-id="id"
        ref="xTable"
        :data="pagination.records"
        :loading="loading"
        @checkbox-all="selectAllEvent"
        @checkbox-change="selectChangeEvent"
      >
        <vxe-column type="checkbox" width="50" />
        <vxe-column field="word" title="敏感词" />
        <vxe-column field="type" title="分类" />
        <vxe-column field="white" title="类型">
          <template #default="{ row }">
            <a-tag v-if="row.white" color="green">白名单</a-tag>
            <a-tag v-else color="red">黑名单</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="enable" title="是否启用">
          <template #default="{ row }">
            <a-tag v-if="row.enable" color="green">启用</a-tag>
            <a-tag v-else color="red">停用</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="description" title="描述" />
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
      <china-word-edit ref="chinaWordEdit" @ok="queryPage" />
      <china-word-verify ref="chinaWordVerify" />
      <basic-import-modal
        ref="basicImportModal"
        @ok="queryPage"
        template-url="/chinaword/getTemplate"
        upload-url="/chinaword/importBatch"
        template-name="洛阳工作量.xlsx"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { del, deleteBatch, page, refresh } from './ChinaWord.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import ChinaWordEdit from './ChinaWordEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance, VxeTable, VxeColumn, VxePager, VxeToolbar } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import ChinaWordVerify from './ChinaWordVerify.vue'
  import BasicImportModal from '/@/components/Bootx/BasicImport/BasicImportModal.vue'
  import ALink from '/@/components/Link/Link.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, batchOperateFlag, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()

  // 查询条件
  const fields = [
    { field: 'word', type: STRING, name: '敏感词', placeholder: '请输入敏感词' },
    { field: 'type', type: STRING, name: '分类', placeholder: '请输入敏感词分类' },
    {
      field: 'white',
      type: 'list',
      name: '类型',
      placeholder: '请选择敏感词类型',
      selectList: [
        { label: '黑名单', value: 'false' },
        { label: '白名单', value: 'true' },
      ],
    },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const chinaWordEdit = $ref<any>()
  const chinaWordVerify = $ref<any>()
  const basicImportModal = $ref<any>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })

  /**
   * 初始化绑定
   */
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
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
    return Promise.resolve()
  }

  /**
   * 选中全部
   */
  function selectAllEvent() {
    const records = xTable?.getCheckboxRecords()
    batchOperateFlag.value = !!records?.length
  }
  /**
   * 选中事件
   */
  function selectChangeEvent() {
    const records = xTable?.getCheckboxRecords()
    batchOperateFlag.value = !!records?.length
  }

  /**
   * 新增
   */
  function add() {
    chinaWordEdit.init(null, FormEditType.Add)
  }

  /**
   * 导入
   */
  function importData() {
    basicImportModal.init()
  }

  /**
   * 编辑
   */
  function edit(record) {
    chinaWordEdit.init(record.id, FormEditType.Edit)
  }

  /**
   * 测试敏感词
   */
  function verify() {
    chinaWordVerify.init()
  }

  /**
   * 刷新缓存
   */
  function refreshAll() {
    createConfirm({
      iconType: 'info',
      title: '提示',
      content: '是否要刷新敏感词缓存',
      onOk: () => {
        refresh().then(() => {
          createMessage.success('刷新成功')
        })
      },
    })
  }

  /**
   * 查看
   */
  function show(record) {
    chinaWordEdit.init(record.id, FormEditType.Show)
  }

  /**
   * 删除
   */
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
  /**
   * 批量删除
   */
  function removeBatch() {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否删除选中的数据',
      onOk: () => {
        const userIds = xTable?.getCheckboxRecords().map((o) => o.id)
        deleteBatch(userIds).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }
</script>

<style lang="less" scoped></style>
