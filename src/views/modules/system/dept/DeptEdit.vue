<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :maskClosable="false"
    @close="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
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
        <a-form-item label="类型" name="orgCategory">
          <a-radio-group :disabled="showable" v-model:value="form.orgCategory">
            <a-radio :value="1">公司</a-radio>
            <a-radio :value="2">部门</a-radio>
            <!--            <a-radio :value="3">岗位</a-radio>-->
          </a-radio-group>
        </a-form-item>
        <a-form-item label="机构名称" name="deptName">
          <a-input v-model:value="form.deptName" :disabled="showable" placeholder="请输入机构/部门名称" />
        </a-form-item>
        <a-form-item label="上级机构" name="parentId">
          <a-tree-select
            allowClear
            style="width: 100%"
            :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
            :tree-data="treeData"
            v-model:value="form.parentId"
            :placeholder="addable ? '请选择上级机构' : '无'"
            :disabled="!addable"
          />
        </a-form-item>
        <a-form-item label="机构编码" v-show="!addable" name="orgCode">
          <a-input disabled v-model:value="form.orgCode" placeholder="请输入机构编码" />
        </a-form-item>
        <a-form-item label="排序" name="sortNo">
          <a-input-number v-model:value="form.sortNo" :disabled="showable" placeholder="请输入排序" />
        </a-form-item>
        <a-form-item label="手机号" name="mobile">
          <a-input v-model:value="form.mobile" :disabled="showable" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item label="传真" name="fax">
          <a-input v-model:value="form.fax" :disabled="showable" placeholder="请输入传真" />
        </a-form-item>
        <a-form-item label="地址" name="address">
          <a-input v-model:value="form.address" :disabled="showable" placeholder="请输入地址" />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="form.remark" :disabled="showable" placeholder="请输入备注" />
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { nextTick, reactive } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, get, update, Dept, tree } from './Dept.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import BasicDrawer from '/@/components/Drawer/src/BasicDrawer.vue'
  import { validateMobile } from '/@/utils/validate'
  import { treeDataTranslate } from '/@/utils/dataUtil'
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
    addable,
    editable,
    showable,
    formEditType,
  } = useFormEdit()
  // 表单
  const formRef = $ref<FormInstance>()
  let treeData = $ref<any[]>([])
  let form = $ref({
    id: null,
    parentId: null,
    deptName: '',
    sortNo: 0,
    orgCategory: 1,
    orgCode: '',
    mobile: '',
    fax: '',
    address: '',
    remark: '',
  } as Dept)
  // 校验
  const rules = reactive({
    deptName: [{ required: true, message: '请输入机构名称' }],
    orgCategory: [{ required: true, message: '请选择机构类型' }],
    mobile: [{ validator: validatePhone }],
  } as Record<string, Rule[]>)
  // 事件
  const emits = defineEmits(['ok'])
  // 入口
  function init(id, editType: FormEditType, dept: Dept) {
    loadTree()
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType, dept)
  }
  // 获取信息
  function getInfo(id, editType: FormEditType, dept: Dept) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form = data
        confirmLoading.value = false
      })
    } else {
      nextTick(() => {
        form.parentId = dept?.id as string
      })
      confirmLoading.value = false
    }
  }
  function loadTree() {
    tree().then((res) => {
      treeData = treeDataTranslate(res.data, 'id', 'deptName')
    })
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

  // 校验手机号
  function validatePhone() {
    const { msg, result } = validateMobile(form.mobile)
    return result ? Promise.resolve() : Promise.reject(msg)
  }
  // 重置表单
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
