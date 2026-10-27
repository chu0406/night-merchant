// Preview only the effect families selected by the user.
function merchantHighlights(weapons, includeNight=false){
  return weapons.flatMap(weapon=>{
    const effects=[];
    const sources=[{text:weapon.effect,nightOnly:false}];
    if(includeNight)sources.push({text:weapon.curse,nightOnly:true});
    for(const source of sources){
      for(const text of String(source.text||'').split('\n').map(s=>s.trim()).filter(Boolean)){
        const compact=text.replace(/\s/g,'');
        const attack=/^提升战技攻击力\+?(18|21)%$/.test(compact)||/^血量全满时，提升攻击力\+?\d+(?:\.\d+)?%$/.test(compact);
        const defense=/^(蓄力攻击命中时|受到损伤时|血量全满时|血量偏低时)，提升减伤率\+?\d+(?:\.\d+)?%$/.test(compact);
        if((attack||defense)&&!effects.some(e=>e.text===text))effects.push({text,category:attack?'attack':'defense',nightOnly:source.nightOnly});
      }
    }
    return effects.length?[{name:weapon.name,effects}]:[];
  });
}
if(typeof module!=='undefined')module.exports={merchantHighlights};
