/* ADK - wizualizacja: menu, dolny pasek, wyszukiwarka ofert, karta oferty */
(function () {
  var TEL = '+48662954458', WA = 'https://wa.me/48662954458';
  var KRAJE = ['Szwajcaria', 'Niemcy', 'Holandia', 'Dania'];
  var FLAGI = {
    Szwajcaria: '<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#d52b1e"/><path d="M13 4h4v4.5h4.5v3H17V16h-4v-4.5H8.5v-3H13z" fill="#fff"/></svg>',
    Niemcy: '<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="7" fill="#000"/><rect y="6.67" width="30" height="6.67" fill="#dd0000"/><rect y="13.33" width="30" height="6.67" fill="#ffce00"/></svg>',
    Holandia: '<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="7" fill="#ae1c28"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#21468b"/></svg>',
    Dania: '<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#c8102e"/><path d="M9 0h3.5v20H9zM0 8.25h30v3.5H0z" fill="#fff"/></svg>'
  };
  /* grupy zawodów - liczone na żywo z ogłoszeń */
  var GRUPY = {
    spawacze: { n: 'Spawacze', r: /spawacz/i },
    rurociagi: { n: 'Monterzy rurociągów', r: /\brur|rurociąg/i },
    elektrycy: { n: 'Elektrycy', r: /elektry/i },
    ciesle: { n: 'Cieśle i zbrojarze', r: /cieśla|zbroj|prefabryk/i },
    murarze: { n: 'Murarze, tynkarze, płytkarze', r: /murarz|tynkarz|płytkarz|wyburz/i },
    maszyny: { n: 'Operatorzy i roboty drogowe', r: /operator|dźwig|drogow|kierowca/i },
    montaz: { n: 'Monterzy i hydraulicy', r: /monter\*ka (płyt|fasad|docieple|okien|ścian|rusztow|konstrukcji|izolacji|wentylacji|co|instalacji|mebli)|ślusarz|hydraulik/i },
    wykonczenia: { n: 'Malarze, stolarze, dekarze', r: /malarz|lakiernik|parkiet|pcv|stolarz|dekarz/i },
    mechanicy: { n: 'Mechanicy', r: /mechanik|opon/i },
    produkcja: { n: 'Produkcja i CNC', r: /produkcj|cnc|giętark/i }
  };
  var D = window.OFERTY || [];
  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l'); }
  function fl(k) { return FLAGI[k] || ''; }
  function okres(c) { return c ? 'Okres: ' + c : ''; }
  function karta(o) {
    return '<a class="karta" href="oferta.html?o=' + o.s + '">' +
      '<img src="img/o-' + o.i + '.webp" width="480" height="320" loading="lazy" decoding="async" alt="">' +
      '<div class="karta-in"><span class="karta-k">' + fl(o.k) + esc(o.m && o.m !== o.k ? o.m : o.k) + '</span>' +
      '<h3>' + esc(o.t) + '</h3>' + (o.z ? '<span class="karta-z">' + esc(o.z) + '</span>' : '') +
      (o.c ? '<span class="karta-o">' + esc(okres(o.c)) + '</span>' : '') + '</div></a>';
  }
  function pasuje(o, q, k, g) {
    if (k && o.k !== k) return false;
    if (g && GRUPY[g] && !GRUPY[g].r.test(o.t)) return false;
    if (q) {
      var h = norm(o.t + ' ' + o.tg + ' ' + o.zk), ws = norm(q).split(/\s+/).filter(Boolean);
      for (var i = 0; i < ws.length; i++) if (h.indexOf(ws[i]) < 0) return false;
    }
    return true;
  }
  function odm(n) { return n === 1 ? 'oferta' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 'oferty' : 'ofert'; }
  window.ADK = { D: D, GRUPY: GRUPY, karta: karta, odm: odm, fl: fl };

  /* menu */
  var bur = document.querySelector('.burger'), pan = document.getElementById('panel');
  if (bur && pan) {
    bur.addEventListener('click', function () {
      var o = pan.hidden; pan.hidden = !o; bur.setAttribute('aria-expanded', o);
      document.body.style.overflow = o ? 'hidden' : '';
    });
    pan.addEventListener('click', function (e) { if (e.target.closest('a')) { pan.hidden = true; bur.setAttribute('aria-expanded', false); document.body.style.overflow = ''; } });
  }
  /* dolny pasek dopiero po przewinięciu za przyciski z pierwszego ekranu */
  var mob = document.querySelector('.mob'), str = document.querySelector('[data-straz]');
  if (mob && str && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { var e = en[0]; mob.classList.toggle('widac', !e.isIntersecting && e.boundingClientRect.top < 0); }).observe(str);
  }

  /* liczniki w kaflach zawodów i krajów */
  document.querySelectorAll('[data-licz-g]').forEach(function (el) { var g = el.getAttribute('data-licz-g'); var n = D.filter(function (o) { return GRUPY[g].r.test(o.t); }).length; el.textContent = n + ' ' + odm(n); });
  document.querySelectorAll('[data-licz-k]').forEach(function (el) { var k = el.getAttribute('data-licz-k'); var n = D.filter(function (o) { return o.k === k; }).length; el.textContent = n + ' ' + odm(n); });
  document.querySelectorAll('[data-licz-all]').forEach(function (el) { el.textContent = D.length; });

  /* wyszukiwarka (strona główna i lista ofert) */
  var fq = document.getElementById('q'), fk = document.getElementById('k'), lista = document.getElementById('lista');
  if (fq && lista) {
    var tryb = lista.getAttribute('data-tryb'); /* "glowna" - 6 kart, "wszystkie" */
    var info = document.getElementById('info'), wiecej = document.getElementById('wiecej');
    var P = new URLSearchParams(location.search), g = P.get('g') || '';
    if (P.get('q')) fq.value = P.get('q');
    if (P.get('k')) fk.value = P.get('k');
    var wyrozn = (lista.getAttribute('data-wyrozn') || '').split(',');
    var gl = document.getElementById('grupa-info');
    var LIM = matchMedia('(max-width:760px)').matches ? 4 : 6;
    function rysuj() {
      var q = fq.value.trim(), k = fk.value, r = D.filter(function (o) { return pasuje(o, q, k, g); });
      var pokaz = r;
      if (tryb === 'glowna') {
        if (!q && !k && !g) pokaz = wyrozn.map(function (s) { return D.find(function (o) { return o.s === s; }); }).filter(Boolean).slice(0, LIM);
        else pokaz = r.slice(0, LIM);
      }
      lista.innerHTML = pokaz.length ? pokaz.map(karta).join('') : '<div class="brak">Brak ogłoszeń dla tego wyszukiwania. Wyślij CV - odezwiemy się, gdy pojawi się praca w Twoim zawodzie.</div>';
      if (lista.classList.contains('karty') && !pokaz.length) lista.style.display = 'block'; else lista.style.display = '';
      if (info) {
        if (tryb === 'glowna' && !q && !k && !g) info.innerHTML = '<span>Wybrane ogłoszenia z budownictwa i przemysłu</span><span>Wszystkich ogłoszeń: <b>' + D.length + '</b></span>';
        else info.innerHTML = '<span>Znaleziono: <b>' + r.length + ' ' + odm(r.length) + '</b>' + (tryb === 'glowna' && r.length > LIM ? ' (pokazano ' + LIM + ')' : '') + '</span>';
      }
      if (wiecej) {
        var u = new URLSearchParams(); if (q) u.set('q', q); if (k) u.set('k', k); if (g) u.set('g', g);
        var a = wiecej.querySelector('a'); a.href = 'oferty.html' + (u.toString() ? '?' + u : '');
        a.textContent = (q || k || g) ? 'Zobacz wszystkie wyniki (' + r.length + ')' : 'Zobacz wszystkie oferty (' + D.length + ')';
        wiecej.hidden = (q || k || g) && r.length <= LIM;
      }
      if (gl) gl.innerHTML = g && GRUPY[g] ? 'Zawód: <b>' + GRUPY[g].n + '</b> <button type="button" class="chip" id="g-x">pokaż wszystkie zawody</button>' : '';
      var gx = document.getElementById('g-x'); if (gx) gx.onclick = function () { g = ''; history.replaceState(null, '', location.pathname); rysuj(); };
      document.querySelectorAll('.filtr-kraje button').forEach(function (b) { b.setAttribute('aria-pressed', b.value === k); });
    }
    fq.addEventListener('input', rysuj); fk.addEventListener('change', rysuj);
    var fs = document.getElementById('szukaj');
    if (fs) fs.addEventListener('submit', function (e) { e.preventDefault(); rysuj(); lista.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    document.querySelectorAll('.filtr-kraje button').forEach(function (b) { b.addEventListener('click', function () { fk.value = b.value; rysuj(); }); });
    rysuj();
  }

  /* formularze - makieta */
  document.querySelectorAll('form[data-makieta]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var w = f.querySelector('.wyslano'); if (w) { w.hidden = false; w.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    });
    var pf = f.querySelector('input[type=file]');
    if (pf) pf.addEventListener('change', function () { var s = pf.closest('label').querySelector('span'); if (pf.files[0]) s.textContent = pf.files[0].name; });
  });

  /* karta jednej oferty */
  var ofEl = document.getElementById('oferta');
  if (ofEl) {
    var slug = new URLSearchParams(location.search).get('o') || 'spawacz-ka-szwajcaria';
    var o = D.find(function (x) { return x.s === slug; }) || D.find(function (x) { return x.s === 'spawacz-ka-szwajcaria'; });
    var opis = (window.OPISY || {})[o.s] || [];
    var pelny = o.t + ' - ' + o.k;
    document.title = o.t + ' - ' + o.k + ' | praca za granicą | ADK Labour Supply';
    document.getElementById('of-tytul').textContent = o.t;
    document.getElementById('of-okr').textContent = o.t;
    document.getElementById('of-kraj').innerHTML = fl(o.k) + esc(o.m || o.k);
    var im = document.getElementById('of-img'); im.src = 'img/o-' + o.i + '-d.webp';
    var f = '';
    if (o.z) f += '<div class="zar pelna"><dt>Zarobki</dt><dd>' + esc(o.z) + '</dd></div>';
    f += '<div><dt>Miejsce pracy</dt><dd>' + esc(o.m || o.k) + '</dd></div>';
    f += '<div><dt>Okres zatrudnienia</dt><dd>' + esc(o.c || 'do ustalenia') + '</dd></div>';
    if (o.zk) f += '<div class="pelna"><dt>Zakres pracy</dt><dd>' + esc(o.zk) + '</dd></div>';
    document.getElementById('of-fakty').innerHTML = f;
    document.getElementById('of-opis').innerHTML = opis.map(function (s) {
      return '<h2>' + esc(s[0]) + '</h2><ul class="lista">' + s[1].map(function (l) { return '<li>' + esc(l.charAt(0).toUpperCase() + l.slice(1)) + '</li>'; }).join('') + '</ul>';
    }).join('');
    var msg = 'Dzień dobry, jestem zainteresowany/a ogłoszeniem: ' + pelny + '. ';
    document.getElementById('of-wa').href = WA + '?text=' + encodeURIComponent(msg + 'Mogę przesłać CV.');
    document.getElementById('of-mail').href = 'mailto:info@adkpoland.eu?subject=' + encodeURIComponent('CV - ' + pelny);
    var st = document.getElementById('of-stan'); if (st) st.value = pelny;
    var gr = Object.keys(GRUPY).find(function (k) { return GRUPY[k].r.test(o.t); });
    var pod = D.filter(function (x) { return x.s !== o.s && gr && GRUPY[gr].r.test(x.t); });
    if (pod.length < 3) pod = pod.concat(D.filter(function (x) { return x.s !== o.s && x.k === o.k && pod.indexOf(x) < 0; }));
    document.getElementById('podobne').innerHTML = pod.slice(0, 3).map(karta).join('');
  }
})();
