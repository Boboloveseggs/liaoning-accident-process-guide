(function(root,factory){
  const data=factory();
  if(typeof module==='object'&&module.exports)module.exports=data;
  root.LIAONING_APP_DATA=data;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const SOURCE_ROAD='https://www.moj.gov.cn/pub/sfbgw/flfggz/flfggzbmgz/201709/t20170919_146045.html';
  const SOURCE_INS='https://xzfg.moj.gov.cn/front/law/detail?LawID=1245&Query=';
  const SOURCE_HOLIDAY='https://big5.www.gov.cn/gate/big5/www.gov.cn/zhengce/zhengceku/202511/content_7047091.htm';

  const locatorQuestions={
    dispute:{text:'现在是否已经进入责任认定复核、赔偿诉讼，或出现明显履行争议？',yes:5,no:'received',order:'1 / 4'},
    received:{text:'是否已经收到道路交通事故认定书？',yes:4,no:'leftScene',order:'2 / 4'},
    leftScene:{text:'你现在是否已经离开事故现场？',yes:'registered',no:'policeArrived',order:'3 / 4'},
    registered:{text:'交警是否已经登记事故，并告知你等待调查或责任认定？',yes:3,no:2,order:'4 / 4'},
    policeArrived:{text:'交警是否已经到达事故现场？',yes:1,no:0,order:'4 / 4'}
  };

  const actionPriorities={
    T00:{key:'immediate',label:'立即处理'},
    T10:{key:'immediate',label:'立即处理'},
    T20:{key:'ongoing',label:'持续进行'},
    T30:{key:'ongoing',label:'持续进行'},
    T40:{key:'today',label:'今天建议完成'},
    T50:{key:'deadline',label:'期限前完成'}
  };

  const cities=[
    ['shenyang','沈阳','sy'],['dalian','大连','dl'],['anshan','鞍山','as'],['fushun','抚顺','fs'],
    ['benxi','本溪','bx'],['dandong','丹东','dd'],['jinzhou','锦州','jz'],['yingkou','营口','yk'],
    ['fuxin','阜新','fx'],['liaoyang','辽阳','ly'],['tieling','铁岭','tl'],['chaoyang','朝阳','cy'],
    ['panjin','盘锦','pj'],['huludao','葫芦岛','hld']
  ].map(item=>({id:item[0],name:item[1],courtUrl:`https://${item[2]}.lncourt.gov.cn/index.shtml`}));

  const officialServices={
    traffic:{name:'辽宁交通安全综合服务平台',short:'交警与车驾管',hotline:'122',url:'https://ln.122.gov.cn/',source:'公安部交通管理服务平台'},
    police:{name:'辽宁省公安厅',short:'公安政务',hotline:'110',url:'https://gat.ln.gov.cn/',source:'辽宁省公安厅'},
    court:{name:'辽宁省高级人民法院',short:'法院与诉讼服务',hotline:'024-12368',url:'https://ln.lncourt.gov.cn/index.shtml',source:'辽宁法院网'},
    courtOnline:{name:'人民法院在线服务网',short:'网上立案与案件服务',hotline:'12368',url:'https://zxfw.court.gov.cn/',source:'最高人民法院'},
    legalAid:{name:'12348辽宁法网',short:'法律咨询与法律援助',hotline:'12348',url:'https://ln.12348.gov.cn/',source:'辽宁省司法厅'},
    justice:{name:'辽宁省司法厅',short:'司法行政与服务地图',hotline:'12348',url:'https://sft.ln.gov.cn/',source:'辽宁省司法厅'},
    insurance:{name:'辽宁金融监管局',short:'保险咨询与消费投诉',hotline:'12378',url:'https://www.nfra.gov.cn/branch/liaoning/view/pages/index/index.html',source:'国家金融监督管理总局'}
  };

  const auditBase={reviewer:'项目维护者（文本核对）',checked:'2026-07-17',status:'已对照官方文本，待专业复核'};
  const ruleAudit={
    T00:[{id:'LN-ROAD-SAFE-01',title:'救助、报警与现场证据优先',basis:'《道路交通事故处理程序规定》现场处置规则',applies:'事故刚发生，存在伤情或现场证据需要固定',excludes:'现场存在持续危险时，应先撤至安全位置',sourceUrl:SOURCE_ROAD,...auditBase}],
    T10:[{id:'LN-ROAD-SCENE-02',title:'配合现场调查并核对记录',basis:'《道路交通事故处理程序规定》第三十二条等',applies:'交警已经到场开展询问、勘查和证据固定',excludes:'对不清楚的事实不作推测性陈述',sourceUrl:SOURCE_ROAD,...auditBase}],
    T20:[{id:'LN-ROAD-PARALLEL-03',title:'离场后调查、治疗和材料保存并行',basis:'《道路交通事故处理程序规定》调查与认定规则',applies:'已经离开现场但认定尚未完成',excludes:'出现急症时以医疗救治为先',sourceUrl:SOURCE_ROAD,...auditBase}],
    T30:[
      {id:'LN-ROAD-REC-10',title:'普通路径10个工作日制作节点',basis:'《道路交通事故处理程序规定》第六十二条、第一百一十二条',applies:'未进入检验鉴定，且已取得交警记录的现场调查日期',excludes:'逃逸案件、检验鉴定、身份未查明或中止认定等特殊路径',sourceUrl:SOURCE_ROAD,...auditBase},
      {id:'LN-ROAD-APP-05',title:'鉴定意见确定后5个工作日制作节点',basis:'《道路交通事故处理程序规定》第六十二条、第一百一十二条',applies:'已经进入检验鉴定且鉴定意见已经确定',excludes:'鉴定意见尚未确定或申请重新鉴定',sourceUrl:SOURCE_ROAD,...auditBase},
      {id:'CAL-2026-WORKDAY',title:'2026年工作日校准',basis:'国务院办公厅2026年部分节假日安排',applies:'起算日和到期日均位于2026年',excludes:'跨年期限需要按对应年度安排人工复核',sourceUrl:SOURCE_HOLIDAY,...auditBase}
    ],
    T40:[{id:'INS-CLAIM-05',title:'交强险责任核定5日节点',basis:'《机动车交通事故责任强制保险条例》第二十九条',applies:'保险公司已经实际收到被保险人提供的证明和资料',excludes:'未报案、资料尚未实际送达或商业险另有约定',sourceUrl:SOURCE_INS,...auditBase}],
    T50:[
      {id:'LN-ROAD-REVIEW-03',title:'认定书送达后3个工作日复核节点',basis:'《道路交通事故处理程序规定》第七十一条、第一百一十二条',applies:'对事故认定或事故证明有异议，且已经记录实际送达日期',excludes:'同一事故复核以一次为限；逾期申请可能不予受理',sourceUrl:SOURCE_ROAD,...auditBase},
      {id:'CAL-2026-WORKDAY',title:'2026年工作日校准',basis:'国务院办公厅2026年部分节假日安排',applies:'送达日和到期日均位于2026年',excludes:'跨年期限需要按对应年度安排人工复核',sourceUrl:SOURCE_HOLIDAY,...auditBase}
    ]
  };

  return {locatorQuestions,actionPriorities,cities,officialServices,ruleAudit,sources:{road:SOURCE_ROAD,insurance:SOURCE_INS,holiday:SOURCE_HOLIDAY},verifiedAt:'2026-07-17'};
});
