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
      <a-form-model-item label="分支条件" prop="conditionExpression">
        <a-input
          v-model="formData.conditionExpression"
          placeholder="分支完成条件表达式"
          @blur="handleMultiInstanceConditionExpression"
          allow-clear />
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
import { commonParse, conditionExpressionParse } from '../../common/parseElement'
export default {
  mixins: [mixinPanel, mixinExecutionListener],
  computed: {
    rules () {
      return {
        id: [{ required: true, message: '请输入连接线ID', trigger: 'blur' }],
        name: [{ required: true, message: '请输入连接线名称', trigger: 'blur' }],
        conditionExpression: [{ required: this.multi, message: '请输入条件表达式', trigger: 'blur' }]
      }
    }
  },
  data () {
    return {
      multi: false,
      conditionExpressionShow: false,
      formData: {
        id: undefined,
        name: undefined,
        documentation: undefined,
        conditionExpression: undefined
      }
    }
  },
  methods: {
    /**
     * 分支完成信息处理
     */
    initConditionExpression () {
      this.$set(this.formData, 'conditionExpression', this.element.businessObject.conditionExpression?.body)
      // 是否是多分支
      this.multi = this.element.businessObject.sourceRef?.outgoing?.length > 1
    },
    /**
     * 处理
     */
    handleMultiInstanceConditionExpression (e) {
      const expression = e.target.value
      if (expression) {
        const newCondition = this.modeler.get('moddle').create('bpmn:FormalExpression', { body: expression })
        this.updateProperties({ conditionExpression: newCondition })
      } else {
        this.updateProperties({ conditionExpression: null })
      }
    }
  },
  mounted () {
    let cache = commonParse(this.element)
    cache = conditionExpressionParse(cache)
    this.formData = cache
    this.initConditionExpression()
  }
}
</script>

<style></style>
