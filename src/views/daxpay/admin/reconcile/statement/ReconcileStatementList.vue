<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
        :query-params="model.queryParam"
        :default-item-count="3"
        :fields="fields"
        @query="queryPage"
        @reset="resetQueryParams"
      />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add"
              >新建</a-button
            >
          </a-space>
        </template>
      </vxe-toolbar>
      <div class="h-65vh">
        <vxe-table
          row-id="id"
          ref="xTable"
          height="auto"
          align="center"
          :data="pagination.records"
          :loading="loading"
          :sort-config="{ remote: true, trigger: 'cell' }"
          @sort-change="sortChange"
        >
          <vxe-column type="seq" title="序号" width="60" />
          <vxe-column field="name" title="标题" :min-width="230" />
          <vxe-column field="date" title="对账日期" :min-width="100" />
          <vxe-column field="reconcileNo" title="对账号" :min-width="230">
            <template #default="{ row }">
              <a @click="show(row)">
                {{ row.reconcileNo }}
              </a>
            </template>
          </vxe-column>
          <vxe-column field="channel" title="对账通道" :min-width="150">
            <template #default="{ row }">
              <a-tag>{{ dictConvert('channel', row.channel) }}</a-tag>
            </template>
          </vxe-column>
          <vxe-column field="down" title="下载" :min-width="100">
            <template #default="{ row }">
              <template v-if="row.downOrUpload">
                <a-tag v-if="row.downOrUpload" color="green">已完成</a-tag>
              </template>
              <template v-else>
                <a-link color="red" @click="down(row)">下载</a-link>
              </template>
            </template>
          </vxe-column>
          <vxe-column field="compare" title="比对" :min-width="100">
            <template #default="{ row }">
              <a-tag v-if="row.compare" color="green">已比对</a-tag>
              <a-link v-else :disabled="!row.downOrUpload" color="red" @click="compareOrder(row)"
                >比对</a-link
              >
            </template>
          </vxe-column>
          <vxe-column field="result" title="对账结果" :min-width="100">
            <template #default="{ row }">
              {{ dictConvert('reconcile_result', row.result) }}
            </template>
          </vxe-column>
          <vxe-colgroup title="平台数据">
            <vxe-column field="orderCount" title="支付订单数" :min-width="150" />
            <vxe-column field="orderAmount" title="支付交易金额" :min-width="150" />
            <vxe-column field="refundCount" title="退款订单数" :min-width="150" />
            <vxe-column field="refundAmount" title="退款交易金额" :min-width="150" />
          </vxe-colgroup>
          <vxe-colgroup title="通道数据">
            <vxe-column field="channelOrderCount" title="支付订单数" :min-width="150" />
            <vxe-column field="channelOrderAmount" title="支付交易金额" :min-width="150" />
            <vxe-column field="channelRefundCount" title="退款订单数" :min-width="150" />
            <vxe-column field="channelRefundAmount" title="退款交易金额" :min-width="150" />
          </vxe-colgroup>
          <vxe-column field="errorMsg" title="错误信息" :min-width="160" />
          <vxe-column field="createTime" title="创建时间" :min-width="160" />
          <vxe-column fixed="right" width="120" :showOverflow="false" title="操作">
            <template #default="{ row }">
              <a-link @click="show(row)">查看</a-link>
              <a-divider type="vertical" />
              <a-dropdown>
                <a>
                  更多
                  <icon icon="ant-design:down-outlined" :size="12" />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a-link @click="downOriginalFile(row)">通道对账单</a-link>
                    </a-menu-item>
                    <a-menu-item>
                      <a-link @click="downReconcileFile(row)">平台对账单</a-link>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <vxe-pager
        size="medium"
        :loading="loading"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @page-change="handleTableChange"
      />
      <ReconcileStatementCreate ref="reconcileStatementCreate" @ok="queryPage" />
      <Reconcile-statement-info ref="reconcileStatementInfo" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, ref } from 'vue'
  import { compare, downAndSave, page } from './ReconcileStatement.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '@/components/Bootx/Query/Query'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useDict } from '@/hooks/bootx/useDict'
  import { Icon } from '@/components/Icon'
  import ALink from '@/components/Link/Link.vue'
  import ReconcileStatementCreate from './ReconcileStatementCreate.vue'
  import ReconcileStatementInfo from './ReconcileStatementInfo.vue'
  import { useFilePlatform } from '@/hooks/bootx/useFilePlatform'

  // 使用hooks
  const {
    handleTableChange,
    pageQueryResHandel,
    resetQueryParams,
    sortChange,
    pagination,
    pages,
    sortParam,
    model,
    loading,
  } = useTablePage(queryPage)
  const { dictDropDown, dictConvert } = useDict()
  const { createMessage, createConfirm } = useMessage()
  const { getFileUrl } = useFilePlatform()

  let channelList = ref<LabeledValue[]>([])
  let resultList = ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'name', type: STRING, name: '标题', placeholder: '请输入对账标题' },
      { field: 'reconcileNo', type: STRING, name: '对账号', placeholder: '请输入对账号' },
      { field: 'channel', name: '对账通道', type: LIST, selectList: channelList.value },
      { field: 'result', name: '对账结果', type: LIST, selectList: resultList.value },
      {
        field: 'downOrUpload',
        name: '下载',
        type: LIST,
        placeholder: '请选择是否已经下载对账文件',
        selectList: [
          { label: '已完成', value: true },
          { label: '未完成', value: false },
        ],
      },
      {
        field: 'compare',
        name: '比对完成',
        type: LIST,
        placeholder: '请选择是否已经对账比对完成',
        selectList: [
          { label: '已完成', value: true },
          { label: '未完成', value: false },
        ],
      },
      { field: 'mchNo', type: STRING, name: '商户号', placeholder: '请输入商户号' },
      { field: 'appId', type: STRING, name: '应用号', placeholder: '请输入应用号' },
    ] as QueryField[]
  })

  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const reconcileStatementCreate = ref<any>()
  const reconcileStatementInfo = ref<any>()

  nextTick(() => {
    xTable.value?.connect(xToolbar.value as VxeToolbarInstance)
  })

  onMounted(() => {
    initData()
    init()
  })

  /**
   * 初始化基础数据
   */
  async function initData() {
    channelList.value = await dictDropDown('channel')
    resultList.value = await dictDropDown('reconcile_result')
  }
  /**
   * 入口
   */
  function init() {
    model.queryParam = {}
    xTable.value?.clearSort()
    queryPage()
  }

  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...pages,
      ...sortParam,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }

  /**
   * 下载对账单
   */
  function down(record) {
    createConfirm({
      iconType: 'info',
      title: '提示',
      content: '确定要下载对账单吗？',
      onOk: () => {
        createMessage.info('对账单下载保存中.....')
        downAndSave(record.id)
          .then(() => {
            createMessage.info('对账单下载完成')
          })
          .finally(() => {
            queryPage()
          })
      },
    })
  }

  /**
   * 对账比对
   */
  function compareOrder(record) {
    createConfirm({
      iconType: 'info',
      title: '提示',
      content: '确定要进行比对吗？',
      onOk: () => {
        createMessage.info('对账单比对中.....')
        compare(record.id)
          .then(() => {
            createMessage.info('对账单比对完成')
          })
          .finally(() => {
            queryPage()
          })
      },
    })
  }

  /**
   * 创建对账订单
   */
  function add() {
    reconcileStatementCreate.value.init()
  }

  /**
   * 查看
   */
  function show(record) {
    reconcileStatementInfo.value.init(record.id)
  }

  /**
   * 下载原始对账单
   */
  function downOriginalFile(record) {
    createConfirm({
      iconType: 'info',
      title: '提示',
      content: '从三方支付系统中获取的交易对账单文件，确定要下载吗？',
      onOk: () => {
        const url = getFileUrl(record.channelFileUrl)
        window.open(url)
      },
    })
  }

  /**
   * 下载对账单
   */
  function downReconcileFile(record) {
    createConfirm({
      iconType: 'info',
      title: '提示',
      content: '是否要下载系统平台的对账单？',
      onOk: () => {
        const url = getFileUrl(record.platformFileUrl)
        window.open(url)
      },
    })
  }

  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
