<template>
  <div ref="propertyPanel" class="property-panel" v-show="getComponent">
    <div v-if="nodeName" style="display: none">{{ nodeName }}</div>
    <component
      :is="getComponent"
      v-if="element"
      :filters="filters"
      :element="element"
      :modeler="modeler"
      :users="users"
      :groups="groups"
      :categories="categories"
      :categories-fields="categoriesFields"
      :associate-form-config="associateFormConfig"
      :associate-form-data-options="associateFormDataOptions"
      :assignee-data-source="assigneeDataSource"
      :due-date-data-source="dueDateDataSource"
      :follow-up-date-data-source="followUpDateDataSource"
      :initiator-data-source="initiatorDataSource"
      :skip-expression-data-source="skipExpressionDataSource"
      :condition-expression-data-source="conditionExpressionDataSource"
      :candidate-user-data-source="candidateUserDataSource"
      :candidate-group-data-source="candidateGroupDataSource"
      @showForm="showAssociateForm"
      @createForm="createAssociateForm"
    />
  </div>
</template>

<script>
import taskPanel from './components/nodePanel/task'
import startEndPanel from './components/nodePanel/startEnd'
import processPanel from './components/nodePanel/process'
import sequenceFlowPanel from './components/nodePanel/sequenceFlow'
import gatewayPanel from './components/nodePanel/gateway'
import { NodeName } from './lang/zh'

export default {
  name: 'PropertyPanel',
  components: { processPanel, taskPanel, startEndPanel, sequenceFlowPanel, gatewayPanel },
  props: {
    categoriesFields: {
      type: Object
    },
    filters: {
      type: Array
    },
    associateFormConfig: {
      type: Object
    },
    associateFormDataOptions: {
      type: Array,
      default: () => []
    },
    users: {
      type: Array,
      required: true
    },
    groups: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      required: true
    },
    modeler: {
      type: Object,
      required: true
    },
    initiatorDataSource: {
      type: Array,
      default: () => []
    },
    assigneeDataSource: {
      type: Array,
      default: () => []
    },
    dueDateDataSource: {
      type: Array,
      default: () => []
    },
    followUpDateDataSource: {
      type: Array,
      default: () => []
    },
    skipExpressionDataSource: {
      type: Array,
      default: () => []
    },
    conditionExpressionDataSource: {
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
      element: null,
      form: {
        id: '',
        name: '',
        color: null
      },
      roles: [
        { value: 'manager', label: '经理' },
        { value: 'personnel', label: '人事' },
        { value: 'charge', label: '主管' }
      ]
    }
  },
  computed: {
    getComponent () {
      const type = this.element?.type
      if (['bpmn:IntermediateThrowEvent', 'bpmn:StartEvent', 'bpmn:EndEvent'].includes(type)) {
        return 'startEndPanel'
      }
      if ([
        'bpmn:UserTask',
        'bpmn:Task',
        'bpmn:SendTask',
        'bpmn:ReceiveTask',
        'bpmn:ManualTask',
        'bpmn:BusinessRuleTask',
        'bpmn:ServiceTask',
        'bpmn:ScriptTask'
        // 'bpmn:CallActivity',
        // 'bpmn:SubProcess'
      ].includes(type)) {
        return 'taskPanel'
      }
      if (type === 'bpmn:SequenceFlow') {
        return 'sequenceFlowPanel'
      }
      if ([
        'bpmn:InclusiveGateway',
        'bpmn:ExclusiveGateway',
        'bpmn:ParallelGateway',
        'bpmn:EventBasedGateway'
      ].includes(type)) {
        return 'gatewayPanel'
      }
      if (type === 'bpmn:Process') {
        return 'processPanel'
      }
      return null
    },
    nodeName () {
      if (this.element) {
        const bizObj = this.element.businessObject
        const type = bizObj?.eventDefinitions
          ? bizObj.eventDefinitions[0].$type
          : bizObj.$type
        var nodeTitle = NodeName[type] || type
        this.$emit('change', nodeTitle)
        return nodeTitle
      }
      return ''
    }
  },
  mounted () {
    this.handleModeler()
  },
  methods: {
    handleModeler () {
      this.modeler.on('root.added', e => {
        if (e.element.type === 'bpmn:Process') {
          this.element = null
          this.$nextTick().then(() => {
            this.element = e.element
          })
        }
      })
      this.modeler.on('element.click', e => {
        const { element } = e
        if (element.type === 'bpmn:Process') {
          this.element = element
        }
      })
      this.modeler.on('selection.changed', e => {
        // hack 同类型面板不刷新
        this.element = null
        const element = e.newSelection[0]
        if (element) {
          this.$nextTick().then(() => {
            this.element = element
          })
        } else {
        }
      })
    },
    showAssociateForm (formKey) {
      this.$emit('showForm', formKey)
    },
    createAssociateForm () {
      this.$emit('createForm')
    }
  }
}
</script>

<style lang="less">
.property-panel {
  padding: 20px 20px;
  // reset element css
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .el-form-item {
    margin-bottom: 6px;
  }
  .tab-table .el-form-item {
    margin-bottom: 16px;
  }
  .node-name{
    border-bottom: 1px solid #ccc;
    padding: 0 0 10px 20px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #444;
  }
}
</style>
