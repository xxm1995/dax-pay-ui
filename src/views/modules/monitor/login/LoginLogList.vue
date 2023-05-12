<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }" />
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="userId" title="用户id" />
        <vxe-column field="account" title="用户名称" />
        <vxe-column field="login" title="登录成功状态">
          <template #default="{ row }">
            <a-tag v-if="row.login" color="green">成功</a-tag>
            <a-tag v-else color="red">失败</a-tag>
          </template>
        </vxe-column>
        <vxe-column field="client" title="终端">
          <template #default="{ row }">
            {{ getClient(row.client) }}
          </template>
        </vxe-column>
        <vxe-column field="loginType" title="登录方式">
          <template #default="{ row }">
            {{ getLoginType(row.loginType) }}
          </template>
        </vxe-column>
        <vxe-column field="ip" title="登录IP地址" />
        <vxe-column field="os" title="操作系统" />
        <vxe-column field="browser" title="浏览器类型" />
        <vxe-column field="msg" title="提示消息" />
        <vxe-column field="loginTime" title="访问时间" />
        <vxe-column fixed="right" width="60" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a href="javascript:" @click="show(row)">查看</a>
            </span>
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
      <login-log-info :clients="clients" :login-types="loginTypes" ref="loginLogInfo" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { page } from './LoginLog.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import { Client, findAll as findClients } from '/@/views/modules/system/client/Client.api'
  import { findAll as findLoginTypes, LoginType } from '/@/views/modules/system/loginType/LoginType.api'
  import { dropdownTranslate, findOneByField } from '/@/utils/dataUtil'
  import LoginLogInfo from './LoginLogInfo.vue'
  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage } = useMessage()

  let clients = $ref<Client[]>()
  let loginTypes = $ref<LoginType[]>()

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const loginLogInfo = $ref<any>()

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'code', type: 'string', name: '账号', placeholder: '请输入账号名称' },
      { field: 'client', type: 'list', name: '终端', placeholder: '请选择终端', selectList: dropdownTranslate(clients, 'name', 'code') },
      {
        field: 'loginType',
        type: 'list',
        name: '登录方式',
        placeholder: '请选择登录方式',
        selectList: dropdownTranslate(loginTypes, 'name', 'code'),
      },
    ] as QueryField[]
  })

  onMounted(() => {
    vxeBind()
    initClientAndLoginType()
    queryPage()
  })

  /**
   * 初始化 终端列表和登录方式列表
   */
  function initClientAndLoginType() {
    findClients().then(({ data }) => {
      clients = data
    })
    findLoginTypes().then(({ data }) => {
      loginTypes = data
    })
  }

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
      data.records[0].loginTime
      pageQueryResHandel(data)
    })
  }
  // 查看
  function show(record) {
    loginLogInfo.show(record.id)
  }
  // 获取终端信息
  function getClient(code) {
    return findOneByField(clients, code, 'code')?.['name']
  }
  // 获取登录方式信息
  function getLoginType(code) {
    return findOneByField(loginTypes, code, 'code')?.['name']
  }
</script>

<style lang="less" scoped></style>
