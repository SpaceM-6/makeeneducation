// أدوات مشتركة لصفحات مكين: الاتصال بقاعدة البيانات، والبرامج، والرأس والتذييل
(function () {
  'use strict';
  var SB_URL = 'https://arkopqzjjvrqrcaxroke.supabase.co';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFya29wcXpqanZycXJjYXhyb2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzODM3MzUsImV4cCI6MjEwNzk1OTczNX0.ayR8IjhhlrrBIx-O2-fTvDlyc9Ax3w_JIoYrZ1LztR4';
  var H = { apikey: SB_ANON, Authorization: 'Bearer ' + SB_ANON };
  var MK = window.MK = {
    SB_URL: SB_URL, SB_ANON: SB_ANON, MAIN: 'https://maimoonah.com',
    PROGRAMS: ['برنامج الحفظ والمراجعة والسرد', 'برنامج التفسير الشامل', 'برنامج تصحيح التلاوة المتقدم', 'برنامج الإجازة في قراءة واحدة أو القراءات العشر',
      'برنامج الرقية الشرعية', 'برنامج الإعجاز اللغوي والصوتي في القرآن', 'برنامج أسماء الله الحسنى وصفاته', 'برنامج فقه الدعاء', 'برنامج (اشرح لي كتاب)',
      'برنامج إعداد معلمات القرآن', 'برنامج الإعداد للمسابقات القرآنية', 'برنامج تعليم اللغة العربية بأقسامه', 'برنامج الإجازة في الحديث النبوي',
      'برنامج دراسة مصطلح الحديث', 'برنامج دراسة شروحات الحديث', 'دراسة تاريخ الفقه الإسلامي', 'دراسة أصول الفقه الإسلامي', 'دراسة فقه المسلم',
      'خدمات البحوث الشرعية العلمية', 'برامج الأطفال'],
    esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
    // قراءة عامة من قاعدة البيانات (ما تسمح به الصلاحيات للزوار فقط)
    get: function (path) {
      return fetch(SB_URL + '/rest/v1/' + path, { headers: H }).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); });
    },
    rpc: function (fn, args) {
      return fetch(SB_URL + '/rest/v1/rpc/' + fn, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, H), body: JSON.stringify(args) })
        .then(function (r) { return r.text().then(function (t) { if (!r.ok) throw new Error(t || ('http ' + r.status)); return t ? JSON.parse(t) : null; }); });
    },
    upload: function (bucket, path, blob) {
      return fetch(SB_URL + '/storage/v1/object/' + bucket + '/' + path, { method: 'POST', headers: Object.assign({ 'Content-Type': blob.type || 'image/jpeg', 'x-upsert': 'false' }, H), body: blob })
        .then(function (r) { if (!r.ok) return r.text().then(function (t) { throw new Error(t); }); return path; });
    },
    title: function (t) { return 'أ/ ' + t.first_name; },
    stars: function (avg, n) {
      if (!n) return '<span class="mk-nostars">لا تقييمات بعد</span>';
      var full = Math.round(avg), s = '';
      for (var i = 1; i <= 5; i++) s += '<span class="' + (i <= full ? 'on' : '') + '">★</span>';
      return '<span class="mk-stars" aria-label="' + avg + ' من ٥">' + s + '</span> <b>' + String(avg).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }) + '</b> <small>(' + String(n).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }) + ' ' + (n === 1 ? 'تقييم' : n <= 10 ? 'تقييمات' : 'تقييمًا') + ')</small>';
    },
    avatar: function (t, size) {
      size = size || 96;
      if (!t.photo_url && t.is_head) return '<img class="mk-av" style="width:' + size + 'px;height:' + size + 'px;object-fit:cover;background:#fff" src="assets/maimouna-logo-square.jpg" alt="شعار أ/ ميمونة" loading="lazy">';
      if (t.photo_url) return '<img class="mk-av" style="width:' + size + 'px;height:' + size + 'px" src="' + MK.esc(t.photo_url) + '" alt="' + MK.esc(MK.title(t)) + '" loading="lazy">';
      return '<span class="mk-av mk-av-l" style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * 0.42) + 'px">' + MK.esc((t.first_name || '؟').charAt(0)) + '</span>';
    }
  };
  // الاسم المعروض: الاسم الأول (مع «عبد/أبو/أم» وما بعدها) وأول حرف من الاسم الثاني
  MK.displayName = function (full) {
    var w = String(full || '').trim().split(/\s+/).filter(Boolean);
    if (!w.length) return '';
    var first = w.shift();
    if (/^(عبد|عبدال|أبو|ابو|أم|ام)$/.test(first) && w.length) first += ' ' + w.shift();
    while (w.length && /^(بن|بنت|ابن)$/.test(w[0])) w.shift();
    return w.length ? first + ' ' + w[0].replace(/^ال/, '').charAt(0) + '.' : first;
  };
  // نجوم مكين: بحسب عدد برامج مكين التي يقدّمها المعلم/ة
  MK.progStars = function (n) { return n >= 15 ? 5 : n >= 10 ? 4 : n >= 6 ? 3 : n >= 3 ? 2 : n >= 1 ? 1 : 0; };
  MK.progStarsHtml = function (n) {
    var k = MK.progStars(n), s = '';
    for (var i = 1; i <= 5; i++) s += '<span class="' + (i <= k ? 'on' : '') + '">★</span>';
    var ar = function (x) { return String(x).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
    return '<span class="mk-stars" title="نجوم مكين بحسب عدد البرامج التي يقدّمها">' + s + '</span> <small>' + ar(n) + ' من ' + ar(MK.PROGRAMS.length) + ' برنامجًا</small>';
  };
  MK.LEVELS = ['ثانوي أو ما يعادله', 'دبلوم', 'بكالوريوس / ليسانس', 'دبلوم دراسات عليا', 'ماجستير', 'دكتوراه', 'دراسة شرعية حرة (مشايخ وإجازات)'];
  MK.DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  MK.hourLabel = function (h) { var p = h < 12 ? 'ص' : 'م', x = h % 12 || 12; return String(x).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }) + ' ' + p; };
  // ===== القائمة الجانبية (مثل موقع ميمونة) =====
  var IC = function (d) { return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  MK.MENU = [
    ['#install', 'تثبيت تطبيق MakeenEducation', IC('<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M12 7v7M9 11l3 3 3-3"/>'), 'install'],
    [MK.MAIN + '/student.html', 'لوحة الطالب', IC('<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/><path d="M8 14h3v3H8z"/>'), 'top'],
    [MK.MAIN + '/teacher-panel.html', 'لوحة المعلم', IC('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M8 9h8M8 12h5"/>')],
    ['my.html', 'المفضلة والمحفوظات', IC('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'), 'top'],
    ['index.html', 'الرئيسية', IC('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>')],
    ['index.html#about-makeen-section', 'من نحن وعن شركة مكين', IC('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>')],
    ['programs.html', 'البرامج والتسجيل', IC('<path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5c-3-.5-6 0-8 1.5z"/><path d="M12 6v14.5"/>')],
    ['teachers.html', 'المعلمون والمعلمات', IC('<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><path d="M16 4.5l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z"/>')],
    ['join.html', 'انضم/ي إلى كادر مكين', IC('<circle cx="10" cy="8" r="4"/><path d="M3 21c0-4 3-6.5 7-6.5"/><path d="M18 14v6M15 17h6"/>'), 'gold'],
    ['join-terms.html', 'شروط الالتحاق بكادر مكين التعليمي', IC('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13l2 2 3-3"/>')],
    ['study-terms.html', 'شروط الدراسة في مكين', IC('<path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5c-3-.5-6 0-8 1.5z"/><path d="M12 6v14.5"/><path d="M15 10l1.5 1.5L19 9"/>')],
    [MK.MAIN + '/messages.html', 'مراسلة الإدارة', IC('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>')],
    ['https://wa.me/201013356935', 'تواصل معنا عبر الواتساب', IC('<path d="M5 19l1.2-3.6A7.5 7.5 0 1 1 9 18.4z"/><path d="M9.5 9.5c.3 1.7 1.8 3.4 3.6 3.9l1-1 1.6.8"/>'), 'ext'],
    [MK.MAIN + '/', 'موقع أ/ ميمونة', IC('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>')],
    [MK.MAIN + '/privacy.html', 'سياسة الخصوصية', IC('<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>')]
  ];
  var CSS = '.mk-menu-btn{width:44px;height:44px;border-radius:10px;border:1.5px solid #F3D37A;background:transparent;color:#F3D37A;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto}' +
    '.mk-dov{position:fixed;inset:0;z-index:3000;display:none;justify-content:flex-end;align-items:stretch;background:rgba(18,53,91,.55)}.mk-dov.open{display:flex}' +
    '.mk-drawer{width:50vw;max-width:480px;min-width:230px;height:100%;background:#FFFDF8 url("assets/beige-texture.jpg") repeat;border-right:3px solid #F3D37A;box-shadow:8px 0 30px rgba(0,0,0,.25);padding:14px 14px 24px;overflow-y:auto;animation:mkDrIn .22s ease-out;font-family:Cairo,Tahoma,sans-serif;direction:rtl}' +
    '@keyframes mkDrIn{from{transform:translateX(-100%)}to{transform:none}}' +
    '.mk-drawer a.flag{background:#12355B;color:#F3D37A;border-radius:12px;border:0;margin:4px 0}.mk-drawer a.flag small{display:block;color:#CBD5E1;font-weight:600;font-size:12px}.mk-drawer a.flag .fl{flex:0 0 auto;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.12);border:1.5px solid #F3D37A;display:inline-flex;align-items:center;justify-content:center;overflow:hidden}' +
    '.mk-drawer a.top{font-weight:900}' +
    '.mk-dhead{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #F3D37A;padding-bottom:10px;margin-bottom:8px}' +
    '.mk-dhead strong{color:#12355B;font-size:17px;display:flex;align-items:center;gap:8px}.mk-dhead img{width:36px;height:36px;border-radius:50%;border:2px solid #F3D37A}' +
    '.mk-dx{background:#12355B;color:#fff;border:none;border-radius:8px;padding:4px 10px;font:700 14px Cairo,sans-serif;cursor:pointer}' +
    '.mk-drawer a{display:flex;align-items:center;gap:10px;padding:12px 8px;color:#12355B;text-decoration:none;font-weight:700;font-size:15px;border-bottom:1px solid #E8DCC0}' +
    '.mk-drawer a:hover,.mk-drawer a.cur{background:rgba(243,211,122,.25)}.mk-drawer a svg{flex:0 0 auto;color:#A8822F}' +
    '.mk-drawer a.gold{background:linear-gradient(90deg,#F3D37A,#E5C158);color:#12355B;font-weight:900;border-radius:12px;border:0;margin:6px 0}.mk-drawer a.gold svg{color:#12355B}' +
    '.mk-drawer a.inst{color:#A8822F;font-weight:800}.mk-drawer a[hidden]{display:none}' +
    '@media (max-width:768px){.mk-drawer a{font-size:14px;padding:11px 4px}}' +
    '@media (hover:none){.service-card:hover{transform:none;border-color:#E2E8F0}}' +
    'header .brand-logo-text .mk-two{display:inline-block;line-height:1.45;text-align:center;white-space:nowrap}' +
    '@media (max-width:520px){header .brand-logo-text .mk-two{font-size:15.5px!important}}' +
    '.mk-hact{display:inline-flex;align-items:center;gap:8px;flex:0 0 auto}' +
    '.mk-hflag{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;padding:0;border:0;background:none;text-decoration:none;-webkit-tap-highlight-color:transparent}' +
    '.mk-hflag .fl{width:36px;height:36px;border-radius:50%;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;border:1.5px solid #F3D37A;background:rgba(255,255,255,.12);flex:0 0 auto}.mk-hflag .fl img{width:36px;height:36px;object-fit:cover;display:block}' +
        'footer{padding-bottom:92px!important}body:not(:has(footer)){padding-bottom:88px}';
  (function () { var st = document.createElement('style'); st.textContent = CSS; (document.head || document.documentElement).appendChild(st); })();
  function ensureDrawer() {
    if (document.getElementById('mkDrawer') || !document.body) return;
    var here = location.pathname.split('/').pop() || 'index.html';
    var ov = document.createElement('div'); ov.className = 'mk-dov'; ov.id = 'mkDrawer';
    ov.innerHTML = '<nav class="mk-drawer" aria-label="القائمة"><div class="mk-dhead"><strong><img src="assets/makeen-logo.jpeg" alt="">القائمة</strong><button type="button" class="mk-dx">✕ إغلاق</button></div>' +
      MK.MENU.map(function (m) {
        var cls = m[3] === 'gold' ? 'gold' : m[3] === 'install' ? 'inst' : m[3] === 'flag' ? 'flag' : m[3] === 'top' ? 'top' + (m[0] === here ? ' cur' : '') : (m[0] === here ? 'cur' : '');
        if (m[3] === 'flag') return '<a href="' + m[0] + '" class="flag" data-flag><span class="fl">' + m[2] + '</span><span><b>' + m[1] + '</b><small data-place></small></span></a>';
        return '<a href="' + m[0] + '"' + (cls ? ' class="' + cls + '"' : '') + (m[3] === 'install' ? ' data-install hidden' : '') + (m[3] === 'ext' ? ' target="_blank" rel="noopener"' : '') + (m[0] === here ? ' aria-current="page"' : '') + '>' + m[2] + m[1] + '</a>';
      }).join('') + '</nav>';
    ov.onclick = function (e) {
      if (e.target === ov || e.target.closest('.mk-dx')) return MK.closeDrawer();
      var a = e.target.closest('a'); if (!a) return;
      if (a.hasAttribute('data-install')) { e.preventDefault(); MK.closeDrawer(); if (window.mnInstallApp) window.mnInstallApp(); return; }
      MK.closeDrawer();
    };
    document.body.appendChild(ov);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') MK.closeDrawer(); });
    var standalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    if (!standalone) setTimeout(function () { var i = ov.querySelector('[data-install]'); if (i && (window.mnInstallApp)) i.hidden = false; }, 300);
  }
  // علم الدولة والمدينة في أول القائمة (من بيانات الطالب في هذا الجهاز)
  function renderFlagItem() {
    var a = document.querySelector('#mkDrawer [data-flag]'); if (!a) return;
    var p = window.MNApp && MNApp.profile && MNApp.profile();
    if (p && p.done && MNApp.flagHtml) {
      a.querySelector('.fl').innerHTML = MNApp.flagHtml(p.cc, 26);
      a.querySelector('[data-place]').textContent = (p.city || '') + (p.country && p.country !== 'دولة أخرى' ? '، ' + p.country : '');
    } else a.querySelector('[data-place]').textContent = 'حدّد/ي دولتك ومدينتك';
  }
  document.addEventListener('mn-profile', renderFlagItem);
  // علم الدولة و«يومي» في الشريط العلوي بجانب زر القائمة
  function headerFlag() {
    var p = window.MNApp && MNApp.profile && MNApp.profile();
    var fl = p && p.done && MNApp.flagHtml ? MNApp.flagHtml(p.cc, 30) : '🌍';
    var title = p && p.done ? 'يومي: مواقيت الصلاة والورد · ' + (p.city || '') + (p.country && p.country !== 'دولة أخرى' ? '، ' + p.country : '') : 'يومي: مواقيت الصلاة والورد';
    document.querySelectorAll('.mk-menu-btn').forEach(function (btn) {
      var a = btn.parentNode.classList.contains('mk-hact') ? btn.parentNode.querySelector('.mk-hflag') : null;
      if (!a) {
        var w = document.createElement('span'); w.className = 'mk-hact';
        a = document.createElement('a'); a.className = 'mk-hflag'; a.href = 'today.html';
        btn.parentNode.insertBefore(w, btn); w.appendChild(a); w.appendChild(btn);
      }
      a.innerHTML = '<span class="fl">' + fl + '</span>'; a.title = title; a.setAttribute('aria-label', title);
    });
  }
  document.addEventListener('mn-profile', headerFlag);
  document.addEventListener('DOMContentLoaded', function () { headerFlag(); setTimeout(headerFlag, 800); });
  MK.openDrawer = function () { ensureDrawer(); renderFlagItem(); document.getElementById('mkDrawer').classList.add('open'); };
  MK.closeDrawer = function () { var d = document.getElementById('mkDrawer'); if (d) d.classList.remove('open'); };
  window.mkOpenDrawer = MK.openDrawer;
  // سحب القائمة باليد من الحافة اليسرى (القائمة تفتح من اليسار)
  (function () {
    var EDGE = 32, DIST = 55, sx = 0, sy = 0, mode = '', done = false;
    var isOpen = function () { var d = document.getElementById('mkDrawer'); return !!(d && d.classList.contains('open')); };
    document.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { mode = ''; return; }
      var t = e.touches[0]; sx = t.clientX; sy = t.clientY; done = false; mode = '';
      if (!isOpen()) { if (!document.querySelector('.mn-ob, .modal-overlay[style*="flex"], .mc-panel.open') && sx <= EDGE) mode = 'open'; }
      else { var p = document.querySelector('#mkDrawer .mk-drawer'); if (p && p.contains(e.target)) mode = 'close'; }
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      if (!mode || done) return;
      var t = e.touches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) { mode = ''; return; }
      if (mode === 'open' && dx > DIST) { done = true; MK.openDrawer(); }
      else if (mode === 'close' && dx < -DIST) { done = true; MK.closeDrawer(); }
    }, { passive: true });
    document.addEventListener('touchend', function () { mode = ''; }, { passive: true });
  })();
  MK.MENU_ICON = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  // الرأس الموحد لصفحات مكين الجديدة: زر القائمة، والشعار
  MK.header = function () {
    return '<header class="mk-top"><a class="mk-brand" href="index.html"><img src="assets/makeen-logo.jpeg" alt="شعار شركة مكين"><span>شركة مكين</span></a>' +
      '<button type="button" class="mk-menu-btn" onclick="mkOpenDrawer()" aria-label="القائمة">' + MK.MENU_ICON + '</button></header>';
  };
  // ===== زر التواصل العائم (بلا شات مباشر) =====
  var FAB_CSS = '.mc-fab{position:fixed;bottom:16px;left:16px;z-index:1900;width:56px;height:56px;border-radius:50%;border:2px solid #F3D37A;background:#12355B;color:#F3D37A;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 22px rgba(18,53,91,.35);-webkit-tap-highlight-color:transparent}' +
    '.mc-panel{position:fixed;bottom:84px;left:16px;z-index:1900;width:290px;max-width:calc(100vw - 32px);background:#FFFDF8;border:1.5px solid #DCC79A;border-radius:16px;box-shadow:0 14px 34px rgba(74,56,24,.25);padding:16px;font-family:Cairo,Tahoma,sans-serif;direction:rtl;display:none}' +
    '.mc-panel.open{display:block;animation:mcIn .2s ease-out}@keyframes mcIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
    '.mc-panel h3{margin:0 0 12px;font-size:18px;color:#12355B;font-weight:800;display:flex;justify-content:space-between;align-items:center}' +
    '.mc-x{background:none;border:none;font-size:20px;color:#4A3818;cursor:pointer;line-height:1;padding:2px 6px}' +
    '.mc-row{display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:10px;text-decoration:none;color:#4A3818;background:#F6EEE2;margin-top:8px;font-weight:700;font-size:14.5px}' +
    '.mc-row:hover{background:#EFE2CB}.mc-row svg{flex:0 0 auto;color:#A8822F}.mc-row small{display:block;font-weight:600;color:#6B5320;font-size:13px;unicode-bidi:isolate;text-align:right}' +
    '.mc-row.gold{background:linear-gradient(90deg,#F3D37A,#E5C158);color:#12355B}.mc-row.gold svg{color:#12355B}';
  var SV = function (d) { return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  function ensureFab() {
    if (document.getElementById('mcFab') || !document.body) return;
    var st = document.createElement('style'); st.textContent = FAB_CSS; document.head.appendChild(st);
    var wa = 'https://wa.me/201013356935?text=' + encodeURIComponent('السلام عليكم ورحمة الله وبركاته، لديّ استفسار عن برامج شركة مكين');
    var b = document.createElement('button'); b.type = 'button'; b.className = 'mc-fab'; b.id = 'mcFab'; b.setAttribute('aria-label', 'تواصل معنا'); b.setAttribute('aria-expanded', 'false');
    b.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/></svg>';
    var p = document.createElement('div'); p.className = 'mc-panel'; p.id = 'mcPanel'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'تواصل معنا');
    p.innerHTML = '<h3>تواصل مع مكين <button type="button" class="mc-x" aria-label="إغلاق">✕</button></h3>' +
      '<a class="mc-row" href="' + wa + '" target="_blank" rel="noopener">' + SV('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9 9.5c.3 2.2 2.3 4.2 4.5 4.5l1-1.2 1.6.8"/>') + '<span>واتساب مكين<small dir="ltr">+20 101 335 6935</small></span></a>' +
      // بريد مكين يُضاف هنا بعد إنشائه (info@makeeneducation.com)
      '<a class="mc-row" href="programs.html">' + SV('<path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5c-3-.5-6 0-8 1.5z"/><path d="M12 6v14.5"/>') + '<span>البرامج والتسجيل<small>اختر/ي برنامجك وسجّل/ي</small></span></a>' +
      '<a class="mc-row gold" href="join.html">' + SV('<circle cx="10" cy="8" r="4"/><path d="M3 21c0-4 3-6.5 7-6.5"/><path d="M18 14v6M15 17h6"/>') + '<span>انضم/ي إلى كادر مكين<small style="color:#12355B">للمعلمين والمعلمات</small></span></a>' +
      '<a class="mc-row" href="' + MK.MAIN + '/complaints.html?from=makeen">' + SV('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M12 8v4.5"/><path d="M12 15.5h.01"/>') + '<span>الشكاوى والبلاغات<small>رسالة مباشرة إلى الإدارة</small></span></a>';
    var tog = function (on) { on = on == null ? !p.classList.contains('open') : on; p.classList.toggle('open', on); b.setAttribute('aria-expanded', on); };
    b.onclick = function () { tog(); };
    p.querySelector('.mc-x').onclick = function () { tog(false); };
    document.addEventListener('click', function (e) { if (p.classList.contains('open') && !p.contains(e.target) && !b.contains(e.target)) tog(false); });
    document.body.appendChild(b); document.body.appendChild(p);
  }
  // روابط سياسة الخصوصية والشروط في كل صفحات مكين (تُخدم من موقع ميمونة)
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href="terms.html"]').forEach(function (a) { a.href = 'study-terms.html'; });
    document.querySelectorAll('a[href="privacy.html"],a[href="refund.html"]').forEach(function (a) { a.href = MK.MAIN + '/' + a.getAttribute('href'); });
    var f = document.querySelector('footer'); if (!f || f.querySelector('a[href$="privacy.html"]')) return;
    var p = document.createElement('p'); p.style.cssText = 'margin:6px 0 0;font-size:13.5px';
    p.innerHTML = '<a href="' + MK.MAIN + '/privacy.html" style="color:inherit">سياسة الخصوصية</a> · <a href="join-terms.html" style="color:inherit">شروط الالتحاق بكادر مكين</a> · <a href="study-terms.html" style="color:inherit">شروط الدراسة للطلاب</a>';
    f.appendChild(p);
  });
  document.addEventListener('DOMContentLoaded', ensureFab);
  document.addEventListener('DOMContentLoaded', ensureDrawer);
})();
