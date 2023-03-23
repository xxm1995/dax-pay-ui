<template>
  <div class="flow-containers" style="height: 100%">
    <a-layout style="height: 100%">
      <a-layout-header theme="light" style="border-bottom: 1px solid rgb(218 218 218); height: auto; background-color: #fff">
        <div v-if="!isView" style="display: flex; padding: 5px 0px; justify-content: space-between">
          <a-space>
            <a-upload v-if="isEdit" name="file" action="" accept=".bpmn,.xml" :showUploadList="false" :beforeUpload="openBpmn">
              <a-tooltip effect="dark" title="打开" placement="bottom">
                <a-button>
                  <Icon icon="ant-design:folder-open-outlined" />
                </a-button>
              </a-tooltip>
            </a-upload>
            <a-tooltip v-if="isEdit" effect="dark" title="清空" placement="bottom">
              <a-button @click="clearDiagram">
                <Icon icon="ant-design:delete-outlined" />
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="自适应屏幕" placement="bottom">
              <a-button @click="fitViewport">
                <Icon icon="ant-design:eye-outlined" />
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="放大" placement="bottom">
              <a-button @click="zoomViewport(true)">
                <Icon icon="ant-design:zoom-in-outlined" />
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="缩小" placement="bottom">
              <a-button @click="zoomViewport(false)">
                <Icon icon="ant-design:zoom-out-outlined" />
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="撤销(增删操作有效)" placement="bottom">
              <a-button @click="undo">
                <Icon icon="ant-design:undo-outlined" />
              </a-button>
            </a-tooltip>
            <a-tooltip title="重做(增删操作有效)" placement="bottom">
              <a-button @click="redo">
                <Icon icon="ant-design:redo-outlined" />
              </a-button>
            </a-tooltip>
            <slot name="header-left"></slot>
          </a-space>
          <a-space>
            <slot name="header-right"></slot>
            <a-button @click="showXML" preIcon="ant-design:eye-outlined"> XML </a-button>
            <a-button @click="downXML(true)" preIcon="ant-design:download-outlined">XML </a-button>
            <a-button @click="downImg('svg', true)" preIcon="ant-design:download-outlined"> SVG </a-button>
            <a-button type="primary" @click="saveXML" v-if="isEdit" preIcon="ant-design:cloud-upload-outlined"> 保存 </a-button>
            <a-button type="danger" @click="cancel" preIcon="ant-design:close-outlined"> 关闭 </a-button>
          </a-space>
        </div>
      </a-layout-header>
      <a-layout style="align-items: stretch">
        <a-layout-content style="padding: 0; margin-top: 10px">
          <div id="canvas" ref="canvas" class="canvas"></div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider
        style="background: #fff; min-width: 40px; width: 40px; max-width: 40px; border-left: 1px solid #eeeeee; box-shadow: 0 0 8px #cccccc"
      >
        <div style="width: 100%; text-align: center" @click="panelVisible = true">
          <i class="iconfont icon-left-graph" style="font-size: 32px" v-if="panelExist"></i>
        </div>
        <a-drawer
          width="400px"
          placement="right"
          :closable="false"
          :visible="panelVisible && panelExist"
          :get-container="false"
          :wrap-style="{ position: 'absolute' }"
        >
          <template #title>
            <i class="iconfont icon-right-graph" style="font-size: 32px" @click="panelVisible = false"></i><span>{{ panelTitle }}</span>
          </template>
          <panel
            v-if="modeler"
            ref="panel"
            :filters="panelFilters"
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
            @change="handlePanelChange"
          />
        </a-drawer>
      </a-layout-sider>
    </a-layout>
    <!--  xml预览  -->
    <basic-modal v-bind="$attrs" width="60%" title="XML" :visible="codeVisible" @cancel="codeVisible = false">
      <div>
        <code-editor readonly v-model:value="xmlCode" :mode="MODE.XML" />
      </div>
      <template #footer> </template>
    </basic-modal>
  </div>
</template>

<script lang="ts" setup>
  import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

  import { ref } from 'vue'
  import Icon from '/@/components/Icon'
  import CodeEditor from '/@/components/CodeEditor/src/CodeEditor.vue'
  import { MODE } from '/@/components/CodeEditor'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'
  import useProcessDesign from '/@/views/modules/bpm/design/useProcessDesign'
  import { $ref } from '@vue-macros/reactivity-transform/macros'

  // 挂载元素
  let canvas = ref<any>()
  const emit = defineEmits(['save', 'cancel'])

  const {
    modeler,
    isEdit,
    isView,
    codeVisible,
    xmlCode,
    zoom,
    renderer,
    undo,
    redo,
    showXML,
    saveXML,
    downXML,
    downImg,
    openBpmn,
    downloadFile,
    cancel,
    fitViewport,
    zoomViewport,
    clearDiagram,
  } = useProcessDesign('#canvas', emit)

  let panelVisible = $ref(false)
  let panelExist = $ref(false)

  defineExpose({
    renderer,
  })
</script>

<style lang="less" scoped>
  .canvas {
    width: 100%;
    height: 100%;
  }
  .view-mode {
    .ant-layout-header,
    .ant-layout-sider,
    :deep(.djs-palette),
    :deep(.bjs-powered-by) {
      display: none;
    }
  }

  html,
  body,
  #app {
    height: 100%;
  }

  .flow-containers {
    // background-color: #ffffff;
    width: 100%;
    height: 100%;
    .canvas {
      width: 100%;
      height: 100%;
    }
    .panel {
      position: absolute;
      right: 0;
      top: 50px;
      //width: 400px;
    }
    .load {
      margin-right: 10px;
    }

    .djs-palette {
      left: 0 !important;
      top: 0;
      border-top: none;
    }

    .djs-container svg {
      min-height: 650px;
    }
  }
  :deep(.ant-layout-sider:hover) {
    background: #0a97ce25 !important;
  }

  :deep(.ant-layout-sider) {
    z-index: 2;
  }

  :deep(.CodeMirror) {
    border: 1px solid #eee;
  }

  :deep(.djs-container) {
    background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+)
      repeat !important;
  }
</style>
