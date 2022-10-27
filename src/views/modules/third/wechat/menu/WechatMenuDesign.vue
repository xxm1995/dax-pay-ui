<template>
  <basic-modal
    v-bind="$attrs"
    title="自定义菜单"
    :closable="false"
    :keyboard="false"
    :destroyOnClose="true"
    :loading="confirmLoading"
    :width="1030"
    :visible="visible"
    :mask-closable="showable"
  >
    <wx-menu-design :showable="showable" v-model:menu="form.menuInfo" />
    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import WxMenuDesign from '/@/views/modules/third/wechat/menu/edit/WxMenuDesign.vue'
  import { $ref } from 'vue/macros'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { get, update } from '/@/views/modules/third/wechat/menu/WechatMenu.api'
  import { FormEditType } from '/@/enums/formTypeEnum'

  const { createConfirm, createMessage } = useMessage()

  let confirmLoading = $ref(false)
  let visible = $ref(false)
  let showable = $ref(false)

  let form = $ref<any>({})

  function init(id, formEditType: FormEditType) {
    visible = true
    showable = formEditType === FormEditType.Show
    if (formEditType === FormEditType.Add) {
      confirmLoading = false
    } else {
      get(id).then((res) => {
        form = res.data
        confirmLoading = false
      })
    }
  }

  /**
   * 保存
   */
  function handleOk() {
    confirmLoading = true
    update(form).then(() => {
      createMessage.success('保存自定义菜单设计内容成功')
      visible = false
      confirmLoading = false
    })
  }

  /**
   * 关闭
   */
  function handleCancel() {
    console.log(showable)
    if (showable) {
      visible = false
    } else {
      createConfirm({
        iconType: 'warning',
        title: '警告',
        content: '是否退出自定义菜单编辑，内容将不会被保存?',
        onOk: () => {
          visible = false
        },
      })
    }
  }
  defineExpose({
    init,
  })
</script>

<style scoped></style>
