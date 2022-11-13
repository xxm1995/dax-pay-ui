<template>
  <div>
    <a-button type="primary" class="editable-add-btn" @click="handleEditableAdd" style="margin-bottom: 8px">新增</a-button>

    <a-table :rowKey='(record,index)=>{return index}' :dataSource="formData.executionListener" :columns="columns" >
      <template slot="event" slot-scope="text, record">
        <a-select :default-value="text" v-model="record.event" style="width: 120px">
          <a-select-option value="start">
            Start
          </a-select-option>
          <a-select-option value="end">
            End
          </a-select-option>
          <a-select-option value="take">
            Take
          </a-select-option>
        </a-select>
      </template>
      <template slot="type" slot-scope="text, record">
        <a-select :default-value="text" v-model="record.type" style="width: 120px">
          <a-select-option value="class">
            类
          </a-select-option>
          <a-select-option value="expression">
            表达式
          </a-select-option>
          <a-select-option value="delegateExpression">
            委托表达式
          </a-select-option>
        </a-select>
      </template>
      <template slot="className" slot-scope="text, record">
        <a-input  v-model:value="record.className" placeholder="请输入类名" />
      </template>
      <template slot="params" slot-scope="text, record,index">
        <a-badge :count="text?text.length:0">
          <a-button @click="configParam(index)">配置</a-button>
        </a-badge>
      </template>
      <template slot="action" slot-scope="text, record,index">
        <a-popconfirm
            title="是否删除?"
            @confirm="() => onDelete(index)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
    </a-table>

    <a-modal v-model:visible="listenerParamVisible" title="监听器参数" width="700px" :maskClosable="false" :closable="false">
      <template #footer>
        <a-button key="submit" type="primary" @click="handleListenerParam">关闭</a-button>
      </template>
      <listenerParam ref="listenerParam" :list="(formData.executionListener.length > 0 && nowIndex !== null) ? formData.executionListener[nowIndex].params:[]"  />
    </a-modal>

  </div>
</template>

<script>
import mixinPanel from '../../../common/mixinPanel'
import listenerParam from './listenerParam'
import { message } from 'ant-design-vue'

export default {
  components: { listenerParam },
  mixins: [mixinPanel],
  data() {
    return {
      listenerParamVisible: false,
      nowIndex:null,
      formData: {
        executionListener: []
      },
      columns: [
        {
          title: '事件',
          dataIndex: 'event',
          key: 'event',
          scopedSlots: {
            customRender: 'event',
          },
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: {
            customRender: 'type',
          },
        },
        {
          title: '类名',
          dataIndex: 'className',
          key: 'className',
          scopedSlots: {
            customRender: 'className',
          },
        },
        {
          title: '参数',
          dataIndex: 'params',
          key: 'params',
          scopedSlots: {
            customRender: 'params',
          },
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
    }
  },
  computed: {
  },
  mounted() {
    this.formData.executionListener = this.element.businessObject.extensionElements?.values
      .filter(item => item.$type === 'flowable:ExecutionListener')
      .map(item => {
        let type
        if ('class' in item) type = 'class'
        if ('expression' in item) type = 'expression'
        if ('delegateExpression' in item) type = 'delegateExpression'
        return {
          event: item.event,
          type: type,
          className: item[type],
          params: item.fields?.map(field => {
            let fieldType
            if ('stringValue' in field) fieldType = 'stringValue'
            if ('expression' in field) fieldType = 'expression'
            return {
              name: field.name,
              type: fieldType,
              value: field[fieldType]
            }
          }) ?? []
        }
      }) ?? []
  },
  methods: {
    onDelete(index){
      this.formData.executionListener.splice(index, 1);
    },
    handleEditableAdd(){
      this.formData.executionListener.push({
        event: 'start',
        className: '',
        type: "class",
        params: [],
      })
    },
    handleListenerParam(){
      if (this.nowIndex === null){
        return;
      }
      var params = this.$refs.listenerParam.getParams();

      if (params === undefined){
        message.error("请填写完整")
      } else {
        this.formData.executionListener[this.nowIndex].params = params
        this.listenerParamVisible = false
      }

    },
    configParam(index) {
      this.nowIndex = index
      const nowObj = this.formData.executionListener[index]
      if (!nowObj.params) {
        nowObj.params = []
      }
      this.listenerParamVisible = true
    },
    updateElement() {
      if (this.formData.executionListener?.length) {
        let extensionElements = this.element.businessObject.get('extensionElements')
        if (!extensionElements) {
          extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
        }
        // 清除旧值
        extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:ExecutionListener') ?? []
        this.formData.executionListener.forEach(item => {
          const executionListener = this.modeler.get('moddle').create('flowable:ExecutionListener')
          executionListener['event'] = item.event
          executionListener[item.type] = item.className
          if (item.params && item.params.length) {
            item.params.forEach(field => {
              const fieldElement = this.modeler.get('moddle').create('flowable:Field')
              fieldElement['name'] = field.name
              fieldElement[field.type] = field.value
              // 注意：flowable.json 中定义的string和expression类为小写，不然会和原生的String类冲突，此处为hack
              // const valueElement = this.modeler.get('moddle').create(`flowable:${field.type}`, { body: field.value })
              // fieldElement[field.type] = valueElement
              executionListener.get('fields').push(fieldElement)
            })
          }
          extensionElements.get('values').push(executionListener)
        })
        this.updateProperties({ extensionElements: extensionElements })
      } else {
        const extensionElements = this.element.businessObject[`extensionElements`]
        if (extensionElements) {
          extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:ExecutionListener') ?? []
        }
      }
    },
    closeDialog() {
      var flag = true;
      //校验
      this.formData.executionListener.forEach(item => {
        if (!item.className || item.className === "" || item.className.length <= 0){
          flag = false;
        }
      })
      if (flag){
        //更新信息
        this.updateElement()
      }
      return flag;
    }
  }
}
</script>

<style lang="less" scoped>
input {
  &::placeholder {
    color: #e15d5d;
  }
}


</style>
