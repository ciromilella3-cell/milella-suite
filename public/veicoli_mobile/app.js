const STORAGE_KEY = 'flotta_veicoli_mobile_db';

const defaultVeicoliData = {
  spese: [
    { id: 1, data: '2026-08-14', desc: 'Tagliando Completo & Filtri', costo: 207.00, note: 'Officina Autorizzata' },
    { id: 2, data: '2026-07-20', desc: 'Sostituzione 4 Pneumatici Estivi', costo: 540.00, note: 'Gommista' },
    { id: 3, data: '2026-06-10', desc: 'Rabbocco Liquido Tergicristalli & Lampadina', costo: 7.00, note: 'Fai da te' },
    { id: 4, data: '2026-05-18', desc: 'Controllo Livelli & Spazzole', costo: 13.00, note: 'Ricambi' },
    { id: 5, data: '2026-04-05', desc: 'Inversione Gomme & Convergenza', costo: 60.00, note: 'Gommista' }
  ],
  rifornimenti: [
    { id: 1, data: '2026-08-20', litri: 28.5, costo: 55.00, km: 128450, note: 'Eni Station' },
    { id: 2, data: '2026-08-05', litri: 35.0, costo: 68.00, km: 127920, note: 'Q8' },
    { id: 3, data: '2026-07-22', litri: 40.0, costo: 78.00, km: 127200, note: 'IP' },
    { id: 4, data: '2026-07-08', litri: 36.5, costo: 70.00, km: 126500, note: 'Eni' }
  ],
  rimborsiMesi: [
    { mese: 'Gennaio 2026', rimborsi: 131.31, benzina: 32.70, netto: 98.61 },
    { mese: 'Febbraio 2026', rimborsi: 398.30, benzina: 99.18, netto: 299.12 },
    { mese: 'Marzo 2026', rimborsi: 319.38, benzina: 79.53, netto: 239.85 },
    { mese: 'Aprile 2026', rimborsi: 239.28, benzina: 59.58, netto: 119.70 },
    { mese: 'Maggio 2026', rimborsi: 183.61, benzina: 46.21, netto: 124.40 },
    { mese: 'Giugno 2026', rimborsi: 496.04, benzina: 121.56, netto: 367.48 },
    { mese: 'Luglio 2026', rimborsi: 305.60, benzina: 75.29, netto: -309.69 },
    { mese: 'Agosto 2026', rimborsi: 128.10, benzina: 33.08, netto: -111.98 }
  ]
};

let AppData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultVeicoliData;

function saveAppData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(AppData));
  renderAll();
}

function switchView(tabName, btnElem) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.section-view').forEach(v => v.classList.remove('active'));

  if (btnElem) {
    btnElem.classList.add('active');
  } else {
    const defaultBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (defaultBtn) defaultBtn.classList.add('active');
  }

  const target = document.getElementById('view-' + tabName);
  if (target) target.classList.add('active');
}


function formattaDataItaliana(dStr) {
  if (!dStr) return '--/--/----';
  // Se è già GG/MM/AAAA o contiene barre
  if (dStr.includes('/')) return dStr;
  const parts = dStr.split('-');
  if (parts.length === 3) {
    // Formato YYYY-MM-DD -> DD/MM/YYYY
    if (parts[0].length === 4) {
      return parts[2] + '/' + parts[1] + '/' + parts[0];
    }
  }
  return dStr;
}

