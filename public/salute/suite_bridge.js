// ============================================================================
// SUITE MILELLA - PROGETTO SALUTE ECOSYSTEM BRIDGE
// Riceve e sincronizza in tempo reale il paziente/profilo attivo dalla Suite
// ============================================================================
(function() {
  function getQueryParam(name) {
    try {
      const u = new URLSearchParams(window.location.search);
      return u.get(name);
    } catch(e) { return null; }
  }

  function mappaPazienteAProfiloSalute(nome) {
    if (!nome) return null;
    const n = nome.toLowerCase().trim();
    if (n.includes('ciro') || n.includes('milella') || n.includes('marito')) return 'marito';
    if (n.includes('maria') || n.includes('carmela') || n.includes('stoppelli') || n.includes('moglie')) return 'moglie';
    return null;
  }

  function sincronizzaProfiloSaluteDaSuite() {
    const paramProfile = getQueryParam('profile') || getQueryParam('paziente') || getQueryParam('patient');
    const storedPaziente = localStorage.getItem('milella_active_patient_name');

    let matchedProf = null;
    let displayName = '';

    if (paramProfile) {
      const dec = decodeURIComponent(paramProfile);
      matchedProf = mappaPazienteAProfiloSalute(dec);
      displayName = dec;
    } else if (storedPaziente) {
      matchedProf = mappaPazienteAProfiloSalute(storedPaziente);
      displayName = storedPaziente;
    }

    if (matchedProf) {
      console.log('🌿 Sincronizzazione Profilo Salute:', matchedProf, '(' + displayName + ')');
      
      // Seleziona la tab corrispondente
      const tabBtn = document.querySelector(`.user-badge[data-profile="${matchedProf}"]`) || document.querySelector(`.profile-tab[data-profile="${matchedProf}"]`);
      if (tabBtn) {
        tabBtn.click();
      } else if (typeof activeProfile !== 'undefined') {
        window.activeProfile = matchedProf;
        localStorage.setItem('activeProfile', matchedProf);
        if (typeof renderAll === 'function') renderAll();
      }

      mostraBannerSaluteSincronizzato(displayName || (matchedProf === 'marito' ? 'Ciro Milella' : 'Maria Carmela'));
    }
  }

  function mostraBannerSaluteSincronizzato(nome) {
    let banner = document.getElementById('salute-patient-synced-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'salute-patient-synced-banner';
      banner.style.cssText = 'position:fixed; top:16px; right:16px; background:linear-gradient(135deg, #10b981, #059669); color:#ffffff; padding:10px 18px; border-radius:14px; font-size:13px; font-weight:700; box-shadow:0 8px 24px rgba(16,185,129,0.35); z-index:999999; display:flex; align-items:center; gap:8px; border:1px solid rgba(255,255,255,0.3); animation:fadeIn 0.3s ease;';
      document.body.appendChild(banner);
    }
    banner.innerHTML = `<span>🥗 Profilo Sincronizzato: <b>${nome}</b></span> <span onclick="this.parentElement.remove()" style="cursor:pointer; font-size:16px; margin-left:6px;">✕</span>`;
    setTimeout(() => { if (banner && banner.parentElement) banner.remove(); }, 5000);
  }

  // Navigazione rapida cross-app da Progetto Salute
  window.navigaDaSaluteACareAssist = function() {
    const prof = (typeof activeProfile !== 'undefined') ? activeProfile : (localStorage.getItem('activeProfile') || 'marito');
    const nome = prof === 'moglie' ? (localStorage.getItem('profileName_moglie') || 'Maria Carmela') : (localStorage.getItem('profileName_marito') || 'Ciro Milella');
    localStorage.setItem('milella_active_patient_name', nome);
    window.location.href = '/careassist/?patient=' + encodeURIComponent(nome);
  };

  window.navigaDaSaluteAAmbulatorio = function() {
    const prof = (typeof activeProfile !== 'undefined') ? activeProfile : (localStorage.getItem('activeProfile') || 'marito');
    const nome = prof === 'moglie' ? (localStorage.getItem('profileName_moglie') || 'Maria Carmela') : (localStorage.getItem('profileName_marito') || 'Ciro Milella');
    localStorage.setItem('milella_active_patient_name', nome);
    window.location.href = '/mednutri/?patient=' + encodeURIComponent(nome);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(sincronizzaProfiloSaluteDaSuite, 250);
    });
  } else {
    setTimeout(sincronizzaProfiloSaluteDaSuite, 250);
  }
})();

  // SINCRONIZZAZIONE AUTOMATICA DEL PESO E PARAMETRI CON IL FASCICOLO SANITARIO SUITE
  window.trasmettiParametriSaluteASuite = function(nomePaziente, peso, altezza, pressione, note) {
    if (!nomePaziente) return;
    try {
      fetch('/api/suite/pazienti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nomePaziente,
          peso: peso || '',
          altezza: altezza || '',
          pressione: pressione || '',
          ultimoRilevamentoSalute: new Date().toISOString(),
          noteSalute: note || 'Parametri aggiornati da Progetto Salute'
        })
      }).then(r => r.json()).then(res => {
        console.log('🌿 Parametri Salute sincronizzati nel Fascicolo Sanitario Centrale:', res);
      }).catch(() => {});
    } catch(e) {}
  };

  // Monitora salvataggi del peso e parametri in Progetto Salute per allineamento istantaneo
  window.addEventListener('storage', function(e) {
    if (e.key && e.key.startsWith('weightLog_')) {
      const prof = e.key.replace('weightLog_', '');
      const nomePaz = (prof === 'marito') ? 'Ciro Milella' : (prof === 'moglie' ? 'Maria Carmela' : prof);
      try {
        const logs = JSON.parse(e.newValue || '[]');
        if (logs.length > 0) {
          const ultimoPeso = logs[logs.length - 1].weight;
          trasmettiParametriSaluteASuite(nomePaz, ultimoPeso, null, null, 'Nuova pesata registrata');
        }
      } catch(err) {}
    }
  });