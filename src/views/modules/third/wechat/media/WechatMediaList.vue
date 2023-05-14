<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <a-form layout="inline">
        <a-form-item label="类型">
          <a-select v-model:value="queryParam.type" :default-value="queryParam.type" :options="mediaTypes" style="width: 200px" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="queryPage">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom :refresh="{ queryMethod: queryPage }">
        <template #buttons>
          <a-upload
            name="file"
            :multiple="false"
            :accept="acceptType"
            :action="uploadAction"
            :headers="tokenHeader"
            :data="queryParam.type"
            :showUploadList="false"
            @change="handleChange"
          >
            <a-button preIcon="ant-design:cloud-upload-outlined" type="primary">
              {{ `素材上传(${dictConvert('WeChatMediaType', queryParam.type)})` }}
            </a-button>
          </a-upload>
        </template>
      </vxe-toolbar>
      <vxe-table row-id="id" ref="xTable" :data="pagination.records" :loading="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="name" title="名称" />
        <vxe-column field="mediaId" title="媒体ID" />
        <vxe-column field="updateTime" title="上传时间" />
        <vxe-column field="remark" title="备注" />
        <vxe-column field="createTime" title="创建时间" />
        <vxe-column fixed="right" width="160" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <span>
              <a href="javascript:" @click="copy(row)">查看素材URL</a>
            </span>
            <a-divider type="vertical" />
            <span>
              <a-popconfirm title="是否删除" @confirm="remove(row)" okText="是" cancelText="否">
                <a href="javascript:" style="color: red">删除</a>
              </a-popconfirm>
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
      <template-render ref="templateRender" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue'
  import { $ref } from 'vue/macros'
  import { pageFile, deleteFile } from './WechatMedia.api'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard'
  import { useUploadType } from '/@/components/Upload/src/useUpload'
  import { useUpload } from '/@/hooks/bootx/useUpload'

  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()
  const { dictDropDown, dictConvert } = useDict()
  const { clipboardRef } = useCopyToClipboard()
  const { tokenHeader, uploadAction } = useUpload('/wechat/media/uploadFile')

  let mediaTypes = $ref<LabeledValue[]>()
  const queryParam = reactive({
    type: 'image',
  })
  const acceptType = computed(() => {
    switch (queryParam.type) {
      case 'image': {
        return 'image/*'
      }
      case 'voice': {
        return 'audio/*'
      }
      case 'video': {
        return 'video/*'
      }
      default: {
        return null
      }
    }
  })

  const xTable = $ref<VxeTableInstance>()
  const xToolbar = $ref<VxeToolbarInstance>()

  onMounted(() => {
    initData()
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable?.connect(xToolbar as VxeToolbarInstance)
  }

  function initData() {
    mediaTypes = dictDropDown('WeChatMediaType')
  }
  // 分页查询
  function queryPage() {
    loading.value = true
    pageFile({
      ...queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }
  function copy(record) {
    clipboardRef.value = record.url
    createMessage.success('复制链接成功')
  }
  function remove(record) {
    deleteFile(record.mediaId).then(() => {
      createMessage.success('删除成功')
      queryPage()
    })
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
</script>

<style scoped></style>
