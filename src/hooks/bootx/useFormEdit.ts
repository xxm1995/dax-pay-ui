import { reactive, toRefs } from 'vue'
import { FormEditType } from '/@/enums/formTypeEnum'

export default function () {
  const model = reactive({
    // 表单项标题文字
    labelCol: {
      sm: { span: 7 },
    },
    // 表单项内容
    wrapperCol: {
      sm: { span: 13 },
    },
    title: '新增',
    modalWidth: 640,
    confirmLoading: false,
    visible: false,
    editable: false,
    addable: false,
    showable: false,
    formEditType: FormEditType.Add,
  })
  // 状态
  const { labelCol, wrapperCol, title, modalWidth, confirmLoading, visible, editable, addable, showable, formEditType } = toRefs(model)

  function initFormEditType(editType: FormEditType) {
    formEditType.value = editType
    visible.value = true
    if (formEditType.value === FormEditType.Add) {
      addable.value = true
      title.value = '新增'
    }
    if (formEditType.value === FormEditType.Edit) {
      editable.value = true
      title.value = '修改'
    }
    if (formEditType.value === FormEditType.Show) {
      showable.value = true
      title.value = '查看'
    }
  }

  // 关闭
  function handleCancel() {
    visible.value = false
    addable.value = false
    editable.value = false
    showable.value = false
  }

  // 搜索
  function search(input: string, option) {
    return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  // 判断脱敏参数是否被修改的参数, 未修改返回空值 rawForm 后端获取到的原始数据, editForm 修改后的数据, keys 字段名称
  function diffForm(rawForm, editForm, ...keys) {
    const form = {}
    for (const key of keys) {
      form[key] = rawForm[key] === editForm[key] ? undefined : editForm[key]
    }
    return form
  }

  return {
    model,
    labelCol,
    wrapperCol,
    title,
    modalWidth,
    confirmLoading,
    visible,
    editable,
    addable,
    showable,
    formEditType,
    initFormEditType,
    handleCancel,
    search,
    diffForm,
  }
}
