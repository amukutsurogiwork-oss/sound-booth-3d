// 扉を閉めたとき、外からは部屋の中の机が見えないこと(ふたを開けて後ろから見ても、どの角度でも)。
// 机あり・なしで描いた絵が同じなら、机は外から見えていない。
// 実行: node tests/desk-hidden-c16.cjs  (Playwright と Chromium が必要)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:700},deviceScaleFactor:1});
await p.goto('file://'+path.resolve(__dirname,'../index.html'));
const bad=await p.evaluate(()=>{const out=[],cv=document.getElementById('c16-cv'),ctx=cv.getContext('2d');
  const shot=(o)=>{window.C16_TEST.view(o);return ctx.getImageData(0,0,cv.width,cv.height).data;};
  for(let yaw=-3.1;yaw<=3.15;yaw+=0.3)for(const pitch of [0.1,0.4,0.8]){
    const base={yaw,pitch,doorOpen:false,lidOpen:true,air:false};
    const a=shot({...base,hide:new Set()}),c=shot({...base,hide:new Set(['desk'])});let n=0;
    for(let i=0;i<a.length;i+=4)if(Math.abs(a[i]-c[i])+Math.abs(a[i+1]-c[i+1])+Math.abs(a[i+2]-c[i+2])>30)n++;
    if(n>8)out.push({yaw:+yaw.toFixed(2),pitch,px:n});}
  window.C16_TEST.view({hide:new Set()});return out;});
await b.close();const ok=bad.length===0;console.log(ok?'PASS':'FAIL',bad.length,JSON.stringify(bad.slice(0,4)));process.exit(ok?0:1);})();
