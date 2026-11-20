// 3Dで、開いた扉やふたが、それより手前にある壁の上に描かれないこと(どの角度でも)。
// 実行: node tests/order-c16.cjs  (Playwright と Chromium が必要)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
await p.goto('file://'+path.resolve(__dirname,'../index.html'));
await p.click('#c16-t-foam');
const bad=await p.evaluate(()=>{const out=[];const has=(g,k)=>[].concat(g).includes(k);
  for(let yaw=-3;yaw<=3.01;yaw+=0.5)for(const pitch of [0.15,0.42,0.9]){
    const order=window.C16_TEST.view({yaw,pitch,doorOpen:true,lidOpen:true});
    for(let i=0;i<order.length;i++){const a=order[i];if(!(has(a.g,'door')||has(a.g,'lid')))continue;
      for(let j=0;j<i;j++){const w=order[j];if(has(w.g,'door')||has(w.g,'lid'))continue;
        if(w.d<a.d-150){const A=a.box,B=w.box,ov=Math.min(A[2],B[2])-Math.max(A[0],B[0]),oh=Math.min(A[3],B[3])-Math.max(A[1],B[1]);
          if(ov>4&&oh>4){out.push({yaw:+yaw.toFixed(2),pitch,panel:[].concat(a.g).join("+"),wall:[].concat(w.g).join("+"),pd:Math.round(a.d),wd:Math.round(w.d),po:a.outer,wo:w.outer});break;}}}
      if(out.length>5)return out;}}
  return out;});
await b.close();const ok=bad.length===0;console.log(ok?'PASS':'FAIL',JSON.stringify(bad.slice(0,3)));process.exit(ok?0:1);})();
