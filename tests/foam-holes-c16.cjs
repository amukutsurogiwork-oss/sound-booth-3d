// 吸音材を「なし」にしても、換気の穴(丸)が後ろの壁の部屋側・消音箱側の両方の表面に残ること。
// 実行: node tests/foam-holes-c16.cjs  (Playwright と Chromium が必要)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+path.resolve(__dirname,'../index.html'));
await p.click('#c16-t-foam');
const r=await p.evaluate(()=>{const back=window.C16_TEST.model().filter(b=>b.v&&[].concat(b.g).includes('back'));
  const faceY=Math.min(...back.map(b=>Math.min(...b.v.map(q=>q[1]))));
  const ds=back.flatMap(b=>b.decals||[]).filter(d=>d.n[1]===-1);
  const silY=Math.max(...back.map(b=>Math.max(...b.v.map(q=>q[1])))),ss=back.flatMap(b=>b.decals||[]).filter(d=>d.n[1]===1);
  return {faceY,count:ds.length,onFace:ds.filter(d=>Math.abs(d.p[0][1]-faceY)<=5).length,silY,silOnFace:ss.filter(d=>Math.abs(d.p[0][1]-silY)<=5).length};});
await b.close();const ok=r.onFace===2&&r.silOnFace===2;console.log(ok?'PASS':'FAIL',JSON.stringify(r));process.exit(ok?0:1);})();
