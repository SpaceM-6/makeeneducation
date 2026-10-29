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
      if (t.photo_url) return '<img class="mk-av" style="width:' + size + 'px;height:' + size + 'px" src="' + MK.esc(t.photo_url) + '" alt="' + MK.esc(MK.title(t)) + '" loading="lazy">';
      return '<span class="mk-av mk-av-l" style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * 0.42) + 'px">' + MK.esc((t.first_name || '؟').charAt(0)) + '</span>';
    }
  };
  // الرأس الموحد لصفحات مكين الجديدة
  MK.header = function (active) {
    var links = [['index.html', 'الرئيسية'], ['programs.html', 'البرامج'], ['teachers.html', 'المعلمون والمعلمات'], ['join.html', 'انضم/ي إلى الكادر']];
    return '<header class="mk-top"><a class="mk-brand" href="index.html"><img src="assets/makeen-logo.jpeg" alt="شعار شركة مكين"><span>شركة مكين</span></a><nav>' +
      links.map(function (l) { return '<a href="' + l[0] + '"' + (l[0] === active ? ' class="on" aria-current="page"' : '') + '>' + l[1] + '</a>'; }).join('') + '</nav></header>';
  };
})();
