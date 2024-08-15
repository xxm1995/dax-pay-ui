<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
        :query-params="model.queryParam"
        :fields="fields"
        @query="queryPage"
        @reset="resetQueryParams"
      />
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
            <a-button preIcon="ant-design:cloud-upload-outlined" type="primary">
              文件上传
            </a-button>
          </a-upload>
        </template>
      </vxe-toolbar>
      <div class="h-65vh">
        <vxe-table
          height="auto"
          row-id="id"
          ref="xTable"
          :data="pagination.records"
          :loading="loading"
        >
          <vxe-column type="seq" :width="60" />
          <vxe-column field="originalFilename" title="原始文件名" :min-width="180">
            <template #default="{ row }">
              <a-link @click="show(row)">{{ row.originalFilename }}</a-link>
            </template>
          </vxe-column>
          <vxe-column field="ext" title="扩展名" :min-width="50" />
          <vxe-column field="contentType" title="文件类型" :min-width="100" />
          <vxe-column field="platformName" title="存储平台" :min-width="70" />
          <vxe-column field="fileSize" title="文件大小" :min-width="120" />
          <vxe-column field="createTime" title="创建时间" :min-width="170" />
          <vxe-column fixed="right" :width="170" :showOverflow="false" title="操作">
            <template #default="{ row }">
              <a href="javascript:" @click="show(row)">查看</a>
              <a-divider type="vertical" />
              <a href="javascript:" @click="down(row)">下载</a>
              <a-divider type="vertical" />
              <a href="javascript:" style="color: red" @click="remove(row)">删除</a>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <vxe-pager
        size="medium"
        :loading="loading"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @page-change="handleTableChange"
      />
    </div>
    <FileUploadInfo ref="fileUploadInfo" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { page, del, UpdateFileInfo } from './FileUpload.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '@/hooks/web/useMessage'
  import { QueryField } from '@/components/Bootx/Query/Query'

  import { useUpload } from '@/hooks/bootx/useUpload'
  import FileUploadInfo from './FileUploadInfo.vue'
  import BQuery from '@/components/Bootx/Query/BQuery.vue'
  import { useFilePlatform } from '@/hooks/bootx/useFilePlatform'
  import ALink from '@/components/Link/Link.vue'

  // 使用hooks
  const {
    handleTableChange,
    pageQueryResHandel,
    resetQueryParams,
    pagination,
    pages,
    model,
    loading,
  } = useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()

  const { tokenHeader, uploadAction } = useUpload('/file/upload')
  const { getFileUrl } = useFilePlatform()

  // 查询条件
  const fields = computed(() => {
    return [{}] as QueryField[]
  })

  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const fileUploadInfo = ref<any>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable.value?.connect(xToolbar.value as VxeToolbarInstance)
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
    fileUploadInfo.value.init(record.id)
  }
  /**
   * 下载
   */
  function down(record: UpdateFileInfo) {
    const url = getFileUrl(record.url, record.platform)
    window.open(url)
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
