<template>
  <basic-drawer forceRender v-bind="$attrs" title="分账组配置" width="60%" :visible="visible" @close="visible = false">
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
      <template #buttons>
        <a-space>
          <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">添加分账方</a-button>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table
      keep-source
      row-id="id"
      ref="xTable"
      :data="records"
      :loading="loading"
      :edit-config="{ trigger: 'click', mode: 'cell' }"
      @edit-closed="editClosedEvent"
      @edit-activated="editActivatedEvent"
    >
      <vxe-column type="seq" width="60" />
      <vxe-column field="name" title="账号别名" />
      <vxe-column field="receiverType" title="接收方类型">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('AllocationReceiverType', row.receiverType) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="receiverAccount" title="接收方账号" />
      <vxe-column field="receiverName" title="接收方姓名" />
      <vxe-column field="rate" width="150" title="分账比例" :edit-render="{}">
        <template #default="{ row }"> {{ row.rate / 100.0 }}% </template>
        <template #edit="{ row }">
          <a-input-number v-model:value="row.rate" :min="0" :max="100" :precision="2" placeholder="请输入分账比例(%)" />
        </template>
      </vxe-column>
      <vxe-column fixed="right" width="60" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <span>
            <a href="javascript:" @click="remove(row)">删除</a>
          </span>
        </template>
      </vxe-column>
    </vxe-table>
    <allocation-group-select ref="allocationGroupSelect" @ok="selectReceiver" />
  </basic-drawer>
</template>

<script setup lang="ts">
  import { nextTick } from 'vue'
  import { $ref } from 'vue/macros'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import VXETable, { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { AllocationGroup, AllocationGroupReceiver, bindReceivers, getReceivers, unbindReceiver, updateRate } from './AllocationGroup.api'
  import AllocationGroupSelect from '/@/views/payment/allocation/group/AllocationGroupSelect.vue'

  // 使用hooks
  const { resetQueryParams, model, loading } = useTablePage(queryPage)
  const { createConfirm, notification, createMessage } = useMessage()
  const { dictDropDown, dictConvert } = useDict()

  let visible = $ref(false)
  let group = $ref<AllocationGroup>({})
  let records = $ref<AllocationGroupReceiver[]>([])
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const allocationGroupSelect = $ref<any>()

  nextTick(() => {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  })

  /**
   * 入口
   * @param record
   */
  function init(record) {
    visible = true
    group = record
    queryPage()
  }

  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    getReceivers(group.id).then(({ data }) => {
      records = data
      loading.value = false
    })
  }

  /**
   * 选择分账方弹窗
   */
  function add() {
    const receiverIds = records.map((item) => {
      return item.receiverId
    })
    allocationGroupSelect.init(receiverIds, group.channel)
  }

  /**
   * 选择分账方成功后回调
   */
  function selectReceiver(ids: string[]) {
    const receivers = ids.map((id) => {
      return { receiverId: id, rate: 0 }
    })
    const param = {
      groupId: group.id,
      receivers,
    }
    createMessage.success('添加中...')
    bindReceivers(param).then(() => {
      createMessage.success('添加成功')
      queryPage()
    })
  }

  /**
   * 删除
   */
  function remove(record) {
    createConfirm({
      iconType: 'warning',
      title: '确定删除该分账方吗？',
      onOk: () => {
        unbindReceiver(record.id).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }

  /**
   * 实时修改触发,
   */
  function editActivatedEvent({ row }) {
    row.rate = row.rate / 100
  }

  /**
   * 实时修改回调
   */
  function editClosedEvent({ row, column }) {
    row.rate = Math.round(row.rate * 100)
    // 判断单元格值是否被修改
    if (xTable?.isUpdateByRow(row, column.field)) {
      createConfirm({
        iconType: 'warning',
        title: '确定修改该分账比例吗？',
        onOk: () => {
          updateRate(row.id, row.rate)
            .then(() => {
              createMessage.success('修改成功')
              xTable.reloadRow(row, null, column.field)
            })
            .catch(() => {
              xTable?.revertData(row)
            })
        },
        onCancel: () => {
          xTable?.revertData(row)
        },
      })
    }
  }

  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
