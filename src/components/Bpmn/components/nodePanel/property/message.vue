<template>
  <div>
    <a-button type="primary" class="editable-add-btn" @click="handleEditableAdd" style="margin-bottom: 8px">新增</a-button>

    <a-table :rowKey='(record,index)=>{return index}' :dataSource="formData.messages" :columns="columns" >
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
    messages: {
      type: Array,
      default:() => []
    },
  },
  data() {
    return {
      rootElements:undefined,
      signalIds:[],
      formData: {
        messages: this.messages
      },
      columns: [
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
    this.getMessageElements();
  },
  methods: {
    handleId(row){
      var toRepeat = []
      this.formData.messages.forEach(item=>{
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
        if (item.$type==='bpmn:Message' && item.id === id){
          this.formData.messages.splice(index, 1);
          this.rootElements.splice(i, 1);
        }
      }
    },
    handleEditableAdd(){
      this.formData.messages.push({
        id: '',
        name: ""
      })
    },
    updateElement() {
      let messageElements = this.getMessageElementIds()
      this.formData.messages.forEach(item => {
        var toRepeat = []
        if (toRepeat.indexOf(item.id)=== -1 && messageElements.indexOf(item.id) === -1){
          const messageRef = this.modeler.get('moddle').create("bpmn:Message",item);
          this.rootElements.push(messageRef);
        }
        toRepeat.push(item.id);

      })
    },
    saveMessage() {
      if (this.formData.messages === undefined || this.formData.messages.length === 0){
        return true;
      }
      var flag = true
      this.formData.messages.forEach(item =>{
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
