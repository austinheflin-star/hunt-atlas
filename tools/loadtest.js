// Load test: opens the built page on an emulated phone with no outside network and fails on any page error.
// Run: node tools/loadtest.js   (needs Playwright; run before every deploy)
const { chromium, devices } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
(async () => {
  const b = await chromium.launch(), c = await b.newContext({ ...devices['iPhone 13'] }), p = await c.newPage(), errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('http://app.test/')){ const f = path.join(ROOT, decodeURIComponent(new URL(u).pathname.slice(1)) || 'index.html');
      return fs.existsSync(f) && fs.statSync(f).isFile() ? r.fulfill({ body: fs.readFileSync(f), contentType: f.endsWith('.html') ? 'text/html' : f.endsWith('.json') ? 'application/json' : 'text/plain' }) : r.fulfill({ status: 404, body: '' }); }
    const m = u.match(/unpkg\.com\/leaflet@1\.9\.4\/dist\/(leaflet\.(?:js|css))$/);
    if (m) return r.fulfill({ body: fs.readFileSync(path.join(__dirname, 'leaflet', m[1])), contentType: m[1].endsWith('.css') ? 'text/css' : 'application/javascript' });
    return r.fulfill({ status: 503, body: '' }); });
  await p.goto('http://app.test/index.html#14/30.596/-95.756'); await p.waitForTimeout(3500);
  const r = await p.evaluate(() => ({ v: typeof APP_VERSION !== 'undefined' ? APP_VERSION : null, map: typeof map !== 'undefined' && !!map.getCenter(), tabs: document.querySelectorAll('nav button').length,
    tips: !!document.querySelector('#thickTips .pros'), season: typeof proSeason === 'function' ? (proSeason(new Date(2026, 10, 11), 30.27, -96.7) || {}).name + '/' + (proSeason(new Date(2026, 10, 11), 30.6, -95.75) || {}).name : null,
    extra: typeof window.psSelfTest === 'function' ? window.psSelfTest() : null })).catch(e => ({ fatal: String(e) }));
  await b.close();
  const ok = !errs.length && r.v && r.map && r.tabs >= 5 && !r.fatal && (!r.extra || r.extra.ok !== false);
  console.log(JSON.stringify(r)); if (errs.length) console.log('PAGE ERRORS:', errs.slice(0, 5));
  console.log(ok ? 'LOAD TEST PASSED' : 'LOAD TEST FAILED'); process.exit(ok ? 0 : 1);
})();
