// 図面の食い違いチェック: 見出しの数字・2D図面・3Dモデル・空気の通り道がそろっていること。
// わざと見出しの数字を変えると、チェックが「食い違い」を見つけること（チェックが本当に働いている）。
// 実行: node tests/consistency-c16.cjs  (Playwright と Chromium が必要)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:700}});
await p.goto('file://'+path.resolve(__dirname,'../index.html'));
const r=await p.evaluate(()=>{if(!window.C16_CHECK)return {err:'C16_CHECK がない'};const a=window.C16_CHECK();
  const shown=document.querySelectorAll('#c16-check tr').length;
  const sub=document.querySelector('#c16 .c16-sub'),keep=sub.textContent;sub.textContent=keep.replace('1,260','1,250');
  const bad=window.C16_CHECK().filter(x=>!x.ok).map(x=>x.name);sub.textContent=keep;
  const desk=[...document.querySelectorAll('#c16-plan text')].find(t=>t.textContent.startsWith('机（')),dk=desk.textContent;desk.textContent=dk.replace('720','700');
  const bad2=window.C16_CHECK().filter(x=>!x.ok).map(x=>x.name);desk.textContent=dk;
  return {n:a.length,fails:a.filter(x=>!x.ok),shown,bad,bad2};});
await b.close();
const ok=!r.err&&r.n>=8&&r.fails.length===0&&r.shown===r.n&&r.bad.length===1&&r.bad2.length===1;
console.log(ok?'PASS':'FAIL',JSON.stringify(r));process.exit(ok?0:1);})();
