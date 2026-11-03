// ============================================================================
// SUITE MILELLA - 1-CLICK SMART IMPORT & ANAGRAFE CONDIVISA
// Permette di importare con 1 clic qualsiasi soggetto presente nell'ecosistema
// (es. Maria Carmela Stoppelli da Progetto Salute in CareAssist Pro o in Ambulatorio)
// ============================================================================

let _soggettiSuiteCache = [];

async function caricaAnagrafeCondivisaSuite() {
  try {
    const res = await fetch('/api/suite/anagrafe-condivisa');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.soggetti) && data.soggetti.length > 0) {
        _soggettiSuiteCache = data.soggetti;
        garantisciPazientiNelContestoLocale();
        popolaSelettoreImportSuite();
        return;
      }
    }
  } catch(e) {
    console.warn('API non raggiungibile, fallback locale:', e.message);
  }
  costruisciFallbackLocaleAnagrafe();
}

function costruisciFallbackLocaleAnagrafe() {
  const map = new Map();
  // 1. CareAssist
  if (typeof AppData !== 'undefined' && Array.isArray(AppData.pazienti)) {
    AppData.pazienti.forEach(p => {
      if (p && p.nome) {
        map.set(p.nome.trim().toLowerCase(), {
          nome: p.nome.trim(),
          dataNascita: p.dataNascita || '',
          sesso: p.sesso || 'M',
          indirizzo: p.indirizzo || '',
          telefono: p.telefono || p.cellulare || '',
          origini: ['CareAssist Pro']
        });
      }
    });
  }

  // 2. Soggetti noti della Suite (Maria Carmela Stoppelli & Ciro Milella da Progetto Salute)
  const ciroNome = localStorage.getItem('profileName_marito') || 'Ciro Milella';
  const mariaNome = localStorage.getItem('profileName_moglie') || 'Maria Carmela';
  const mariaFull = mariaNome.toLowerCase().includes('stoppelli') ? mariaNome : mariaNome + ' Stoppelli';

  map.set('maria carmela', {
    nome: mariaFull,
    dataNascita: '1969-03-20',
    sesso: 'F',
    indirizzo: 'Via Giulio Petroni, 69 - BARI (BA)',
    telefono: '347 123 4567',
    origini: ['Progetto Salute']
  });

  map.set('ciro milella', {
    nome: ciroNome.trim(),
    dataNascita: '1967-12-16',
    sesso: 'M',
    indirizzo: 'Via Giulio Petroni, 69 - BARI (BA)',
    telefono: '338 000 0000',
    origini: ['Progetto Salute']
  });

  _soggettiSuiteCache = Array.from(map.values());
  garantisciPazientiNelContestoLocale();
  popolaSelettoreImportSuite();
}

// Inietta immediatamente i pazienti della Suite in AppData se mancano
function garantisciPazientiNelContestoLocale() {
  if (typeof AppData === 'undefined' || !AppData || !Array.isArray(AppData.pazienti)) return;

  let modificato = false;
  _soggettiSuiteCache.forEach(s => {
    const nomeNorm = s.nome.trim().toLowerCase();
    const giaPresente = AppData.pazienti.some(p => {
      const pNorm = (p.nome || '').trim().toLowerCase();
      return pNorm === nomeNorm || 
             (nomeNorm.includes('maria carmela') && pNorm.includes('maria carmela')) ||
             (nomeNorm.includes('ciro milella') && pNorm.includes('ciro milella'));
    });

    if (!giaPresente) {
      console.log('✨ Auto-iniezione paziente Suite in CareAssist:', s.nome);
      AppData.pazienti.push({
        id: s.id || 'paz_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        nome: s.nome,
        dataNascita: s.dataNascita || '1969-03-20',
        sesso: s.sesso || 'F',
        indirizzo: s.indirizzo || 'Via Giulio Petroni, 69 - BARI (BA)',
        telefono: s.telefono || '',
        cellulare: s.telefono || '',
        allettato: false,
        patologie: s.patologie || ['Nutrizione & Benessere'],
        terapie: [],
        visite: [],
        diario: []
      });
      modificato = true;
    } else {
      // Se è Maria Carmela ma non ha cognome Stoppelli, aggiorniamo il nome completo
      const mcPaz = AppData.pazienti.find(p => (p.nome || '').toLowerCase().includes('maria carmela'));
      if (mcPaz && !mcPaz.nome.toLowerCase().includes('stoppelli')) {
        mcPaz.nome = 'Maria Carmela Stoppelli';
        modificato = true;
      }
    }
  });

  if (modificato) {
    if (typeof saveDb === 'function') saveDb();
    if (typeof renderAll === 'function') renderAll();
    if (typeof renderizzaGrigliaPazientiAsl === 'function') renderizzaGrigliaPazientiAsl();
  }
}

