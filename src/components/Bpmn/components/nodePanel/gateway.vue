<template>
  <div>
    <a-form-model
      ref="form"
      :model="formData"
      :rules="rules"
      :label-col="{ span: 6,offset: 0 }"
      :wrapper-col="{ span: 16,offset: 1}"
      layout="horizontal">
      <a-form-model-item label="节点ID" prop="id">
        <a-input v-model="formData.id" placeholder="请输入流程标识" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="节点名称" prop="name">
        <a-input v-model="formData.name" placeholder="请输入流程名称" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="节点描述" prop="documentation" v-if="!filter('nodeDocumentation')">
        <a-textarea
          v-model="formData.documentation"
          placeholder="请输入流程描述"
          :auto-size="{minRows: 4, maxRows: 4}"
          :style="{width: '100%'}"
          allow-clear />
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
import { commonParse } from '../../common/parseElement'
export default {
  mixins: [mixinPanel, mixinExecutionListener],
  data () {
    return {
      formData: {
        id: undefined,
        name: undefined,
        documentation: undefined
      },
      rules: {
        id: [{
          required: true,
          message: '请输入流程标识',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入流程名称',
          trigger: 'blur'
        }],
        documentation: []
      }
    }
  },
  computed: {

  },
  created () {
    this.formData = commonParse(this.element)
  }
}
</script>

<style>

</style>
