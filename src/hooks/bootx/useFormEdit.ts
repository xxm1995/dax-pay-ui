import { reactive, toRefs } from 'vue'
import { FormType } from "/@/enums/formTypeEnum";

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
    modalWidth: '50%',
    confirmLoading: false,
    visible: false,
    editable: false,
    addable: false,
    showable: false,
    type: FormType.Add,
  })
  // 状态
  const { labelCol, wrapperCol, title, modalWidth, confirmLoading, visible, editable, addable, showable, type } = toRefs(model)

  function initFormModel(record, fromType: FormType, ...vars) {
    type.value = fromType
    visible.value = true
    if (type.value === FormType.Add) {
      addable.value = true
      title.value = '新增'
    }
    if (type.value === FormType.Edit) {
      editable.value = true
      title.value = '修改'
    }
    if (type.value === FormType.Show) {
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
    type,
    initFormModel,
    handleCancel,
    search,
  }
}
