<template>
  <div>
    <a-button type="primary" class="editable-add-btn" @click="handleEditableAdd" style="margin-bottom: 8px">新增</a-button>

    <a-table :rowKey='(record,index)=>{return index}' :dataSource="formData.signal" :columns="columns" >
      <template slot="scope" slot-scope="text, record">
        <a-select :default-value="text" v-model="record.scope" style="width: 120px">
          <a-select-option value="global">
            全局
          </a-select-option>
          <a-select-option value="processInstance">
            流程实例
          </a-select-option>
        </a-select>
      </template>
      <template slot="id" slot-scope="text, record">
        <a-input  v-model:value="record.id" :placeholder="record.placeholder?record.placeholder:'请输入id'" @blur="handleId(record)"/>
      </template>
      <template slot="name" slot-scope="text, record">
        <a-input  v-model:value="record.name" placeholder="请输入名称" />
      </template>
      <template slot="action" slot-scope="text, record,index">
        <a-popconfirm
            title="是否删除?"
            @confirm="() => onDelete(index,record.id)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>
import mixinPanel from '../../../common/mixinPanel'
export default {
  mixins: [mixinPanel],
  props:{
    signals: {
      type: Array,
      default:() => []
    },
  },
  data() {
    return {
      rootElements:undefined,
      signalIds:[],
      formData: {
        signal: this.signals
      },
      columns: [
        {
          title: '作用域',
          dataIndex: 'scope',
          key: 'scope',
          scopedSlots: {
            customRender: 'scope',
          },
        },
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id',
          scopedSlots: {
            customRender: 'id',
          },
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: {
            customRender: 'name',
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
    this.getSignalElements();
  },
  methods: {
    handleId(row){
      var toRepeat = []
      this.formData.signal.forEach(item=>{
        if (toRepeat.indexOf(row.id) !== -1){
          row.id=undefined;
          row.placeholder = "id不能相同";
        } else {
          toRepeat.push(item.id)
        }
      })
    },
    onDelete(index,id){
      this.rootElements = this.modeler.getDefinitions().rootElements;

      for (let i = 0; i < this.rootElements.length; i++) {
        var item = this.rootElements[i]
        if (item.$type==='bpmn:Signal' && item.id === id){
          this.formData.signal.splice(index, 1);
          this.rootElements.splice(i, 1);
        }
      }
    },
    handleEditableAdd(){
      this.formData.signal.push({
        scope: 'global',
        id: '',
        name: ""
      })
    },
    updateElement() {
      let signalElements = this.getSignalElementIds()
      this.formData.signal.forEach(item => {
        var toRepeat = []
        if (toRepeat.indexOf(item.id)=== -1 && signalElements.indexOf(item.id) === -1){
          // const signalRef = this.modeler.get('moddle').create("bpmn:Signal", item);
          const signalRef = this.modeler.get('moddle').create("bpmn:Signal");
          signalRef['id']=item.id;
          signalRef['name']=item.name
          signalRef.$attrs['flowable:scope']=item.scope
          this.rootElements.push(signalRef);
        }
        toRepeat.push(item.id);

      })
    },
    saveSignal() {
      if (this.formData.signal === undefined || this.formData.signal.length === 0){
        return true;
      }
      var flag = true
      this.formData.signal.forEach(item =>{
        if (item.name === "" || item.id === ""){
          flag = false;
        }
      })
      if (flag){
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
