// تطبيق MakeenEducation: الصفحات من الشبكة أولًا، والصور والملفات من الذاكرة
const V = 'mk-202610291800';
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
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'تطبيق MakeenEducation', {
    body: d.body || '', icon: at('icons/icon-192.png'), badge: at('icons/icon-192.png'), dir: 'rtl', lang: 'ar',
    tag: d.tag || undefined, renotify: !!d.tag, data: { url: d.url || './' },
    actions: d.tag === 'daily' ? [{ action: 'open', title: 'اقرأ' }, { action: 'close', title: '✕ إغلاق' }] : []
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  if (e.action === 'close') return;
  let u = (e.notification.data && e.notification.data.url) || './';
  if (/^\/(student|messages|mushaf|room)\.html/.test(u)) u = 'https://maimoonah.com' + u;
  const url = /^https?:/.test(u) ? u : at(u);
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) { if (c.url === url && 'focus' in c) return c.focus(); }
    for (const c of list) { if ('navigate' in c && url.startsWith(self.registration.scope)) return c.navigate(url).then((w) => w && w.focus()); }
    return self.clients.openWindow(url);
  }));
});
