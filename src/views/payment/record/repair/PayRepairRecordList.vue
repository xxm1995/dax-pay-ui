<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="paymentId" title="支付号" />
        <vxe-column field="businessNo" title="业务号" />
        <vxe-column field="repairSource" title="修复来源">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayRepairSource', row.repairSource) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="repairType" title="修复类型">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayRepairType', row.repairType) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="asyncChannel" title="修复通道">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('AsyncPayChannel', row.asyncChannel) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="beforeStatus" title="修复前类型">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayStatus', row.beforeStatus) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="afterStatus" title="修复后类型">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayStatus', row.afterStatus) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="修复时间" />
        <vxe-column fixed="right" width="60" :showOverflow="false" title="操作">
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
    </div>
    <pay-repair-record-info ref="payRepairRecordInfo" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page } from './PayRepairRecord.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import PayRepairRecordInfo from './PayRepairRecordInfo.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  let repairSourceList = $ref<LabeledValue[]>([])
  let repairTypeList = $ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'paymentId', type: STRING, name: '支付单号', placeholder: '请输入支付单号' },
      { field: 'businessNo', type: STRING, name: '业务号', placeholder: '请输入业务号' },
      {
        field: 'repairSource',
        type: LIST,
        name: '修复来源',
        placeholder: '请选择修复来源',
        selectList: repairSourceList,
      },
      {
        field: 'repairType',
        type: LIST,
        name: '修复类型',
        placeholder: '请选择修复类型',
        selectList: repairTypeList,
      },
    ] as QueryField[]
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const payRepairRecordInfo = $ref<any>()

  onMounted(() => {
    init()
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 初始化
   */
  async function init() {
    repairSourceList = await dictDropDown('PayRepairSource')
    repairTypeList = await dictDropDown('PayRepairType')
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
   * 查看
   */
  function show(record) {
    payRepairRecordInfo.init(record.id)
  }
</script>

<style lang="less" scoped></style>