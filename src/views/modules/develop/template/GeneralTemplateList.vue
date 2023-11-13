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
            <a-dropdown v-if="batchOperateFlag">
              <a-button post-icon="ant-design:down-outlined"> 批量操作 </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a @click="removeBatch">批量删除</a>
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
        <vxe-column field="name" title="模板名称" />
        <vxe-column field="code" title="模板代码" />
        <vxe-column field="useType" title="使用类型">
          <template #default="{ row }">
            {{ dictConvert('GeneralTemplateUseType', row.useType) }}
          </template>
        </vxe-column>
        <vxe-column field="fileType" title="文件类型" />
        <vxe-column field="fileSuffix" title="模板后缀名" />
        <vxe-column field="state" title="状态">
          <template #default="{ row }">
            {{ dictConvert('GeneralTemplateState', row.state) }}
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="200" :showOverflow="false" title="操作">
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
            <a-divider type="vertical" />
            <span>
              <a-link @click="down(row)">下载</a-link>
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
      <general-template-edit ref="generalTemplateEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { del, deleteBatch, page } from './GeneralTemplate.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import GeneralTemplateEdit from './GeneralTemplateEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance, VxeTable, VxeColumn, VxePager, VxeToolbar } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { getFileDownloadUrl } from '/@/api/common/FileUpload'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, batchOperateFlag, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  // 查询条件
  const fields = [
    { field: 'code', type: 'string', name: '编码', placeholder: '请输入编码' },
    { field: 'name', type: 'string', name: '名称', placeholder: '请输入名称' },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const generalTemplateEdit = $ref<any>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })

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
   * 新增
   */
  function add() {
    generalTemplateEdit.init(null, FormEditType.Add)
  }

  /**
   * 编辑
   */
  function edit(record) {
    generalTemplateEdit.init(record.id, FormEditType.Edit)
  }

  /**
   * 查看
   */
  function show(record) {
    generalTemplateEdit.init(record.id, FormEditType.Show)
  }

  /**
   * 下载
   */
  function down(record) {
    getFileDownloadUrl(record.fileId).then((res) => {
      window.open(res.data)
    })
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
