<template>
  <basic-modal
    destroyOnClose
    title="接收方选择"
    :width="1000"
    :visible="visible"
    :confirmLoading="loading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <vxe-toolbar>
      <template #buttons>
        <b-query :query-params="queryParam" :fields="fields" :default-item-md="8" @query="queryPage" @reset="() => (queryParam = {})" />
      </template>
    </vxe-toolbar>
    <vxe-table row-id="id" ref="xTable" :height="350" :checkbox-config="checkboxConfig" :loading="loading" :data="pagination.records">
      <vxe-column type="checkbox" width="50" />
      <vxe-column field="name" title="账号别名" :min-width="100"/>
      <vxe-column field="receiverType" title="分账接收方类型" :min-width="100">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('AllocReceiverType', row.receiverType) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="receiverAccount" title="接收方账号" :min-width="160" />
      <vxe-column field="receiverName" title="接收方姓名" :min-width="100" />
      <vxe-column field="relationType" title="分账关系" :min-width="100">
        <template #default="{ row }">
          <a-tag>{{ dictConvert('AllocRelationType', row.relationType) }}</a-tag>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      border
      row-id="id"
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
  import { BasicModal } from '/@/components/Modal'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { $ref } from 'vue/macros'
  import { LIST, QueryField, STRING } from '/@/components/Bootx/Query/Query'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { page } from '../receiver/AllocationReceiver.api'
  import { useDict } from '/@/hooks/bootx/useDict'
  import { computed } from 'vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useMessage } from '/@/hooks/web/useMessage'

  const { handleTableChange, pageQueryResHandel, pagination, pages, model, loading } = useTablePage(queryPage)
  const { dictConvert, dictDropDown } = useDict()
  const { notification, createMessage, createConfirm } = useMessage()

  const emits = defineEmits(['ok'])

  let visible = $ref(false)
  let selectIds = $ref<string[]>([])
  let currentChannel = $ref<string>('')
  let queryParam = $ref<any>({})
  let relationTypeList = $ref<LabeledValue[]>([])
  let receiverTypeList = $ref<LabeledValue[]>([])

  const xTable = $ref<any>()
  const fields = computed(() => {
    return [
      { field: 'name', type: STRING, name: '账号别名', placeholder: '请输入账号别名' },
      { field: 'relationType', type: LIST, name: '分账关系', placeholder: '请选择分账关系', selectList: relationTypeList },
      // { field: 'receiverType', type: LIST, name: '接收方类型', placeholder: '请选择分账接收方类型', selectList: receiverTypeList },
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
  async function init(receiverIds, channel) {
    visible = true
    selectIds = receiverIds
    currentChannel = channel
    relationTypeList = await dictDropDown('AllocationRelationType')
    queryPage()
  }
  /**
   * 查询
   */
  function queryPage() {
    loading.value = true
    page({
      ...queryParam,
      ...pages,
      channel: currentChannel,
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
    const reserveUsers = xTable.getCheckboxReserveRecords()
    // 本页选中的
    const checkObjs = xTable.getCheckboxRecords()
    const objs = reserveUsers.concat(checkObjs)
    const ids = objs.map((res) => res.id)
    if (!ids.length) {
      createMessage.warn('请选择分账接收方')
      return
    }

    emits('ok', ids)
    visible = false
  }

  /**
   * 关闭
   */
  function handleCancel() {
    visible = false
  }
  /**
   * 禁止选中的行 复选
   */
  function banCheckbox({ row }) {
    return !selectIds.includes(row.id)
  }
  defineExpose({ init })
</script>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'BUserSelectModal',
  })
</script>
<style scoped></style>
