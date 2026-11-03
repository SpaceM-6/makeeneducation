// حماية من وضع الموقع داخل إطار موقع آخر (انتحال الصفحة أو خداع النقر): يُسمح فقط بإطارات من موقعي ميمونة ومكين
(function () {
  try {
    if (window.top === window.self) return;
    var ok = /(^|\.)maimoonah\.com$|^spacem-6\.github\.io$|^localhost$|^127\.0\.0\.1$/;
    var anc = location.ancestorOrigins;
    var bad = anc && anc.length ? [].some.call(anc, function (o) { try { return !ok.test(new URL(o).hostname); } catch (e) { return true; } }) : false;
    if (!anc) { try { void window.top.location.hostname; } catch (e) { bad = true; } }
    if (bad) { document.documentElement.style.display = 'none'; window.top.location = location.href; }
  } catch (e) {}
})();
// حماية نصوص الموقع من النسخ (مثل قسم «مدخل إلى التفوق»): لا تحديد ولا نسخ ولا قائمة ولا سحب ولا طباعة،
// مع بقاء الكتابة في الحقول والنسخ من أزرار «نسخ الرابط». لوحات الإدارة والمعلمين والطلاب مستثناة.
(function () {
  if (/(admin|teacher-panel|messages|student|room|mushaf)[^/]*\.html$/i.test(location.pathname)) return;
  // المسموح نسخه فقط: الحقول، والروابط والبريد والهاتف، والأرقام اللاتينية (رقم الترخيص والطلب)، وما عُلِّم data-allow-copy
  var COPYABLE = 'input, textarea, select, [contenteditable="true"], [data-allow-copy], a[href^="mailto:"], a[href^="tel:"], [dir="ltr"], bdi, code';
  var editable = function (t) { t = t && (t.nodeType === 1 ? t : t.parentNode); return !!(t && t.closest && t.closest(COPYABLE)); };
  var st = document.createElement('style');
  st.textContent = 'body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}input,textarea,select,[contenteditable="true"],[data-allow-copy],[data-allow-copy] *,a[href^="mailto:"],a[href^="tel:"],[dir="ltr"],[dir="ltr"] *,bdi,code{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}a[href]{-webkit-touch-callout:default}img{-webkit-user-drag:none}@media print{body{display:none!important}}';
  (document.head || document.documentElement).appendChild(st);
  ['copy', 'cut', 'contextmenu', 'selectstart', 'dragstart'].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      if (editable(e.target) || ((ev === 'copy' || ev === 'cut') && editable(document.activeElement))) return;
      if (ev === 'copy') { var sel = window.getSelection && window.getSelection(); if (sel && sel.rangeCount && editable(sel.anchorNode) && editable(sel.focusNode)) return; }
      if (ev === 'contextmenu') { var t = e.target && (e.target.nodeType === 1 ? e.target : e.target.parentNode); if (t && t.closest && t.closest('a[href]') && !t.closest('img, picture, svg')) return; }
      e.preventDefault();
      if (ev === 'copy' && e.clipboardData) { try { e.clipboardData.setData('text/plain', ''); } catch (x) {} }
    }, true);
  });
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'a'].indexOf(k) >= 0 && !editable(document.activeElement)) e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && ['p', 's', 'u'].indexOf(k) >= 0) e.preventDefault();
  }, true);
})();
// تثبيت الموقع تطبيقًا على الجوال
(function () {
  if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  var standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  var ua = navigator.userAgent || '';
  var ios = /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  var deferred = null;
  var android = /android/i.test(ua);
  var samsung = /SamsungBrowser/i.test(ua);
  var chrome = android && /Chrome\//.test(ua) && !/SamsungBrowser|EdgA|OPR|YaBrowser|Firefox|FxiOS|MiuiBrowser|HuaweiBrowser|UCBrowser|wv\)/i.test(ua);
  function show(on) { document.querySelectorAll('[data-install]').forEach(function (el) { el.hidden = !on; }); }
  function seen() { try { return localStorage.getItem('mk_app_bar') === '1'; } catch (e) { return false; } }
  function ensureCss() {
    if (document.getElementById('mn-pwa-css')) return;
    var st = document.createElement('style'); st.id = 'mn-pwa-css';
    st.textContent = '.app-bar{position:fixed;left:10px;right:10px;bottom:10px;z-index:2400;display:flex;align-items:center;gap:10px;background:#12355B;color:#fff;border:1.5px solid #F3D37A;border-radius:16px;padding:8px 10px;box-shadow:0 10px 30px rgba(0,0,0,.25);font-family:Cairo,Tahoma,sans-serif;animation:appUp .3s ease-out}.app-bar img{width:42px;height:42px;border-radius:10px}.app-bar div{flex:1;line-height:1.4}.app-bar b{display:block;color:#F3D37A}.app-bar small{font-size:12.5px;color:#E2E8F0}.app-bar-ok{background:#F3D37A;color:#12355B;border:0;border-radius:999px;padding:7px 16px;font:800 14px Cairo,Tahoma,sans-serif;cursor:pointer}.app-bar-x{background:none;border:0;color:#CBD5E1;font-size:18px;cursor:pointer;padding:4px}@keyframes appUp{from{transform:translateY(120%)}to{transform:none}}' +
      '.app-howto{position:fixed;inset:0;z-index:3100;background:rgba(18,53,91,.5);display:flex;align-items:flex-end;justify-content:center;padding:12px;font-family:Cairo,Tahoma,sans-serif}.app-howto>div{background:#FFFDF8;border:1.5px solid #F3D37A;border-radius:18px;max-width:420px;width:100%;padding:18px;color:#2B2416;line-height:1.9;text-align:right}.app-howto h3{margin:0 0 6px;color:#12355B;text-align:center}.app-howto ol{margin:0 0 12px;padding-right:20px}.app-howto p{line-height:1.8}.app-howto button{display:block;margin-top:8px;width:100%;background:#12355B;color:#F3D37A;border:0;border-radius:999px;padding:10px;font:800 15px Cairo,Tahoma,sans-serif;cursor:pointer}';
    document.head.appendChild(st);
  }
  function bar() {
    if (standalone || seen() || !document.body || !document.body.hasAttribute('data-app-bar')) return;
    if (!/android|iphone|ipad|ipod/i.test(ua) && !ios) return;
    var b = document.createElement('div'); b.className = 'app-bar';
    b.innerHTML = '<img src="icons/icon-192.png" alt=""><div><b>تطبيق MakeenEducation</b><small>ثبّته على جوالك وافتحه بلمسة</small></div><button type="button" class="app-bar-ok">تثبيت</button><button type="button" class="app-bar-x" aria-label="إغلاق">✕</button>';
    ensureCss();
    var close = function () { b.remove(); try { localStorage.setItem('mk_app_bar', '1'); } catch (e) {} };
    b.querySelector('.app-bar-x').onclick = close;
    b.querySelector('.app-bar-ok').onclick = function () { close(); window.mnInstallApp(); };
    setTimeout(function () { if (deferred || ios || (android && !chrome)) document.body.appendChild(b); }, 6000);
  }
  function howto(viaOther) {
    ensureCss();
    var d = document.createElement('div'); d.className = 'app-howto';
    var url = location.href.replace(/[?#].*$/, '').replace(/[^/]*$/, '');
    if (ios) {
      d.innerHTML = '<div><h3>تثبيت التطبيق على الآيفون</h3><ol><li>افتح/ي الموقع من متصفح <b>Safari</b>.</li><li>اضغط/ي زر المشاركة <b>⬆︎</b> أسفل الشاشة.</li><li>اختر/ي <b>«إضافة إلى الشاشة الرئيسية»</b> ثم <b>«إضافة»</b>.</li></ol><button type="button">حسنًا</button></div>';
    } else if (android && !chrome) {
      d.innerHTML = '<div><h3>ثبّت/ي التطبيق من متصفح Google Chrome</h3>' +
        '<p style="margin:0 0 6px">لا بد من تثبيت التطبيق على أندرويد من متصفح <b>Google Chrome</b> ليُثبَّت بشكل سليم.</p>' +
        '<ol><li>اضغط/ي الزر بالأسفل ليُفتح الموقع في Chrome.</li><li>من قائمة <b>⋮</b> أعلى الشاشة اختر/ي <b>«تثبيت التطبيق»</b>.</li></ol>' +
        '<button type="button" data-chrome>افتح/ي الموقع في Chrome</button>' +
        '<button type="button" data-close style="margin-top:8px;background:none;color:#6B5320;font-weight:700">إغلاق</button></div>';
    } else {
      d.innerHTML = '<div><h3>تثبيت التطبيق</h3><ol><li>افتح/ي قائمة المتصفح <b>⋮</b> أعلى الشاشة.</li><li>اختر/ي <b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b>.</li></ol>' + '<button type="button">حسنًا</button></div>';
    }
    d.onclick = function (e) {
      var t = e.target;
      if (t.hasAttribute && t.hasAttribute('data-chrome')) {
        location.href = 'intent://' + url.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(url) + ';end';
        return;
      }
      if (t === d || t.tagName === 'BUTTON') d.remove();
    };
    document.body.appendChild(d);
  }
  // نافذة تثبيت مباشرة: زر «ثبّت/ي الآن» يطلب التثبيت من المتصفح، مع التنبيه إلى التثبيت من Chrome
  function installDialog(title) {
    ensureCss();
    var old = document.querySelector('.app-howto'); if (old) old.remove();
    var d = document.createElement('div'); d.className = 'app-howto';
    d.innerHTML = '<div><h3>' + title + '</h3><p style="margin:0 0 10px;line-height:1.9">ليُثبَّت التطبيق بشكل صحيح ثبّته/يه من متصفح <b>Google Chrome</b>.</p>' +
      '<button type="button" data-go>ثبّت/ي الآن</button>' +
      '<button type="button" data-close style="margin-top:8px;background:none;color:#6B5320;font-weight:700">لاحقًا</button>' +
      '<p data-msg style="margin:8px 0 0;font-size:13px;line-height:1.8;color:#6B5320"></p></div>';
    var msg = d.querySelector('[data-msg]');
    d.onclick = function (e) {
      var t = e.target;
      if (t === d || (t.hasAttribute && t.hasAttribute('data-close'))) { d.remove(); return; }
      if (t.hasAttribute && t.hasAttribute('data-go')) {
        if (deferred) { var p = deferred; p.prompt(); p.userChoice.finally(function () { deferred = null; d.remove(); }); return; }
        msg.textContent = 'التطبيق مثبّت على جوالك بالفعل، أو أن المتصفح لم يُجهّز التثبيت بعد. انتظر/ي ثواني ثم اضغط/ي «ثبّت/ي الآن» مرة أخرى.';
      }
    };
    document.body.appendChild(d);
  }
  window.mnInstallApp = function () {
    // صفحات مكين على موقع ميمونة: تطبيق مكين يُثبَّت من موقع مكين المستقل (تطبيق ميمونة يشمل نطاق الموقع كله)
    if (/^\/makeen(\/|$)/.test(location.pathname)) { var mk = (window.MN && MN.mkDomainLive && MN.mkDomainLive()) ? 'https://makeeneducation.com/' : 'https://spacem-6.github.io/makeeneducation/'; location.href = mk + '?install=1'; return; }
    if (android && !chrome) { howto(); return; }
    if (ios) { howto(); return; }
    if (deferred) { deferred.prompt(); deferred.userChoice.finally(function () { deferred = null; }); return; }
    installDialog('تثبيت تطبيق MakeenEducation');
  };
  // فتح الصفحة برابط ?install=1 يعرض نافذة التثبيت مباشرة
  if (/[?&]install=1/.test(location.search) && !standalone) document.addEventListener('DOMContentLoaded', function () { setTimeout(function () { window.mnInstallApp(); }, 400); });
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; show(true); });
  window.addEventListener('appinstalled', function () { deferred = null; show(false); try { localStorage.setItem('mk_app_bar', '1'); } catch (e) {} });
  document.addEventListener('DOMContentLoaded', function () { show(!standalone); bar(); });
})();

