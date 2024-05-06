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
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table
        row-id="id"
        ref="xTable"
        :data="pagination.records"
        :loading="loading"
        :sort-config="{ remote: true, trigger: 'cell' }"
        @sort-change="sortChange"
      >
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="date" title="对账日期" />
        <vxe-column field="reconcileNo" title="对账号" />
        <vxe-column field="channel" title="对账通道">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayChannel', row.channel) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="down" title="下载或上传">
          <template #default="{ row }">
            <template v-if="row.downOrUpload">
              <a-tag v-if="row.downOrUpload" color="green">已完成</a-tag>
            </template>
            <template v-else>
              <a-link color="red" @click="down(row)">下载</a-link>
              <a-divider type="vertical" />
              <a-upload
                name="file"
                :multiple="false"
                :action="uploadAction"
                :headers="tokenHeader"
                :data="{ id: row.id }"
                :showUploadList="false"
                @change="handleChange"
              >
                <a-link color="red">上传</a-link>
              </a-upload>
            </template>
          </template>
        </vxe-column>
        <vxe-column field="compare" title="比对">
          <template #default="{ row }">
            <a-tag v-if="row.compare" color="green">已比对</a-tag>
            <a-link v-else :disabled="!row.downOrUpload" color="red" @click="compareOrder(row)">比对</a-link>
          </template>
        </vxe-column>
        <vxe-column field="result" title="对账结果">
          <template #default="{ row }">
            {{ dictConvert('ReconcileResult', row.result) }}
          </template>
        </vxe-column>
        <vxe-column field="errorMsg" title="错误信息" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="150" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-dropdown>
              <a> 下载 <icon icon="ant-design:down-outlined" :size="12" /> </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-link @click="downOriginalFile(row)">原始对账单</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="downOriginalTransferFile(row)">通道对账单</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="downReconcileFile(row)">系统对账单</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="downDiffFile(row)">差异明细</a-link>
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
    </div>
    <reconcile-order-create ref="reconcileOrderCreate" @ok="queryPage" />
    <reconcile-order-info ref="reconcileOrderInfo" />
  </div>
</template>
<script setup lang="ts">
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { computed, onMounted } from 'vue'
  import { DATE, LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { compare, downAndSave, page } from './ReconcileOrder.api'
  import ReconcileOrderInfo from './ReconcileOrderInfo.vue'
  import ReconcileOrderCreate from './ReconcileOrderCreate.vue'
  import ALink from '/@/components/Link/Link.vue'
  import { useUpload } from '/@/hooks/bootx/useUpload'
  import { useUserStoreWithOut } from '/@/store/modules/user'
  import { getAppEnvConfig } from '/@/utils/env'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, sortChange, sortParam, pagination, pages, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()
  // 手动上传对账单
  const { tokenHeader, uploadAction } = useUpload('/order/reconcile/upload')
  const useUserStore = useUserStoreWithOut()
  const { VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX } = getAppEnvConfig()
  const downUrl = VITE_GLOB_API_URL + VITE_GLOB_API_URL_PREFIX

  let payChannelList = $ref<LabeledValue[]>([])
  let reconcileResultList = $ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'date', type: DATE, name: '对账日期', placeholder: '请选择对账日期' },
      { field: 'reconcileNo', type: STRING, name: '批次号', placeholder: '请输入对账批次号' },
      {
        field: 'channel',
        type: LIST,
        name: '对账通道',
        placeholder: '请选择对账通道',
        selectList: payChannelList,
      },
      {
        field: 'result',
        type: LIST,
        name: '对账结果',
        placeholder: '请选择对账结果',
        selectList: reconcileResultList,
      },
    ] as QueryField[]
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const reconcileOrderCreate = $ref<any>()
  const reconcileOrderInfo = $ref<any>()

  onMounted(() => {
    initData()
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    payChannelList = await dictDropDown('AsyncPayChannel')
    reconcileResultList = await dictDropDown('ReconcileResult')
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
    return Promise.resolve()
  }
  /**
   * 查看详情
   */
  function show(record) {
    reconcileOrderInfo.init(record)
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
   * 上传完成回调
   */
  function handleChange(info) {
    if (info.file.status === 'done') {
      if (!info.file.response.code) {
        queryPage()
        createMessage.success(`${info.file.name} 上传成功!`)
      } else {
        createMessage.error(`${info.file.response.msg}`)
      }
    } else if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  /**
   * 创建对账订单
   */
  function add() {
    reconcileOrderCreate.init()
  }

  /**
   * 下载原始对账单
   */
  function downOriginalFile(record) {
    createConfirm({
      iconType: 'info',
      title: '提示',
      content: '从三方支付系统中获取的交易对账单文件，未经过处理，确定要下载吗？',
      onOk: () => {
        const token = useUserStore.getToken
        // 跳转到新页面进行下载
        window.open(`${downUrl}/order/reconcile/downOriginal?id=${record.id}&Accesstoken=${token}`)
      },
    })
  }

  /**
   * 下载原始对账单(转换)
   */
  function downOriginalTransferFile(record) {
    createConfirm({
      iconType: 'info',
      title: '提示',
      content: '将三方支付系统中的原始交易对账文件，转换为统一格式的CSV，确定要下载吗？',
      onOk: () => {
        const token = useUserStore.getToken
        // 跳转到新页面进行下载
        window.open(`${downUrl}/order/reconcile/downOriginal2Csv?id=${record.id}&Accesstoken=${token}`)
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
      content: '通过本系统中订单生成的对账单，确定要下载吗？',
      onOk: () => {
        const token = useUserStore.getToken
        // 跳转到新页面进行下载
        window.open(`${downUrl}/order/reconcile/downLocalCsv?id=${record.id}&Accesstoken=${token}`)
      },
    })
  }

  /**
   * 下载对账差异明细
   */
  function downDiffFile(record) {
    createConfirm({
      iconType: 'info',
      title: '提示',
      content: '确定要下载对账差异明细吗？',
      onOk: () => {
        const token = useUserStore.getToken
        // 跳转到新页面进行下载
        window.open(`${downUrl}/order/reconcile/downDiffCsv?id=${record.id}&Accesstoken=${token}`)
        createMessage.info('对账差异明细单下载保存中.....')
      },
    })
  }
</script>

<style scoped lang="less"></style>
