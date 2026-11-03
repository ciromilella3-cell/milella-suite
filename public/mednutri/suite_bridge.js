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

  async function popolaSelectImportMedNutri() {
    try {
      const res = await fetch('/api/suite/anagrafe-condivisa');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.soggetti)) {
          _mednutriSuiteSoggetti = data.soggetti;
          aggiornaTendinaMedNutri();
        }
      }
    } catch(e) {
      console.warn('Fallback anagrafe in MedNutri:', e.message);
    }
  }

  function aggiornaTendinaMedNutri() {
    const sel = document.getElementById('select-import-mednutri-suite');
    if (!sel) return;
    sel.innerHTML = '<option value="NUOVO" style="background:#0284c7; color:#ffffff; font-weight:800; padding:10px;">➕ INSERISCI UN PAZIENTE DEL TUTTO NUOVO (Pulisci campi)</option>' +
      '<option value="" disabled selected style="background:#1e293b; color:#94a3b8;">-- Oppure seleziona un assistito registrato nella Suite --</option>' +
      _mednutriSuiteSoggetti.map((s, idx) => {
        const originiStr = (s.origini || []).join(', ');
        return `<option value="${idx}" style="background:#0f172a; color:#ffffff; font-weight:700; padding:10px; border-bottom:1px solid #1e293b;">👤 ${s.nome} (${originiStr}${s.dataNascita ? ' • Nato il ' + s.dataNascita : ''})</option>`;
      }).join('');
  }

  window.applicaImportMedNutriDaSuite = function(idxStr) {
    if (idxStr === '' || idxStr === null || idxStr === undefined) return;
    
    // CASO 1: L'UTENTE VUOLE INSERIRE UN PAZIENTE DEL TUTTO NUOVO (NON ANCORA IN NESSUNA APP)
    if (idxStr === 'NUOVO') {
      const nameEl = document.getElementById('patient-name');
      if (nameEl) { nameEl.value = ''; nameEl.focus(); }
      const dobEl = document.getElementById('patient-dob');
      if (dobEl) dobEl.value = '';
      const heightEl = document.getElementById('patient-height');
      if (heightEl) heightEl.value = '';
      const weightEl = document.getElementById('patient-weight');
      if (weightEl) weightEl.value = '';
      const wristEl = document.getElementById('patient-wrist');
      if (wristEl) wristEl.value = '';
      const notesEl = document.getElementById('patient-notes');
      if (notesEl) notesEl.value = '';

      if (typeof calculateBMI === 'function') calculateBMI();
      
      const feed = document.getElementById('mednutri-sync-feedback');
      if (feed) {
        feed.style.display = 'block';
        feed.textContent = '✨ Modalità Nuovo Paziente: inserisci i dati nei campi sottostanti e salva. Verrà condiviso con tutta la Suite!';
        setTimeout(() => { if (feed) feed.style.display = 'none'; }, 7000);
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
