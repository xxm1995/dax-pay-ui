import showConfig from '../flowable/showConfig'

export default {
  props: {
    filters: {
      type: Array,
      default: () => []
    },
    associateFormConfig: {
      type: Object,
      default: () => {
        return {
          enable: false, // 此项为false，后设置两项均无效
          isPreview: true,
          isCreate: true
        }
      }
    },
    associateFormDataOptions: {
      type: Array,
      default: () => []
    },
    modeler: {
      type: Object,
      required: true
    },
    element: {
      type: Object,
      required: true
    },
    categories: {
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
    }
  },
  watch: {
    'formData.id': function (val) {
      this.updateProperties({ id: val })
    },
    'formData.name': function (val) {
      this.updateProperties({ name: val })
    },
    'formData.documentation': function (val) {
      if (!val) {
        this.updateProperties({ documentation: [] })
        return
      }
      const documentationElement = this.modeler.get('moddle').create('bpmn:Documentation', { text: val })
      this.updateProperties({ documentation: [documentationElement] })
    }
  },
  methods: {
    updateProperties (properties) {
      const modeling = this.modeler.get('modeling')
      modeling.updateProperties(this.element, properties)
    },
    getSignalElements () {
      const signals = []
      this.rootElements = this.modeler.getDefinitions().rootElements
      if (this.rootElements.length > 0) {
        this.rootElements.forEach(item => {
          if (item.$type === 'bpmn:Signal') {
            signals.push(item)
          }
        })
      }
      return signals
    },
    getSignalElementIds () {
      var signals = []
      this.rootElements = this.modeler.getDefinitions().rootElements
      if (this.rootElements.length > 0) {
        this.rootElements.forEach(item => {
          if (item.$type === 'bpmn:Signal') {
            signals.push(item.id)
          }
        })
      }
      return signals
    },
    getMessageElements () {
      var signals = []
      this.rootElements = this.modeler.getDefinitions().rootElements
      if (this.rootElements.length > 0) {
        this.rootElements.forEach(item => {
          if (item.$type === 'bpmn:Message') {
            signals.push(item)
          }
        })
      }
      return signals
    },
    getMessageElementIds () {
      var signals = []
      this.rootElements = this.modeler.getDefinitions().rootElements
      if (this.rootElements.length > 0) {
        this.rootElements.forEach(item => {
          if (item.$type === 'bpmn:Message') {
            signals.push(item.id)
          }
        })
      }
      return signals
    },
    /**
     * 判断当前节点是否是执行类型的节点
     * @param name
     * @returns {boolean}
     */
    filter (name) {
      return this.filters.indexOf(name) !== -1
    },
    showAssociateForm (formKey) {
      this.$emit('showForm', formKey)
    },
    createAssociateForm () {
      this.$emit('createForm')
    }
  },
  computed: {
    elementType () {
      const bizObj = this.element.businessObject
      return bizObj.eventDefinitions
        ? bizObj.eventDefinitions[0].$type
        : bizObj.$type
    },
    showConfig () {
      return showConfig[this.elementType] || {}
    }
  }
}