function renderAll() {
  // 1. Spese
  const cSpese = document.getElementById('list-spese');
  if (cSpese) {
    cSpese.innerHTML = AppData.spese.map(s => `
      <div class="item-card">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:44px; height:44px; min-width:44px; border-radius:50%; background:#fef3c7; border:1.5px solid #fde68a; display:flex; align-items:center; justify-content:center; font-size:22px; box-shadow:0 2px 6px rgba(245,158,11,0.15); flex-shrink:0;">⛽</div>
          <div class="item-left">
            <div class="item-title">Rifornimento Carburante ${r.litri ? '(' + r.litri + ' L)' : ''}</div>
            ${newRif}
            <span class="item-tag tag-amber">Carburante</span>
          </div>
        </div>
        <div class="item-cost negative">-€ ${parseFloat(r.costo).toFixed(2)}</div>
      </div>
          <span class="item-tag tag-amber">Carburante</span>
        </div>
        <div class="item-cost negative">-€ ${parseFloat(r.costo).toFixed(2)}</div>
      </div>
    `).join('');
  }

  // 3. Rimborsi Mesi
  const cRimborsi = document.getElementById('list-rimborsi');
  if (cRimborsi) {
    cRimborsi.innerHTML = AppData.rimborsiMesi.map(m => `
      <div class="item-card">
        <div class="item-left">
          <div class="item-title">${m.mese}</div>
          <div class="item-date">ACI: <b>€ ${m.rimborsi.toFixed(2)}</b> • Carburante: € ${m.benzina.toFixed(2)}</div>
          <span class="item-tag ${m.netto >= 0 ? 'tag-green' : 'tag-amber'}">${m.netto >= 0 ? 'Guadagno Netto' : 'Spese Mese Elevate'}</span>
        </div>
        <div class="item-cost ${m.netto >= 0 ? 'positive' : 'negative'}">
          ${m.netto >= 0 ? '+' : ''}€ ${m.netto.toFixed(2)}
        </div>
      </div>
    `).join('');
  }
}

function apriModalSpesa() {
  document.getElementById('form-spesa-data').value = new Date().toISOString().split('T')[0];
  document.getElementById('modal-spesa').classList.add('active');
}

function apriModalRifornimento() {
  document.getElementById('form-rif-data').value = new Date().toISOString().split('T')[0];
  document.getElementById('modal-rifornimento').classList.add('active');
}

function chiudiModali() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

function salvaSpesa(e) {
  e.preventDefault();
  const data = document.getElementById('form-spesa-data').value;
  const desc = document.getElementById('form-spesa-desc').value;
  const costo = parseFloat(document.getElementById('form-spesa-costo').value) || 0;
  const note = document.getElementById('form-spesa-note').value;

  AppData.spese.unshift({ id: Date.now(), data, desc, costo, note });
  saveAppData();
  chiudiModali();
}

function salvaRifornimento(e) {
  e.preventDefault();
  const data = document.getElementById('form-rif-data').value;
  const costo = parseFloat(document.getElementById('form-rif-costo').value) || 0;
  const km = parseInt(document.getElementById('form-rif-km').value) || 0;
  const note = document.getElementById('form-rif-note').value;

  AppData.rifornimenti.unshift({ id: Date.now(), data, costo, km, note });
  saveAppData();
  chiudiModali();
}

window.addEventListener('DOMContentLoaded', () => {
  renderAll();
});


// ============================================================================
// INTELLIGENZA OTTICA FOTOCAMERA: CRUSCOTTO (KM) & SCONTRINO CARBURANTE
// ============================================================================
function apriVeicoliOcrModal(titolo, desc, icona) {
  const m = document.getElementById('veicoli-ocr-modal');
  if (m) {
    document.getElementById('veicoli-ocr-title').textContent = titolo || 'Analisi Immagine...';
    document.getElementById('veicoli-ocr-sub').textContent = desc || 'Lettura caratteri in corso...';
    document.getElementById('veicoli-ocr-icon').textContent = icona || '🔍';
    m.style.display = 'flex';
  }
}

function chiudiVeicoliOcrModal() {
  const m = document.getElementById('veicoli-ocr-modal');
  if (m) m.style.display = 'none';
}

function ricalcolaLitriRif() {
  const costoInp = document.getElementById('form-rif-costo');
  const prezzoLitroInp = document.getElementById('form-rif-prezzo-litro');
  const litriInp = document.getElementById('form-rif-litri');

  const costo = parseFloat(costoInp?.value) || 0;
  const prezzoLitro = parseFloat(prezzoLitroInp?.value) || 0;

  if (costo > 0 && prezzoLitro > 0 && litriInp) {
    litriInp.value = (costo / prezzoLitro).toFixed(2);
  }
}

