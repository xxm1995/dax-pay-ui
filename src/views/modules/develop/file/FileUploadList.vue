<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <a-form class="page-query" layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input allowClear v-model:value="model.queryParam.originalFilename" placeholder="请输入文件名称" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="扩展名">
              <a-input allowClear v-model:value="model.queryParam.ext" placeholder="请输入文件扩展名" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="MIME">
              <a-input allowClear v-model:value="model.queryParam.contentType" placeholder="请输入文件MIME类型" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-space>
              <a-button type="primary" @click="query">查询</a-button>
              <a-button @click="resetQueryParams">重置</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
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
        <vxe-column field="originalFilename" title="原始文件名" />
        <vxe-column field="ext" title="扩展名" />
        <vxe-column field="contentType" title="文件类型" />
        <vxe-column field="fileSize" title="文件大小" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="200" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a href="javascript:" @click="show(row)">查看</a>
            <a-divider type="vertical" />
            <a href="javascript:" @click="preview(row)">预览</a>
            <a-divider type="vertical" />
            <a href="javascript:" @click="down(row)">下载</a>
            <a-divider type="vertical" />
            <a href="javascript:" style="color: red" @click="remove(row)">删除</a>
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
    <file-upload-info ref="fileUploadInfo" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { $ref } from 'vue/macros'
  import { page, del } from './FileUpload.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { QueryField } from '/@/components/Bootx/Query/Query'
  import { getFileDownloadUrl, getFilePreviewUrl } from '/@/api/common/FileUpload'
  import { useUserStoreWithOut } from '/@/store/modules/user'
  import { getAppEnvConfig } from '/@/utils/env'
  import { useUpload } from '/@/hooks/bootx/useUpload'
  import FileUploadInfo from './FileUploadInfo.vue'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, query, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const useUserStore = useUserStoreWithOut()
  const { VITE_GLOB_API_URL } = getAppEnvConfig()

  const { tokenHeader, uploadAction } = useUpload('/file/upload')

  // 查询条件
  const fields = [{}] as QueryField[]

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()
  const fileUploadInfo = $ref<any>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  /**
   * 上传完成回调
   */
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

  /**
   * 分页查询
   */
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

  /**
   * 查看
   */
  function show(record) {
    fileUploadInfo.init(record.id)
  }
  /**
   * 预览
   */
  function preview(record) {
    getFilePreviewUrl(record.id).then((res) => {
      window.open(res.data)
    })
  }
  /**
   * 下载
   */
  function down(record) {
    getFileDownloadUrl(record.id).then((res) => {
      window.open(res.data)
    })
  }

  /**
   * 删除
   */
  function remove(record) {
    createConfirm({
      iconType: 'warning',
      title: '删除',
      content: '是否删除该文件',
      onOk: () => {
        loading.value = true
        del(record.id).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }
</script>

<style lang="less" scoped></style>
