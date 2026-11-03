// ============================================================================
// SUITE MILELLA - MEDNUTRI PRO (AMBULATORIO MEDICO) ECOSYSTEM BRIDGE
// Riceve e sincronizza in tempo reale il paziente attivo dalla Suite
// ============================================================================
(function() {
  function getQueryParam(name) {
    try {
      const u = new URLSearchParams(window.location.search);
      return u.get(name);
    } catch(e) { return null; }
  }

  function formatItalianDateToInput(dateStr) {
    if (!dateStr) return '';
    if (dateStr.includes('-')) return dateStr;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return '';
  }

  function caricaPazienteDaSuite() {
    const paramPaziente = getQueryParam('patient') || getQueryParam('paziente');
    const storedPaziente = localStorage.getItem('milella_active_patient_name');
    const targetNome = paramPaziente ? decodeURIComponent(paramPaziente).trim() : (storedPaziente ? storedPaziente.trim() : null);

    if (!targetNome) return;

    console.log('🩺 Sincronizzazione Ambulatorio Medico con paziente:', targetNome);

    // Controlla se il paziente esiste nell'archivio locale di MedNutri
    const key = 'mednutri_pat_' + targetNome.toLowerCase();
    const data = localStorage.getItem(key);

    const nameInput = document.getElementById('patient-name');
    if (!nameInput) {
      setTimeout(caricaPazienteDaSuite, 150);
      return;
    }

    if (data) {
      try {
        const p = JSON.parse(data);
        if (typeof loadPatient === 'function') {
          loadPatient(targetNome);
          mostraBannerPazienteSincronizzato(p.name);
          return;
        }
      } catch(e) {}
    }

    // Se non presente nell'archivio interno di MedNutri, precompiliamo con i dati passati dalla Suite
    nameInput.value = targetNome;
    
    // Aggiorna anche sesso e data se disponibili nella memoria condivisa Suite
    const storedDob = localStorage.getItem('milella_active_patient_dob');
    const storedGender = localStorage.getItem('milella_active_patient_gender');
    
    if (storedDob && document.getElementById('patient-dob')) {
      const fmtDob = formatItalianDateToInput(storedDob);
      if (fmtDob) document.getElementById('patient-dob').value = fmtDob;
    }
    if (storedGender && document.getElementById('patient-gender')) {
      const gVal = (storedGender.toUpperCase().startsWith('F') || storedGender.toLowerCase() === 'donna') ? 'F' : 'M';
      document.getElementById('patient-gender').value = gVal;
    }

    if (typeof calculateBMI === 'function') calculateBMI();
    mostraBannerPazienteSincronizzato(targetNome);
  }

  function mostraBannerPazienteSincronizzato(nome) {
    let banner = document.getElementById('suite-patient-synced-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'suite-patient-synced-banner';
      banner.style.cssText = 'position:fixed; top:16px; right:16px; background:linear-gradient(135deg, #0284c7, #0369a1); color:#ffffff; padding:10px 18px; border-radius:14px; font-size:13px; font-weight:700; box-shadow:0 8px 24px rgba(2,132,199,0.35); z-index:999999; display:flex; align-items:center; gap:8px; border:1px solid rgba(255,255,255,0.3); animation:fadeIn 0.3s ease;';
      document.body.appendChild(banner);
    }
    banner.innerHTML = `<span>👥 Cartella Sincronizzata: <b>${nome}</b></span> <span onclick="this.parentElement.remove()" style="cursor:pointer; font-size:16px; margin-left:6px;">✕</span>`;
    setTimeout(() => { if (banner && banner.parentElement) banner.remove(); }, 5000);
  }

  // Notifica la Suite al cambio/salvataggio paziente in MedNutri
  function attivaAscoltoInput() {
    const nameInput = document.getElementById('patient-name');
    if (nameInput) {
      nameInput.addEventListener('change', function() {
        if (this.value && this.value.trim().length > 2) {
          localStorage.setItem('milella_active_patient_name', this.value.trim());
        }
      });
    }
  }

  // Navigazione rapida cross-app da MedNutri
  window.navigaDaMedNutriACareAssist = function() {
    const nome = (document.getElementById('patient-name') || {}).value || localStorage.getItem('milella_active_patient_name') || '';
    if (nome) localStorage.setItem('milella_active_patient_name', nome);
    window.location.href = '/careassist/?patient=' + encodeURIComponent(nome);
  };

  window.navigaDaMedNutriASalute = function() {
    const nome = (document.getElementById('patient-name') || {}).value || localStorage.getItem('milella_active_patient_name') || '';
    if (nome) localStorage.setItem('milella_active_patient_name', nome);
    window.location.href = '/salute/?profile=' + encodeURIComponent(nome);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(caricaPazienteDaSuite, 200);
      setTimeout(attivaAscoltoInput, 300);
    });
  } else {
    setTimeout(caricaPazienteDaSuite, 200);
    setTimeout(attivaAscoltoInput, 300);
  }
})();


  // ==============================================================
  // ANAGRAFE FEDERATA 1-CLICK IMPORT IN MEDNUTRI
  // ==============================================================
  let _mednutriSuiteSoggetti = [];

  // LISTA FALLBACK ISTANTANEA IMMEDIATA (ZERO ATTESE - CARICAMENTO IN 0 MILLISECONDI)
  const _soggettiDefault = [
    { nome: 'Aldo Zamparino', dataNascita: '1935-04-18', sesso: 'M', origini: ['CareAssist Pro'] },
    { nome: 'Angela Mazzicone', dataNascita: '1938-05-29', sesso: 'F', origini: ['CareAssist Pro'] },
    { nome: 'Rosa Annunziata Cavalcante', dataNascita: '1938-06-16', sesso: 'F', origini: ['CareAssist Pro'] },
    { nome: 'Ciro Milella', dataNascita: '1967-12-16', sesso: 'M', origini: ['Progetto Salute', 'CareAssist Pro'] },
    { nome: 'Maria Carmela Stoppelli', dataNascita: '1969-03-20', sesso: 'F', origini: ['Progetto Salute', 'CareAssist Pro'] }
  ];

  _mednutriSuiteSoggetti = _soggettiDefault;

  async function popolaSelectImportMedNutri() {
    // 1. Mostra subito la lista locale senza attendere la rete
    aggiornaTendinaMedNutri();

    // 2. Prova ad aggiornare dal server se connesso
    try {
      const res = await fetch('/api/suite/anagrafe-condivisa');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.soggetti) && data.soggetti.length > 0) {
          _mednutriSuiteSoggetti = data.soggetti;
          aggiornaTendinaMedNutri();
        }
      }
    } catch(e) {
      console.warn('Uso lista precaricata MedNutri:', e.message);
    }
  }

  
  // Renderizza i pazienti come bottoni chip chiari, ad alto contrasto e immediatamente cliccabili
  function aggiornaTendinaMedNutri() {
    const container = document.getElementById('suite-patients-chips-container');
    if (!container) return;

    if (!_mednutriSuiteSoggetti || _mednutriSuiteSoggetti.length === 0) {
      container.innerHTML = '<div style="color:#64748b; font-size:12.5px;">Nessun paziente trovato nella suite.</div>';
      return;
    }

    container.innerHTML = _mednutriSuiteSoggetti.map((s, idx) => {
      const originiStr = (s.origini || []).join(', ');
      const isFem = (s.sesso && (s.sesso.toUpperCase() === 'F' || s.sesso.toLowerCase() === 'donna'));
      const emoji = isFem ? '👩' : '👨';
      const bgHover = isFem ? '#fdf2f8' : '#f0f9ff';
      const borderCol = isFem ? '#f472b6' : '#38bdf8';
      
      return `
        <button type="button" 
                onclick="applicaImportMedNutriDaSuite('${idx}')" 
                title="Clicca per compilare la cartella di ${s.nome}"
                style="background:#ffffff; color:#0f172a; border:1.5px solid ${borderCol}; padding:8px 14px; border-radius:12px; font-weight:800; font-size:13px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 2px 6px rgba(0,0,0,0.06); transition:all 0.2s;"
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(2,132,199,0.2)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.06)';">
          <span>${emoji}</span>
          <span style="color:#0f172a; font-weight:800;">${s.nome}</span>
          <span style="font-size:11px; color:#64748b; font-weight:600; background:#f1f5f9; padding:2px 6px; border-radius:6px;">${s.dataNascita ? s.dataNascita.split('-')[0] : ''}</span>
        </button>
      `;
    }).join('');
  }

  window.applicaImportMedNutriDaSuite = function(idxStr) {
    if (idxStr === '' || idxStr === null || idxStr === undefined) return;
    
    // CASO 1: L'UTENTE VUOLE INSERIRE UN PAZIENTE DEL TUTTO NUOVO (PULIZIA TOTALE)
    if (idxStr === 'NUOVO') {
      try {
        localStorage.removeItem('milella_active_patient_name');
        localStorage.removeItem('milella_active_patient_dob');
        localStorage.removeItem('milella_active_patient_gender');
      } catch(e) {}

      const fields = ['patient-name', 'patient-dob', 'patient-height', 'patient-weight', 'patient-wrist', 'patient-notes'];
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.value = ""; try { el.dispatchEvent(new Event("input")); el.dispatchEvent(new Event("change")); } catch(e){} }
      });

      const nameEl = document.getElementById('patient-name');
      if (nameEl) nameEl.focus();

      const genderEl = document.getElementById('patient-gender');
      if (genderEl) genderEl.value = 'M';

      const ageEl = document.getElementById('calculated-age');
      if (ageEl) ageEl.textContent = '';

      const bmiBadge = document.getElementById('bmi-badge');
      if (bmiBadge) bmiBadge.innerHTML = '';

      const frameBadge = document.getElementById('frame-badge');
      if (frameBadge) frameBadge.innerHTML = '';

      const tdeeBadge = document.getElementById('tdee-badge');
      if (tdeeBadge) tdeeBadge.innerHTML = '';

      if (typeof calculateBMI === 'function') calculateBMI();

      const feed = document.getElementById('mednutri-sync-feedback');
      if (feed) {
        feed.style.display = 'block';
        feed.textContent = '✨ Scheda paziente azzerata: inserisci i nuovi dati e premi Salva Paziente!';
        setTimeout(() => { if (feed) feed.style.display = 'none'; }, 5000);
      }
      return;
    }

    // CASO 2: SELEZIONE DI UN PAZIENTE ESISTENTE DALLA SUITE
    const idx = parseInt(idxStr, 10);
    const s = _mednutriSuiteSoggetti[idx];
    if (!s) return;

    const nameEl = document.getElementById('patient-name');
    if (nameEl) nameEl.value = s.nome;

    const genderEl = document.getElementById('patient-gender');
    if (genderEl && s.sesso) {
      genderEl.value = (s.sesso.toUpperCase().startsWith('F') || s.sesso.toLowerCase() === 'donna') ? 'F' : 'M';
    }

    const dobEl = document.getElementById('patient-dob');
    if (dobEl && s.dataNascita) {
      dobEl.value = s.dataNascita;
    }

    if (typeof calculateBMI === 'function') calculateBMI();
    if (typeof mostraBannerPazienteSincronizzato === 'function') {
      mostraBannerPazienteSincronizzato(s.nome);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(popolaSelectImportMedNutri, 300));
  } else {
    setTimeout(popolaSelectImportMedNutri, 300);
  }
