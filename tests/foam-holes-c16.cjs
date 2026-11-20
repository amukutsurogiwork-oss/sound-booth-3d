// 吸音材を「なし」にしても、部屋側の換気の穴(丸)が後ろの壁に残ること。
// 実行: node tests/foam-holes-c16.cjs  (Playwright と Chromium が必要)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+path.resolve(__dirname,'../index.html'));
await p.click('#c16-t-foam');
const n=await p.evaluate(()=>window.C16_TEST.model().filter(b=>[].concat(b.g).includes('back')).flatMap(b=>b.decals).filter(d=>d.n[1]===-1).length);
await b.close();const ok=n===2;console.log(ok?'PASS':'FAIL','room-side holes visible with foam hidden:',n);process.exit(ok?0:1);})();
