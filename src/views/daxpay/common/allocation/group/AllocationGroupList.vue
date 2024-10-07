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
        <vxe-column field="groupNo" title="分组编号" :min-width="160">
          <template #default="{ row }">
            <a-link @click="show(row)">{{ row.groupNo }}</a-link>
          </template>
        </vxe-column>
        <vxe-column field="name" title="分组名称" :min-width="160" />
        <vxe-column field="channel" title="所属通道" :min-width="100">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('PayChannel', row.channel) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="totalRate" title="分账比例" :min-width="100">
          <template #default="{ row }"> {{ row.totalRate / 100.0 }}% </template>
        </vxe-column>
        <vxe-column field="defaultGroup" title="默认分组" :min-width="100">
          <template #default="{ row }">
            <a-tag color="green" v-if="row.defaultGroup">是</a-tag>
            <a-tag v-else>否</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注" :min-width="160" />
        <vxe-column fixed="right" :min-width="160" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link danger @click="config(row)">接收方配置</a-link>
            <a-divider type="vertical" />
            <a-dropdown>
              <a> 更多 <icon icon="ant-design:down-outlined" :size="12" /></a>
              <template #overlay>
                <a-menu>
                  <a-menu-item v-if="!row.defaultGroup">
                    <a-link @click="setUpDefault(row)">设为默认</a-link>
                  </a-menu-item>
                  <a-menu-item v-if="row.defaultGroup">
                    <a-link @click="clearDefault(row)">取消默认</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="edit(row)">编辑</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link danger :disabled="row.defaultGroup" @click="remove(row)">删除</a-link>
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
    <allocation-group-edit ref="allocationGroupEdit" @ok="queryPage" />
    <allocation-group-config ref="allocationGroupConfig" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { cancelDefaultGroup, del, page, setDefaultGroup } from './AllocationGroup.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import { VxeTable, VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '@/hooks/web/useMessage'
  import { useDict } from '@/hooks/bootx/useDict'
  import ALink from '@/components/Link/Link.vue'
  import BQuery from '@/components/Bootx/Query/BQuery.vue'
  import { LIST, QueryField, STRING } from '@/components/Bootx/Query/Query'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import AllocationGroupEdit from './AllocationGroupEdit.vue'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { findChannels } from '../receiver/AllocationReceiver.api'
  import AllocationGroupConfig from './AllocationGroupConfig.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, sortChange, sortParam, pages, model, loading } =
    useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  const allocationGroupEdit = ref<any>()
  const allocationGroupConfig = ref<any>()
  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()

  let payChannelList = ref<LabeledValue[]>([])

  const fields = computed(() => {
    return [
      { field: 'groupNo', type: STRING, name: '分账组编号', placeholder: '请输入分账组编号' },
      { field: 'name', type: STRING, name: '分账组名称', placeholder: '请输入分账组名称' },
      { field: 'channel', type: LIST, name: '分账通道', placeholder: '请选择分账通道', selectList: payChannelList },
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
  }

  /**
   * 新建
   */
  function add() {
    allocationGroupEdit.init(null, FormEditType.Add)
  }

  /**
   * 修改
   */
  function edit(record) {
    allocationGroupEdit.init(record, FormEditType.Edit)
  }

  /**
   * 查看
   */
  function show(record) {
    allocationGroupEdit.init(record, FormEditType.Show)
  }

  /**
   * 配置页
   */
  function config(record) {
    allocationGroupConfig.init(record)
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
   * 设为默认分账组
   */
  function setUpDefault(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否确认设为默认分账组?',
      onOk: () => {
        loading.value = true
        setDefaultGroup(record.id).then(({ data }) => {
          createMessage.success('设置成功')
          queryPage()
        })
      },
    })
  }

  /**
   * 设为默认分账组
   */
  function clearDefault(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否取消当前的默认分账组?',
      onOk: () => {
        loading.value = true
        cancelDefaultGroup(record.id).then(({ data }) => {
          createMessage.success('取消成功')
          queryPage()
        })
      },
    })
  }
</script>

<style scoped lang="less"></style>
