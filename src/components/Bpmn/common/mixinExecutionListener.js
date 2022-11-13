
import executionListener from '../components/nodePanel/property/executionListener'
import { message } from 'ant-design-vue'
export default {
  components: {
    executionListener
  },
  data() {
    return {
      executionListenerVisible:false,
      executionListenerLength: 0,
      dialogName: null
    }
  },
  methods: {
    computedExecutionListenerLength() {
      this.executionListenerLength = this.element.businessObject.extensionElements?.values?.length ?? 0
    },
    getExecutionListenerLength() {
      return this.element.businessObject.extensionElements?.values?.length ?? 0
    },
    handleExecutionListener(){
      var flag = this.$refs.executionListener.closeDialog();
      if (flag){
        this.computedExecutionListenerLength()
        this.executionListenerVisible = false;
      } else {
        message.error("请补充信息")
      }
    },
    handleShowExecutionListener() {
      this.executionListenerVisible = true;
    }
  }
}
