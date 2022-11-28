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
      :height="350"
      ref="xTable"
      :checkbox-config="checkboxConfig"
      :radio-config="radioConfig"
      :loading="loading"
      :data="pagination.records"
    >
      <vxe-column v-if="multiple" type="checkbox" width="50" />
      <vxe-column v-if="!multiple" type="radio" width="50" />
      <vxe-column field="name" title="角色名称" />
      <vxe-column field="code" title="角色编码" />
    </vxe-table>
    <vxe-pager
      row-id="id"
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
  import useTablePage from '/@/hooks/bootx/useTablePage'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { $ref } from 'vue/macros'
  import { STRING } from '/@/components/Bootx/Query/Query'
  import { computed } from 'vue'
  import { page } from '/@/views/modules/system/role/Role.api'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'

  const { handleTableChange, pageQueryResHandel, resetQueryParams, pagination, pages, model, loading } = useTablePage(queryPage)

  const props = withDefaults(
    defineProps<{
      // 名称
      title: string
      // 是否是查询看状态
      multiple: boolean
      // 宽度
      width?: number | string
    }>(),
    {
      title: '选择角色',
      multiple: false,
      width: 640,
    },
  )
  const emits = defineEmits(['ok'])

  let visible = $ref(false)
  let selectRoleIds = $ref<string[]>([])
  let selectRoleId = $ref<string>()
  const xTable = $ref<any>()
  const fields = [
    { field: 'name', type: STRING, name: '名称', placeholder: '请输入角色名称' },
    { field: 'code', type: STRING, name: '编号', placeholder: '请输入角色编号' },
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
          checkRowKey: selectRoleId,
        }
      : {}
  })

  /**
   * 调用 初始化
   * @param param 已经选中的用户ID或ID集合
   */
  function init(param) {
    visible = true
    if (props.multiple) {
      selectRoleIds = param || selectRoleId
    } else {
      selectRoleId = param || selectRoleId
    }
    queryPage()
  }

  /**
   * 查询
   */
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
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
    emits('ok', userIds, users)
  }

  /**
   * 单选回调
   * @return userId 选中的用户id
   * @return user 选中的用户
   */
  function radioCallback() {
    const user = xTable.getRadioRecord()
    const userId = user?.id
    emits('ok', userId, user)
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
