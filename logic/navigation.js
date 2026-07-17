(function(root,factory){
  const logic=factory();
  if(typeof module==='object'&&module.exports)module.exports=logic;
  root.LIAONING_APP_LOGIC=logic;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function resolveLocator(questions,step,answer){
    if(!questions||!questions[step])throw new Error(`未知定位问题：${step}`);
    if(answer!=='yes'&&answer!=='no')throw new Error(`无效回答：${answer}`);
    const result=questions[step][answer];
    if(typeof result!=='number'&&typeof result!=='string')throw new Error(`问题 ${step} 缺少 ${answer} 分支`);
    return result;
  }

  function runLocator(questions,answers,start='dispute'){
    let step=start,used=0;
    while(typeof step==='string'){
      if(used>=answers.length)throw new Error(`定位路径在 ${step} 缺少回答`);
      step=resolveLocator(questions,step,answers[used++]);
      if(used>20)throw new Error('定位路径可能存在循环');
    }
    return {stageIndex:step,answersUsed:used};
  }

  function enumerateLocatorPaths(questions,start='dispute'){
    const paths=[];
    function walk(step,answers,visited){
      if(typeof step==='number'){paths.push({answers,stageIndex:step});return}
      if(visited.has(step))throw new Error(`定位问题存在循环：${step}`);
      const nextVisited=new Set(visited);nextVisited.add(step);
      for(const answer of ['yes','no'])walk(resolveLocator(questions,step,answer),[...answers,answer],nextVisited);
    }
    walk(start,[],new Set());
    return paths;
  }

  function validateLocator(questions,stageCount){
    const paths=enumerateLocatorPaths(questions);
    const terminals=new Set();
    for(const path of paths){
      if(!Number.isInteger(path.stageIndex)||path.stageIndex<0||path.stageIndex>=stageCount)throw new Error(`无效阶段索引：${path.stageIndex}`);
      terminals.add(path.stageIndex);
    }
    return {pathCount:paths.length,terminalStages:[...terminals].sort((a,b)=>a-b),paths};
  }

  function priorityForStage(priorities,stageId){
    return priorities[stageId]||{key:'today',label:'今天建议完成'};
  }

  return {resolveLocator,runLocator,enumerateLocatorPaths,validateLocator,priorityForStage};
});
