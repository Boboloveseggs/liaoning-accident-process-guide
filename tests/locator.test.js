const assert=require('node:assert/strict');
const data=require('../prototype/data/app-data.js');
const logic=require('../prototype/logic/navigation.js');

const cases=[
  {name:'已进入争议程序',answers:['yes'],expected:5},
  {name:'已收到事故认定书',answers:['no','yes'],expected:4},
  {name:'离场并等待责任认定',answers:['no','no','yes','yes'],expected:3},
  {name:'离场但尚未进入等待认定',answers:['no','no','yes','no'],expected:2},
  {name:'仍在现场且交警已到场',answers:['no','no','no','yes'],expected:1},
  {name:'事故刚发生且交警未到场',answers:['no','no','no','no'],expected:0}
];

for(const item of cases){
  const result=logic.runLocator(data.locatorQuestions,item.answers);
  assert.equal(result.stageIndex,item.expected,item.name);
}

const validation=logic.validateLocator(data.locatorQuestions,6);
assert.equal(validation.pathCount,6);
assert.deepEqual(validation.terminalStages,[0,1,2,3,4,5]);

for(const stageId of ['T00','T10','T20','T30','T40','T50']){
  const priority=logic.priorityForStage(data.actionPriorities,stageId);
  assert.ok(priority.key&&priority.label,`${stageId} 应有行动优先级`);
}

assert.equal(data.cities.length,14,'应覆盖辽宁14个地级市法院入口');
assert.ok(Object.values(data.ruleAudit).every(items=>items.length>0),'每个阶段应有关联审核规则');

console.log(`定位组合测试通过：${cases.length}条路径，覆盖6个阶段；辽宁城市入口：${data.cities.length}个。`);
