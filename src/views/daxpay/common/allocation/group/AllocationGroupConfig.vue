<template>
  <basic-drawer
    forceRender
    v-bind="$attrs"
    title="接收方配置"
    width="60%"
    :open="visible"
    @close="visible = false"
  >
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
      <template #buttons>
        <a-space>
          <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add"
            >添加分账方</a-button
          >
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table
      keep-source
      key-field="id"
      ref="xTable"
      :data="records"
      :loading="loading"
      :edit-config="{ trigger: 'click', mode: 'cell' }"
      @edit-closed="editClosedEvent"
    >
      <vxe-column type="seq" width="60" />
      <vxe-column field="receiverType" title="接收方类型" :min-width="100">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('alloc_receiver_type', row.receiverType) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="receiverAccount" title="接收方账号" :min-width="230" />
      <vxe-column field="receiverName" title="接收方姓名" :min-width="100" />
      <vxe-column field="rate" width="150" title="分账比例" :edit-render="{}" :min-width="100">
        <template #default="{ row }"> {{ row.rate }}% </template>
        <template #edit="{ row }">
          <a-input-number
            v-model:value="row.rate"
            :min="0"
            :max="100"
            :precision="2"
            placeholder="请输入分账比例(%)"
          />
        </template>
      </vxe-column>
      <vxe-column fixed="right" width="60" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <span>
            <a-link danger @click="remove(row)">删除</a-link>
          </span>
        </template>
      </vxe-column>
    </vxe-table>
    <AllocationGroupSelect ref="allocationGroupSelect" @ok="selectReceiver" />
  </basic-drawer>
</template>

<script setup lang="ts">
  import { nextTick, ref } from 'vue'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '@/hooks/web/useMessage'
  import BasicDrawer from '@/components/Drawer/src/BasicDrawer.vue'
  import { useDict } from '@/hooks/bootx/useDict'
  import {
    AllocGroup,
    AllocGroupReceiver,
    bindReceivers,
    getReceivers,
    unbindReceiver,
    updateRate,
  } from './AllocationGroup.api'
  import AllocationGroupSelect from './AllocationGroupSelect.vue'
  import ALink from '@/components/Link/Link.vue'

  // 使用hooks
  const { loading } = useTablePage(queryPage)
  const { createConfirm, createMessage } = useMessage()
  const { dictConvert } = useDict()

  let visible = ref(false)
  let group = ref<AllocGroup>({})
  let records = ref<AllocGroupReceiver[]>([])
  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const allocationGroupSelect = ref<any>()

  nextTick(() => {
    xTable.value?.connect(xToolbar.value as VxeToolbarInstance)
  })

  /**
   * 入口
   * @param record
   */
  function init(record) {
    visible.value = true
    group.value = record
    queryPage()
  }

  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    getReceivers(group.value.id).then(({ data }) => {
      records.value = data
      loading.value = false
    })
  }

  /**
   * 选择分账方弹窗
   */
  function add() {
    const receiverIds = records.value.map((item) => {
      return item.receiverId
    })
    const { channel, appId } = group.value
    allocationGroupSelect.value.init(receiverIds, channel, appId)
  }

  /**
   * 选择分账方成功后回调
   */
  function selectReceiver(ids: string[]) {
    const receivers = ids.map((id) => {
      return { receiverId: id, rate: 0 }
    })
    const param = {
      groupId: group.value.id,
      receivers,
    }
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
   * 实时修改回调
   */
  function editClosedEvent({ row, column }) {
    // 判断单元格值是否被修改
    if (xTable.value?.isUpdateByRow(row, column.field)) {
      createConfirm({
        iconType: 'warning',
        title: '确定修改该分账比例吗？',
        onOk: () => {
          updateRate(row.id, row.rate)
            .then(() => {
              createMessage.success('修改成功')
              xTable.value?.reloadRow(row, null, column.field)
            })
            .catch(() => {
              xTable.value?.revertData(row)
            })
        },
        onCancel: () => {
          xTable.value?.revertData(row)
        },
      })
    }
  }

  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
