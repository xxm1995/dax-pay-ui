<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
            <a-button pre-icon="ant-design:sync-outlined" @click="loginGoView">一键登录大屏</a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="id" title="大屏代码" />
        <vxe-column field="name" title="项目名称" />
        <vxe-column field="state" title="发布状态" :title-help="{message: '需要未编辑状态下才能进行发布！'}">
          <template #default="{ row }">
            <a-tag v-if="row.state === 1" color="green">已发布</a-tag>
            <a-tag v-else color="red">未发布</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="edit" title="编辑状态"  :title-help="{message: '请在‘操作->更多->进行保存或重置编辑‘，变更状态！'}">
          <template #default="{ row }">
            <a-tag v-if="row.edit" color="red">编辑中</a-tag>
            <a-tag v-else color="green">未编辑</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="220" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a-link @click="edit(row)">编辑</a-link>
            </span>
            <a-divider type="vertical" />
            <span>
              <a-link @click="design(row)">设计</a-link>
            </span>
            <a-divider type="vertical" />
            <span>
              <a-link @click="preview(row)">预览</a-link>
            </span>
            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link"> 更多 <icon icon="ant-design:down-outlined" :size="12" /> </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-link @click="copyInfo(row)">复制</a-link>
                  </a-menu-item>
                  <a-menu-item v-if="row.edit">
                    <a-link @click="enableEdit(row)">保存编辑</a-link>
                  </a-menu-item>
                  <a-menu-item v-if="row.edit && row.state === -1">
                    <a-link @click="resetEdit(row)">重置编辑</a-link>
                  </a-menu-item>
                  <a-menu-item v-if="!row.edit && row.state === -1">
                    <a-link @click="publishInfo(row)">发布</a-link>
                  </a-menu-item>
                  <a-menu-item v-if="row.state === 1">
                    <a-link @click="unPublishInfo(row)">取消发布</a-link>
                  </a-menu-item>
                  <a-menu-item>
                    <a-link danger :disabled="row.state === 1" @click="remove(row)">删除</a-link>
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
      <project-info-edit ref="projectInfoEdit" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { copy, del, enableEditContent, getGoViewUrl, page, publish, resetEditContent, unPublish } from './ProjectInfo.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import ProjectInfoEdit from './ProjectInfoEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import { useUserStoreWithOut } from '/@/store/modules/user'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const useUserStore = useUserStoreWithOut()

  // 查询条件
  const fields = [
    { field: 'projectId', name: '大屏代码', placeholder: '请输入大屏代码' },
    { field: 'name', name: '项目名称', placeholder: '请输入项目名称' },
  ] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const projectInfoEdit = $ref<any>()
  let goViewUrl = $ref('')

  onMounted(() => {
    initGoViewUrl()
    vxeBind()
    queryPage()
  })

  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }
  // 初始化GoView地址
  function initGoViewUrl() {
    getGoViewUrl().then(({ data }) => {
      goViewUrl = data
    })
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
  // 新增
  function add() {
    projectInfoEdit.init(null, FormEditType.Add)
  }
  // 编辑
  function edit(record) {
    projectInfoEdit.init(record.id, FormEditType.Edit)
  }
  // 预览
  function preview(record) {
    open(`${goViewUrl}/#/chart/preview/${record.id}`, '_blank')
  }
  // 设计
  function design(record) {
    open(`${goViewUrl}/#/chart/home/${record.id}`, '_blank')
  }
  // 复制
  function copyInfo(record) {
    createConfirm({
      iconType: 'info',
      title: '复制',
      content: '是否复制大屏',
      onOk: () => {
        loading.value = true
        copy(record.id).then((_) => {
          createMessage.success('复制成功')
          queryPage()
        })
      },
    })
  }
  // 发布
  function publishInfo(record) {
    createConfirm({
      iconType: 'info',
      title: '发布',
      content: '发布大屏',
      onOk: () => {
        loading.value = true
        publish(record.id).then((_) => {
          createMessage.success('发布成功')
          queryPage()
        })
      },
    })
  }
  // 取消发布
  function unPublishInfo(record) {
    createConfirm({
      iconType: 'info',
      title: '取消发布',
      content: '是否取消发布大屏',
      onOk: () => {
        loading.value = true
        unPublish(record.id).then((_) => {
          createMessage.success('取消发布成功')
          queryPage()
        })
      },
    })
  }
  // 应用编辑中的信息
  function enableEdit(record) {
    createConfirm({
      iconType: 'info',
      title: '保存编辑',
      content: '是否保存编辑中的信息，保存后发布的数据将会更新',
      onOk: () => {
        loading.value = true
        enableEditContent(record.id).then((_) => {
          createMessage.success('更新成功')
          queryPage()
        })
      },
    })
  }
  // 重置编辑中的信息
  function resetEdit(record) {
    createConfirm({
      iconType: 'info',
      title: '重置编辑',
      content: '是否重置编辑中的信息，确定后编辑的内容将会恢复为之前保存的内容',
      onOk: () => {
        loading.value = true
        resetEditContent(record.id).then((_) => {
          createMessage.success('重置成功')
          queryPage()
        })
      },
    })
  }
  // 删除
  function remove(record) {
    createConfirm({
      iconType: 'warning',
      title: '删除',
      content: '是否删除大屏',
      onOk: () => {
        loading.value = true
        del(record.id).then((_) => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }
  // 一键登录GoView平台
  function loginGoView() {
    createConfirm({
      iconType: 'info',
      title: '一键登录',
      content: '是否一键登录可视化大屏平台',
      okText: '登录',
      onOk: () => {
        const token = useUserStore.getToken
        createMessage.info('等待下一个版本实装')
      },
    })
  }
</script>

<style lang="less" scoped></style>
