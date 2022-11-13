export default {
  'bpmn:EndEvent': {},
  'bpmn:StartEvent': {
    initiator: true,
    formKey: true
  },
  'bpmn:SequenceFlow': {
    skipExpression: true,
    conditionExpression: true
  },
  'bpmn:UserTask': {
    userType: true,
    dataType: true,
    assignee: true,
    candidateUsers: true,
    candidateGroups: true,
    async: true,
    priority: true,
    formKey: true,
    skipExpression: true,
    dueDate: true,
    followUpDate:true,
    taskListener: true
  },
  'bpmn:ServiceTask': {
    async: true,
    skipExpression: true,
    isForCompensation: true,
    triggerable: true,
    class: true
  },
  'bpmn:ScriptTask': {
    async: true,
    isForCompensation: true,
    // asyncBefore: true,
    // asyncAfter: true,
    // exclusive: true,
    // scriptFormat: true,
    // scriptType: true,
    // script: true,
    // resource: true,
    resultVariable: true,
    autoStoreVariables: true
  },
  'bpmn:ManualTask': {
    async: true,
    isForCompensation: true
  },
  'bpmn:ReceiveTask': {
    async: true,
    isForCompensation: true
  },
  'bpmn:SendTask': {
    async: true,
    isForCompensation: true
  },
  'bpmn:BusinessRuleTask': {
    async: true,
    isForCompensation: true,
    ruleVariablesInput: true,
    rules: true,
    resultVariable: true,
    exclude: true
  }
}
