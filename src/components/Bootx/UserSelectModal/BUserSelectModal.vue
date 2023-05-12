<template>
  <basic-modal
    destroyOnClose
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="loading"
    :maskClosable="false"
    @cancel="handleCancel"
    @ok="handleOk"
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
      row-id="id"
      ref="xTable"
      :height="350"
      :checkbox-config="checkboxConfig"
      :radio-config="radioConfig"
      :loading="loading"
      :data="pagination.records"
    >
      <vxe-column v-if="multiple" type="checkbox" width="50" />
      <vxe-column v-if="!multiple" type="radio" width="50" />
      <vxe-column field="name" title="用户名称" />
      <vxe-column field="username" title="用户账号" />
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
      <a-button key="forward" type="primary" @click="handleOk">选择</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { BasicModal } from '/@/components/Modal'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { computed } from 'vue'
  import { $ref } from '@vue-macros/reactivity-transform/macros'
  import { STRING } from '/@/components/Bootx/Query/Query'
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import { page } from '/@/views/modules/system/user/User.api'

  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)

  interface Props {
    // 名称
    title?: string
    // 是否允许多选
    multiple?: boolean
    // 宽度
    width?: number | string
    // 数据源
    dataSource?: Function
  }
  const props = withDefaults(defineProps<Props>(), {
    title: '选择用户',
    multiple: false,
    width: 640,
    dataSource: page,
  })
  const emits = defineEmits(['ok'])

  let callbackVariable

  let visible = $ref(false)
  let selectUserIds = $ref<string[]>([])
  let selectUserId = $ref<string>()
  const xTable = $ref<any>()
  const fields = [
    { field: 'name', type: STRING, name: '账号', placeholder: '输入用户名称' },
    { field: 'username', type: STRING, name: '账号', placeholder: '输入用户账号' },
  ]
  const checkboxConfig = computed(() => {
    return props.multiple
      ? {
          reserve: true,
          checkMethod: banCheckbox,
        }
      : {}
  })
  const radioConfig = computed(() => {
    return !props.multiple
      ? {
          reserve: true,
          checkRowKey: selectUserId,
        }
      : {}
  })

  /**
   * 调用 初始化
   * @param param 已经选中的用户ID或ID集合
   * @param variable 回调原样带回的参数
   */
  function init(param, ...variable) {
    visible = true
    callbackVariable = variable
    if (props.multiple) {
      selectUserIds = param || selectUserIds
    } else {
      selectUserId = param || selectUserId
    }
    queryPage()
  }
  /**
   * 查询
   */
  function queryPage() {
    loading.value = true
    props
      .dataSource({
        ...model.queryParam,
        ...pages,
      })
      .then(({ data }) => {
        pageQueryResHandel(data)
      })
    return Promise.resolve()
  }
  /**
   * 选中确定回调
   */
  function handleOk() {
    if (props.multiple) {
      checkboxCallback()
    } else {
      radioCallback()
    }
    visible = false
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
    const checkUsers = xTable.getCheckboxRecords()
    const users = reserveUsers.concat(checkUsers)
    const userIds = users.map((res) => res.id)
    emits('ok', userIds, users, ...callbackVariable)
  }

  /**
   * 单选回调
   * @return userId 选中的用户id
   * @return user 选中的用户
   */
  function radioCallback() {
    const user = xTable.getRadioRecord()
    const userId = user?.id
    emits('ok', userId, user, ...callbackVariable)
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
    return !selectUserIds.includes(row.id)
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
