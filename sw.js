// تطبيق MakeenEducation: الصفحات من الشبكة أولًا، والصور والملفات من الذاكرة
const V = 'mk-202611111935';
const SHELL = ['./', 'index.html', 'programs.html', 'teachers.html', 'today.html', 'mk.css', 'mk-common.js', 'manifest.webmanifest', 'icons/icon-192.png', 'assets/makeen-logo.jpeg'];
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).catch(() => {})); });
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin) return;
  if (r.mode === 'navigate' || r.destination === 'document' || /\.(js|css|json|webmanifest)$/.test(u.pathname)) {
    e.respondWith(fetch(r).then((res) => { const c = res.clone(); caches.open(V).then((x) => x.put(r, c)); return res; }).catch(() => caches.match(r).then((m) => m || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then((m) => m || fetch(r).then((res) => { if (res.ok) { const c = res.clone(); caches.open(V).then((x) => x.put(r, c)); } return res; })));
});
// الإشعارات: مواقيت الصلاة، والورد، وزادك اليومي، وتذكير الحصص (تصل حتى والتطبيق مغلق)
const at = (u) => new URL(String(u || '').replace(/^\//, '') || './', self.registration.scope).href;
// نغمة التنبيه: «حي على الصلاة» للصلاة، و«ألا بذكر الله تطمئن القلوب» للأذكار (تُسمع في التطبيق المفتوح، وعند فتح الإشعار)
const TONE_TAGS = { prayer: 1, adhkar: 1 };
// تُعرف النغمة من نوع الإشعار، أو من عنوانه إن لم يُذكر النوع
const toneOf = (d) => TONE_TAGS[d.tag] ? d.tag : /أذكار|الأذكار/.test(d.title || '') ? 'adhkar' : /وقت صلاة|حان.*الصلاة|الأذان/.test(d.title || '') ? 'prayer' : '';
const withTone = (u, tag) => { if (!TONE_TAGS[tag]) return u; try { const x = new URL(u, self.location.origin); x.searchParams.set('tone', tag); return x.href; } catch (e) { return u; } };
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data && e.data.text() }; }
  const tone = toneOf(d);
  if (tone) e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((l) => l.forEach((c) => c.postMessage({ type: 'mn-tone', tag: tone }))));
  e.waitUntil(self.registration.showNotification(d.title || 'تطبيق MakeenEducation', {
    body: d.body || '', icon: at('icons/icon-192.png'), badge: at('icons/icon-192.png'), dir: 'rtl', lang: 'ar',
    tag: d.tag || undefined, renotify: !!d.tag, data: { url: withTone(d.url || './', tone) },
    actions: d.tag === 'daily' ? [{ action: 'open', title: 'اقرأ' }, { action: 'close', title: '✕ إغلاق' }] : []
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  if (e.action === 'close') return;
  let u = (e.notification.data && e.notification.data.url) || './';
  // صفحات خدمات مكين صارت داخل تطبيق مكين؛ المصحف ومراسلة أ/ ميمونة على موقع ميمونة
  if (/^\/(mushaf\.html|messages\.html(?!\?site=makeen))/.test(u)) u = 'https://maimoonah.com' + u;
  const url = /^https?:/.test(u) ? u : at(u);
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) { if (c.url === url && 'focus' in c) return c.focus(); }
    for (const c of list) { if ('navigate' in c && url.startsWith(self.registration.scope)) return c.navigate(url).then((w) => w && w.focus()); }
    return self.clients.openWindow(url);
  }));
});
