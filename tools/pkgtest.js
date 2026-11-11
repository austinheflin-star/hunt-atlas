// Builds one small AI-scan test package from the live app on a neutral block of national forest (pipeline test only).
const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 820, height: 900 } }); fs.mkdirSync('out/pkg', { recursive: true });
  for (const c of ['31.2760/-95.1280', '31.3300/-95.1000', '31.2200/-95.0500', '31.4200/-95.1700']){
    await p.goto('https://austinheflin-star.github.io/hunt-atlas/?t=' + Date.now() + '#16/' + c); await p.waitForTimeout(8000);
    const r = await p.evaluate(async () => { try { const k = await aiBuild('small', { date: new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10), session: 'Morning', weapon: 'Rifle' }, AI_FOCUS.map(f => f[1]), '', () => {}); return JSON.stringify(k); } catch (e){ return 'ERR ' + (e && e.message || e); } });
    console.log(c, r.startsWith('ERR') ? r : 'ok ' + r.length);
    if (!r.startsWith('ERR')){ fs.writeFileSync('out/pkg/test.json', r); break; } }
  await b.close(); })();
