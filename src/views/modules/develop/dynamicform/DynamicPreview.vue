<template>
  <basic-modal
    title="预览表单"
    :loading="confirmLoading"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <EBuilder ref="builder" :pageSchema="pageSchema" />
  </basic-modal>
</template>

<script lang="ts" setup>
  import 'epic-designer/dist/style.css'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { EBuilder } from 'epic-designer'
  import useFormEdit from '/@/hooks/bootx/useFormEdit'
  import { $ref } from 'vue/macros'
  import { DynamicForm, get } from '/@/views/modules/develop/dynamicform/DynamicForm.api'

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

  let builder = $ref<any>()
  let form = $ref<DynamicForm>()

  const pageSchema = {
    schemas: [
      {
        type: 'page',
        id: 'root',
        children: [
          {
            label: '表单',
            type: 'form',
            icon: 'icon-qiapian',
            name: 'default',
            componentProps: {
              labelWidth: 100,
              labelCol: {
                span: 5,
              },
              wrapperCol: {
                span: 19,
              },
              hideRequiredMark: false,
              labelPosition: 'right',
              size: 'default',
              requireAsteriskPosition: 'left',
            },
            children: [
              {
                label: '输入框',
                type: 'input',
                field: 'input',
                icon: 'icon-write',
                input: true,
                componentProps: {
                  defaultValue: '',
                  placeholder: '请输入',
                  size: 'default',
                  type: 'text',
                },
                id: '7k6ajqpxhl000',
              },
              {
                label: '数字输入框',
                type: 'number',
                icon: 'icon-number',
                field: 'number',
                input: true,
                componentProps: {
                  placeholder: '请输入',
                  size: 'default',
                  controlsPosition: 'default',
                },
                id: 'i6x0mqlm6js00',
              },
              {
                label: '选择框',
                type: 'select',
                icon: 'icon-xiala',
                field: 'select',
                input: true,
                componentProps: {
                  options: [
                    {
                      label: '选项1',
                      value: '选项1',
                    },
                    {
                      label: '选项2',
                      value: '选项2',
                    },
                  ],
                  placeholder: '请选择',
                  size: 'default',
                  effect: 'light',
                  placement: 'bottom-start',
                },
                id: '80gl3fnca3g00',
              },
              {
                label: '单选框',
                type: 'radio',
                icon: 'icon-danxuan-cuxiantiao',
                field: 'radio',
                input: true,
                componentProps: {
                  options: [
                    {
                      label: '选项1',
                      value: '选项1',
                    },
                    {
                      label: '选项2',
                      value: '选项2',
                    },
                  ],
                  size: 'default',
                },
                id: '2ggd4l3i109w0',
              },
            ],
            id: 'eqf5rtg2ohc00',
          },
        ],
        componentProps: {
          style: {
            padding: '16px',
          },
        },
      },
    ],
  }
  /**
   * 初始化
   */
  function init(id) {
    visible.value = true
    confirmLoading.value = true
    get(id).then((res) => {
      form = res.data
      if (form.value) {
      }
      confirmLoading.value = false
    })
  }
  defineExpose({ init })
</script>

<style scoped></style>
