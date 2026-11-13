/* حسابات التواصل الاجتماعي لشركة مكين — تظهر في التذييل ونافذة «تواصل معنا» وصفحة التواصل */
(function () {
  var S = [
    { n: 'فيسبوك', u: 'https://www.facebook.com/makeeneducation', c: '#1877F2',
      d: 'M14 8.5V6.8c0-.8.5-1 .9-1H17V2.2L14.1 2.2C10.9 2.2 10.2 4.6 10.2 6.1v2.4H8v3.7h2.2V22h3.8v-9.8h2.9l.4-3.7z' },
    { n: 'إنستغرام', u: 'https://www.instagram.com/makeeneducation', c: '#C13584',
      d: 'M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM16.3 2H7.7A5.7 5.7 0 0 0 2 7.7v8.6A5.7 5.7 0 0 0 7.7 22h8.6a5.7 5.7 0 0 0 5.7-5.7V7.7A5.7 5.7 0 0 0 16.3 2zm4 14.3a4 4 0 0 1-4 4H7.7a4 4 0 0 1-4-4V7.7a4 4 0 0 1 4-4h8.6a4 4 0 0 1 4 4z' },
    { n: 'يوتيوب', u: 'https://www.youtube.com/@makeeneducation', c: '#FF0000',
      d: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z' },
    { n: 'تيك توك', u: 'https://www.tiktok.com/@makeeneducation', c: '#111111',
      d: 'M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2.1-2.8V9a6.3 6.3 0 1 0 5.4 6.2V8.6a7.8 7.8 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.4z' }
  ];
  function ico(s, size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="' + s.d + '"/></svg>';
  }
  function row(cls) {
    return '<div class="' + cls + '" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:10px">' +
      S.map(function (s) {
        return '<a href="' + s.u + '" target="_blank" rel="noopener" aria-label="' + s.n + '" title="' + s.n + '" style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#fff;color:' + s.c + ';box-shadow:0 1px 4px rgba(0,0,0,.15);text-decoration:none">' + ico(s, 20) + '</a>';
      }).join('') + '</div>';
  }
  function run() {
    document.querySelectorAll('footer').forEach(function (f) {
      if (f.querySelector('.mn-social')) return;
      var p = document.createElement('div'); p.innerHTML = '<p style="margin:10px 0 0;font-weight:700">تابعونا على حساباتنا</p>' + row('mn-social');
      f.appendChild(p);
    });
    // القائمة الجانبية
    var dr = document.querySelector('#mkDrawer .mk-drawer') || document.querySelector('.mk-drawer');
    if (dr && !dr.querySelector('.mn-social')) {
      var q = document.createElement('div'); q.style.cssText = 'padding:14px 4px 4px;text-align:center;border-top:1px solid #E2E8F0;margin-top:8px';
      q.innerHTML = '<small style="font-weight:800;color:#12355B">تابعونا على حساباتنا</small>' + row('mn-social');
      dr.appendChild(q);
    }
    var panel = document.getElementById('mcPanel');
    if (panel && !panel.querySelector('.mn-social')) {
      var d = document.createElement('div'); d.style.cssText = 'padding:8px 4px 4px;text-align:center';
      d.innerHTML = '<small style="font-weight:700;opacity:.8">تابعونا على حساباتنا</small>' + row('mn-social');
      panel.appendChild(d);
    }
    document.querySelectorAll('[data-social-ways]').forEach(function (box) {
      if (box.dataset.done) return; box.dataset.done = '1';
      box.innerHTML = S.map(function (s) {
        return '<a class="way" href="' + s.u + '" target="_blank" rel="noopener"><span class="ic" style="color:' + s.c + '">' + ico(s, 24) + '</span><span><b>' + s.n + '</b><small>شركة مكين على ' + s.n + '</small></span><span class="go">‹</span></a>';
      }).join('');
    });
  }
  window.__mkSocial = 1;
  // فقاعة التواصل والقائمة الجانبية تُبنى بعد تحميل الصفحة، فنعيد المحاولة حتى تظهرا
  function later() { run(); var n = 0, t = setInterval(function () { run(); if (++n > 20 || (document.getElementById('mcPanel') && document.querySelector('.mk-drawer'))) clearInterval(t); }, 500); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', later); else later();
  document.addEventListener('click', function () { setTimeout(run, 50); }, true);
})();
