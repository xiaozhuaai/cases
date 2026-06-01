console.log("APP START");
var ocrData={};
var TOTAL=414,IMG_BASE='pages/';
var chapters=[
  {name:"一、投资的理念",start:10,end:63,icon:"💡",desc:"价值之锚、现金流、复利、合理估值",topics:["价值投资","分红","复利","估值","垄断"]},
  {name:"二、技术分析及交易",start:64,end:84,icon:"📊",desc:"搬砖、做T、网格交易、四大流派",topics:["搬砖","做T","网格","K线"]},
  {name:"三、大盘和个股",start:85,end:90,icon:"📈",desc:"A股生态环境、个股深度分析",topics:["A股","美的","格力","陕煤"]},
  {name:"四、关于风险",start:91,end:103,icon:"⚠️",desc:"风险敞口、杠杆、回撤控制",topics:["风险","杠杆","回撤"]},
  {name:"五、产业与周期",start:104,end:186,icon:"🏭",desc:"地产、银行、互联网、钢铁周期洞察",topics:["地产","银行","互联网","周期"]},
  {name:"六、煤炭和电力能源",start:187,end:240,icon:"⚡",desc:"煤电博弈、神华淮北深度拆解",topics:["煤炭","电力","神华","淮北"]},
  {name:"七、人口与趋势",start:241,end:333,icon:"👥",desc:"人口结构对消费、房产的长期影响",topics:["人口","老龄化","消费","日本"]},
  {name:"八、局势及竞争",start:334,end:351,icon:"🌏",desc:"通缩、债务、国际竞争格局",topics:["通缩","债务","美国","越南"]},
  {name:"九、闲言碎语",start:352,end:414,icon:"💬",desc:"抄作业、识人辨术、投资之外的智慧",topics:["抄作业","识人","常识"]}
];
var allTags=["价值投资","分红","复利","估值","垄断","煤炭","电力","神华","淮北","银行","地产","周期","人口","风险","搬砖","做T","A股","焦煤","杠杆","日本","通缩"];
var activeTag=null;
function pad(n){return String(n).padStart(3,'0')}

function buildAll(){
  buildTopTags();
  buildChapterCards();
  buildTimeline();
  buildTagCloud();
  buildFullText();
  updateProgress();
}

function buildTopTags(){
  var el=document.getElementById('topTags');if(!el)return;
  var h='<span class="nav-tag active" onclick="filterByTag(null,this)">全部</span>';
  for(var i=0;i<allTags.length;i++){
    var t=allTags[i];
    h+='<span class="nav-tag" onclick="filterByTag(\''+t+'\',this)">'+t+'</span>';
  }
  el.innerHTML=h;
}

function filterByTag(tag,el){
  activeTag=tag;
  var nts=document.querySelectorAll('.nav-tag');
  for(var i=0;i<nts.length;i++)nts[i].classList.remove('active');
  if(el)el.classList.add('active');
  var tcts=document.querySelectorAll('.tag-cloud .tag');
  for(var i=0;i<tcts.length;i++)tcts[i].classList.toggle('active',tcts[i].textContent===tag);
  var cards=document.querySelectorAll('.chapter-card');
  for(var i=0;i<cards.length;i++){
    if(!tag){cards[i].classList.remove('filtered-out');continue}
    var topics=cards[i].getAttribute('data-topics')||'';
    cards[i].classList.toggle('filtered-out',topics.indexOf(tag)===-1);
  }
}

function buildChapterCards(){
  var grid=document.getElementById('chapterGrid');if(!grid)return;
  var h='';
  for(var i=0;i<chapters.length;i++){
    var ch=chapters[i];
    var preview=ch.desc;
    for(var pg=ch.start;pg<=ch.end;pg++){
      var t=ocrData[String(pg)];
      if(t){preview=t.substring(0,120).replace(/\n/g,' ')+'...';break}
    }
    h+='<div class="chapter-card" data-topics="'+ch.topics.join(',')+'" onclick="toggleChapter('+i+')">';
    h+='<div class="ch-num">'+(i+1)+'</div>';
    h+='<h3>'+ch.icon+' '+ch.name+'</h3>';
    h+='<div class="ch-range">p.'+ch.start+'-'+ch.end+' · '+(ch.end-ch.start+1)+'页</div>';
    h+='<div class="ch-preview">'+preview+'</div>';
    h+='<div class="ch-topics">';
    for(var j=0;j<ch.topics.length;j++)h+='<span class="ch-topic">'+ch.topics[j]+'</span>';
    h+='</div></div>';
    h+='<div class="chapter-detail" id="chDetail'+i+'">';
    h+='<button class="close-btn" onclick="event.stopPropagation();toggleChapter('+i+')">✕</button>';
    h+='<h3>'+ch.icon+' '+ch.name+'</h3>';
    h+=buildChapterContent(ch);
    h+='</div>';
  }
  grid.innerHTML=h;
}

