// C16 の2D図面が、寸法を変えても枠(viewBox)からはみ出さないこと。
// 実行: node tests/viewbox-c16.cjs  (Playwright と Chromium が必要)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+path.resolve(__dirname,'../index.html'));await p.click('#c16-b2d');
const r=await p.evaluate(()=>['c16-plan','c16-sil','c16-sec'].map(id=>{const s=document.getElementById(id),v=s.viewBox.baseVal,bb=s.getBBox();
  return {id,ok:bb.x>=v.x&&bb.y>=v.y&&bb.x+bb.width<=v.x+v.width&&bb.y+bb.height<=v.y+v.height,view:[v.x,v.y,v.width,v.height].map(Math.round),drawn:[bb.x,bb.y,bb.width,bb.height].map(Math.round)};}));
await b.close();const ok=r.every(x=>x.ok);console.log(ok?'PASS':'FAIL',JSON.stringify(r));process.exit(ok?0:1);})();