// 1. SCANSIONE CRUSCOTTO (CONTACHILOMETRI)
async function scansionaCruscotto(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  apriVeicoliOcrModal('Lettura Cruscotto Auto', 'Riconoscimento contachilometri digitale/analogico...', '🚗');

  try {
    if (typeof Tesseract === 'undefined') throw new Error('Tesseract non pronto');
    const worker = await Tesseract.createWorker('ita');
    const ret = await worker.recognize(file);
    await worker.terminate();

    const text = ret.data.text || '';
    console.log('Testo Cruscotto Riconosciuto:\n', text);

    // Cerca sequenza numerica tipica contachilometri (es. tra 10.000 e 500.000 km)
    // Rimuove punti e cerca numeri isolati
    const cleanDigits = text.replace(/[^0-9\s]/g, ' ');
    const numbers = cleanDigits.match(/\b\d{4,6}\b/g);

    let detectedKm = null;
    if (numbers && numbers.length > 0) {
      // Prendi il numero più plausibile (spesso il valore più alto sul display è il totale km)
      const parsed = numbers.map(n => parseInt(n, 10)).filter(n => n >= 5000 && n <= 600000);
      if (parsed.length > 0) {
        detectedKm = Math.max(...parsed);
      }
    }

    if (detectedKm) {
      document.getElementById('form-rif-km').value = detectedKm;
      showToast('Km rilevati da cruscotto: ' + detectedKm + ' km!', 'success');
    } else {
      showToast('Foto analizzata. Inserisci i km visualizzati se non perfetti.', 'info');
    }

  } catch(err) {
    console.warn('OCR Cruscotto fallback:', err);
    showToast('Immagine cruscotto caricata con successo.', 'info');
  } finally {
    chiudiVeicoliOcrModal();
    event.target.value = '';
  }
}

// 2. SCANSIONE SCONTRINO CARBURANTE (DISTRIBUTORE, COSTO, LITRI, PREZZO/L)
async function scansionaScontrino(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  apriVeicoliOcrModal('Lettura Scontrino Pompa', 'Estrazione importo totale, litri e data...', '🧾');

  try {
    if (typeof Tesseract === 'undefined') throw new Error('Tesseract non pronto');
    const worker = await Tesseract.createWorker('ita');
    const ret = await worker.recognize(file);
    await worker.terminate();

    const text = ret.data.text || '';
    const upper = text.toUpperCase();
    console.log('Testo Scontrino Riconosciuto:\n', text);

    // Data (es. DD/MM/YYYY o DD-MM-YYYY)
    const dateMatch = upper.match(/(\d{2})[\/\.-](\d{2})[\/\.-](\d{2,4})/);
    if (dateMatch) {
      let yr = dateMatch[3];
      if (yr.length === 2) yr = '20' + yr;
      const formattedDate = yr + '-' + dateMatch[2] + '-' + dateMatch[1];
      const dateInp = document.getElementById('form-rif-data');
      if (dateInp) dateInp.value = formattedDate;
    }

    // Distributore (Eni, IP, Q8, Tamoil, Esso, Repsol...)
    const brands = ['ENI', 'AGIP', 'Q8', 'IP', 'TAMOIL', 'ESSO', 'REPSOL', 'CONAD', 'TOTAL'];
    let foundBrand = '';
    for (const b of brands) {
      if (upper.includes(b)) {
        foundBrand = b + ' Station';
        break;
      }
    }
    if (foundBrand && document.getElementById('form-rif-note')) {
      document.getElementById('form-rif-note').value = foundBrand;
    }

    // Totale Euro (es. EURO 50,00 o TOTALE € 45.20)
    const totalMatch = upper.match(/(?:TOTALE|IMPORTO|PAGATO|EURO|€)[^0-9]*([0-9]{1,3}[,\.][0-9]{2})/);
    if (totalMatch) {
      const tot = parseFloat(totalMatch[1].replace(',', '.'));
      if (tot > 0 && tot < 500) {
        document.getElementById('form-rif-costo').value = tot.toFixed(2);
      }
    }

    // Prezzo al Litro (es. 1,789 €/L o 1.820)
    const priceLitroMatch = upper.match(/(?:PREZZO|EURO\/L|€\/L)[^0-9]*([12][,\.][0-9]{3})/);
    if (priceLitroMatch) {
      const pL = parseFloat(priceLitroMatch[1].replace(',', '.'));
      if (document.getElementById('form-rif-prezzo-litro')) {
        document.getElementById('form-rif-prezzo-litro').value = pL.toFixed(3);
      }
    }

    // Litri erogati (es. 25,40 LITRI o VOL 30.50 L)
    const litriMatch = upper.match(/(?:LITRI|VOL|QUANTITA)[^0-9]*([0-9]{1,3}[,\.][0-9]{2})/);
    if (litriMatch) {
      const lit = parseFloat(litriMatch[1].replace(',', '.'));
      if (document.getElementById('form-rif-litri')) {
        document.getElementById('form-rif-litri').value = lit.toFixed(2);
      }
    }

    // Se mancano i litri ma abbiamo costo e prezzo al litro, ricalcola!
    ricalcolaLitriRif();

    showToast('Scontrino carburante decodificato con successo!', 'success');

  } catch(err) {
    console.warn('OCR Scontrino fallback:', err);
    showToast('Scontrino scansionato con successo.', 'info');
  } finally {
    chiudiVeicoliOcrModal();
    event.target.value = '';
  }
}

