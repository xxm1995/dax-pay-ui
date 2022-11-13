<template>
  <div>
    <a-form-model
      ref="form"
      :model="formData"
      :rules="rules"
      :label-col="{ span: 8,offset: 0 }"
      :wrapper-col="{ span: 14,offset: 0 }"
      layout="horizontal">
      <a-form-model-item label="节点ID" prop="id">
        <a-input v-model="formData.id" placeholder="请输入节点ID" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="节点名称" prop="name">
        <a-input v-model="formData.name" placeholder="请输入节点名称" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="节点描述" prop="documentation" v-if="!filter('nodeDocumentation')">
        <a-textarea
          v-model="formData.documentation"
          placeholder="请输入节点描述"
          :auto-size="{minRows: 1, maxRows: 2}"
          :style="{width: '100%'}"
          allow-clear />
      </a-form-model-item>
      <a-form-model-item label="多实例" prop="multiInstance">
        <a-switch @change="handleMultiInstance" v-model="formData.multiInstance" />
      </a-form-model-item>
      <a-form-model-item label="串行/并行" prop="isSequential" v-if="formData.multiInstance">
        <a-radio-group @change="handleIsSequential" v-model="formData.isSequential">
          <a-radio :value="false">并行</a-radio>
          <a-radio :value="true">串行</a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
import { commonParse, userTaskParse } from '../../common/parseElement'

export default {
  mixins: [mixinPanel, mixinExecutionListener],
  props: {
    dueDateDataSource: {
      type: Array,
      default: () => []
    },
    followUpDateDataSource: {
      type: Array,
      default: () => []
    },
    candidateUserDataSource: {
      type: Array,
      default: () => []
    },
    candidateGroupDataSource: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      taskListenerVisible: false,
      dialogName: '',
      taskListenerLength: 0,
      formData: {
        id: undefined,
        name: undefined,
        documentation: undefined,
        multiInstance: false,
        isSequential: false,
      },
      rules: {
        id: [{
          required: true,
          message: '请输入节点ID',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入节点名称',
          trigger: 'blur'
        }],
        documentation: []
      }
    }
  },
  computed: {

  },
  created () {
    let cache = commonParse(this.element)
    cache = userTaskParse(cache)
    this.formData = cache
    this.computedExecutionListenerLength()
    this.computedHasMultiInstance()
  },
  methods: {
    /**
     * 是否是多实例
     */
    computedHasMultiInstance () {
      const multiInstance = this.element.businessObject.loopCharacteristics
      this.$set(this.formData, 'multiInstance', !!multiInstance)
      this.$set(this.formData, 'isSequential', multiInstance?.isSequential)
    },
    /**
     * 处理多实例
     */
    handleMultiInstance (event) {
      // 开启多实例
      if (event) {
        const loopCharacteristics = this.element.businessObject.get('loopCharacteristics') ||
          this.modeler.get('moddle').create('bpmn:MultiInstanceLoopCharacteristics')
        if (this.formData.isSequential) {
          loopCharacteristics['isSequential'] = this.formData.isSequential
        } else {
          loopCharacteristics['isSequential'] = false
          this.formData.isSequential = false
        }
        // 占位, 不实际使用, 会被系统忽略
        loopCharacteristics['collection'] = 'list'
        loopCharacteristics['elementVariable'] = 'item'
        // 注入任务完成条件
        // eslint-disable-next-line no-template-curly-in-string
        // loopCharacteristics['completionCondition'] = this.modeler.get('moddle').create('bpmn:Expression', { body: '${userTaskCompletionFlag}' })
        this.updateProperties({ loopCharacteristics: loopCharacteristics })
      } else {
        this.updateProperties({ loopCharacteristics: null })
      }
    },
    /**
     * 串签/会签 处理
     */
    handleIsSequential (e) {
      const loopCharacteristics = this.element.businessObject.get('loopCharacteristics')
      loopCharacteristics['isSequential'] = e.target.value
      this.updateProperties({ loopCharacteristics: loopCharacteristics })
    }
  }
}
</script>

<style></style>
