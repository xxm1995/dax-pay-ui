<template>
  <basic-modal
    destroyOnClose
    title="接收方选择"
    :width="1000"
    :open="visible"
    :confirmLoading="loading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <vxe-toolbar>
      <template #buttons>
        <b-query
          :query-params="model.queryParam"
          :fields="fields"
          :default-item-md="8"
          @query="queryPage"
          @reset="() => (model.queryParam = {})"
        />
      </template>
    </vxe-toolbar>
    <vxe-table
      key-field="id"
      ref="xTable"
      :checkbox-config="checkboxConfig"
      :loading="loading"
      :data="pagination.records"
    >
      <vxe-column type="checkbox" width="50" />
      <vxe-column field="receiverNo" title="接收方编号" :min-width="160" />
      <vxe-column field="receiverType" title="分账接收方类型" :min-width="100">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('alloc_receiver_type', row.receiverType) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="receiverAccount" title="接收方账号" :min-width="160" />
      <vxe-column field="receiverName" title="接收方姓名" :min-width="100" />
      <vxe-column field="relationType" title="分账关系" :min-width="100">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('alloc_relation_type', row.relationType) }}</a-tag>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      border
      size="medium"
      :height="350"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"
    />
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" type="primary" @click="checkboxCallback">选择</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { LIST, QueryField, STRING } from '@/components/Bootx/Query/Query'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import { page } from '../receiver/AllocationReceiver.api'
  import { useDict } from '@/hooks/bootx/useDict'
  import { computed, ref } from 'vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useMessage } from '@/hooks/web/useMessage'

  const { handleTableChange, pageQueryResHandel, pagination, model, pages, loading } =
    useTablePage(queryPage)
  const { dictConvert, dictDropDown } = useDict()
  const { createMessage } = useMessage()

  const emits = defineEmits(['ok'])

  const visible = ref(false)
  const selectIds = ref<string[]>([])
  const currentChannel = ref<string>('')
  const currentAppId = ref<string>('')
  const relationTypeList = ref<LabeledValue[]>([])

  const xTable = ref<any>()
  const fields = computed(() => {
    return [
      { field: 'receiverNo', type: STRING, name: '接收方编号', placeholder: '请输入接收方编号' },
      {
        field: 'relationType',
        type: LIST,
        name: '分账关系',
        placeholder: '请选择分账关系',
        selectList: relationTypeList.value,
      },
    ] as QueryField[]
  })
  const checkboxConfig = {
    reserve: true,
    checkMethod: banCheckbox,
  }

  /**
   * 调用 初始化
   * @param receiverIds 已经选中的用户id集合
   * @param channel 通道
   */
  async function init(receiverIds, channel, appId) {
    visible.value = true
    selectIds.value = receiverIds
    currentChannel.value = channel
    currentAppId.value = appId
    relationTypeList.value = await dictDropDown('alloc_relation_type')
    queryPage().then()
  }
  /**
   * 查询
   */
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...pages,
      appId: currentAppId.value,
      channel: currentChannel.value,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }

  /**
   * 复选回调
   * @return userIds 选中的用户id集合
   * @return users 选中的用户集合
   */
  function checkboxCallback() {
    // 非本页选中的
    const reserveUsers = xTable.value.getCheckboxReserveRecords()
    // 本页选中的
    const checkObjs = xTable.value.getCheckboxRecords()
    const objs = reserveUsers.concat(checkObjs)
    const ids = objs.map((res) => res.id)
    if (!ids.length) {
      createMessage.warn('请选择分账接收方')
      return
    }

    emits('ok', ids)
    visible.value = false
  }

  /**
   * 关闭
   */
  function handleCancel() {
    visible.value = false
  }
  /**
   * 禁止选中的行 复选
   */
  function banCheckbox({ row }) {
    return !selectIds.value.includes(row.id)
  }
  defineExpose({ init })
</script>
<style scoped></style>
