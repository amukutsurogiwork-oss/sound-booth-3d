// 壁を消したら、その壁の穴(筒)も一緒に消えること。左の壁→外への口2つ、後ろの壁→部屋との穴2つ。
// 実行: node tests/hole-walls-c16.cjs  (Playwright と Chromium が必要)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:700}});
await p.goto('file://'+path.resolve(__dirname,'../index.html'));
const r=await p.evaluate(()=>{const tubes=h=>window.C16_TEST.view({yaw:-2.2,pitch:0.3,doorOpen:true,lidOpen:true,hide:new Set(h)}).filter(x=>[].concat(x.g).includes('hole')).length;
  const out={all:tubes([]),noLeft:tubes(['left']),noBoth:tubes(['left','back'])};window.C16_TEST.view({hide:new Set()});return out;});
await b.close();const ok=r.all>0&&r.noLeft<r.all&&r.noBoth===0;console.log(ok?'PASS':'FAIL',JSON.stringify(r));process.exit(ok?0:1);})();
