// ============================================================================
// SUITE MILELLA - 1-CLICK SMART IMPORT & ANAGRAFE CONDIVISA
// Permette di importare con 1 clic qualsiasi soggetto presente nell'ecosistema
// (es. Maria Carmela da Progetto Salute in CareAssist Pro o in Ambulatorio)
// ============================================================================

let _soggettiSuiteCache = [];

async function caricaAnagrafeCondivisaSuite() {
  try {
    const res = await fetch('/api/suite/anagrafe-condivisa');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.soggetti)) {
        _soggettiSuiteCache = data.soggetti;
        popolaSelettoreImportSuite();
      }
    }
  } catch(e) {
    console.warn('Caricamento anagrafe condivisa da API non riuscito, uso fallback locale:', e.message);
    costruisciFallbackLocaleAnagrafe();
  }
}

function costruisciFallbackLocaleAnagrafe() {
  const map = new Map();
  // CareAssist
  if (typeof AppData !== 'undefined' && Array.isArray(AppData.pazienti)) {
    AppData.pazienti.forEach(p => {
      if (p && p.nome) {
        map.set(p.nome.trim().toLowerCase(), {
          nome: p.nome.trim(),
          dataNascita: p.dataNascita || '',
          sesso: p.sesso || 'M',
          indirizzo: p.indirizzo || '',
          origini: ['CareAssist Pro']
        });
      }
    });
  }
  // Salute da localStorage
  const ciroNome = localStorage.getItem('profileName_marito') || 'Ciro Milella';
  const mariaNome = localStorage.getItem('profileName_moglie') || 'Maria Carmela';
  map.set(ciroNome.toLowerCase(), {
    nome: ciroNome,
    dataNascita: '1967-12-16',
    sesso: 'M',
    indirizzo: 'Via Giulio Petroni, 69 - BARI (BA)',
    origini: ['Progetto Salute']
  });
  map.set(mariaNome.toLowerCase(), {
    nome: mariaNome,
    dataNascita: '1969-03-20',
    sesso: 'F',
    indirizzo: 'Via Giulio Petroni, 69 - BARI (BA)',
    origini: ['Progetto Salute']
  });

  _soggettiSuiteCache = Array.from(map.values());
  popolaSelettoreImportSuite();
}

function popolaSelettoreImportSuite() {
  const sel = document.getElementById('select-importa-suite-paziente');
  if (!sel) return;

  // Escludi i pazienti già registrati in CareAssist
  const nomiEsistenti = (typeof AppData !== 'undefined' && Array.isArray(AppData.pazienti))
    ? AppData.pazienti.map(p => (p.nome || '').trim().toLowerCase())
    : [];

  const importabili = _soggettiSuiteCache.filter(s => !nomiEsistenti.includes(s.nome.trim().toLowerCase()));

  sel.innerHTML = '<option value="">-- Seleziona un soggetto registrato nella Suite --</option>' +
    importabili.map((s, idx) => {
      const originiBadge = s.origini.join(', ');
      return `<option value="${idx}">✨ ${s.nome} (${originiBadge}${s.dataNascita ? ' • Nato il ' + s.dataNascita : ''})</option>`;
    }).join('');

  const container = document.getElementById('box-importa-suite');
  if (container) {
    container.style.display = importabili.length > 0 ? 'block' : 'none';
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
    const rFem = document.querySelector('input[name="nuovo-sesso"][value="F"]') || document.getElementById('nuovo-paz-sesso-f');
    const rMas = document.querySelector('input[name="nuovo-sesso"][value="M"]') || document.getElementById('nuovo-paz-sesso-m');
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
    banner.innerHTML = `✅ Dati di <b>${s.nome}</b> importati con successo da <i>${s.origini.join(', ')}</i>! Controlla e premi Salva.`;
    setTimeout(() => { if (banner) banner.style.display = 'none'; }, 6000);
  }
}

// Intercetta l'apertura del modal nuovo paziente
const origOpenModal = window.openModal;
window.openModal = function(modalId) {
  if (typeof origOpenModal === 'function') origOpenModal(modalId);
  if (modalId === 'modal-nuovo-paziente') {
    caricaAnagrafeCondivisaSuite();
  }
};

window.caricaAnagrafeCondivisaSuite = caricaAnagrafeCondivisaSuite;
window.applicaImportazionePazienteSuite = applicaImportazionePazienteSuite;
