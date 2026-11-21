// 材料と数量（目安）: 3Dモデルの全部の部品が、どれかの材料の行に入っていること（数え漏れなし）。
// 外の板の面積が箱の外側の面積と大きくずれないこと、ゴムの足が9個であること、表がページに出ていること。
// 実行: node tests/bom-c16.cjs  (Playwright と Chromium が必要)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:700}});
await p.goto('file://'+path.resolve(__dirname,'../index.html'));
const r=await p.evaluate(()=>{const T=window.C16_TEST;if(!T.bom)return {err:'bom がない'};const B=T.bom(),d=T.dims;
  const OW=d.mid*2,OH=d.OH,OD=document.querySelector('#c16-dims').textContent.match(/(\d+) × (\d+) × 高さ (\d+)/)[2]*1;
  const env=(2*OW*OD+2*(OW+OD)*OH)/1e6,row=k=>B.rows.find(x=>x.key===k)||{};
  const rows=[...document.querySelectorAll('#c16-bom tr')].map(t=>t.textContent);
  return {left:B.left,feet:row('feet').qty,p12:row('p12').area,env,shown:rows.length,hasFeet:rows.some(t=>t.includes('防振ゴムの足')&&t.includes('9')),
    sheetsOk:['p12','p24','p18'].every(k=>row(k).qty===Math.ceil(row(k).area*1.15/(0.91*1.82)))};});
await b.close();
const ok=!r.err&&r.left.length===0&&r.feet===9&&r.p12>0.8*r.env&&r.p12<1.3*r.env&&r.shown>=12&&r.hasFeet&&r.sheetsOk;
console.log(ok?'PASS':'FAIL',JSON.stringify(r));process.exit(ok?0:1);})();
