<template>
  <basic-modal
    defaultFullscreen
    v-bind="$attrs"
    :width="750"
    :visible="true"
  >
    <process-viewer
      ref="processViewer"
      :height="750"
      :instance="instance"
      :node-task-list="nodeTaskList"
      :flow-node-list="flowNodeList"
      :xml="bpmModel.modelEditorXml"
    />
  </basic-modal>
</template>

<script lang="ts" setup>
  import ProcessViewer from '/@/components/Bpmn/ProcessViewer.vue'
  import { $ref } from 'vue/macros'
  import BasicModal from '/@/components/Modal/src/BasicModal.vue'

  let instance = $ref({
    id: '1573964159274438656',
    createTime: '2022-09-25 17:14:33',
    lastModifiedTime: '2022-09-25 17:14:33',
    version: 0,
    instanceId: '1573964159266050048',
    instanceName: '分支测试[小小明]',
    modelId: '1570336760533303296',
    defId: 'lffp56gv:5:1570336922374717440',
    defName: '分支测试',
    modelType: null,
    startUserId: '1399985191002447872',
    startUserName: '小小明',
    state: 'running',
    result: null,
    startTime: '2022-09-25 17:14:33',
    endTime: null,
    formVariables: null,
  })
  let nodeTaskList = $ref({
    tx: [
      {
        id: '1573964205348868096',
        createTime: '2022-09-25 17:14:44',
        lastModifiedTime: '2022-09-25 17:15:42',
        version: 1,
        taskId: '1573964159463182338',
        executionId: '1573964159458988032',
        instanceId: '1573964159266050048',
        instanceName: '分支测试[小小明]',
        defName: '分支测试',
        nodeId: 'tx',
        nodeName: '填写',
        state: 'running',
        result: null,
        reason: null,
        startTime: '2022-09-25 17:14:33',
        endTime: null,
        userId: '1414143554414059520',
        userName: '小小明1995',
        startUserId: '1399985191002447872',
        startUserName: '小小明',
        formVariables: {},
      },
    ],
  })
  let flowNodeList = $ref([
    {
      activityId: 'Event_05npxwe',
      activityType: 'startEvent',
      running: false,
    },
    {
      activityId: 'Flow_1sb4bbn',
      activityType: 'sequenceFlow',
      running: false,
    },
    {
      activityId: 'tx',
      activityType: 'userTask',
      running: false,
    },
  ])
  let bpmModel = $ref({
    id: '1570336760533303296',
    createTime: '2022-09-15 17:00:34',
    lastModifiedTime: '2022-09-15 17:01:13',
    version: 1,
    name: '分支测试',
    modelType: 'OA',
    formId: null,
    publish: 'published',
    enable: true,
    deployId: '1570336922060144640',
    defId: 'lffp56gv:5:1570336922374717440',
    defKey: 'lffp56gv',
    defName: '分支测试',
    defRemark: null,
    mainProcess: true,
    processVersion: 5,
    modelEditorXml:
      '<?xml version="1.0" encoding="UTF-8"?>\n<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsd="http://www.w3.org/2001/XMLSchema" targetNamespace="http://www.flowable.org/processdef">\n  <process id="lffp56gv" name="分支测试">\n    <startEvent id="Event_05npxwe">\n      <outgoing>Flow_1sb4bbn</outgoing>\n    </startEvent>\n    <sequenceFlow id="Flow_1sb4bbn" sourceRef="Event_05npxwe" targetRef="tx" />\n    <userTask id="tx" name="填写">\n      <incoming>Flow_1sb4bbn</incoming>\n      <outgoing>Flow_0c60bsu</outgoing>\n    </userTask>\n    <sequenceFlow id="Flow_0c60bsu" sourceRef="tx" targetRef="Gateway_0k9yetc" />\n    <sequenceFlow id="Flow_1l7upty" sourceRef="Gateway_0k9yetc" targetRef="dlb">\n      <conditionExpression xsi:type="tFormalExpression">${nextNode == \'dlb\'}</conditionExpression>\n    </sequenceFlow>\n    <sequenceFlow id="Flow_06lyv1u" sourceRef="Gateway_0k9yetc" targetRef="xlb">\n      <conditionExpression xsi:type="tFormalExpression">${nextNode == \'xlb\'}</conditionExpression>\n    </sequenceFlow>\n    <sequenceFlow id="Flow_0b404pf" sourceRef="dlb" targetRef="Gateway_0y33msz" />\n    <inclusiveGateway id="Gateway_0y33msz">\n      <incoming>Flow_0b404pf</incoming>\n      <incoming>Flow_1vlmw9l</incoming>\n      <outgoing>Flow_1xiiwtx</outgoing>\n    </inclusiveGateway>\n    <sequenceFlow id="Flow_1vlmw9l" sourceRef="xlb" targetRef="Gateway_0y33msz" />\n    <exclusiveGateway id="Gateway_0k9yetc" name="网关">\n      <incoming>Flow_0c60bsu</incoming>\n      <outgoing>Flow_1l7upty</outgoing>\n      <outgoing>Flow_06lyv1u</outgoing>\n    </exclusiveGateway>\n    <sequenceFlow id="Flow_1xiiwtx" sourceRef="Gateway_0y33msz" targetRef="Activity_0c9kfh4" />\n    <endEvent id="Event_0t8uxuu">\n      <incoming>Flow_1tsxjyl</incoming>\n    </endEvent>\n    <sequenceFlow id="Flow_1tsxjyl" sourceRef="Activity_0c9kfh4" targetRef="Event_0t8uxuu" />\n    <userTask id="dlb" name="大老板">\n      <incoming>Flow_1l7upty</incoming>\n      <outgoing>Flow_0b404pf</outgoing>\n    </userTask>\n    <userTask id="xlb" name="小老板">\n      <incoming>Flow_06lyv1u</incoming>\n      <outgoing>Flow_1vlmw9l</outgoing>\n    </userTask>\n    <userTask id="Activity_0c9kfh4" name="备注">\n      <incoming>Flow_1xiiwtx</incoming>\n      <outgoing>Flow_1tsxjyl</outgoing>\n    </userTask>\n  </process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_flow">\n    <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="lffp56gv">\n      <bpmndi:BPMNEdge id="Flow_1tsxjyl_di" bpmnElement="Flow_1tsxjyl">\n        <di:waypoint x="370" y="-40" />\n        <di:waypoint x="492" y="-40" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_1xiiwtx_di" bpmnElement="Flow_1xiiwtx">\n        <di:waypoint x="155" y="-40" />\n        <di:waypoint x="270" y="-40" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_1vlmw9l_di" bpmnElement="Flow_1vlmw9l">\n        <di:waypoint x="-40" y="70" />\n        <di:waypoint x="130" y="70" />\n        <di:waypoint x="130" y="-15" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_0b404pf_di" bpmnElement="Flow_0b404pf">\n        <di:waypoint x="-10" y="-180" />\n        <di:waypoint x="130" y="-180" />\n        <di:waypoint x="130" y="-65" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_06lyv1u_di" bpmnElement="Flow_06lyv1u">\n        <di:waypoint x="-220" y="-35" />\n        <di:waypoint x="-220" y="70" />\n        <di:waypoint x="-140" y="70" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_1l7upty_di" bpmnElement="Flow_1l7upty">\n        <di:waypoint x="-220" y="-85" />\n        <di:waypoint x="-220" y="-180" />\n        <di:waypoint x="-110" y="-180" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_0c60bsu_di" bpmnElement="Flow_0c60bsu">\n        <di:waypoint x="-300" y="-60" />\n        <di:waypoint x="-245" y="-60" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id="Flow_1sb4bbn_di" bpmnElement="Flow_1sb4bbn">\n        <di:waypoint x="-452" y="-60" />\n        <di:waypoint x="-400" y="-60" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id="Event_05npxwe_di" bpmnElement="Event_05npxwe">\n        <dc:Bounds x="-488" y="-78" width="36" height="36" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Activity_06lpzky_di" bpmnElement="tx">\n        <dc:Bounds x="-400" y="-100" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Gateway_0ji3ola_di" bpmnElement="Gateway_0y33msz">\n        <dc:Bounds x="105" y="-65" width="50" height="50" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Gateway_052rzhs_di" bpmnElement="Gateway_0k9yetc" isMarkerVisible="true">\n        <dc:Bounds x="-245" y="-85" width="50" height="50" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x="-192" y="-67" width="23" height="14" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Event_0t8uxuu_di" bpmnElement="Event_0t8uxuu">\n        <dc:Bounds x="492" y="-58" width="36" height="36" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Activity_03s9cvh_di" bpmnElement="dlb">\n        <dc:Bounds x="-110" y="-220" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Activity_0jagpnz_di" bpmnElement="xlb">\n        <dc:Bounds x="-140" y="30" width="100" height="80" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id="Activity_1v7ieyj_di" bpmnElement="Activity_0c9kfh4">\n        <dc:Bounds x="270" y="-80" width="100" height="80" />\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</definitions>\n',
    remark: '',
  })
</script>

<style scoped></style>
