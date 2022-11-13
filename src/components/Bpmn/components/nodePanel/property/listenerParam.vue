<template>
  <div>
    <a-button type="primary" class="editable-add-btn" @click="handleParamEditableAdd" style="margin-bottom: 8px">新增</a-button>
    <a-table :rowKey='(record,index)=>{return index}' :dataSource="list" :columns="columns" >
      <template slot="type" slot-scope="text, record">
        <a-select :default-value="text"  v-model="record.type" style="width: 120px">
          <a-select-option value="stringValue">
            字符串
          </a-select-option>
          <a-select-option value="expression">
            表达式
          </a-select-option>
        </a-select>
      </template>
      <template slot="name" slot-scope="text, record">
        <a-input  v-model:value="record.name" placeholder="请输入名称" />
      </template>
      <template slot="value" slot-scope="text, record">
        <a-input  v-model:value="record.value" placeholder="请输入值" />
      </template>
      <template slot="action" slot-scope="text, record,index">
        <a-popconfirm
            title="是否删除?"
            @confirm="() => onParamDelete(index)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>
// import mixinXcrud from '../../../common/mixinXcrud'
export default {
  // mixins: [mixinXcrud],
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: [
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: {
            customRender: 'type',
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
          title: '值',
          dataIndex: 'value',
          key: 'value',
          scopedSlots: {
            customRender: 'value',
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
  methods: {
    onParamDelete(index){
      this.list.splice(index, 1);
    },
    handleParamEditableAdd(){
      this.list.push({
        name:"",
        type:"stringValue",
        value:""
      })
    },
    getParams() {
      if (this.list === undefined || this.list.length === 0){
        return [];
      }
      var flag = true
      this.list.forEach(item =>{
        if (item.name === "" || item.value === ""){
          flag = false;
        }
      })
      if (flag){
        return  this.list;
      } else {
        return undefined
      }
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
