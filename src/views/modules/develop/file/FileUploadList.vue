<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query :query-params="model.queryParam" :fields="fields" @query="queryPage" @reset="resetQueryParams" />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-upload
            name="file"
            :multiple="false"
            :action="uploadAction"
            :headers="tokenHeader"
            :showUploadList="false"
            @change="handleChange"
          >
            <a-button preIcon="ant-design:cloud-upload-outlined" type="primary"> 文件上传 </a-button>
          </a-upload>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="fileName" title="文件名称" />
        <vxe-column field="fileSuffix" title="文件后缀" />
        <vxe-column field="fileType" title="文件类型" />
        <vxe-column field="fileSize" title="文件大小" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="150" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a href="javascript:" @click="show(row)">查看</a>
            <a-divider type="vertical" />
            <a href="javascript:" @click="down(row)">下载</a>
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
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page } from './FileUpload.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import { getFileDownloadUrl, getFilePreviewUrl } from '/@/api/common/FileUpload'
  import { useUserStoreWithOut } from '/@/store/modules/user'
  import { getAppEnvConfig } from '/@/utils/env'
  import { useUpload } from '/@/hooks/bootx/useUpload'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage } = useMessage()
  const useUserStore = useUserStoreWithOut()
  const { VITE_GLOB_API_URL } = getAppEnvConfig()

  const { tokenHeader, uploadAction } = useUpload('/file/upload')

  // 查询条件
  const fields = [] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  // 上传完成回调
  function handleChange(info) {
    if (info.file.status === 'done') {
      if (!info.file.response.code) {
        queryPage()
        createMessage.success(`${info.file.name} 上传成功!`)
      } else {
        createMessage.error(`${info.file.response.msg}`)
      }
    } else if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
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
  // 上传
  function upload() {}
  // 查看
  function show(record) {
    getFilePreviewUrl(record.id).then((res) => {
      window.open(res.data)
    })
  }
  // 下载
  function down(record) {
    getFileDownloadUrl(record.id).then((res) => {
      window.open(res.data)
    })
  }
</script>

<style lang="less" scoped></style>
