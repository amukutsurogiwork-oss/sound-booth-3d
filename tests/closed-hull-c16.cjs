// 扉とふたを閉めた外観では、中の吸音材(ピラミッド・うす水色)が外の壁を突き抜けて見えないこと(どの角度でも)。
// 4つの穴は本当に空いているので、穴の中から見える所は数えない。
// 実行: node tests/closed-hull-c16.cjs  (Playwright と Chromium が必要)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:700},deviceScaleFactor:1});
await p.goto('file://'+path.resolve(__dirname,'../index.html'));
const bad=await p.evaluate(()=>{const out=[];const cv=document.getElementById('c16-cv'),ctx=cv.getContext('2d');
  for(let yaw=-3.1;yaw<=3.15;yaw+=0.25)for(const pitch of [0.05,0.3,0.6,1.0,1.4]){
    window.C16_TEST.view({yaw,pitch,doorOpen:false,lidOpen:false,air:false});
    const d=ctx.getImageData(0,0,cv.width,cv.height).data;let n=0;const rings=window.C16_TEST.holeRings(),mk=document.createElement('canvas');mk.width=cv.width;mk.height=cv.height;{const m=mk.getContext('2d');m.fillStyle='#000';m.strokeStyle='#000';m.lineWidth=6;for(const R of rings){m.beginPath();R.forEach(([x,y],i)=>i?m.lineTo(x,y):m.moveTo(x,y));m.closePath();m.fill();m.stroke();}}const MK=mk.getContext('2d').getImageData(0,0,mk.width,mk.height).data,inRing=(x,y)=>MK[(y*mk.width+x)*4+3]>0;
    for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],bl=d[i+2];if(bl>r+25&&g>r+15&&Math.abs(bl-g)<30&&!inRing((i/4)%cv.width,Math.floor(i/4/cv.width)))n++;}
    if(n>6)out.push({yaw:+yaw.toFixed(2),pitch,px:n});}
  return out;});
await b.close();const ok=bad.length===0;console.log(ok?'PASS':'FAIL',bad.length,JSON.stringify(bad.slice(0,4)));process.exit(ok?0:1);})();
