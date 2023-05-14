<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="generationBatch">生成储值卡</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="cardNo" title="卡号" />
        <vxe-column field="batchNo" title="生成批次号" />
        <vxe-column field="faceValue" title="面值" />
        <vxe-column field="balance" title="余额" />
        <vxe-column field="startTime" title="开始时间" />
        <vxe-column field="endTime" title="结束时间" />
        <vxe-column field="enduring" title="长期有效">
          <template #default="{ row }">
            <a-tag>{{ row.enduring ? '长期' : '期限' }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="status" title="状态">
          <template #default="{ row }">
            {{ dictConvert('VoucherStatus', row.status) }}
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="120" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a-link @click="show(row)">查看</a-link>
            </span>
            <a-divider type="vertical" />
            <a-dropdown>
              <a> 更多 <icon icon="ant-design:down-outlined" :size="12" /> </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-link danger v-if="row.status === 1" @click="lockConfirm(row.id, true)">停用</a-link>
                    <a-link v-if="row.status === 2" @click="lockConfirm(row.id, false)">启用</a-link>
                  </a-menu-item>
                  <!--                <a-menu-item>-->
                  <!--                  <a-link>金额变动</a-link>-->
                  <!--                </a-menu-item>-->
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
      <voucher-info ref="voucherInfo" />
      <voucher-generation ref="voucherGeneration" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { del, lock, page, unlock } from './Voucher.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import VoucherInfo from './VoucherInfo.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { useDict } from '/@/hooks/bootx/useDict'
  import VoucherGeneration from '/@/views/modules/payment/voucher/VoucherGeneration.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  // 查询条件
  const fields = [
    { field: 'cardNo', type: STRING, name: '卡号', placeholder: '请输入储值卡卡号' },
    { field: 'batchNo', type: STRING, name: '批次号', placeholder: '请输入批次号' },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const voucherInfo = $ref<any>()
  const voucherGeneration = $ref<any>()

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
  // 查看
  function show(record) {
    voucherInfo.init(record.id)
  }

  // 批量生成
  function generationBatch() {
    voucherGeneration.init()
  }
  /**
   * 启用/停用 储值卡
   * @param voucherId 储值卡id
   * @param type true 锁定, false 解锁
   */
  function lockConfirm(voucherId, type) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: type ? '是否停用该储值卡' : '是否启用该储值卡',
      onOk: async () => {
        if (type) {
          await lock(voucherId)
        } else {
          await unlock(voucherId)
        }
        createMessage.success(type ? '停用该储值卡成功' : '启用该储值卡成功')
        queryPage()
      },
    })
  }
</script>

<style lang="less" scoped></style>
