<template>
  <basic-modal
    title="选择文章"
    :width="750"
    :visible="visible"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <vxe-table row-id="id" :loading="loading" :data="pagination.records" :radio-config="{ highlight: true }" @radio-change="radioChange">
      <vxe-column width="50" type="radio" />
      <vxe-column field="titles" title="标题" />
      <vxe-column field="articleId" title="文章id" />
      <vxe-column field="updateTime" title="上传时间" />
    </vxe-table>
    <vxe-pager
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"
    />
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button :loading="loading" type="primary" :disabled="!articleId" @click="handleOk">选择</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { $ref } from 'vue/macros'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { page } from '/@/views/modules/third/wechat/article/WechatArticleSelect.api'
  import { useMessage } from '/@/hooks/web/useMessage'
  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { notification, createMessage, createConfirm } = useMessage()

  const emits = defineEmits(['ok'])

  let visible = $ref(false)
  let articleId = $ref<string | null>('')
  // 分页查询
  function queryPage() {
    loading.value = true
    page({
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }
  function show() {
    articleId = null
    visible = true
    loading.value = true
    queryPage()
  }
  function handleOk() {
    emits('ok', articleId)
    handleCancel()
  }
  function handleCancel() {
    visible = false
  }
  function radioChange({ row }) {
    articleId = row.articleId
  }
  defineExpose({ show })
</script>

<style scoped></style>
