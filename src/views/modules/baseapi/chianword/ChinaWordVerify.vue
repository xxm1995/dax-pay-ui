<template>
  <basic-modal destroyOnClose title="敏感词测试" :width="720" :visible="visible" :maskClosable="false">
    <a-spin :spinning="loading">
      <a-form ref="formRef" layout="vertical">
        <a-form-item label="待检测内容">
          <a-textarea :rows="5" v-model:value="form.text" placeholder="请输入待检测内容" />
        </a-form-item>
        <a-form-item>
          <template #label>
            <basic-title
              helpMessage="查找敏感词，距离越长，过滤越严格，效率越低，开发者可以根据具体需求设置，
这里以“紧急”为敏感词举例，以此类推:
0 匹配紧急
1 匹配不紧不急，紧x急
2 匹配紧急，紧x急，紧xx急"
              >文本距离</basic-title
            >
          </template>
          <a-input-number :min="0" v-model:value="form.skip" placeholder="请输入文本距离" />
        </a-form-item>
        <template v-if="result">
          <a-form-item label="是否敏感">
            <a-tag v-if="result.sensitive" color="red">敏感</a-tag>
            <a-tag v-else color="green">不敏感</a-tag>
          </a-form-item>
          <a-form-item label="敏感词数量">
            <a-tag>{{ result.count }}</a-tag>
          </a-form-item>
          <a-form-item v-show="result.text" label="过滤后内容">
            <div style="border: 1px solid #ccc">
              <a-textarea :row="5" v-model:value="result.text" disabled />
            </div>
          </a-form-item>
        </template>
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">关闭</a-button>
        <a-button key="forward" :loading="loading" type="primary" @click="verifyText">测试</a-button>
      </a-space>
    </template>
  </basic-modal>
</template>

<script setup lang="ts">
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import { $ref } from 'vue/macros'
  import { verify } from '/@/views/modules/baseapi/chianword/ChinaWord.api'
  import BasicTitle from '/@/components/Basic/src/BasicTitle.vue'
  import { ref } from 'vue'

  let visible = $ref(false)
  let loading = $ref(false)
  let form = $ref<any>({
    text: '',
    skip: 0,
    symbol: '*',
  })

  let result = $ref<any>(null)

  /**
   * 入口
   */
  function init() {
    loading = false
    visible = true
    form = {
      text: '',
      skip: 0,
      symbol: '*',
    }

    result = null
  }

  /**
   * 退出
   */
  function handleCancel() {
    visible = false
  }

  /**
   * 文本验证
   */
  function verifyText() {
    loading = true
    verify(form).then(({ data }) => {
      result = data
      loading = false
    })
  }

  defineExpose({ init })
</script>

<style scoped lang="less">
  .vben-basic-title {
    font-size: 14px;
  }
</style>
