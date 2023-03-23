<template>
  <basic-drawer forceRender showFooter v-bind="$attrs" :title="title + ' 列表'" width="60%" :visible="visible" @close="visible = false">
    <vxe-toolbar ref="xToolbar" custom :refresh="{ query: query }">
      <template #buttons>
        <a-space>
          <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
          <a-button :disabled="modelPublish" pre-icon="ant-design:sync-outlined" :loading="loading" @click="syncNode"
            >同步任务节点</a-button
          >
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table row-id="id" ref="xTable" :data="tableData" :loading="loading">
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="nodeName" title="任务节点名称" />
      <vxe-column field="nodeId" title="任务节点id" />
      <vxe-column field="multi" title="多任务">
        <template #default="{ row }">{{ row.multi ? '是' : '否' }}</template>
      </vxe-column>
      <vxe-column field="sequential" title="串行/并行">
        <template #default="{ row }">
          <template v-if="row.multi">
            {{ row.sequential ? '串行' : '并行' }}
          </template>
          <template v-else> 无 </template>
        </template>
      </vxe-column>
      <vxe-column field="skip" title="跳过当前节点">
        <template #default="{ row }">{{ row.skip ? '是' : '否' }}</template>
      </vxe-column>
      <vxe-column field="assignType" title="人员分配类型">
        <template #default="{ row }">{{ dictConvert('BpmTaskAssignType', row.assignType) }}</template>
      </vxe-column>
      <vxe-column field="assignShow" title="分配人" />
      <vxe-column fixed="right" width="200" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical" />
          <a-link :disabled="modelPublish" @click="edit(row)">编辑</a-link>
          <a-divider type="vertical" />
          <a-link :disabled="modelPublish" @click="remove(row)" :style="{ color: modelPublish ? '' : 'red' }">删除</a-link>
        </template>
      </vxe-column>
    </vxe-table>
    <bpm-model-node-edit ref="bpmModelNodeEdit" @ok="query" />
  </basic-drawer>
</template>

<script lang="ts" setup>
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { BpmModel } from '../Model.api'
  import { PUBLISHED } from '/@/views/modules/bpm/model/node/BpmModelNodeCode'
  import { BpmModelNode, del, listByModelId, sync } from './ModelNode.api'
  import BpmModelNodeEdit from './BpmModelNodeEdit.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'

  const { createConfirm, createMessage } = useMessage()
  const { dictConvert } = useDict()

  let bpmModelNodeEdit = $ref<any>()
  let visible = $ref(false)
  let model = $ref<BpmModel>({
    name: '',
  })
  let loading = $ref(false)
  let modelPublish = $ref(false)
  let title = $ref('')
  let tableData = $ref<BpmModelNode[]>([])

  function init(record: BpmModel) {
    model = record
    modelPublish = record.publish === PUBLISHED
    title = record.name
    visible = true
    query()
  }

  function query() {
    loading = true
    listByModelId(model.id).then(({ data }) => {
      tableData = data
      loading = false
    })
  }
  function add() {
    bpmModelNodeEdit.init('', FormEditType.Add)
  }
  function edit(record) {
    bpmModelNodeEdit.init(record.id, FormEditType.Edit)
  }
  function show(record) {
    bpmModelNodeEdit.init(record.id, FormEditType.Show)
  }
  function remove(record) {
    createConfirm({
      iconType: 'warning',
      title: '删除',
      content: '是否删除流程模型',
      onOk: () => {
        loading = true
        del(record.id).then((_) => {
          createMessage.success('删除成功')
          query()
        })
      },
    })
  }
  /**
   * 同步任务节点
   */
  function syncNode() {
    createConfirm({
      iconType: 'warning',
      title: '同步',
      content: '是否同步流程业务节点',
      onOk: () => {
        loading = true
        sync(model.id).then(() => {
          createMessage.success('同步任务节点成功')
          query()
        })
      },
    })
  }
  defineExpose({ init })
</script>

<style scoped></style>
