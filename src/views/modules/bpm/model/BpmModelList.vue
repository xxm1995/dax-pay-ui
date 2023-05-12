<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom zoom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
        </template>
      </vxe-toolbar>
      <vxe-table ref="xTable" row-id="id" :loading="loading" :data="pagination.records">
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column field="name" title="名称" />
        <vxe-column field="modelType" title="流程类型" />
        <vxe-column field="defName" title="流程名称" />
        <vxe-column field="defId" title="流程ID" />
        <vxe-column field="publish" title="发布状态">
          <template #default="{ row }">
            <a-tag>{{ dictConvert('BpmModelPublish', row.publish) }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="mainProcess" title="是否主流程">
          <template #default="{ row }">
            <a-tag v-if="row.mainProcess" color="green">是</a-tag>
            <a-tag v-else color="red">否</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="processVersion" title="流程版本号">
          <template #default="{ row }">
            <a-tag>{{ row.processVersion || '无' }}</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="320" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-link @click="show(row)">查看</a-link>
            <a-divider type="vertical" />
            <a-link disabled v-if="row.publish === PUBLISHED">编辑</a-link>
            <a v-else @click="edit(row)">编辑</a>
            <a-divider type="vertical" />
            <a-link @click="bpmnEdit(row, false)">设计流程</a-link>
            <a-divider type="vertical" />
            <a @click="taskNodeShow(row)">节点配置</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a> 更多 <icon icon="ant-design:down-outlined" :size="12" /> </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-link @click="bpmnEdit(row, true)">查看流程</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link :disabled="row.publish !== UNPUBLISHED" @click="verifyBpmModel(row)">校验模型</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link :disabled="row.publish !== UNPUBLISHED" @click="publishModel(row)">发布</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link @click="copyModel(row)">复制</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link danger :disabled="row.publish === PUBLISHED" @click="remove(row)">删除</a-link>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </vxe-column>
      </vxe-table>
      <vxe-pager
        border
        size="medium"
        :loading="loading"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @page-change="handleTableChange"
      />
    </div>
    <bpm-model-edit ref="bpmModelEdit" @ok="queryPage" />
    <bpm-model-node-list ref="bpmModelNodeList" />
    <bpm-modeler ref="bpmModeler" />
  </div>
</template>

<script lang="ts" setup>
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { onMounted } from 'vue'
  import { copy, del, page, publish, verifyModel } from '/@/views/modules/bpm/model/Model.api'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { PUBLISHED, UNPUBLISHED } from './node/BpmModelNodeCode'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import BpmModelEdit from './BpmModelEdit.vue'
  import BpmModelNodeList from './node/BpmModelNodeList.vue'
  import BpmModeler from './BpmModeler.vue'

  const { handleTableChange, resetQueryParams, pageQueryResHandel, pagination, pages, model, loading } = useTablePage(queryPage)
  const { dictConvert } = useDict()
  const { createMessage, createConfirm } = useMessage()
  // 查询条件
  const fields = [{ field: 'name', type: STRING, name: '名称', placeholder: '请输入流程模型名称' }] as QueryField[]
  const bpmModelEdit = $ref<any>()
  const bpmModelNodeList = $ref<any>()
  const bpmModeler = $ref<any>()
  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
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
  function add() {
    bpmModelEdit.init('', FormEditType.Add)
  }
  function edit(record) {
    bpmModelEdit.init(record.id, FormEditType.Edit)
  }
  function show(record) {
    bpmModelEdit.init(record.id, FormEditType.Show)
  }
  /**
   * 流程图设计
   */
  function bpmnEdit(record, isView) {
    bpmModeler.design(record.id, isView)
  }
  /**
   * 任务节点列表
   */
  function taskNodeShow(record) {
    bpmModelNodeList.init(record)
  }
  function remove(record) {
    createConfirm({
      iconType: 'warning',
      title: '删除',
      content: '是否删除流程模型',
      onOk: () => {
        loading.value = true
        del(record.id).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }
  /**
   * 发布
   */
  function publishModel(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否发布当前流程模型',
      onOk: () => {
        loading.value = true
        publish(record.id).then(() => {
          createMessage.success('发布流程成功')
          queryPage()
        })
      },
    })
  }
  /**
   * 复制
   */
  function copyModel(record) {
    createConfirm({
      iconType: 'warning',
      title: '复制',
      content: '是否要复制该流程模型',
      onOk: () => {
        loading.value = true
        copy(record.id).then(() => {
          createMessage.success('复制成功')
          queryPage()
        })
      },
    })
  }

  /**
   * 校验
   */
  function verifyBpmModel(record) {
    verifyModel(record.id).then(() => {
      createMessage.success('校验通过')
    })
  }
</script>

<style lang="less" scoped></style>
