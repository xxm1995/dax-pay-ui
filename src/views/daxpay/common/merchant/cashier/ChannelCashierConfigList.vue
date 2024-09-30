<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    width="70%"
    title="收银配置"
    :mask-closable="true"
    :open="visible"
    @close="handleCancel"
  >
    <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
      <template #buttons>
        <a-space>
          <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table ey-field="id" ref="xTable" :data="records" :loading="loading">
      <vxe-column type="seq" width="60" />
      <vxe-column field="cashierType" title="收银台类型" :min-width="150">
        <template #default="{ row }">
          <a-tag color="green">{{ dictConvert('cashier_type', row.cashierType) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="cashierName" title="收银台名称" :min-width="150" />
      <vxe-column field="channel" title="关联通道" :min-width="150">
        <template #default="{ row }">
          <a-tag color="green">{{ dictConvert('channel', row.channel) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="channel" title="关联支付方式" :min-width="150">
        <template #default="{ row }">
          <a-tag color="green">{{ dictConvert('pay_method', row.payMethod) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="allocation" title="开启分账" :min-width="150">
        <template #default="{ row }">
          <a-tag v-if="row.allocation" color="green">开启</a-tag>
          <a-tag v-else color="red">关闭</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="autoAllocation" title="自动分账" :min-width="150">
        <template #default="{ row }">
          <a-tag v-if="row.autoAllocation" color="green">开启</a-tag>
          <a-tag v-else color="red">关闭</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="remark" title="备注" :min-width="170" />
      <vxe-column field="createTime" title="创建时间" :min-width="170" />
      <vxe-column fixed="right" :width="150" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:" style="color: red" @click="del(row)">删除</a>
        </template>
      </vxe-column>
    </vxe-table>
    <ChannelCashierConfigEdit ref="channelCashierConfigEdit" @ok="queryPage" />
  </basic-drawer>
</template>
<script setup lang="ts">
  import { BasicDrawer } from '@/components/Drawer'
  import { ref } from 'vue'
  import { findAll, remove, ChannelCashierConfig } from './ChannelCashierConfig.api'
  import ChannelCashierConfigEdit from './ChannelCashierConfigEdit.vue'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { useMessage } from '@/hooks/web/useMessage'
  import { useDict } from '@/hooks/bootx/useDict'
  import { MchApp } from '@/views/daxpay/common/merchant/app/MchApp.api'

  const { createConfirm, createMessage } = useMessage()
  const { dictConvert } = useDict()

  const currentApp = ref<MchApp>({})

  const loading = ref(false)
  const visible = ref(false)
  const records = ref<ChannelCashierConfig[]>([])

  const channelCashierConfigEdit = ref<any>()
  /**
   * 初始化并展示
   */
  async function init(mchApp: MchApp) {
    visible.value = true
    loading.value = false
    currentApp.value = mchApp
    queryPage()
  }

  /**
   * 查询
   */
  function queryPage() {
    // 列表信息
    loading.value = true
    findAll(currentApp.value.appId).then(({ data }) => {
      records.value = data
      loading.value = false
    })
  }

  /**
   * 关闭页面
   */
  function handleCancel() {
    visible.value = false
  }

  /**
   * 新增
   */
  function add() {
    channelCashierConfigEdit.value.init(null, FormEditType.Add, currentApp.value)
  }
  /**
   * 编辑
   */
  function edit(record) {
    channelCashierConfigEdit.value.init(record.id, FormEditType.Edit, currentApp.value)
  }
  /**
   * 查看
   */
  function show(record) {
    channelCashierConfigEdit.value.init(record.id, FormEditType.Show, currentApp.value)
  }

  /**
   * 删除
   */
  function del(record) {
    createConfirm({
      iconType: 'warning',
      title: '删除',
      content: '是否删除该数据',
      onOk: () => {
        loading.value = true
        remove(record.id).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }
  defineExpose({
    init,
  })
</script>
<style scoped lang="less"></style>
