// ピラミッド吸音材が、どの角度でも、自分の土台(吸音材の板)に後ろから塗りつぶされて消えないこと。
// 土台の面より手前(見ている側)にあるピラミッドの面が、その土台より先に描かれて上書きされていたら失敗。
// 実行: node tests/pyramids-visible-c16.cjs  (Playwright と Chromium が必要)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:700}});
await p.goto('file://'+path.resolve(__dirname,'../index.html'));
const bad=await p.evaluate(()=>{const out=[],has=(g,k)=>[].concat(g).includes(k);
  for(let yaw=-3;yaw<=3.01;yaw+=0.75)for(const pitch of [0.2,0.7,1.2])for(const hide of [['roof','front'],['roof','left'],['lid','roof']]){
    const o=window.C16_TEST.view({yaw,pitch,zoom:1,doorOpen:true,lidOpen:true,hide:new Set(hide)});
    const tris=o.map((x,i)=>({...x,i})).filter(x=>x.tri),bases=o.map((x,i)=>({...x,i})).filter(x=>!x.tri&&x.plane&&has(x.g,'foam'));
    // only a pyramid's own foam base (same wall, same plane under it) is checked
    const own=(t,B)=>[].concat(t.g).join()===[].concat(B.g).join()&&B.baseId===t.baseId;
    for(const t of tris){for(const B of bases){if(B.i<=t.i||!own(t,B))continue;const [n,off]=B.plane;const s=n[0]*t.wc[0]+n[1]*t.wc[1]+n[2]*t.wc[2]-off;if(s<2||s>60)continue;
      const A=t.box,C=B.box;if(Math.min(A[2],C[2])-Math.max(A[0],C[0])>2&&Math.min(A[3],C[3])-Math.max(A[1],C[1])>2){out.push({yaw:+yaw.toFixed(2),pitch,hide:hide.join('+')});break;}}
      if(out.length&&out[out.length-1].yaw===+yaw.toFixed(2)&&out[out.length-1].pitch===pitch&&out[out.length-1].hide===hide.join('+'))break;}}
  window.C16_TEST.view({yaw:0.6,pitch:0.42,hide:new Set()});return out;});
await b.close();const ok=bad.length===0;console.log(ok?'PASS':'FAIL',bad.length,JSON.stringify(bad.slice(0,4)));process.exit(ok?0:1);})();
