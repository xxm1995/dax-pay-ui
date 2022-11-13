<template>
  <div>
    <a-form-model ref="form" :model="formData" :rules="rules" :label-col="{ span: 4,
      offset: 0 }" :wrapper-col="{ span: 14,
      offset: 0 }" layout="horizontal">
      <a-row style="margin-bottom: 20px;">
        <a-alert  type="info" show-icon >
          <span slot="description">
            按照BPMN2.0规范的要求，用于为每个实例创建执行的父执行，会提供下列变量:<br>
          nrOfInstances：实例总数。<br>
          nrOfActiveInstances：当前活动的（即未完成的），实例数量。对于顺序多实例，这个值总为1。<br>
          nrOfCompletedInstances：已完成的实例数量。<br>
          loopCounter：给定实例在for-each循环中的index。<br>
          </span>
        </a-alert>
      </a-row>
      <a-form-model-item prop="collection">
        <span slot="label">
          集合
          <a-tooltip>
            <template slot="title">
              属性会作为表达式进行解析。如果表达式解析为字符串而不是一个集合，<br />
              不论是因为本身配置的就是静态字符串值，还是表达式计算结果为字符串，<br />
              这个字符串都会被当做变量名，并从流程变量中用于获取实际的集合。
            </template>
            <i class="iconfont icon-info" style="color: #0a97ce"></i>
          </a-tooltip>
        </span>
        <a-input v-model="formData.collection" placeholder="请输入集合" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item prop="elementVariable">
        <span slot="label">
          元素变量
          <a-tooltip>
            <template slot="title">
              每创建一个用户任务前，先以该元素变量为label，集合中的一项为value，<br />
              创建（局部）流程变量，该局部流程变量被用于指派用户任务。<br />
              一般来说，该字符串应与指定人员变量相同。
            </template>
            <i class="iconfont icon-info" style="color: #0a97ce"></i>
          </a-tooltip>
        </span>
        <a-input v-model="formData.elementVariable" placeholder="请输入元素变量" :style="{width: '100%'}" allow-clear>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="执行方式" prop="isSequential">
        <a-radio-group v-model="formData.isSequential">
          <a-radio v-for="(item, index) in isSequentialOptions" :key="index" :value="item.value"
                   :disabled="item.disabled">{{item.label}}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item prop="completionCondition">
        <span slot="label">
          完成条件
          <a-tooltip>
            <template slot="title">
               多实例活动在所有实例都完成时结束，然而也可以指定一个表达式，在每个实例<br />
              结束时进行计算。当表达式计算为true时，将销毁所有剩余的实例，并结束多实例<br />
              活动，继续执行流程。例如 ${nrOfCompletedInstances/nrOfInstances >= 0.6 }，<br />
              表示当任务完成60%时，该节点就算完成'

            </template>
            <i class="iconfont icon-info" style="color: #0a97ce"></i>
          </a-tooltip>
        </span>
        <a-input v-model="formData.completionCondition" placeholder="请输入单行文本" :style="{width: '100%'}"
                 allow-clear></a-input>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import mixinPanel from '../../../common/mixinPanel'
import { formatJsonKeyValue } from '../../../common/parseElement'
export default {
  mixins: [mixinPanel],
  data() {
    return {
      formData: {
        collection: undefined,
        elementVariable: undefined,
        isSequential: true,
        completionCondition: undefined,
      },
      rules: {
        collection: [{
          required: false,
          message: '请输入集合',
          trigger: 'blur'
        }],
        elementVariable: [{
          required: false,
          message: '请输入元素变量',
          trigger: 'blur'
        }],
        isSequential: [{
          required: false,
          message: '执行方式不能为空',
          trigger: 'change'
        }],
        completionCondition: [{
          required: false,
          message: '请输入单行文本',
          trigger: 'blur'
        }],
      },
      isSequentialOptions: [{
        "label": "串行",
        "value": true
      }, {
        "label": "并行",
        "value": false
      }],
    }
  },
  computed: {
  },
  mounted() {
    const cache = JSON.parse(JSON.stringify(this.element.businessObject.loopCharacteristics ?? {}))
    cache.completionCondition = cache.completionCondition?.body
    this.formData = formatJsonKeyValue(cache)
  },
  methods: {
    updateElement() {
      if (this.formData.isSequential !== null && this.formData.isSequential !== undefined) {
        let loopCharacteristics = this.element.businessObject.get('loopCharacteristics')
        if (!loopCharacteristics) {
          loopCharacteristics = this.modeler.get('moddle').create('bpmn:MultiInstanceLoopCharacteristics')
        }
        loopCharacteristics['isSequential'] = this.formData.isSequential
        loopCharacteristics['collection'] = this.formData.collection
        loopCharacteristics['elementVariable'] = this.formData.elementVariable
        if (this.formData.completionCondition) {
          const completionCondition = this.modeler.get('moddle').create('bpmn:Expression', { body: this.formData.completionCondition })
          loopCharacteristics['completionCondition'] = completionCondition
        }
        this.updateProperties({ loopCharacteristics: loopCharacteristics })
      } else {
        delete this.element.businessObject.loopCharacteristics
      }
    },
    save() {
      var flag = false;
      this.$refs['form'].validate(valid => {
        if (!valid) return
        this.updateElement()
        flag = true
      })
      return flag;
    },
    clear(){
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style scoped>
.muti-instance .el-form-item {
  margin-bottom: 22px;
}
</style>
