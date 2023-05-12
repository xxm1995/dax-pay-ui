<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-space>
              <a-button type="primary" preIcon="ant-design:plus-outlined" @click="add">新建</a-button>
              <a-tooltip title="获取微信当前菜单配置到系统中">
                <a-button preIcon="ant-design:sync-outlined" @click="syncMenu">导入</a-button>
              </a-tooltip>
              <a-tooltip title="清空当前微信的菜单配置">
                <a-button type="danger" preIcon="ant-design:delete-outlined" @click="clearMenuInfo">清空</a-button>
              </a-tooltip>
            </a-space>
          </a-space>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="name" title="名称" />
        <vxe-column field="menuInfo" title="菜单信息" />
        <vxe-column field="remark" title="备注" />
        <vxe-column field="publish" title="是否发布">
          <template #default="{ row }">
            <a-tag v-if="row.publish" color="green">已发布</a-tag>
            <a-tag v-else color="red">草稿</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="220" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a href="javascript:" @click="show(row)">查看</a>
            </span>
            <a-divider type="vertical" />
            <span>
              <a href="javascript:" @click="edit(row)">编辑</a>
            </span>
            <a-divider type="vertical" />
            <span>
              <a href="javascript:" @click="designEdit(row)">设计</a>
            </span>
            <a-divider type="vertical" />
            <a-dropdown>
              <a> 更多 <icon icon="ant-design:down-outlined" :size="12" /></a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a @click="designShow(row)">菜单预览</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="publishMenu(row)">菜单发布</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:" @click="remove(row)" style="color: red">删除</a>
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
      <wechat-menu-edit ref="wechatMenuEdit" @ok="queryPage" />
      <wechat-menu-design ref="wechatMenuDesign" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { clearMenu, del, importMenu, page, publish } from './WechatMenu.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import WechatMenuEdit from './WechatMenuEdit.vue'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import WechatMenuDesign from './WechatMenuDesign.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()

  // 查询条件
  const fields = [{ field: 'name', type: 'string', name: '名称', placeholder: '请输入名称' }] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const wechatMenuEdit = $ref<any>()
  const wechatMenuDesign = $ref<any>()

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
  // 新增
  function add() {
    wechatMenuEdit.init(null, FormEditType.Add)
  }
  // 编辑
  function edit(record) {
    wechatMenuEdit.init(record.id, FormEditType.Edit)
  }
  // 查看
  function show(record) {
    wechatMenuEdit.init(record.id, FormEditType.Show)
  }
  //设计编辑
  function designEdit(record) {
    wechatMenuDesign.init(record.id, FormEditType.Edit)
  }
  //设计预览
  function designShow(record) {
    wechatMenuDesign.init(record.id, FormEditType.Show)
  }

  // 删除
  function remove(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否删除该数据',
      onOk: () => {
        del(record.id).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }
  /**
   * 导入菜单
   */
  function syncMenu() {
    createConfirm({
      title: '通知',
      iconType: 'info',
      content: '是否导入当前微信自定义菜单到系统中',
      onOk: () => {
        importMenu().then(() => {
          createMessage.success('导入成功')
          queryPage()
        })
      },
    })
  }
  // 清除微信自定义的菜单
  function clearMenuInfo() {
    createConfirm({
      title: '警告',
      iconType: 'warning',
      content: '是否清除当前微信配置的自定义菜单',
      onOk: () => {
        clearMenu().then(() => {
          createMessage.success('清除成功')
        })
      },
    })
  }
  // 发布
  function publishMenu(record) {
    createConfirm({
      title: '通知',
      iconType: 'info',
      content: '是否将当前微信自定义菜单进行发布',
      onOk: () => {
        publish(record.id).then(() => {
          createMessage.success('菜单发布成功')
          queryPage()
        })
      },
    })
  }
</script>

<style lang="less" scoped></style>
