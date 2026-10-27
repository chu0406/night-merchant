(() => {
  const maps=window.ZH_MAPS, key='night-merchant-language';
  let lang='hant';
  try {const saved=localStorage.getItem(key);if(saved==='hans'||saved==='hant')lang=saved;} catch {}
  const records=new WeakMap();
  function convert(value,target=lang){
    const text=String(value??''), dictionary=maps.phrases[target];
    const converted=dictionary[text]??Array.from(text,c=>maps[target][c]??c).join('');
    return target==='hant'?converted.replace(/紅發辮/g,'紅髮辮').replace(/頭發/g,'頭髮'):converted;
  }
  function translate(owner,field,current,set){
    let record=records.get(owner);if(!record){record={};records.set(owner,record);}
    if(!record[field]||record[field].last!==current)record[field]={original:current,last:current};
    const value=convert(record[field].original);set(value);record[field].last=value;
  }
  function apply(){
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;while(node=walker.nextNode()){
      if(node.parentElement?.closest('script,style,[data-no-translate]'))continue;
      if(!node.nodeValue.trim())continue;
      const current=node;translate(current,'text',current.nodeValue,v=>{current.nodeValue=v;});
    }
    document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el=>{
      if(el.closest('[data-no-translate]'))return;
      for(const attr of ['placeholder','aria-label','title'])if(el.hasAttribute(attr))translate(el,attr,el.getAttribute(attr),v=>el.setAttribute(attr,v));
    });
    document.documentElement.lang=lang==='hant'?'zh-Hant':'zh-Hans';
    document.title=convert('夜渡商人 · 黑夜君臨');
    document.querySelectorAll('[data-language]').forEach(el=>{const active=el.dataset.language===lang;el.setAttribute('aria-pressed',String(active));el.classList.toggle('active',active);});
  }
  window.ZH={convert,apply,simplify:v=>convert(v,'hans')};
  document.querySelectorAll('[data-language]').forEach(el=>el.addEventListener('click',()=>{
    lang=el.dataset.language;try{localStorage.setItem(key,lang);}catch{}apply();
  }));
})();
