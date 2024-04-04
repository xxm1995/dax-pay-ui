<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" :default-item-count="3" @query="queryPage" @reset="resetQueryParams" />
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
        <vxe-column field="name" title="账号别名" />
        <vxe-column field="channel" title="所属通道">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayChannel', row.channel) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="receiverType" title="分账接收方类型">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('AllocationReceiverType', row.receiverType) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="receiverAccount" title="接收方账号" />
        <vxe-column field="receiverName" title="接收方姓名" />
        <vxe-column field="relationType" title="分账关系">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('AllocationRelationType', row.relationType) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="sync" title="是否同步">
          <template #default="{ row }">
            <a-tag>{{ row.sync ? '已同步' : '未同步' }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column fixed="right" width="220" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link @click="edit(row)">编辑</a-link>
            <a-divider type="vertical" />
            <a-link :disabled="row.sync" @click="remove(row)">删除</a-link>
            <a-divider type="vertical" />
            <a-link v-if="!row.sync" @click="bind(row)">同步</a-link>
            <a-link v-else @click="unbind(row)">取消同步</a-link>
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
    <allocation-receiver-edit ref="allocationReceiverEdit" @ok="queryPage" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { del, findChannels, page, registerByGateway, removeByGateway } from './AllocationReceiver.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useDict } from '/@/hooks/bootx/useDict'
  import ALink from '/@/components/Link/Link.vue'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import AllocationReceiverEdit from './AllocationReceiverEdit.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, sortChange, sortParam, pages, model, loading } =
    useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  const allocationReceiverEdit = $ref<any>()
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()

  let payChannelList = $ref<LabeledValue[]>([])
  let receiverTypeList = $ref<LabeledValue[]>([])
  let relationTypeList = $ref<LabeledValue[]>([])

  const fields = computed(() => {
    return [
      { field: 'name', type: STRING, name: '账号别名', placeholder: '请输入账号别名' },
      { field: 'receiverAccount', type: STRING, name: '接收方账号', placeholder: '请输入接收方账号' },
      { field: 'channel', type: LIST, name: '分账通道', placeholder: '请选择分账通道', selectList: payChannelList },
      { field: 'relationType', type: LIST, name: '分账关系', placeholder: '请选择分账关系', selectList: relationTypeList },
      { field: 'receiverType', type: LIST, name: '接收方类型', placeholder: '请选择分账接收方类型', selectList: receiverTypeList },
    ] as QueryField[]
  })
  onMounted(() => {
    vxeBind()
    initData()
    queryPage()
  })

  /**
   * 绑定
   */
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    findChannels().then(({ data }) => (payChannelList = data))
    relationTypeList = await dictDropDown('AllocationRelationType')
  }

  /**
   * 新建
   */
  function add() {
    allocationReceiverEdit.init(null, FormEditType.Add)
  }

  /**
   * 修改
   */
  function edit(record) {
    allocationReceiverEdit.init(record, FormEditType.Edit)
  }

  /**
   * 查看
   */
  function show(record) {
    allocationReceiverEdit.init(record, FormEditType.Show)
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
   * 删除
   */
  function remove(record) {
    // 判断是否未进行注册
    if (record.sync) {
      createMessage.warning('该接收方已同步到三方支付系统中,无法删除')
      return
    }
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否确认删除该条数据?',
      onOk: () => {
        loading.value = true
        del(record.id).then(({ data }) => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }

  /**
   * 同步到三方支付系统中
   */
  function bind(record) {
    createConfirm({
      iconType: 'info',
      title: '警告',
      content: '是否确认同步该条数据?',
      onOk: () => {
        loading.value = true
        registerByGateway(record.id).then(({ data }) => {
          createMessage.success('该分账接收方同步到三方支付系统中成功')
          queryPage()
        })
      },
    })
  }

  /**
   * 从三方支付系统中删除
   */
  function unbind(record) {
    createConfirm({
      iconType: 'info',
      title: '警告',
      content: '是否确认取消同步该条数据?',
      onOk: () => {
        loading.value = true
        removeByGateway(record.id).then(({ data }) => {
          createMessage.success('该分账接收方从三方支付系统中取消成功')
          queryPage()
        })
      },
    })
  }
</script>

<style scoped lang="less"></style>
