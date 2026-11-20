// 4つの穴は色を付けず、向こうが見える本当の穴であること(吸音材あり・なし どちらでも)。
// 部屋と消音箱の間の穴: 正面の壁を外して正面から見ると、穴の中心から後ろ(ふたを開けた先の背景)が見える。
// 外への口: 右の壁と消音箱の中の仕切りを外して左から見ると、口の中心から背景が見える。
// 穴のすぐ横は壁が見えている(穴だけが抜けている)ことも確かめる。
// 実行: node tests/holes-c16.cjs  (Playwright と Chromium が必要)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:700},deviceScaleFactor:1});
await p.goto('file://'+path.resolve(__dirname,'../index.html'));
const r=await p.evaluate(()=>{const cv=document.getElementById('c16-cv'),ctx=cv.getContext('2d'),out=[];
  const px=(xy)=>{const d=ctx.getImageData(Math.round(xy[0]),Math.round(xy[1]),1,1).data;return [d[0],d[1],d[2]];};
  const isBg=c=>c[0]>235&&c[1]>240&&c[2]>240;
  for(const foam of [true,false]){
    const hide=['front','roof','desk',...(foam?[]:['foam'])];
    window.C16_TEST.view({yaw:0,pitch:0,zoom:1.6,doorOpen:true,lidOpen:true,air:false,hide:new Set(hide)});
    for(const h of window.C16_TEST.holes().filter(h=>h.axis===1)){const c=px(window.C16_TEST.screen(h.c)),w=px(window.C16_TEST.screen([h.c[0]-2.5*h.r,h.c[1],h.c[2]]));out.push({kind:'room',foam,ok:isBg(c)&&!isBg(w),c,w});}
    window.C16_TEST.view({yaw:-Math.PI/2,pitch:0,zoom:1.6,doorOpen:false,lidOpen:true,air:false,hide:new Set(['right','sil','desk','front','roof','back',...(foam?[]:['foam'])])});
    for(const h of window.C16_TEST.holes().filter(h=>h.axis===0)){const c=px(window.C16_TEST.screen(h.c)),w=px(window.C16_TEST.screen([h.c[0],h.c[1]-2.5*h.r,h.c[2]]));out.push({kind:'port',foam,ok:isBg(c)&&!isBg(w),c,w});}}
  window.C16_TEST.view({yaw:0.6,pitch:0.42,zoom:1,hide:new Set()});return out;});
await b.close();const ok=r.length===8&&r.every(x=>x.ok);console.log(ok?'PASS':'FAIL',JSON.stringify(r));process.exit(ok?0:1);})();
