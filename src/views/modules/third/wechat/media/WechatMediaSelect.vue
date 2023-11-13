<template>
  <basic-modal
    title="选择素材"
    :width="750"
    :visible="visible"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="类型">
          <a-select v-model:value="queryParam.type" :default-value="queryParam.type" :options="mediaTypes" style="width: 200px" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="queryPage">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <vxe-table row-id="id" :loading="loading" :data="pagination.records" :radio-config="{ highlight: true }" @radio-change="radioChange">
      <vxe-column width="50" type="radio" />
      <vxe-column field="name" title="名称" />
      <vxe-column field="mediaId" title="媒体ID" />
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
        <a-button :loading="loading" type="primary" :disabled="!mediaId" @click="handleOk">选择</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { pageFile } from './WechatMedia.api'
  import { $ref } from 'vue/macros'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { reactive } from 'vue'
  import { useDict } from '/@/hooks/bootx/useDict'
  // 使用hooks
  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)
  const { dictDropDown } = useDict()

  let mediaTypes = $ref<LabeledValue[]>()
  const queryParam = reactive({
    type: 'image',
  })
  let visible = $ref(false)
  let mediaId = $ref<string | null>('')

  const emits = defineEmits(['ok'])

  function show() {
    mediaId = null
    visible = true
    loading.value = true
    dictDropDown('WeChatMediaType').then((res) => {
      mediaTypes = res
    })
    queryPage()
  }

  function queryPage() {
    loading.value = true
    pageFile({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
  }

  function handleOk() {
    emits('ok', mediaId)
    handleCancel()
  }

  function handleCancel() {
    visible = false
  }

  function radioChange({ row }) {
    mediaId = row.mediaId
  }
  defineExpose({ show })
</script>

<style scoped></style>
