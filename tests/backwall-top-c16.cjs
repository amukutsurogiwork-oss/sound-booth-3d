// 部屋と消音箱の間の壁(二重構造)は、上の切り口でも「ピラミッド・板・中の吸音材・板・ピラミッド」の順であること。
// 中の吸音材(うす水色)は、板と板の間(内の板より消音箱側)にだけ入り、部屋側のピラミッドや内の板の所には入らない。
// 実行: node tests/backwall-top-c16.cjs  (Playwright と Chromium が必要)
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+path.resolve(__dirname,'../index.html'));
const bad=await p.evaluate(()=>{const T=window.C16_TEST,d=T.dims,W=JSON.stringify(T.wool);
  return T.model().filter(b=>b.v&&JSON.stringify(b.c)===W).map(b=>{const xs=b.v.map(q=>q[0]),ys=b.v.map(q=>q[1]),zs=b.v.map(q=>q[2]);return {x0:Math.min(...xs),x1:Math.max(...xs),y0:Math.min(...ys),y1:Math.max(...ys),z0:Math.min(...zs),z1:Math.max(...zs)};})
    .filter(x=>x.x0<d.mid&&x.x1>d.mid&&x.z1>d.top+1&&x.z0<d.OH-d.ia-1&&x.y0<d.ySil-d.ia-1&&x.y1>d.yBack+1);});
await b.close();const ok=bad.length===0;console.log(ok?'PASS':'FAIL',JSON.stringify(bad));process.exit(ok?0:1);})();
