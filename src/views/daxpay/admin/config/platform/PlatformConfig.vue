<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <div class="flex justify-center" style="flex-wrap: wrap">
        <a-spin :spinning="confirmLoading">
          <a-form
            class="small-from-item w-40vw"
            ref="formRef"
            :model="form"
            :rules="rules"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 18 }"
            :validate-trigger="['blur', 'change']"
          >
            <a-form-item label="网关地址" name="gatewayServiceUrl">
              <a-input
                :disabled="!edit"
                v-model:value="form.gatewayServiceUrl"
                placeholder="请输入网关地址"
              />
            </a-form-item>
          </a-form>
          <div class="flex justify-center">
            <a-button v-if="edit" @click="initData">取消</a-button>
            <a-button v-if="edit" style="margin-left: 50px" type="primary" @click="updateConfig"
              >更新</a-button
            >
            <a-button v-if="!edit" @click="edit = true">编辑信息</a-button>
          </div>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { onMounted, ref } from 'vue'
  import { get, PlatformConfig, update } from './PlatformConfig.api'
  import { useMessage } from '@/hooks/web/useMessage'

  const { createMessage } = useMessage()
  const confirmLoading = ref(false)
  const formRef = ref<FormInstance>()
  const form = ref<PlatformConfig>({})
  const edit = ref<boolean>(false)
  const rules = {
    gatewayServiceUrl: [{ required: true, message: '请输入网关地址' }],
  } as Record<string, Rule[]>

  onMounted(() => {
    initData()
  })

  /**
   * 获取配置
   */
  function initData() {
    confirmLoading.value = true
    edit.value = false
    get().then(({ data }) => {
      form.value = data
      confirmLoading.value = false
    })
  }

  /**
   * 更新
   */
  function updateConfig() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      update(form.value)
        .then(() => {
          createMessage.success('更新成功')
          initData()
        })
        .finally(() => (confirmLoading.value = false))
    })
  }
</script>

<style scoped lang="less"></style>
