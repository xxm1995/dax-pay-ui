<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="modalWidth"
    :title="title"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-form class="small-from-item" ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="主键" name="id" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item label="任务名称" name="name">
        <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入任务名称" />
      </a-form-item>
      <a-form-item label="任务类名" name="jobClassName">
        <a-input v-model:value="form.jobClassName" :disabled="showable" placeholder="请输入任务类名" />
      </a-form-item>
      <a-form-item label="cron表达式" name="cron">
        <a-input placeholder="请选择cron表达式" v-model:value="form.cron" disabled>
          <template #addonAfter>
            <a class="open-btn" :disabled="showable ? 'disabled' : null" @click="showConfigModal">
              <icon icon="ant-design:setting-outlined" />
              <span>选择</span>
            </a>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="参数" name="parameter">
        <a-textarea v-model:value="form.parameter" :disabled="showable" placeholder="请输入参数" />
      </a-form-item>
      <a-form-item label="状态" name="state" v-if="showable">
        <a-tag v-if="form.state === 1" color="green">运行</a-tag>
        <a-tag v-else color="red">停止</a-tag>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="form.remark" :disabled="showable" placeholder="请输入备注" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
    <easy-cron ref="easyCron" :value="form.cron" @ok="cronOk" />
  </basic-modal>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, unref } from 'vue'
  import { $ref } from 'vue/macros'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { add, get, update, QuartzJob, judgeJobClass } from './QuartzJob.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '/@/enums/formTypeEnum'
  import { BasicModal, useModal } from '/@/components/Modal'
  import Icon from '/@/components/Icon/src/Icon.vue'
  import EasyCron from '/@/components/EasyCron/EasyCron.vue'

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
  const [registerModal, { openModal }] = useModal()

  // 表单
  const formRef = $ref<FormInstance>()
  let form = $ref({
    id: null,
    name: '',
    jobClassName: '',
    cron: '',
    parameter: '',
    state: 1,
    remark: '',
  } as QuartzJob)
  // 校验
  const rules = reactive({
    name: [{ required: true, message: '请输入任务名称' }],
    jobClassName: [
      { required: true, message: '请输入任务类名' },
      { validator: validateJobClass, trigger: 'blur' },
    ],
    cron: [{ required: true, message: '请输入或选择cron' }],
  } as Record<string, Rule[]>)
  const easyCron = $ref<any>()
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

  // 重置表单的校验
  function resetForm() {
    nextTick(() => {
      formRef?.resetFields()
    })
  }
  function showConfigModal() {
    easyCron.showConfigModal()
  }

  function cronOk(cron) {
    form.cron = unref(cron)
    formRef?.validateFields('cron')
  }

  async function validateJobClass() {
    const { jobClassName } = form
    if (!jobClassName) {
      return Promise.resolve()
    }
    const res = await judgeJobClass(jobClassName)
    return res.data ? Promise.reject(res.data) : Promise.resolve()
  }
  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