function toggleChapter(i){
  var d=document.getElementById('chDetail'+i);if(!d)return;
  d.classList.toggle('open');
  if(d.classList.contains('open'))d.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function buildChapterContent(ch){
  var h='';
  for(var pg=ch.start;pg<=Math.min(ch.end,ch.start+5);pg++){
    var t=ocrData[String(pg)];if(!t)continue;
    h+='<div class="post"><div class="date">📄 第 '+pg+' 页</div>';
    var posts=t.split(/(?=20\d{2}[-—]\d{2}[-—]\d{2})/);
    for(var i=0;i<Math.min(posts.length,2);i++){
      var p=posts[i];if(!p.trim())continue;
      var pl=p.trim().split('\n'),dm=pl[0].match(/(20\d{2}[-—]\d{2}[-—]\d{2}.*)/);
      if(dm){h+='<div class="date">📅 '+dm[1].replace(/[—]/g,'-')+'</div>';pl.shift()}
      for(var j=0;j<Math.min(pl.length,5);j++){
        var cl=pl[j].trim();if(!cl)continue;
        if(cl.indexOf('网友')===0||cl.indexOf('鹿鼎公')===0){
          var who=cl.indexOf('网友')===0?'网友':'鹿鼎公';
          h+='<div class="reply"><span class="who">'+who+'：</span>'+cl.replace(/^(网友|鹿鼎公)[：:]\s*/,'')+'</div>';
        }else{h+='<p>'+cl+'</p>'}
      }
    }
    h+='</div>';break;
  }
  if(!h)h='<p style="color:var(--text2);font-size:13px">文字提取中，即将上线。</p>';
  return h;
}

function buildTimeline(){
  var tl=document.getElementById('timeline');if(!tl)return;
  var items=[
    {date:"2014-05",text:'提出<span class="highlight">沙漠之花</span>概念——海螺水泥、中国神华'},
    {date:"2014-12",text:'定义投资方法论：<span class="highlight">以产业投资眼光买股票</span>'},
    {date:"2015-02",text:'守株待兔——投资就是<span class="highlight">在交通要道上找棵大树静静守着</span>'},
    {date:"2015-03",text:'孙子兵法：<span class="highlight">想赚钱，先做到不亏钱</span>'},
    {date:"2015-07",text:'深读<span class="highlight">价值之锚</span>——8-9%分红价即股价底锚'},
    {date:"2015-09",text:'十六字诀成形：<span class="highlight">价值选股，趋势选时，估值定仓，波动降本</span>'}
  ];
  var h='';
  for(var i=0;i<items.length;i++){
    h+='<div class="timeline-item"><div class="tl-date">'+items[i].date+'</div><div class="tl-text">'+items[i].text+'</div></div>';
  }
  tl.innerHTML=h;
}

function buildTagCloud(){
  var tc=document.getElementById('tagCloud');if(!tc)return;
  var h='';
  for(var i=0;i<allTags.length;i++){
    var t=allTags[i];
    h+='<span class="tag" onclick="filterByTag(\''+t+'\',this)">'+t+'</span>';
  }
  tc.innerHTML=h;
}

function buildFullText(){
  var ft=document.getElementById('fullText');if(!ft)return;
  var h='',lastChap='';
  for(var pg=1;pg<=TOTAL;pg++){
    var chap=null;
    for(var c=0;c<chapters.length;c++){if(pg===chapters[c].start){chap=chapters[c];break}}
    if(chap&&chap.name!==lastChap){
      h+='<div style="text-align:center;margin:32px 0 20px;padding-top:20px;border-top:1px solid var(--border)"><span style="font-size:14px;color:var(--accent);font-weight:600">'+chap.icon+' '+chap.name+'</span></div>';
      lastChap=chap.name;
    }
    var t=ocrData[String(pg)];
    h+='<div style="margin-bottom:24px;padding:16px 20px;background:var(--card);border-radius:8px;border:1px solid var(--border)">';
    h+='<div style="font-size:9px;color:var(--text2);opacity:0.3;margin-bottom:8px">p.'+pg+'</div>';
    if(t){
      var posts=t.split(/(?=20\d{2}[-—]\d{2}[-—]\d{2})/);
      for(var i=0;i<posts.length;i++){
        var p=posts[i];if(!p.trim())continue;
        var pl=p.trim().split('\n'),dm=pl[0].match(/(20\d{2}[-—]\d{2}[-—]\d{2}.*)/);
        if(dm){h+='<div style="font-size:10px;color:var(--gold);margin-bottom:6px">'+dm[1].replace(/[—]/g,'-')+'</div>';pl.shift()}
        for(var j=0;j<pl.length;j++){
          var cl=pl[j].trim();if(!cl)continue;
          if(cl.indexOf('网友')===0||cl.indexOf('鹿鼎公')===0){
            var who=cl.indexOf('网友')===0?'网友':'鹿鼎公';
            h+='<div style="font-size:13px;color:var(--text2);margin:3px 0 3px 12px;padding-left:8px;border-left:2px solid var(--border)"><b style="color:var(--accent)">'+who+'：</b>'+cl.replace(/^(网友|鹿鼎公)[：:]\s*/,'')+'</div>';
          }else{h+='<p style="text-indent:2em;margin-bottom:4px;font-size:14px">'+cl+'</p>'}
        }
      }
    }else{
      h+='<div style="text-align:center"><img data-src="'+IMG_BASE+'p_'+pad(pg)+'.webp" alt="" src="" style="max-width:100%;min-height:200px;background:#f5f0e8;border-radius:4px;border:1px solid var(--border)"></div>';
    }
    h+='</div>';
  }
  ft.innerHTML=h;
  setTimeout(function(){
    var obs=new IntersectionObserver(function(entries){
      for(var i=0;i<entries.length;i++){
        if(entries[i].isIntersecting){
          var img=entries[i].target;
          if(img.dataset.src){img.src=img.dataset.src;obs.unobserve(img)}
        }
      }
    },{rootMargin:'200px'});
    var imgs=document.querySelectorAll('img[data-src]');
    for(var i=0;i<imgs.length;i++)obs.observe(imgs[i]);
  },200);
}

function updateProgress(){
  var el=document.getElementById('ocrProgress');
  if(el)el.textContent=Object.keys(ocrData).length;
}

// Load OCR data then build
console.log("Fetching ocr.json...");
fetch('ocr.json').then(function(r){return r.json()}).then(function(d){
  ocrData=d;
  console.log("Loaded "+Object.keys(d).length+" OCR pages");
  buildAll();
}).catch(function(e){
  console.log("OCR fetch failed: "+e.message);
  buildAll();
});
