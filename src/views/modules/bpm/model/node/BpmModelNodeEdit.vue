<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-form
      class="small-from-item"
      ref="formRef"
      :model="form"
      :rules="rules"
      :validate-trigger="['blur', 'change']"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="主键" name="id" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item label="任务节点id" name="nodeId">
        <a-input disabled v-model:value="form.nodeId" placeholder="请输入任务节点id" />
      </a-form-item>
      <a-form-item label="任务节点名称" name="nodeName">
        <a-input disabled v-model:value="form.nodeName" placeholder="请输入任务节点名称" />
      </a-form-item>
      <a-form-item label="多实例" name="multi">
        <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.multi" disabled />
      </a-form-item>
      <a-form-item label="是否串签" name="sequential" v-if="form.multi && showable">
        <a-switch checked-children="串行" un-checked-children="并行" v-model:checked="form.sequential" disabled />
      </a-form-item>
      <a-form-item label="是否是或签" name="orSign" v-if="form.multi">
        <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.orSign" :disabled="showable" />
      </a-form-item>
      <a-form-item label="是否比例通过" name="ratioPass" v-if="form.multi && !form.sequential">
        <a-switch checked-children="是" un-checked-children="否" v-model:checked="form.ratioPass" :disabled="showable" />
      </a-form-item>
      <a-form-item label="通过比例" name="passRatio" v-if="form.ratioPass">
        <a-input-number
          style="width: 100%"
          :min="1"
          :max="100"
          :precision="0"
          :disabled="showable"
          v-model:valeu="form.passRatio"
          placeholder="请输入通过比例"
        />
      </a-form-item>
      <a-form-item label="分配类型" name="assignType">
        <a-select
          allowClear
          v-model:value="form.assignType"
          :disabled="showable"
          :filter-option="search"
          :options="assignTypeList"
          style="width: 100%"
          placeholder="选择处理人分配类型"
          @change="assignTypeChange"
        />
      </a-form-item>
      <a-form-item label="分配用户" name="assignShow" v-if="[USER_GROUP, USER].includes(form.assignType)">
        <a-input v-model:value="form.assignShow" placeholder="请选择用户" disabled>
          <template #addonAfter>
            <a-link :disabled="showable" @click="selectUserShow">选择用户</a-link>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="分配角色" prop="assignShow" v-if="[ROLE].includes(form.assignType)">
        <template #label>
          <span>
            分配角色
            <a-tooltip v-if="!form.multi">
              <template #title>如果角色关联多个用户只会从中随机抽选一个</template>
              <icon icon="ant-design:question-circle-outlined" />
            </a-tooltip>
          </span>
        </template>
        <a-input v-model:value="form.assignShow" placeholder="请选择角色" disabled>
          <template #addonAfter>
            <a-link :disabled="showable" @click="selectRoleShow">选择角色</a-link>
          </template>
        </a-input>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
    <!--  用户分配 -->
    <b-user-select-modal ref="userSelectModal" @ok="selectUser" :multiple="form.multi" />
    <!--  角色分配 -->
    <b-role-select-modal ref="roleSelectModal" @ok="selectRole" :multiple="form.multi" />
  </basic-modal>
</template>

<script lang="ts" setup>
  import { computed, nextTick } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, get, update, BpmModelNode } from './ModelNode.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal } from '/@/components/Modal'
  import {
    DEPT_LEADER_OPTION,
    DEPT_MEMBER_OPTION,
    ROLE_OPTION,
    SELECT_OPTION,
    SPONSOR_OPTION,
    USER_GROUP_OPTION,
    USER_OPTION,
    USER_GROUP,
    USER,
    ROLE,
  } from '/@/views/modules/bpm/model/node/BpmModelNodeCode'
  import BUserSelectModal from '/@/components/Bootx/UserSelectModal/BUserSelectModal.vue'
  import BRoleSelectModal from '/@/components/Bootx/RoleSelectModal/BRoleSelectModal.vue'
  import { UserInfo } from '/@/views/modules/system/user/User.api'
  import { Role } from '/@/views/modules/system/role/Role.api'
  const {
    initFormEditType,
    handleCancel,
    search,
    labelCol,
    wrapperCol,
    modalWidth,
    title,
    confirmLoading,
    visible,
    editable,
    showable,
    formEditType,
  } = useFormEdit()

  const userSelectModal = $ref<any>()
  const roleSelectModal = $ref<any>()

  const assignTypeList = computed(() => {
    if (form.multi) {
      return [SPONSOR_OPTION, SELECT_OPTION, USER_GROUP_OPTION, ROLE_OPTION, DEPT_LEADER_OPTION, DEPT_MEMBER_OPTION]
    } else {
      return [SPONSOR_OPTION, SELECT_OPTION, USER_OPTION, ROLE_OPTION, DEPT_LEADER_OPTION]
    }
  })
  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref({
    id: null,
    nodeId: '',
    nodeName: '',
    multi: false,
    sequential: false,
    orSign: undefined,
    ratioPass: undefined,
    passRatio: undefined,
    skip: false,
    assignType: undefined,
    assignRaw: '',
    assignShow: '',
  } as BpmModelNode)
  // 校验
  const rules = computed(() => {
    return {
      nodeId: [{ required: true, message: '请输入任务节点ID!' }],
      nodeName: [{ required: true, message: '请输入任务节点名称!' }],
      assignType: [{ required: true, message: '请选择处理人分配类型!' }],
      assignShow: [{ required: true, message: '请选择处理人!' }],
      skip: [{ required: true, message: '' }],
      orSign: [{ required: form.multi, message: '' }],
      ratioPass: [{ required: form.multi, message: '' }],
      passRatio: [{ required: form.ratioPass, message: '请输入通过比例' }],
    } as Record<string, Rule[]>
  })
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
  }
  // 获取信息
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form = data
        confirmLoading.value = false
      })
    } else {
      confirmLoading.value = false
    }
  }
  // 保存
  function handleOk() {
    formRef?.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(form)
      } else if (formEditType.value === FormEditType.Edit) {
        await update(form)
      }
      confirmLoading.value = false
      handleCancel()
      emits('ok')
    })
  }

  // 重置表单
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  /**
   * 开启选择用户界面
   */
  function selectUserShow() {
    userSelectModal.init()
  }
  /**
   * 选中用户回调
   */
  function selectUser(userId, userInfo: UserInfo | UserInfo[]) {
    form.assignRaw = userId
    if (form.multi) {
      form.assignShow = (userInfo as UserInfo[]).map((o) => o.name).join(',')
    } else {
      form.assignShow = (userInfo as UserInfo)?.name
    }
    formRef?.validateFields(['assignShow'])
  }
  /**
   * 选择角色
   */
  function selectRoleShow() {
    roleSelectModal.init()
  }

  /**
   * 选中角色回调
   */
  function selectRole(roleId, roleInfo: Role | Role[]) {
    form.assignRaw = roleId
    if (form.multi) {
      form.assignShow = (roleInfo as Role[]).map((o) => o.name).join(',')
    } else {
      form.assignShow = (roleInfo as Role)?.name
    }
    formRef?.validateFields(['assignShow'])
  }
  /**
   * 分配类型改变时, 清空分配数据信息
   */
  function assignTypeChange() {
    form.assignRaw = undefined
    form.assignShow = undefined
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
