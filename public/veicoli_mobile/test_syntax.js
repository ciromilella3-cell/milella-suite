
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

    function switchView(tabName) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.section-view').forEach(v => v.classList.remove('active'));

      event.target.classList.add('active');
      const target = document.getElementById('view-' + tabName);
      if (target) target.classList.add('active');
    }

    function renderAll() {
      // 1. Spese
      const cSpese = document.getElementById('list-spese');
      if (cSpese) {
        cSpese.innerHTML = AppData.spese.map(s => 
          <div class="item-card">
            <div class="item-left">
              <div class="item-title"></div>
              <div class="item-date">📅  </div>
              <span class="item-tag tag-blue">Manutenzione Auto</span>
            </div>
            <div class="item-cost negative">-€ </div>
          </div>
        ).join('');
      }

      // 2. Rifornimenti
      const cRif = document.getElementById('list-rifornimenti');
      if (cRif) {
        cRif.innerHTML = AppData.rifornimenti.map(r => 
          <div class="item-card">
            <div class="item-left">
              <div class="item-title">⛽ Rifornimento Carburante </div>
              <div class="item-date">📅   </div>
              <span class="item-tag tag-amber">Carburante</span>
            </div>
            <div class="item-cost negative">-€ </div>
          </div>
        ).join('');
      }

      // 3. Rimborsi Mesi
      const cRimborsi = document.getElementById('list-rimborsi');
      if (cRimborsi) {
        cRimborsi.innerHTML = AppData.rimborsiMesi.map(m => 
          <div class="item-card">
            <div class="item-left">
              <div class="item-title"></div>
              <div class="item-date">ACI: <b>€ </b> • Carburante: € </div>
              <span class="item-tag "></span>
            </div>
            <div class="item-cost ">
              € 
            </div>
          </div>
        ).join('');
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
  