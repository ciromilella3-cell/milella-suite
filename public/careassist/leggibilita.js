/* ==========================================================================
   LEGGIBILITÀ ASSISTITA — CareAssist Pro
   Pensato per utenti di circa 50 anni: nessun testo sotto una soglia minima,
   contrasto sufficiente e dimensione del testo scelta con un tasto (Normale / Grande / Molto grande).
   - Agisce solo a schermo (non tocca stampe e PDF).
   - Funziona anche sui contenuti generati dinamicamente (tabelle, modali, avvisi).
   ========================================================================== */
(function () {
  'use strict';
  if (window.__caLeggibilita) return;
  window.__caLeggibilita = true;

  var KEY = 'ca_text_level';
  var LEVELS = {
    1: { min: 12.5, label: 'Normale' },
    2: { min: 14.5, label: 'Grande' },
    3: { min: 16.5, label: 'Molto grande' }
  };
  var level = parseInt(localStorage.getItem(KEY), 10);
  if (!LEVELS[level]) level = 2;

  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, BR: 1, HR: 1, IMG: 1, CANVAS: 1, TEMPLATE: 1, OPTION: 1, OPTGROUP: 1, HEAD: 1, META: 1, LINK: 1, TITLE: 1, IFRAME: 1 };
  var FIELD = { INPUT: 1, SELECT: 1, TEXTAREA: 1 };
  var MIN_CONTRAST = 4.5;

  /* ---- stile iniettato (solo schermo, non influisce sulla stampa) ---- */
  var st = document.createElement('style');
  st.id = 'ca-leggibilita-style';
  st.textContent =
    '@media screen {' +
    '  [data-ca-fs] { font-size: var(--ca-fs) !important; line-height: 1.4; }' +
    '  [data-ca-col] { color: var(--ca-col) !important; }' +
    '  .ca-size-btn { white-space: nowrap; }' +
    '}' +
    '@media screen and (max-width: 640px) { .ca-size-btn .ca-size-label { display: none; } }';
  (document.head || document.documentElement).appendChild(st);

  /* ---- utilità colore ---- */
  function parseRGBA(s) {
    var m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/.exec(s || '');
    if (!m) return null;
    var a = m[4] === undefined ? 1 : (m[4].slice(-1) === '%' ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
    return { r: +m[1], g: +m[2], b: +m[3], a: a };
  }
  function lum(c) {
    function f(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }
  function ratio(a, b) {
    var l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  function mix(c, t, k) { // k = 0..1 verso t (0 o 255)
    return { r: Math.round(c.r + (t - c.r) * k), g: Math.round(c.g + (t - c.g) * k), b: Math.round(c.b + (t - c.b) * k) };
  }
  function css(c) { return 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')'; }

  /* sfondo effettivo: null = sconosciuto (gradienti/immagini) -> non si tocca il colore */
  function getBg(el, cache) {
    if (!el || el.nodeType !== 1) return { r: 255, g: 255, b: 255 };
    if (cache.has(el)) return cache.get(el);
    var cs = getComputedStyle(el), res;
    var bi = cs.backgroundImage;
    var c = parseRGBA(cs.backgroundColor);
    if (bi && bi !== 'none') res = null;
    else if (c && c.a >= 0.95) res = { r: c.r, g: c.g, b: c.b };
    else if (c && c.a > 0.05) {
      var up = getBg(el.parentElement, cache);
      res = up ? { r: Math.round(c.r * c.a + up.r * (1 - c.a)), g: Math.round(c.g * c.a + up.g * (1 - c.a)), b: Math.round(c.b * c.a + up.b * (1 - c.a)) } : null;
    } else res = el === document.documentElement ? { r: 255, g: 255, b: 255 } : getBg(el.parentElement, cache);
    cache.set(el, res);
    return res;
  }

  function hasOwnText(el) {
    var n = el.childNodes;
    for (var i = 0; i < n.length; i++) {
      if (n[i].nodeType === 3 && n[i].nodeValue.trim()) return true;
    }
    return false;
  }

  /* ---- elaborazione ---- */
  function process(roots) {
    var min = LEVELS[level].min;
    var list = [];
    function test(el) {
      if (SKIP[el.tagName] || (typeof SVGElement !== 'undefined' && el instanceof SVGElement)) return;
      if (FIELD[el.tagName] || hasOwnText(el)) list.push(el);
    }
    roots.forEach(function (r) {
      if (!r || !r.isConnected || r.nodeType !== 1) return;
      test(r);
      var all = r.querySelectorAll('*');
      for (var i = 0; i < all.length; i++) test(all[i]);
    });
    if (!list.length) return;

    // FASE 1: lettura (evita che le modifiche falsino i valori ereditati)
    var cache = new Map();
    var jobs = list.map(function (el) {
      var cs = getComputedStyle(el);
      var job = { el: el, fs: parseFloat(cs.fontSize) || 16, hidden: false };
      if (!el.hasAttribute('data-ca-col')) {
        var tc = parseRGBA(cs.color);
        if (tc && tc.a > 0.3) {
          var bg = getBg(el, cache);
          if (bg) {
            var cr = ratio(tc, bg);
            if (cr < MIN_CONTRAST) {
              var dark = lum(bg) > 0.45;
              var best = null;
              for (var k = 1; k <= 12; k++) {
                var cand = dark ? mix(tc, 0, k / 12) : mix(tc, 255, k / 12);
                if (ratio(cand, bg) >= MIN_CONTRAST) { best = cand; break; }
              }
              if (!best) {
                var nero = { r: 15, g: 23, b: 42 }, bianco = { r: 255, g: 255, b: 255 };
                best = ratio(nero, bg) >= ratio(bianco, bg) ? nero : bianco;
              }
              job.col = css(best);
            }
          }
        }
      }
      return job;
    });

    // FASE 2: scrittura
    jobs.forEach(function (j) {
      var el = j.el;
      if (!el.hasAttribute('data-ca-fs') && j.fs < min - 0.05) {
        el.setAttribute('data-ca-fs', '1');
        el.style.setProperty('--ca-fs', min + 'px');
      }
      if (j.col && !el.hasAttribute('data-ca-col')) {
        el.setAttribute('data-ca-col', '1');
        el.style.setProperty('--ca-col', j.col);
      }
    });
  }

  function reset() {
    document.querySelectorAll('[data-ca-fs],[data-ca-col]').forEach(function (el) {
      el.removeAttribute('data-ca-fs');
      el.removeAttribute('data-ca-col');
      el.style.removeProperty('--ca-fs');
      el.style.removeProperty('--ca-col');
    });
  }

  function processAll() {
    process([document.body]);
  }

  /* ---- osservatore per contenuti dinamici ---- */
  var pending = [], timer = null;
  function schedule(nodes) {
    nodes.forEach(function (n) { if (n.nodeType === 1) pending.push(n); });
    if (timer || !pending.length) return;
    timer = setTimeout(function () {
      timer = null;
      var roots = pending; pending = [];
      try { process(roots); } catch (e) { console.warn('Leggibilità:', e); }
    }, 60);
  }

  /* ---- tasto dimensione testo ---- */
  function etichetta() { return 'Testo: ' + LEVELS[level].label; }
  function aggiornaTasto() {
    document.querySelectorAll('.ca-size-btn .ca-size-label').forEach(function (e) { e.textContent = etichetta(); });
    document.querySelectorAll('.ca-size-btn').forEach(function (b) { b.title = 'Dimensione del testo: ' + LEVELS[level].label + ' (tocca per cambiare)'; });
    document.documentElement.setAttribute('data-ca-level', level);
  }
  function setLevel(l) {
    level = l;
    try { localStorage.setItem(KEY, String(l)); } catch (e) {}
    reset();
    processAll();
    aggiornaTasto();
  }
  function ciclo() {
    var next = level === 2 ? 3 : (level === 3 ? 1 : 2);
    setLevel(next);
    if (typeof window.showToast === 'function') window.showToast('Dimensione del testo: ' + LEVELS[next].label + ' 🔠');
  }
  window.caCambiaDimensioneTesto = ciclo;
  window.caImpostaDimensioneTesto = setLevel;

  function iniettaTasto() {
    var bar = document.querySelector('.header-top-utilities');
    if (bar && !bar.querySelector('.ca-size-btn')) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-header-utility ca-size-btn';
      b.innerHTML = '<span style="font-weight:900;">Aa</span> <span class="ca-size-label"></span>';
      b.addEventListener('click', ciclo);
      bar.insertBefore(b, bar.firstChild);
    } else if (!bar && !document.querySelector('.ca-size-btn') && document.body) {
      // Pagine senza barra comandi (es. Turnario): pulsante flottante discreto
      var f = document.createElement('button');
      f.type = 'button';
      f.className = 'ca-size-btn ca-size-float';
      f.style.cssText = 'position:fixed; right:14px; bottom:14px; z-index:9990; background:#0f172a; color:#fff; border:2px solid #fff; border-radius:999px; padding:10px 16px; font-size:14px; font-weight:800; box-shadow:0 6px 18px rgba(0,0,0,.3); cursor:pointer;';
      f.innerHTML = '<span style="font-weight:900;">Aa</span> <span class="ca-size-label"></span>';
      f.addEventListener('click', ciclo);
      document.body.appendChild(f);
    }
    aggiornaTasto();
  }

  function start() {
    iniettaTasto();
    processAll();
    var mo = new MutationObserver(function (muts) {
      var added = [];
      muts.forEach(function (m) { m.addedNodes && m.addedNodes.forEach(function (n) { added.push(n); }); });
      if (added.length) schedule(added);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    // secondo passaggio dopo il caricamento dei dati/cloud
    setTimeout(function () { iniettaTasto(); processAll(); }, 1200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
