/**
 * suite_nav.js - Unified Mobile Experience & Navigation per la Suite Milella
 * 1. Barra di Navigazione Mobile Unificata (Glassmorphic)
 * 2. Feedback Aptico / Vibrazione tattile al tocco
 * 3. Badge Notifiche dinamico (Pallino rosso su Flotta per scadenze/allarmi)
 * 4. Supporto PWA / Prompt "Aggiungi a Schermata Home"
 * 5. Transizioni fluide di pagina (Page Fade / Slide Transition)
 */
(function() {
  if (document.getElementById('suite-unified-bottom-nav')) return;

  // 1. INIEZIONE STILI CSS
  const style = document.createElement('style');
  style.id = 'suite-unified-bottom-nav-style';
  style.textContent = `
    /* Spazio extra in fondo alla pagina per evitare sovrapposizioni */
    body {
      padding-bottom: 84px !important;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }

    body.page-transitioning {
      opacity: 0;
      transform: translateY(6px);
    }

    /* BARRA INFERIORE FLOTTANTE */
    #suite-unified-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 68px;
      background: rgba(11, 19, 35, 0.94);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-top: 1px solid rgba(56, 189, 248, 0.22);
      box-shadow: 0 -8px 25px rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 10px;
      padding-bottom: env(safe-area-inset-bottom, 0px);
      z-index: 999999;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }

    /* VISIBILE SOLO SU SMARTPHONE / TABLET (<= 900px) */
    @media (min-width: 901px) {
      #suite-unified-bottom-nav, #pwa-install-banner {
        display: none !important;
      }
      body {
        padding-bottom: 0 !important;
      }
    }

    .suite-nav-btn {
      position: relative;
      background: none;
      border: none;
      color: #94a3b8;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      padding: 6px 10px;
      border-radius: 12px;
      min-width: 58px;
      -webkit-tap-highlight-color: transparent;
    }

    .suite-nav-btn:active {
      transform: scale(0.88);
      color: #38bdf8;
    }

    .suite-nav-btn.active, .suite-nav-btn:hover {
      color: #38bdf8;
    }

    .suite-nav-btn svg {
      width: 22px;
      height: 22px;
      stroke: currentColor;
    }

    /* Tasto Centrale in Risalto */
    .suite-nav-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      top: -10px;
    }

    .suite-nav-circle-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
      border: 3px solid #070d18;
      box-shadow: 0 6px 18px rgba(14, 165, 233, 0.55);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .suite-nav-circle-btn:active {
      transform: scale(0.86);
    }

    .suite-nav-circle-btn svg {
      width: 24px;
      height: 24px;
      stroke: #ffffff;
    }

    .suite-nav-center span {
      font-size: 10px;
      font-weight: 800;
      color: #38bdf8;
      margin-top: 3px;
    }

    /* BADGE NOTIFICA ROSSO */
    .suite-badge {
      position: absolute;
      top: 3px;
      right: 12px;
      width: 9px;
      height: 9px;
      background: #ef4444;
      border: 1.5px solid #070d18;
      border-radius: 50%;
      box-shadow: 0 0 8px #ef4444;
      animation: pulseBadge 2s infinite;
    }

    @keyframes pulseBadge {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { transform: scale(1.15); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    /* BANNER INSTALLA COME APP */
    #pwa-install-banner {
      position: fixed;
      top: 12px;
      left: 14px;
      right: 14px;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.96) 100%);
      border: 1px solid rgba(56, 189, 248, 0.35);
      border-radius: 16px;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      z-index: 1000000;
      animation: slideDownBanner 0.4s ease-out;
    }

    @keyframes slideDownBanner {
      from { transform: translateY(-30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .pwa-banner-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .pwa-banner-text strong {
      font-size: 13px;
      color: #ffffff;
      font-weight: 700;
    }
    .pwa-banner-text span {
      font-size: 11px;
      color: #94a3b8;
    }
    .pwa-banner-btns {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .btn-pwa-add {
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
      color: #ffffff;
      border: none;
      padding: 7px 13px;
      border-radius: 10px;
      font-size: 11.5px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(14, 165, 233, 0.4);
    }
    .btn-pwa-close {
      background: none;
      border: none;
      color: #64748b;
      font-size: 16px;
      cursor: pointer;
      padding: 4px;
    }
  `;
  document.head.appendChild(style);

  // 2. FUNZIONE FEEDBACK APTICO / VIBRAZIONE
  function triggerHaptic(duration = 25) {
    try {
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(duration);
      }
    } catch(e) {}
  }

  // 3. NAVIGAZIONE CON TRANSIZIONE FLUIDA
  function navigateWithTransition(url) {
    triggerHaptic(30);
    document.body.classList.add('page-transitioning');
    setTimeout(() => {
      window.location.href = url;
    }, 180);
  }

  // 4. CREAZIONE DOM DELLA BARRA
  const nav = document.createElement('nav');
  nav.id = 'suite-unified-bottom-nav';
  nav.innerHTML = `
    <!-- 1. INDIETRO -->
    <button type="button" class="suite-nav-btn" id="suite-btn-back" title="Torna Indietro">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      <span>Indietro</span>
    </button>

    <!-- 2. HOME SUITE -->
    <a href="/launcher.html" class="suite-nav-btn" id="suite-btn-home" title="Home Suite Launcher">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <span>Home</span>
    </a>

    <!-- 3. AZIONE RAPIDA CENTRALE -->
    <div class="suite-nav-center">
      <a href="/launcher.html" class="suite-nav-circle-btn" id="suite-btn-menu" title="Menu Suite">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </a>
      <span>Suite</span>
    </div>

    <!-- 4. BLOCCA CON PIN -->
    <button type="button" class="suite-nav-btn" id="suite-btn-lock" title="Blocca App con PIN" style="color:#f59e0b;">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <span>Blocca</span>
    </button>

    <!-- 5. FLOTTA VEICOLI (CON BADGE NOTIFICA) -->
    <a href="/veicoli_mobile/" class="suite-nav-btn" id="suite-btn-flotta" title="Flotta Veicoli & Spese">
      <div class="suite-badge" title="Scadenze / Attenzioni attive"></div>
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
        <circle cx="7" cy="17" r="2"/>
        <path d="M9 17h6"/>
        <circle cx="17" cy="17" r="2"/>
      </svg>
      <span>Flotta</span>
    </a>
  `;

  // Collega eventi con feedback aptico e animazione
  function bindNavEvents() {
    document.getElementById('suite-btn-back')?.addEventListener('click', (e) => {
      e.preventDefault();
      triggerHaptic(20);
      if (window.history.length > 1) {
        document.body.classList.add('page-transitioning');
        setTimeout(() => window.history.back(), 180);
      } else {
        navigateWithTransition('/launcher.html');
      }
    });

    document.getElementById('suite-btn-home')?.addEventListener('click', (e) => {
      e.preventDefault();
      navigateWithTransition('/launcher.html');
    });

    document.getElementById('suite-btn-menu')?.addEventListener('click', (e) => {
      e.preventDefault();
      navigateWithTransition('/launcher.html');
    });

    document.getElementById('suite-btn-lock')?.addEventListener('click', (e) => {
      e.preventDefault();
      triggerHaptic(40);
      if (typeof window.lockMilellaSuite === 'function') {
        window.lockMilellaSuite();
      } else if (typeof lockSaluteApp === 'function') {
        lockSaluteApp();
      } else {
        sessionStorage.removeItem('milella_session_unlocked');
        window.location.reload();
      }
    });

    document.getElementById('suite-btn-flotta')?.addEventListener('click', (e) => {
      e.preventDefault();
      navigateWithTransition('/veicoli_mobile/');
    });
  }

  // Auto-caricamento del Security Gate se non già presente nella pagina
  if (!window.__milellaSecurityGateInit && window.location.pathname !== '/launcher.html' && window.location.pathname !== '/') {
    const gateScript = document.createElement('script');
    gateScript.src = '/suite_security_gate.js?v=1';
    document.head.appendChild(gateScript);
  }

  // 5. BANNER PWA / "AGGIUNGI A SCHERMATA HOME"
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showPwaBanner();
  });

  function showPwaBanner() {
    if (localStorage.getItem('pwa_banner_dismissed') === 'true') return;
    if (document.getElementById('pwa-install-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="pwa-banner-text">
        <strong>📱 Installa Suite Milella</strong>
        <span>Aggiungi alla schermata Home come App nativa</span>
      </div>
      <div class="pwa-banner-btns">
        <button class="btn-pwa-add" id="btn-pwa-install">Installa</button>
        <button class="btn-pwa-close" id="btn-pwa-dismiss">✕</button>
      </div>
    `;

    document.body.prepend(banner);

    document.getElementById('btn-pwa-install')?.addEventListener('click', async () => {
      triggerHaptic(30);
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
      } else {
        alert("Per installare l'App su Brave/Chrome:\n1. Tocca i 3 puntini ⋮ in alto a destra\n2. Scegli 'Aggiungi a schermata Home'");
      }
      banner.remove();
    });

    document.getElementById('btn-pwa-dismiss')?.addEventListener('click', () => {
      triggerHaptic(15);
      localStorage.setItem('pwa_banner_dismissed', 'true');
      banner.remove();
    });
  }

  // Mostra banner suggerimento dopo 3 secondi se su cellulare e non ancora salvato
  if (window.innerWidth <= 900 && !window.matchMedia('(display-mode: standalone)').matches) {
    setTimeout(showPwaBanner, 2500);
  }

  
  // INSERIMENTO A CARICAMENTO DOM
  function mount() {
    document.body.appendChild(nav);
    bindNavEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
