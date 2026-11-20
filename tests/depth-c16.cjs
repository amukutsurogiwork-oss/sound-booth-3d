// 3Dは点ごとに「いちばん手前の面」だけを描くこと(どの角度でも、奥の面が手前の面の上に出ない・ピラミッドが土台に消されない)。
// いろいろな角度・壁の消し方で、画面の点を選び、その点を覆う面のうち一番手前の面の色と、実際に描かれた色が同じか確かめる。
// 実行: node tests/depth-c16.cjs  (Playwright と Chromium が必要)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:700},deviceScaleFactor:1});
await p.goto('file://'+path.resolve(__dirname,'../index.html'));
const r=await p.evaluate(()=>{const cv=document.getElementById('c16-cv'),ctx=cv.getContext('2d');let checked=0;const bad=[];let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  for(let yaw=-3;yaw<=3.01;yaw+=0.75)for(const pitch of [0.2,0.6,1.1])for(const hide of [[],['roof','front'],['roof','left'],['lid','roof','foam']]){
    const prims=window.C16_TEST.view({yaw,pitch,zoom:1,doorOpen:true,lidOpen:true,air:false,hide:new Set(hide)});const img=ctx.getImageData(0,0,cv.width,cv.height).data;
    for(let s=0;s<60;s++){const x=Math.floor(rnd()*cv.width)+.5,y=Math.floor(rnd()*cv.height)+.5;let best=null,bz=Infinity,cov=0;
      for(const t of prims){const [A,B,C]=t.pts;if(x<t.box[0]-1||x>t.box[2]+1||y<t.box[1]-1||y>t.box[3]+1)continue;const ar=(B[0]-A[0])*(C[1]-A[1])-(B[1]-A[1])*(C[0]-A[0]);if(Math.abs(ar)<1e-9)continue;
        const w0=((B[0]-x)*(C[1]-y)-(B[1]-y)*(C[0]-x))/ar,w1=((C[0]-x)*(A[1]-y)-(C[1]-y)*(A[0]-x))/ar,w2=1-w0-w1,e=0.02;
        if(w0<-e||w1<-e||w2<-e)continue;if(Math.min(w0,w1,w2)<e){cov=2;break;}const z=w0*A[2]+w1*B[2]+w2*C[2];if(z<bz){bz=z;best=t;}}
      if(cov===2||!best||best.cut)continue;// edges and cut-out faces are skipped
      const i=(Math.floor(y)*cv.width+Math.floor(x))*4,c=[img[i],img[i+1],img[i+2]];checked++;
      if(Math.abs(c[0]-best.col[0])+Math.abs(c[1]-best.col[1])+Math.abs(c[2]-best.col[2])>6)bad.push({yaw:+yaw.toFixed(2),pitch,hide:hide.join('+'),want:best.col,got:c,g:[].concat(best.g).join('+')});}}
  window.C16_TEST.view({yaw:0.6,pitch:0.42,hide:new Set()});return {checked,bad};});
await b.close();const ok=r.checked>500&&r.bad.length<=r.checked*0.01;console.log(ok?'PASS':'FAIL',r.checked,r.bad.length,JSON.stringify(r.bad.slice(0,3)));process.exit(ok?0:1);})();
