import { reactive, ref, toRefs } from 'vue'
import { FormType } from '/#/web'

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
  const { labelCol, wrapperCol, title, modalWidth, confirmLoading, visible, editable, addable, showable, type } = toRefs(model)
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
  }
}
