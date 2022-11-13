<template>
  <div>
    <a-button type="primary" class="editable-add-btn" @click="handleEditableAdd" style="margin-bottom: 8px">新增</a-button>

    <a-table :rowKey='(record,index)=>{return index}' :dataSource="formData.taskListener" :columns="columns" >
      <template slot="event" slot-scope="text, record">
        <a-select :default-value="text" v-model="record.event" style="width: 120px">
          <a-select-option value="create">
            Create
          </a-select-option>
          <a-select-option value="assignment">
            Assignment
          </a-select-option>
          <a-select-option value="complete">
            Complete
          </a-select-option>
          <a-select-option value="delete">
            Delete
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
      <listenerParam ref="listenerParam" :list="(formData.taskListener.length > 0 && nowIndex !== null) ? formData.taskListener[nowIndex].params:[]"  />
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
      dialogVisible: true,
      listenerParamVisible: false,
      nowIndex: null,
      formData: {
        taskListener: []
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
    this.formData.taskListener = this.element.businessObject.extensionElements?.values
      .filter(item => item.$type === 'flowable:TaskListener')
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
      this.formData.taskListener.splice(index, 1);
    },
    handleEditableAdd(){
      this.formData.taskListener.push({
        event: 'create',
        className: '',
        type: "class",
        params: [],
      })
    },
    configParam(index) {
      this.nowIndex = index
      const nowObj = this.formData.taskListener[index]
      if (!nowObj.params) {
        nowObj.params = []
      }
      this.listenerParamVisible = true
    },
    handleListenerParam(){
      if (this.nowIndex === null){
        return;
      }
      var params = this.$refs.listenerParam.getParams();

      if (params === undefined){
        message.error("请填写完整")
      } else {
        this.formData.taskListener[this.nowIndex].params = params
        this.listenerParamVisible = false
      }

    },
    finishConfigParam(param) {
      this.listenerParamVisible = false
      // hack 数量不更新问题
      const cache = this.formData.taskListener[this.nowIndex]
      cache.params = param
      this.$set(this.formData.taskListener[this.nowIndex], this.nowIndex, cache)
      this.nowIndex = null
    },
    updateElement() {
      if (this.formData.taskListener?.length) {
        let extensionElements = this.element.businessObject.get('extensionElements')
        if (!extensionElements) {
          extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements')
        }
        // 清除旧值
        extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:TaskListener') ?? []
        this.formData.taskListener.forEach(item => {
          const taskListener = this.modeler.get('moddle').create('flowable:TaskListener')
          taskListener['event'] = item.event
          taskListener[item.type] = item.className
          if (item.params && item.params.length) {
            item.params.forEach(field => {
              const fieldElement = this.modeler.get('moddle').create('flowable:Field')
              fieldElement['name'] = field.name
              fieldElement[field.type] = field.value
              // 注意：flowable.json 中定义的string和expression类为小写，不然会和原生的String类冲突，此处为hack
              // const valueElement = this.modeler.get('moddle').create(`flowable:${field.type}`, { body: field.value })
              // fieldElement[field.type] = valueElement
              taskListener.get('fields').push(fieldElement)
            })
          }
          extensionElements.get('values').push(taskListener)
        })
        this.updateProperties({ extensionElements: extensionElements })
      } else {
        const extensionElements = this.element.businessObject[`extensionElements`]
        if (extensionElements) {
          extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:TaskListener') ?? []
        }
      }
    },
    closeDialog() {
      var flag = true;
      //校验
      this.formData.taskListener.forEach(item => {
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