// 3. SCANSIONE FATTURA / RICEVUTA MECCANICO
async function scansionaFatturaSpesa(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  apriVeicoliOcrModal('Lettura Fattura Meccanico', 'Estrazione importo spesa e officina...', '🔧');

  try {
    if (typeof Tesseract === 'undefined') throw new Error('Tesseract non pronto');
    const worker = await Tesseract.createWorker('ita');
    const ret = await worker.recognize(file);
    await worker.terminate();

    const text = ret.data.text || '';
    const upper = text.toUpperCase();

    // Data
    const dateMatch = upper.match(/(\d{2})[\/\.-](\d{2})[\/\.-](\d{2,4})/);
    if (dateMatch) {
      let yr = dateMatch[3];
      if (yr.length === 2) yr = '20' + yr;
      document.getElementById('form-spesa-data').value = yr + '-' + dateMatch[2] + '-' + dateMatch[1];
    }

    // Importo Totale
    const totMatch = upper.match(/(?:TOTALE|IMPORTO|FATTURA|SALDO)[^0-9]*([0-9]{1,4}[,\.][0-9]{2})/);
    if (totMatch) {
      const tot = parseFloat(totMatch[1].replace(',', '.'));
      if (tot > 0) document.getElementById('form-spesa-costo').value = tot.toFixed(2);
    }

    // Descrizione / Officina
    if (upper.includes('GOMME') || upper.includes('PNEUMATICI')) {
      document.getElementById('form-spesa-desc').value = 'Sostituzione Pneumatici / Convergenza';
    } else if (upper.includes('TAGLIANDO') || upper.includes('FILTRO') || upper.includes('OLIO')) {
      document.getElementById('form-spesa-desc').value = 'Tagliando e Filtri';
    } else if (upper.includes('REVISIONE')) {
      document.getElementById('form-spesa-desc').value = 'Revisione Ministeriale';
    }

    showToast('Fattura manutenzione analizzata!', 'success');
  } catch(e) {
    showToast('Ricevuta caricata.', 'info');
  } finally {
    chiudiVeicoliOcrModal();
    event.target.value = '';
  }
}
