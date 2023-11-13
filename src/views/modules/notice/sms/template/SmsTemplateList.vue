<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" :default-item-count="4" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:sync-outlined" @click="add">同步</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="supplierType" title="短信渠道商" />
        <vxe-column field="templateId" title="模板ID" />
        <vxe-column field="name" title="模板名称" />
        <vxe-column field="content" title="模板内容" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="150" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a-link @click="show(row)">查看</a-link>
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
      <sms-template-edit ref="smsTemplateEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { del, page } from './SmsTemplate.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import SmsTemplateEdit from './SmsTemplateEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance, VxeTable, VxeColumn, VxePager, VxeToolbar } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import { dropdownTranslate } from '/@/utils/dataUtil'
  import { findAll, SmsChannelConfig } from '/@/views/modules/notice/sms/config/SmsChannelConfig.api'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()

  let configs = $ref<SmsChannelConfig[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      {
        name: '短信渠道商',
        field: 'supplierType',
        type: 'list',
        placeholder: '请选择要查询的短信渠道商',
        selectList: dropdownTranslate(configs, 'name', 'code'),
      },
      { name: '模板ID', field: 'templateId', type: 'string', placeholder: '请输入模板ID' },
      { name: '模板名称', field: 'name', type: 'string', placeholder: '请输入模板名称' },
    ] as QueryField[]
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const smsTemplateEdit = $ref<any>()

  onMounted(() => {
    vxeBind()
    initData()
    queryPage()
  })

  /**
   * 初始化绑定
   */
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 初始化数据
   */
  function initData() {
    findAll().then(({ data }) => {
      configs = data
    })
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
    // smsTemplateEdit.init(null, FormEditType.Add)
  }

  /**
   * 查看
   */
  function show(record) {
    smsTemplateEdit.init(record.id, FormEditType.Show)
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
</script>

<style lang="less" scoped></style>