function popolaSelettoreImportSuite() {
  const sel = document.getElementById('select-importa-suite-paziente');
  if (!sel) return;

  const nomiEsistenti = (typeof AppData !== 'undefined' && Array.isArray(AppData.pazienti))
    ? AppData.pazienti.map(p => (p.nome || '').trim().toLowerCase())
    : [];

  const importabili = _soggettiSuiteCache.filter(s => !nomiEsistenti.includes(s.nome.trim().toLowerCase()));

  if (importabili.length === 0) {
    sel.innerHTML = '<option value="">-- Tutti i soggetti della Suite sono già registrati --</option>';
  } else {
    sel.innerHTML = '<option value="">-- Seleziona un soggetto da autocompilare (' + importabili.length + ' disponibili) --</option>' +
      importabili.map((s, idx) => {
        const originiBadge = s.origini.join(', ');
        return `<option value="${idx}">✨ ${s.nome} (${originiBadge}${s.dataNascita ? ' • Nato il ' + s.dataNascita : ''})</option>`;
      }).join('');
  }

  const container = document.getElementById('box-importa-suite');
  if (container) {
    container.style.display = 'block';
  }
}

function applicaImportazionePazienteSuite(indexStr) {
  if (indexStr === '' || indexStr === null || indexStr === undefined) return;
  const idx = parseInt(indexStr, 10);
  const nomiEsistenti = (typeof AppData !== 'undefined' && Array.isArray(AppData.pazienti))
    ? AppData.pazienti.map(p => (p.nome || '').trim().toLowerCase())
    : [];
  const importabili = _soggettiSuiteCache.filter(s => !nomiEsistenti.includes(s.nome.trim().toLowerCase()));
  const s = importabili[idx];
  if (!s) return;

  // 1. Compila Nome
  const elNome = document.getElementById('nuovo-paz-nome');
  if (elNome) elNome.value = s.nome;

  // 2. Compila Data di Nascita
  if (s.dataNascita) {
    const elData = document.getElementById('nuovo-paz-nascita');
    if (elData) {
      elData.value = s.dataNascita;
      if (typeof sincronizzaSelectsDaData === 'function') sincronizzaSelectsDaData('nuovo', s.dataNascita);
      if (typeof calcolaEtaDinamica === 'function') calcolaEtaDinamica(s.dataNascita);
    }
  }

  // 3. Compila Sesso
  if (s.sesso) {
    const isFem = (s.sesso.toUpperCase() === 'F' || s.sesso.toLowerCase().includes('donna') || s.sesso.toLowerCase().includes('moglie'));
    const rFem = document.getElementById('nuovo-paz-sesso-f') || document.querySelector('input[name="nuovo-sesso"][value="F"]');
    const rMas = document.getElementById('nuovo-paz-sesso-m') || document.querySelector('input[name="nuovo-sesso"][value="M"]');
    if (isFem && rFem) rFem.checked = true;
    else if (!isFem && rMas) rMas.checked = true;
  }

  // 4. Compila Indirizzo
  if (s.indirizzo) {
    const elInd = document.getElementById('nuovo-paz-indirizzo');
    if (elInd) elInd.value = s.indirizzo;
  }

  // 5. Compila Telefono
  if (s.telefono) {
    const elTel = document.getElementById('nuovo-paz-cellulare') || document.getElementById('nuovo-paz-telefono');
    if (elTel) elTel.value = s.telefono;
  }

  // Feedback visivo immediato
  const banner = document.getElementById('import-suite-feedback');
  if (banner) {
    banner.style.display = 'block';
    banner.innerHTML = `✅ Dati di <b>${s.nome}</b> importati con successo! Controlla e clicca su "Crea Cartella Clinica".`;
  }
}

// Esegui caricamento immediato all'avvio
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(caricaAnagrafeCondivisaSuite, 200);
  });
} else {
  setTimeout(caricaAnagrafeCondivisaSuite, 200);
}

// Aggancia l'evento openModal
const originalOpenModalNuovo = window.openModal;
window.openModal = function(id) {
  if (typeof originalOpenModalNuovo === 'function') {
    originalOpenModalNuovo(id);
  } else {
    const el = document.getElementById(id);
    if (el) { el.classList.add('active'); el.style.display = 'flex'; }
  }
  if (id === 'modal-nuovo-paziente') {
    caricaAnagrafeCondivisaSuite();
  }
};

window.caricaAnagrafeCondivisaSuite = caricaAnagrafeCondivisaSuite;
window.applicaImportazionePazienteSuite = applicaImportazionePazienteSuite;
