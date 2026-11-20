// 印刷・PDF保存で、最新の C16 の2D図面が出ること(3D表示のままでも)。
// 実行: node tests/print-c16.cjs  (Playwright と Chromium が必要)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+path.resolve(__dirname,'../index.html'));await p.emulateMedia({media:'print'});
const r=await p.evaluate(()=>{const vis=id=>{const e=document.getElementById(id);return !!e&&getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().height>0;};
  return {plan:vis('c16-plan'),sil:vis('c16-sil'),sec:vis('c16-sec'),p3d:vis('c16-p3d'),c07plan:vis('sheet-plan')};});
await b.close();
const ok=r.plan&&r.sil&&r.sec&&!r.p3d&&r.c07plan;console.log(ok?'PASS':'FAIL',JSON.stringify(r));process.exit(ok?0:1);})();
