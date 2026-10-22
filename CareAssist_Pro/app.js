// CareAssist Pro - Core Engine Multi-Paziente con Gestione Farmacia & Scarico Automatico

// Gestione Menu Strumenti / Opzioni Dropdown
function toggleMenuStrumenti(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('tools-dropdown-panel');
  if (menu) {
    menu.classList.toggle('show');
  }
}

function chiudiMenuStrumenti() {
  const menu = document.getElementById('tools-dropdown-panel');
  if (menu) {
    menu.classList.remove('show');
  }
}

// Chiudi dropdown al clic esterno
window.addEventListener('click', function(e) {
  const container = document.getElementById('dropdown-tools-container');
  if (container && !container.contains(e.target)) {
    chiudiMenuStrumenti();
  }
});

// Calcolo età esatta dalla data di nascita
function calcolaAnniDaData(dataStr) {
  if (!dataStr) return 91;
  const birth = new Date(dataStr);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    years--;
  }
  return years >= 0 ? years : 0;
}

function calcolaEtaDinamica(dataVal) {
  const eta = calcolaAnniDaData(dataVal);
  const preview = document.getElementById('nuovo-paz-eta-preview');
  if (preview) {
    preview.value = `${eta} anni`;
  }
}

// Template per un nuovo paziente
function createPazienteTemplate(id, nome, dataNascita, note = '') {
  const eta = calcolaAnniDaData(dataNascita);
  return {
    id: id,
    nome: nome,
    dataNascita: dataNascita || '1935-05-10',
    eta: eta,
    medico: 'Dott. Curante',
    telMedico: '',
    allergie: 'Nessuna nota',
    catetere: false,
    allettato: true,
    note: note || 'Paziente assistito a domicilio.',
    terapie: [],
    registrazioni: [],
    visite: []
  };
}

// Inizializzazione dati per ALDO con anagrafica reale e farmaci
function getPazienteAldoInit() {
  const aldo = createPazienteTemplate('paz_aldo', 'Aldo Zamparino', '1935-04-18', 'Paziente allettato 91 anni. Terapia cardiologica, neurologica e urologica con scarico pressorio q2h.');
  aldo.indirizzo = 'Via Giovanni Modugno, 25 - Bari';
  aldo.telefonoFisso = '080 561 57 14';
  aldo.cellulare = '338 306 69 05';
  aldo.moglieNome = 'Mazzicone Angela';
  aldo.moglieCellulare = '338 944 96 10';
  aldo.medico = 'Dott. Roberto Scarcia';
  aldo.medicoNome = 'Dott. Roberto Scarcia';
  aldo.medicoIndirizzo = 'Via Muciaccia, 11 - 70121 Bari';
  aldo.medicoStudio = 'Via Muciaccia, 11 - 70121 Bari';
  aldo.medicoTelStudio = '080 557 44 90';
  aldo.medicoTel = '347 126 59 71';
  aldo.medicoOrari = 'Lunedì: 10:00-13:00. Martedì: 10:00-13:00 e 16:00-19:00. Mercoledì: 10:00-13:00. Giovedì: 16:00-19:00. Venerdì: 10:00-13:00 (Bari - Via Muciaccia 11)';
  aldo.medicoNome = 'Dott. Roberto Scarcia';
  aldo.medicoEmail = 'scarcia.roberto@alice.it';
  aldo.telMedico = '';
  aldo.allergie = 'Nessuna nota';
  aldo.allettato = true;
  aldo.catetere = false;

  aldo.patologie = [
    'Paziente geriatrico allettato ad alto rischio di lesioni da decubito (Scala Braden: Rischio Elevato)',
    'Cardiopatia / Aritmia (in terapia con Bisoprololo 1,25 mg)',
    'Epilessia / Disturbo neurologico focale (in terapia con VIMPAT Lacosamide 100 mg b.i.d.)',
    'Ipertrofia Prostatica Benigna (IPB) con difficoltà minzionali (in terapia con SILODYX 8 mg)',
    'Disturbo comportamentale del sonno / Agitazione notturna (in terapia con Quetiapina 25 mg)',
    'Gastroprotezione per terapia cronica (in terapia con Pantoprazolo 40 mg)'
  ];

  aldo.ausili = [
    {
      tipo: 'Materasso Antidecubito a Pressione Alternata',
      utilizzo: 'Gonfiaggio continuo a ciclo alternato per prevenzione piaghe da decubito',
      accessori: 'Compressore elettrico con regolazione del peso paziente',
      stato: 'In uso attivo h24'
    },
    {
      tipo: 'Protocollo Posturale Rotatorio (q2h)',
      utilizzo: 'Rotazione obbligatoria ogni 2 ore: Supino, Fianco Dx, Fianco Sx, Semiseduto',
      accessori: 'Cuscini di posizionamento a 30° e crema barriera protettiva cutanea',
      stato: 'Monitoraggio attivo con segnale sonoro e timer'
    }
  ];
  aldo.terapie = [
    {
      id: 101,
      ora: '07:30',
      fascia: 'Mattina (Digiuno)',
      farmaco: 'Pantoprazolo 40 mg',
      principio: 'Pantoprazolo',
      dosaggio: '40 mg (1 cpr gastroresistente)',
      modo: 'A DIGIUNO, 30 min prima di colazione (Protezione gastrica)',
      cprPerScatola: 28,
      scorta: 28,
      fattoOggi: false
    },
    {
      id: 102,
      ora: '08:30',
      fascia: 'Mattina (Colazione)',
      farmaco: 'Bisoprololo Teva/Sandoz 1,25 mg',
      principio: 'Bisoprololo fumarato',
      dosaggio: '1,25 mg (1 cpr rivestita)',
      modo: 'A colazione (Controllo frequenza cardiaca e pressione)',
      cprPerScatola: 28,
      scorta: 28,
      fattoOggi: false
    },
        {
      id: 103,
      ora: '08:30',
      fascia: 'Mattina (Colazione)',
      farmaco: 'VIMPAT 100 mg (1ª dose)',
      principio: 'Lacosamide',
      dosaggio: '100 mg (1 capsula)',
      modo: 'A colazione con acqua (Controllo neurologico)',
      cprPerScatola: 56,
      scorta: 56,
      fattoOggi: false
    },
    {
      id: 1032,
      ora: '13:30',
      fascia: 'Pranzo',
      farmaco: 'VIMPAT 100 mg (2ª dose)',
      principio: 'Lacosamide',
      dosaggio: '100 mg (1 capsula)',
      modo: 'A pranzo con acqua (Controllo neurologico)',
      cprPerScatola: 56,
      scorta: 56,
      fattoOggi: false
    },
    {
      id: 104,
      ora: '20:00',
      fascia: 'Sera (Cena)',
      farmaco: 'SILODYX 8 mg (Silodosina)',
      principio: 'Silodosina',
      dosaggio: '8 mg (1 capsula)',
      modo: 'A CENA, a stomaco pieno con acqua (Ipertrofia prostatica / diuresi)',
      cprPerScatola: 30,
      scorta: 30,
      fattoOggi: false
    },
    {
      id: 105,
      ora: '20:30',
      fascia: 'Sera (Cena)',
      farmaco: 'VIMPAT 100 mg (3ª dose serale)',
      principio: 'Lacosamide',
      dosaggio: '200 mg (2 capsule insieme)',
      modo: 'Dopo cena (Dose serale cumulativa di 2 capsule = 200 mg)',
      cprPerScatola: 56,
      scorta: 56,
      fattoOggi: false
    },    {
      id: 106,
      ora: '21:30',
      fascia: 'Notte (Prima di dormire)',
      farmaco: 'Quetiapina Teva 25 mg',
      principio: 'Quetiapina',
      dosaggio: '25 mg (1 cpr rivestita)',
      modo: 'Prima di coricarsi con acqua (Modulatore umore e sonno)',
      cprPerScatola: 30,
      scorta: 30,
      fattoOggi: false
    }
  ];

  aldo.visite = [
    { id: 1, data: '2026-10-16', ora: '09:00', medico: 'Medico di Famiglia (MMG)', motivo: 'Prescrizione e rinnovo ricette farmaci per Aldo', fatto: false }
  ];

  return aldo;
}

// Inizializzazione dati per ANGELA MAZZICONE con anagrafica e farmaci
function getPazienteAngelaInit() {
  const angela = createPazienteTemplate('paz_angela', 'Angela Mazzicone', '1938-05-29', 'Coniuge di Aldo. Terapia cardiologica, ipertensiva, dislipidemica, uricosurica, gastroprotettiva e integrazione vit. D3.');
  angela.nome = 'Angela Mazzicone';
  angela.indirizzo = 'Via Giovanni Modugno, 25 - BARI (BA)';
  angela.telefonoFisso = '080 561 57 14';
  angela.cellulare = '338 944 96 10';
  angela.maritoNome = 'Aldo Zamparino';
  angela.maritoCellulare = '338 306 69 05';
  angela.farmaciaDiRiferimento = 'Farmacia Dott. MACARIO';
  angela.farmaciaIndirizzo = 'Via G. Petroni, 69/b - Bari';
  angela.farmaciaTelefono = '080 542 8061';
  angela.medicoNome = 'Dott. Roberto Scarcia';
  angela.medicoIndirizzo = 'Via Muciaccia, 11 - 70121 Bari';
  angela.medicoStudio = 'Via Muciaccia, 11 - 70121 Bari';
  angela.medicoTelStudio = '080 557 44 90';
  angela.medicoTel = '347 126 59 71';
  angela.medicoOrari = 'Lunedì: 10:00-13:00. Martedì: 10:00-13:00 e 16:00-19:00. Mercoledì: 10:00-13:00. Giovedì: 16:00-19:00. Venerdì: 10:00-13:00 (Bari - Via Muciaccia 11)';
  angela.medicoEmail = 'scarcia.roberto@alice.it';
  angela.allergie = 'Nessuna nota';
  angela.allettato = false;
  angela.catetere = false;

  angela.terapie = [
    {
      id: 201,
      ora: '08:00',
      fascia: 'Mattina (Colazione)',
      farmaco: 'Bisoprololo Sandoz 1,25 mg',
      principio: 'Bisoprololo fumarato',
      dosaggio: '1,25 mg (1 cpr rivestita con film)',
      modo: 'Al mattino a colazione (Beta-bloccante: controllo frequenza e battito cardiaco)',
      cprPerScatola: 28,
      scorta: 28,
      farmacia: 'Farmacia MACARIO',
      fattoOggi: false
    },
    {
      id: 202,
      ora: '08:30',
      fascia: 'Mattina (Colazione)',
      farmaco: 'Irbesartan/Idroclorotiazide Teva 300 mg/12,5 mg',
      principio: 'Irbesartan + Idroclorotiazide',
      dosaggio: '300 mg / 12,5 mg (1 cpr rivestita)',
      modo: 'Al mattino dopo colazione con acqua (Antipertensivo combinato per la pressione arteriosa)',
      cprPerScatola: 28,
      scorta: 28,
      farmacia: 'Farmacia MACARIO',
      fattoOggi: false
    },
    {
      id: 203,
      ora: '09:00',
      fascia: 'Mattina (Colazione)',
      farmaco: 'Lasix 25 mg (Furosemide)',
      principio: 'Furosemide',
      dosaggio: '25 mg (1 compressa)',
      modo: 'Al mattino (Diuretico dell\'ansa per eliminazione liquidi in eccesso ed edemi)',
      cprPerScatola: 30,
      scorta: 30,
      farmacia: 'Farmacia MACARIO',
      fattoOggi: false
    },
    {
      id: 204,
      ora: '13:00',
      fascia: 'Pranzo',
      farmaco: 'Cardioaspirin 100 mg (Acido Acetilsalicilico)',
      principio: 'Acido acetilsalicilico',
      dosaggio: '100 mg (1 cpr gastroresistente)',
      modo: 'A metà o fine pranzo con abbondante acqua (Antiaggregante piastrinico salvacuore)',
      cprPerScatola: 30,
      scorta: 30,
      farmacia: 'Farmacia MACARIO',
      fattoOggi: false
    },
    {
      id: 205,
      ora: '13:30',
      fascia: 'Pranzo',
      farmaco: 'Allopurinolo Teva Italia 300 mg',
      principio: 'Allopurinolo',
      dosaggio: '300 mg (1 compressa)',
      modo: 'Dopo pranzo (Uricosurico: riduzione e controllo dell\'acido urico e prevenzione gotta)',
      cprPerScatola: 30,
      scorta: 30,
      farmacia: 'Farmacia MACARIO',
      fattoOggi: false
    },
    {
      id: 206,
      ora: '15:30',
      fascia: 'Pomeriggio (Al bisogno / Dopo i pasti)',
      farmaco: 'Riopan 80 mg/ml (Magaldrato)',
      principio: 'Magaldrato anidro',
      dosaggio: '80 mg/ml (Gel orale / Bustina)',
      modo: '1 ora dopo i pasti o al bisogno (Antiacido gastroprotettore contro bruciore e reflusso)',
      cprPerScatola: 20,
      scorta: 20,
      farmacia: 'Farmacia MACARIO',
      fattoOggi: false
    },
    {
      id: 207,
      ora: '20:30',
      fascia: 'Sera (Cena)',
      farmaco: 'Aplactin 40 mg (Pravastatina)',
      principio: 'Pravastatina sale sodico',
      dosaggio: '40 mg (1 compressa)',
      modo: 'La sera dopo cena o prima di dormire (Statina: controllo del colesterolo e lipidi)',
      cprPerScatola: 28,
      scorta: 28,
      farmacia: 'Farmacia MACARIO',
      fattoOggi: false
    },
    {
      id: 208,
      ora: '10:00',
      fascia: 'Mattina (Dose Periodica)',
      farmaco: 'DIBASE 50.000 U.I. / 2,5 ml (Colecalciferolo)',
      principio: 'Colecalciferolo (Vitamina D3)',
      dosaggio: '50.000 U.I. in 2,5 ml flaconcino monodose',
      modo: 'Assunzione orale periodica con un po\' di cibo grasso per assorbimento osseo',
      cprPerScatola: 1,
      scorta: 1,
      farmacia: 'Farmacia MACARIO',
      fattoOggi: false
    }
  ];

  angela.patologie = [
    'Ipertensione arteriosa sistemica in polichemioterapia',
    'Sindrome delle Apnee Ostruttive nel Sonno (OSAS) con indicazione ausilio CPAP notturna',
    'Dislipidemia / Ipercolesterolemia',
    'Iperuricemia con rischio gotta',
    'Ipovitaminosi D3 (in integrazione ciclica con DIBASE)',
    'Reflusso gastroesofageo / gastrite'
  ];

  angela.ausili = [
    {
      tipo: 'CPAP Notturna (Ventilazione a Pressione Positiva Continua)',
      utilizzo: 'Tutte le notti durante il riposo per prevenire le apnee notturne e desaturazione',
      accessori: 'Maschera nasale/oro-facciale, circuito, umidificatore con acqua distillata',
      stato: 'In uso attivo'
    },
    {
      tipo: 'Bombola di Ossigeno Terapeutico / Concentratore O2',
      utilizzo: 'Ossigenoterapia domiciliare / Scorta di emergenza',
      prossimaRichiesta: '2026-10-19', // Lunedì prossimo
      stato: 'Da ordinare / Rinnovo ricetta con il Dott. Scarcia'
    }
  ];

  angela.visite = [
    { id: 201, data: '2026-10-16', ora: '09:00', medico: 'Dott. Roberto Scarcia', motivo: 'Rinnovo ricette e piano terapeutico per Angela Mazzicone', fatto: false },
    { id: 202, data: '2026-10-19', ora: '10:30', medico: 'ASL / Servizio Ossigenoterapia Domiciliare', motivo: 'Richiesta e fornitura bombola ossigeno terapeutico per Angela', fatto: false }
  ];

  return angela;
}

// Struttura Globale

function getPazienteRosaInit() {
  const rosa = createPazienteTemplate('paz_rosa', 'Rosa Annunziata Cavalcante', '1938-06-16', 'Paziente di 88 anni. Cardiopatia ipertensiva in buon compenso, osteoartrosi diffusa e insufficienza venosa periferica.');
  rosa.nome = 'Rosa Annunziata Cavalcante';
  rosa.indirizzo = 'Via Domenico Cirillo, 9 - 85012 Corleto Perticara (PZ)';
  rosa.telefonoFisso = '097 169 32 21';
  rosa.cellulare = '338 379 76 71';
  rosa.moglieNome = 'Maria Carmela (Figlia / Caregiver)';
  rosa.moglieCellulare = '338 739 76 71';
  rosa.farmaciaDiRiferimento = 'Farmacia Girasole Picconi';
  rosa.farmaciaIndirizzo = 'Via Ariosto, 4 / 16 - 85012 Corleto Perticara (PZ)';
  rosa.farmaciaTelefono = '0971 963055';
  rosa.medicoNome = 'Dr.ssa Carolina Potenza';
  rosa.medicoStudio = 'Sarconi: Via Provinciale 1 / Moliterno: Via Parco del Seggio 1';
  rosa.medicoTel = '338 379 05 64';
  rosa.medicoEmail = 'carolina.potenza@aspbasilicata.it';
  rosa.medicoOrari = 'Moliterno: Lun 15:00-18:00, Gio 9:00-13:00. Sarconi: Lun-Mer-Ven 9:30-13:00, Mar-Gio 15:00-18:30 (su appuntamento)';
  rosa.allergie = 'Nessuna nota';
  rosa.allettato = false;
  rosa.catetere = false;
  rosa.patologie = getPatologieRosaFoto();
  rosa.ausili = [
    { tipo: 'Deambulatore rollator con freno per interni/esterni', stato: 'In uso regolare', utilizzo: 'Uso quotidiano per deambulazione interna ed esterna in sicurezza' },
    { tipo: 'Calze elastiche antitrombo a compressione graduata', stato: 'In uso', utilizzo: 'In uso diurno per favorire il ritorno venoso e prevenzione edemi' },
    { tipo: 'Mutandina Assorbente PANTS (Pull-Up monouso)', taglia: 'L (Extra) - Girovita 110-150 cm', cartoni: '10 confezioni (140 pz)', scortaPacchi: 10, pezziTotali: 140, pezziPerPacco: 14, utilizzo: 'PANTS SD SENSITIVE BE FREE EXTRA L 8 (Cod. 00037212200021) - 10 conf. x 14 pz = 140 pz. DDT Serenity N. 2286626418 del 21/08/2026. Ord. ASP 0060448686 - Distretto Villa D\'Agri 02 02. Codice Utente: 002713. Prossima consegna indicativa: 24/11/2026 con preavviso telefonico (3383797671). Scadenza Piano: 18/02/2027.', fabbisogno: 'Fornitura periodica ASP Potenza (consegne ogni ~90 giorni)', fornitore: 'Serenity S.p.A. / ASP Potenza (Distretto Villa D\'Agri)', ddtNumero: '2286626418', ddtData: '2026-08-21', codiceUtente: '002713', codiceArticolo: '00037212200021', numConfezioni: 10, pezziConsegnati: 140, prossimaConsegnaIndicativa: '2026-11-24', scadenzaPiano: '2027-02-18', stato: 'In uso attivo regolare', dataRifornimento: '2026-08-21', dataScadenza: '2027-02-18', prossimaRichiesta: '2026-11-24', giorniAlert: 15 }
  ];
  rosa.terapie = getTerapieRosaFoto();
  rosa.visite = [
    { id: 401, data: '2026-10-22', ora: '10:00', medico: 'Dr.ssa Carolina Potenza', motivo: 'Visita periodica di controllo e rinnovo piano terapeutico', fatto: false }
  ];
  return rosa;
}

// Diagnosi croniche di Rosa dedotte dai farmaci in foto (17/10/2026) - DA CONFERMARE COL MEDICO
function getPatologieRosaFoto() {
  return [
    'Diabete mellito tipo 2 in terapia insulinica e orale (Xultophy, Diamicron, Forxiga)',
    'Cardiopatia ipertensiva / scompenso cardiaco (Congescor, Triatec, Lasix, Forxiga)',
    'Prevenzione eventi aterotrombotici / antiaggregazione piastrinica (Averelix Clopidogrel)',
    'Morbo di Parkinson / parkinsonismo (Sinemet)',
    'Iperuricemia / gotta (Adenuric)',
    'Osteoartrosi con dolore cronico (Arcoxia)',
    'Ipovitaminosi D (Fedivelle)',
    'Dislipidemia / Ipercolesterolemia (Sivastin)'
  ];
}

// Terapia di Rosa dai farmaci in foto (17/10/2026).
// ATTENZIONE: orari e dosi sono STANDARD PROVVISORI, da verificare col piano terapeutico del medico.
function getTerapieRosaFoto() {
  const F = 'Farmacia Girasole Picconi';
  const V = ' ⚠️ Orario/dose da confermare col medico';
  const mk = (id, ora, fascia, farmaco, principio, dosaggio, modo, cpr) => ({
    id, ora, fascia, farmaco, principio, dosaggio, modo: modo + V,
    cprPerScatola: cpr, scorta: cpr, farmacia: F, fattoOggi: false
  });
  return [
    mk(301, '07:30', 'Mattina (Digiuno)', 'SINEMET 100+25 mg (1ª dose)', 'Levodopa + Carbidopa', '100/25 mg (1 cpr)', '30 min prima di colazione (Parkinson)', 50),
    mk(302, '08:00', 'Mattina (Colazione)', 'XULTOPHY penna', 'Insulina degludec + Liraglutide', '___ unità (sottocute)', 'Iniezione sottocute 1 volta al giorno, sempre alla stessa ora (Diabete)', 15),
    mk(303, '08:00', 'Mattina (Colazione)', 'DIAMICRON 60 mg RM', 'Gliclazide', '60 mg (1 cpr rilascio modificato)', 'A colazione, non masticare (Diabete) - rischio ipoglicemia con insulina', 30),
    mk(304, '08:00', 'Mattina (Colazione)', 'FORXIGA 10 mg', 'Dapagliflozin', '10 mg (1 cpr)', 'Al mattino con acqua (Diabete / cuore / reni)', 28),
    mk(305, '08:00', 'Mattina (Colazione)', 'CONGESCOR 2,5 mg', 'Bisoprololo', '2,5 mg (1 cpr)', 'A colazione (Beta-bloccante: frequenza cardiaca)', 28),
    Object.assign(mk(306, '08:00', 'Mattina (Colazione)', 'TRIATEC 5 mg', 'Ramipril', '5 mg (Dose alternata: ½ cpr e 1 cpr)', 'A colazione con acqua: ½ cpr un giorno e 1 cpr il giorno dopo su indicazione medica', 14), { cadenzaTipo: 'alternata_mezza_intera', quantitaQuota: 0.5, dataInizioAlterni: '2026-10-18', ultimaModificaClinica: { data: '22/10/2026', fonte: 'Visita Specialistica', medico: 'Cardiologo', motivo: 'Alternanza mezza compressa e una compressa per modulazione pressoria' } }),
    mk(307, '08:30', 'Mattina (Colazione)', 'LASIX 25 mg', 'Furosemide', '25 mg (1 cpr)', 'Al mattino (Diuretico: edemi / scompenso)', 30),
    mk(308, '12:30', 'Pranzo', 'SINEMET 100+25 mg (2ª dose)', 'Levodopa + Carbidopa', '100/25 mg (1 cpr)', '30 min prima di pranzo (Parkinson)', 50),
    mk(314, '13:00', 'Pranzo', 'AVERELIX 75 mg', 'Clopidogrel', '75 mg (1 cpr rivestita)', 'A pranzo con acqua (Antiaggregante piastrinico / prevenzione cardiovascolare)', 28),
    Object.assign(mk(309, '13:30', 'Pranzo', 'ADENURIC 80 mg', 'Febuxostat', '80 mg (1 cpr)', 'A GIORNI ALTERNI con Sivastin - dopo pranzo con acqua (Acido urico / gotta)', 28), { cadenzaTipo: 'alterni', dataInizioAlterni: '2026-10-18' }),
    mk(310, '13:30', 'Pranzo', 'ARCOXIA 90 mg', 'Etoricoxib', '90 mg (1 cpr)', 'A stomaco pieno (Antinfiammatorio: dolore artrosi)', 28),
    mk(311, '19:30', 'Sera (Cena)', 'SINEMET 100+25 mg (3ª dose)', 'Levodopa + Carbidopa', '100/25 mg (1 cpr)', '30 min prima di cena (Parkinson)', 50),
    Object.assign(mk(313, '21:00', 'Notte (Prima di dormire)', 'SIVASTIN 20 mg', 'Simvastatina', '20 mg (1 cpr)', 'A GIORNI ALTERNI con Adenuric - la sera prima di dormire (Statina: colesterolo)', 28), { cadenzaTipo: 'alterni', dataInizioAlterni: '2026-10-17' }),
    mk(312, 'Al Bisogno', 'Al Bisogno (SOS)', 'FEDIVELLE 20.000 U.I.', 'Colecalciferolo (Vitamina D3)', '20.000 U.I. (1 capsula molle)', 'Dose periodica (di solito settimanale): registrare il giorno di assunzione (Vitamina D)', 10)
  ];
}

const defaultState = {
  activePazienteId: 'paz_aldo',
  pazienti: [
    getPazienteAldoInit(),
    getPazienteAngelaInit(),
    getPazienteRosaInit()
  ]
};

const DB_KEY = 'careassist_pro_multipaziente_v4';

// Caricamento Dati con aggiornamento automatico
let AppData = JSON.parse(localStorage.getItem(DB_KEY));

if (!AppData || !AppData.pazienti || AppData.pazienti.length === 0) {
  AppData = defaultState;
  localStorage.setItem(DB_KEY, JSON.stringify(AppData));
} else {
  // Sincronizza i dati di Aldo Zamparino se già presenti
  const aldoEx = AppData.pazienti.find(p => p.id === 'paz_aldo');
  if (aldoEx) {
    aldoEx.medicoNome = 'Dott. Roberto Scarcia';
    aldoEx.medicoIndirizzo = 'Via Muciaccia 11, 70121 Bari';
    aldoEx.medicoStudio = 'Via Muciaccia 11, 70121 Bari';
    aldoEx.medicoTelStudio = '080 557 44 90';
    aldoEx.medicoOrari = 'Lunedì: 10:00-13:00. Martedì: 10:00-13:00 e 16:00-19:00. Mercoledì: 10:00-13:00. Giovedì: 16:00-19:00. Venerdì: 10:00-13:00 (Bari - Via Muciaccia 11)';
  }
  if (aldoEx) {
    aldoEx.nome = aldoEx.nome || 'Aldo Zamparino';
    aldoEx.indirizzo = aldoEx.indirizzo || 'Via Giovanni Modugno, 25 - BARI (BA)';
    aldoEx.telefonoFisso = aldoEx.telefonoFisso || '080 561 57 14';
    aldoEx.cellulare = aldoEx.cellulare || '338 306 69 05';
    aldoEx.moglieNome = aldoEx.moglieNome || 'Mazzicone Angela';
    aldoEx.moglieCellulare = aldoEx.moglieCellulare || '338 944 96 10';
    aldoEx.farmaciaDiRiferimento = aldoEx.farmaciaDiRiferimento || 'Farmacia Dott. MACARIO';
    aldoEx.farmaciaIndirizzo = aldoEx.farmaciaIndirizzo || 'Via G. Petroni, 69/b - Bari';
    aldoEx.farmaciaTelefono = aldoEx.farmaciaTelefono || '080 542 8061';
    aldoEx.medicoNome = 'Dott. Roberto Scarcia';
    aldoEx.medicoIndirizzo = 'Via Muciaccia 11, 70121 Bari';
    aldoEx.medicoStudio = 'Via Muciaccia 11, 70121 Bari';
    aldoEx.medicoTelStudio = '080 557 44 90';
    aldoEx.medicoEmail = 'scarcia.roberto@alice.it';
    aldoEx.medicoOrari = 'Lunedì: 10:00-13:00. Martedì: 10:00-13:00 e 16:00-19:00. Mercoledì: 10:00-13:00. Giovedì: 16:00-19:00. Venerdì: 10:00-13:00 (Bari - Via Muciaccia 11)';
    if (!aldoEx.patologie || aldoEx.patologie.length === 0) aldoEx.patologie = getPazienteAldoInit().patologie;
    if (!aldoEx.ausili || aldoEx.ausili.length === 0) aldoEx.ausili = getPazienteAldoInit().ausili;
    if (typeof aldoEx.allettato === 'undefined') aldoEx.allettato = true;

    // Sincronizza posologia esatta 4 capsule VIMPAT
    if (aldoEx.terapie) {
      const haVimpatPranzo = aldoEx.terapie.some(t => (t.ora === '13:30' || t.ora === '14:00') && (t.farmaco || '').toUpperCase().includes('VIMPAT'));
      if (!haVimpatPranzo) {
        aldoEx.terapie = aldoEx.terapie.filter(t => !(t.farmaco || '').toUpperCase().includes('VIMPAT'));
        aldoEx.terapie.push({
          id: 103,
          ora: '08:30',
          fascia: 'Mattina (Colazione)',
          farmaco: 'VIMPAT 100 mg (1ª dose)',
          principio: 'Lacosamide',
          dosaggio: '100 mg (1 capsula)',
          modo: 'A colazione con acqua (Controllo neurologico)',
          cprPerScatola: 56,
          scorta: 56,
          fattoOggi: false
        });
        aldoEx.terapie.push({
          id: 1032,
          ora: '13:30',
          fascia: 'Pranzo',
          farmaco: 'VIMPAT 100 mg (2ª dose)',
          principio: 'Lacosamide',
          dosaggio: '100 mg (1 capsula)',
          modo: 'A pranzo con acqua (Controllo neurologico)',
          cprPerScatola: 56,
          scorta: 56,
          fattoOggi: false
        });
        aldoEx.terapie.push({
          id: 105,
          ora: '20:30',
          fascia: 'Sera (Cena)',
          farmaco: 'VIMPAT 100 mg (3ª dose serale)',
          principio: 'Lacosamide',
          dosaggio: '200 mg (2 capsule insieme)',
          modo: 'Dopo cena (Dose serale di 2 capsule = 200 mg)',
          cprPerScatola: 56,
          scorta: 56,
          fattoOggi: false
        });
        aldoEx.terapie.sort((a, b) => (a.ora || '').localeCompare(b.ora || ''));
      }
    }
  }

  // Verifica o sincronizza Angela Mazzicone nella lista pazienti
  let angelaEx = AppData.pazienti.find(p => p.id === 'paz_angela' || p.nome.toLowerCase().includes('angela'));
  if (!angelaEx) {
    angelaEx = getPazienteAngelaInit();
    AppData.pazienti.push(angelaEx);
  } else {
    angelaEx.id = 'paz_angela';
    angelaEx.nome = 'Angela Mazzicone';
    angelaEx.dataNascita = '1938-05-29';
    angelaEx.indirizzo = 'Via Giovanni Modugno, 25 - BARI (BA)';
    angelaEx.telefonoFisso = '080 561 57 14';
    angelaEx.cellulare = '338 944 96 10';
    angelaEx.maritoNome = 'Aldo Zamparino';
    angelaEx.maritoCellulare = '338 306 69 05';
    angelaEx.farmaciaDiRiferimento = 'Farmacia Dott. MACARIO';
    angelaEx.farmaciaIndirizzo = 'Via G. Petroni, 69/b - Bari';
    angelaEx.farmaciaTelefono = '080 542 8061';
    angelaEx.medicoNome = 'Dott. Roberto Scarcia';
    angelaEx.medicoIndirizzo = 'Via Muciaccia, 11 - 70121 Bari';
    angelaEx.medicoStudio = 'Via Muciaccia, 11 - 70121 Bari';
    angelaEx.medicoTelStudio = '080 557 44 90';
    angelaEx.medicoTel = angelaEx.medicoTel || '347 126 59 71';
    angelaEx.medicoEmail = 'scarcia.roberto@alice.it';
    angelaEx.medicoOrari = 'Lunedì: 10:00-13:00. Martedì: 10:00-13:00 e 16:00-19:00. Mercoledì: 10:00-13:00. Giovedì: 16:00-19:00. Venerdì: 10:00-13:00 (Bari - Via Muciaccia 11)';
    angelaEx.patologie = getPazienteAngelaInit().patologie;
    angelaEx.ausili = getPazienteAngelaInit().ausili;
    if (!angelaEx.visite || angelaEx.visite.length < 2) {
      angelaEx.visite = getPazienteAngelaInit().visite;
    }
    // Se non ha le terapie della foto o sono vuote, assegna quelle complete
        // Aggiornamento specifico DIBASE: cadenza ogni 15 giorni (il 15 e il 30 del mese)
    if (angelaEx && angelaEx.terapie) {
      var dibase = angelaEx.terapie.find(function(item) { return (item.farmaco || '').toUpperCase().indexOf('DIBASE') >= 0; });
      if (dibase) {
        dibase.cadenzaTipo = 'quindicinale_15_30';
        dibase.fascia = 'Mattina (Dose Periodica)';
        dibase.ora = '10:00';
        if (dibase.modo.indexOf('15 e il 30') < 0) {
          dibase.modo = 'Assunzione orale periodica con un po\' di cibo grasso [Ogni 15 giorni: il 15 e il 30 del mese]';
        }
      }
    }

    if (!angelaEx.terapie || angelaEx.terapie.length < 5) {
      angelaEx.terapie = getPazienteAngelaInit().terapie;
    }
  }

    // Inizializzazione una-tantum o inserimento di Rosa Annunziata Cavalcante
  const rosaEx = AppData.pazienti.find(p => p.id === 'paz_rosa');
  if (!rosaEx) {
    AppData.pazienti.push(getPazienteRosaInit());
    console.log('Paziente Rosa Annunziata Cavalcante integrata in AppData!');
  } else if (!AppData.rosaInitializedOnce) {
    // Solo al primo avvio pulisce i dati ereditati, poi rispetta tassativamente tutti i salvataggi dell'utente!
    AppData.rosaInitializedOnce = true;
    rosaEx.nome = 'Rosa Annunziata Cavalcante';
    rosaEx.dataNascita = '1938-06-16';
    rosaEx.eta = calcolaAnniDaData('1938-06-16');
    rosaEx.indirizzo = 'Corleto Perticara (PZ)';
    if (rosaEx.telefonoFisso === '080 561 57 14' || rosaEx.telefonoFisso === '080 5615714') {
      rosaEx.telefonoFisso = '097 169 32 21';
    }
    if (rosaEx.cellulare === '338 306 69 05' || rosaEx.cellulare === '338 3066905') {
      rosaEx.cellulare = '';
    }
    if (!rosaEx.moglieNome || rosaEx.moglieNome.includes('Mazzicone') || rosaEx.moglieNome.trim() === '') {
      rosaEx.moglieNome = 'Maria Carmela (Figlia / Caregiver)';
      rosaEx.moglieCellulare = '338 739 76 71';
    }
    if (typeof rosaEx.allettato === 'undefined') {
      rosaEx.allettato = false;
    }
    // Rimuovi note ereditate da Aldo con 91 anni
    if (!rosaEx.note || rosaEx.note.includes('91 anni') || rosaEx.note.includes('urologica')) {
      rosaEx.note = 'Paziente di 88 anni. Cardiopatia ipertensiva in buon compenso, osteoartrosi diffusa e insufficienza venosa periferica.';
    }
    rosaEx.farmaciaDiRiferimento = rosaEx.farmaciaDiRiferimento || 'Farmacia Girasole Picconi';
    rosaEx.farmaciaIndirizzo = rosaEx.farmaciaIndirizzo || 'Via Ariosto, 4 / 16 - 85012 Corleto Perticara (PZ)';
    rosaEx.farmaciaTelefono = rosaEx.farmaciaTelefono || '0971 963055';
    rosaEx.medicoNome = rosaEx.medicoNome || 'Dr.ssa Carolina Potenza';
    rosaEx.medicoIndirizzo = rosaEx.medicoIndirizzo || 'Sarconi: Via Provinciale 1 / Moliterno: Via Parco del Seggio 1';
    rosaEx.medicoStudio = rosaEx.medicoStudio || 'Sarconi: Via Provinciale 1 / Moliterno: Via Parco del Seggio 1';
    rosaEx.medicoOrari = rosaEx.medicoOrari || 'Moliterno: Lun 15:00-18:00, Gio 9:00-13:00. Sarconi: Lun-Mer-Ven 9:30-13:00, Mar-Gio 15:00-18:30 (su appuntamento)';
    rosaEx.medicoTel = rosaEx.medicoTel || '338 379 05 64';
    rosaEx.medicoEmail = rosaEx.medicoEmail || 'carolina.potenza@aspbasilicata.it';
  }

  // Sostituzione una-tantum della terapia di Rosa con i farmaci della foto (17/10/2026)
  const rosaFoto = AppData.pazienti.find(p => p.id === 'paz_rosa');
  if (rosaFoto && !AppData.rosaTerapiaFoto20261017) {
    AppData.rosaTerapiaFoto20261017 = true;
    rosaFoto.terapie = getTerapieRosaFoto();
    rosaFoto.patologie = getPatologieRosaFoto();
    rosaFoto.registrazioni = (rosaFoto.registrazioni || []).filter(r => !String(r.tipo || '').startsWith('farmaco'));
  }
  // Aggiunta una-tantum Sivastin 20 mg (17/10/2026)
  // Configurazione automatica schema alternato Triatec per Rosa Annunziata
  if (rosaFoto && !AppData.rosaTriatecAlternato20261022) {
    AppData.rosaTriatecAlternato20261022 = true;
    var triatecRosa = (rosaFoto.terapie || []).find(function(t) { return (t.farmaco || '').toUpperCase().indexOf('TRIATEC') >= 0; });
    if (triatecRosa) {
      triatecRosa.cadenzaTipo = 'alternata_mezza_intera';
      triatecRosa.quantitaQuota = 0.5;
      triatecRosa.dosaggio = '5 mg (Dose alternata: ½ cpr e 1 cpr)';
      triatecRosa.modo = 'A colazione con acqua: ½ cpr un giorno e 1 cpr il giorno successivo (Pressione arteriosa)';
      triatecRosa.dataInizioAlterni = '2026-10-18';
      triatecRosa.ultimaModificaClinica = {
        data: '22/10/2026',
        fonte: 'Visita Specialistica',
        medico: 'Cardiologo',
        motivo: 'Alternanza ½ cpr e 1 cpr a giorni alterni per controllo pressione'
      };
    }
  }

  if (rosaFoto && !AppData.rosaSivastin20261017) {
    AppData.rosaSivastin20261017 = true;
    if (!(rosaFoto.terapie || []).some(t => t.id === 313)) {
      rosaFoto.terapie = rosaFoto.terapie || [];
      rosaFoto.terapie.push(getTerapieRosaFoto().find(t => t.id === 313));
    }
    rosaFoto.patologie = rosaFoto.patologie || [];
    if (!rosaFoto.patologie.some(x => x.toLowerCase().includes('dislipidemia'))) {
      rosaFoto.patologie.push('Dislipidemia / Ipercolesterolemia (Sivastin)');
    }
  }
  // Sincronizzazione una-tantum Ausilio PANTS per Rosa (17/10/2026)
  if (rosaFoto && !AppData.rosaPants20261017) {
    AppData.rosaPants20261017 = true;
    rosaFoto.ausili = rosaFoto.ausili || [];
    if (!rosaFoto.ausili.some(a => (a.tipo || '').toUpperCase().includes('PANTS'))) {
      rosaFoto.ausili.push({
        tipo: 'Mutandina Assorbente PANTS (Pull-Up monouso)',
        utilizzo: 'Taglia M (4 cambi/die) - Fornitura Trimestrale ASP',
        taglia: 'Media (M)',
        fabbisogno: '4 cambi/die (Lasix ore 08:30)',
        fornitore: 'ASP Basilicata (Fornitura Trimestrale)',
        scortaPacchi: 24,
        pezziTotali: 336,
        stato: 'In uso attivo (Rinnovo trimestrale)'
      });
    }
  }

  // Bonifica una-tantum descrizioni ausili di Rosa per evitare 'undefined'
  if (rosaFoto && !AppData.rosaAusiliDescrizioniFix20261018) {
    AppData.rosaAusiliDescrizioniFix20261018 = true;
    if (rosaFoto.ausili && Array.isArray(rosaFoto.ausili)) {
      rosaFoto.ausili.forEach(a => {
        if (!a.utilizzo) {
          const t = (a.tipo || '').toLowerCase();
          if (t.includes('deambulatore')) a.utilizzo = 'Uso quotidiano per deambulazione interna ed esterna in sicurezza';
          else if (t.includes('calze')) a.utilizzo = 'In uso diurno per favorire il ritorno venoso e prevenzione edemi';
          else if (t.includes('pants')) {
            a.utilizzo = 'Taglia M (4 cambi/die) - Fornitura Trimestrale ASP';
            a.dataRifornimento = a.dataRifornimento || '2026-10-15';
            a.prossimaRichiesta = a.prossimaRichiesta || '2027-01-15';
            a.dataScadenza = a.dataScadenza || '2027-01-15';
            a.giorniAlert = 15;
          }
          else a.utilizzo = a.stato || 'In uso attivo domiciliare';
        }
      });
    }
  }

  // Inserimento una-tantum AVERELIX 75 mg Clopidogrel (17/10/2026)
  if (rosaFoto && !AppData.rosaAverelix20261017) {
    AppData.rosaAverelix20261017 = true;
    if (!(rosaFoto.terapie || []).some(t => t.id === 314 || (t.farmaco || '').toUpperCase().includes('AVERELIX'))) {
      rosaFoto.terapie = rosaFoto.terapie || [];
      const averelixItem = getTerapieRosaFoto().find(t => t.id === 314);
      if (averelixItem) {
        rosaFoto.terapie.push(averelixItem);
        rosaFoto.terapie.sort((a, b) => (a.ora || '').localeCompare(b.ora || ''));
      }
    }
    rosaFoto.patologie = rosaFoto.patologie || [];
    if (!rosaFoto.patologie.some(x => x.toLowerCase().includes('averelix') || x.toLowerCase().includes('aterotrombotici'))) {
      rosaFoto.patologie.push('Prevenzione eventi aterotrombotici / antiaggregazione piastrinica (Averelix Clopidogrel)');
    }
  }

  // Allineamento contatto Caregiver / Figlia per Rosa se attualmente vuoto
  if (rosaFoto && (!rosaFoto.moglieNome || rosaFoto.moglieNome.trim() === '')) {
    rosaFoto.moglieNome = 'Maria Carmela (Figlia / Caregiver)';
    rosaFoto.moglieCellulare = rosaFoto.moglieCellulare || '338 739 76 71';
    if (!rosaFoto.telefonoFisso) rosaFoto.telefonoFisso = '097 169 32 21';
  }

  // Sincronizzazione specifica confezione foto: SERENITY SoftDry Sensitive Pants be free Taglia L Extra (14 pz)
  if (rosaFoto && !AppData.rosaSerenityPantsRinnovo20270218) {
    AppData.rosaSerenityPantsRinnovo20270218 = true;
    rosaFoto.ausili = rosaFoto.ausili || [];
    let pants = rosaFoto.ausili.find(a => (a.tipo || '').toUpperCase().includes('PANTS'));
    if (!pants) {
      pants = { tipo: 'Mutandina Assorbente PANTS (Pull-Up monouso)' };
      rosaFoto.ausili.push(pants);
    }
    pants.marca = 'Serenity SoftDry Sensitive "be free"';
    pants.taglia = 'L (110-150 cm) - Livello Extra (6 gocce)';
    pants.pezziPerPacco = 14;
    pants.cartoni = '6 cartoni (24 pacchi - 336 pezzi)';
    pants.scortaPacchi = 24;
    pants.pezziTotali = 336;
    pants.utilizzo = 'Serenity SoftDry Sensitive "be free" - Taglia L Extra (110-150 cm) con Aloe & Vit. E - 6 cartoni (24 pacchi = 336 pezzi) - Fornitura ASP';
    pants.fabbisogno = '3-4 cambi/die (terapia diuretica Lasix)';
    pants.fornitore = 'ASP Basilicata (Fornitura Sanitaria Domiciliare)';
    pants.stato = 'In uso attivo regolare';
    pants.dataRifornimento = '2026-10-15';
    pants.prossimaRichiesta = '2027-02-18';
    pants.dataScadenza = '2027-02-18';
    pants.giorniAlert = 15;
  }

  // Sincronizzazione DDT Serenity CamScanner (DDT n. 2286626418 del 21/08/2026)
  if (rosaFoto && !AppData.rosaSerenityDDT20260821) {
    AppData.rosaSerenityDDT20260821 = true;
    rosaFoto.indirizzo = 'Via Domenico Cirillo, 9 - 85012 Corleto Perticara (PZ)';
    rosaFoto.cellulare = '338 379 76 71';
    rosaFoto.ausili = rosaFoto.ausili || [];
    let pants = rosaFoto.ausili.find(a => (a.tipo || '').toUpperCase().includes('PANTS'));
    if (!pants) {
      pants = { tipo: 'Mutandina Assorbente PANTS (Pull-Up monouso)' };
      rosaFoto.ausili.push(pants);
    }
    pants.marca = 'Serenity S.p.A. - PANTS SD SENSITIVE BE FREE EXTRA L 8';
    pants.codiceArticolo = '00037212200021';
    pants.taglia = 'L (Extra) - Girovita 110-150 cm';
    pants.ddtNumero = '2286626418';
    pants.ddtData = '2026-08-21';
    pants.ordineAsp = '0060448686 del 03.08.2026';
    pants.codiceDistretto = '02 02 - DISTRETTO VILLA D\'AGRI';
    pants.codiceUtente = '002713';
    pants.pezziConsegnati = 140;
    pants.numConfezioni = 10;
    pants.pezziPerPacco = 14;
    pants.cartoni = '10 confezioni (140 pezzi)';
    pants.scortaPacchi = 10;
    pants.pezziTotali = 140;
    pants.fornitore = 'Serenity S.p.A. / ASP Potenza (Distretto Villa D\'Agri)';
    pants.fabbisogno = 'Fornitura programmata ogni 90 giorni (ASP Potenza)';
    pants.utilizzo = 'PANTS SD SENSITIVE BE FREE EXTRA L 8 (Cod. 00037212200021) - 10 conf. x 14 pz = 140 pz. DDT Serenity N. 2286626418 del 21/08/2026. Ord. ASP 0060448686 - Distretto Villa D\'Agri 02 02. Codice Utente: 002713. Prossima consegna indicativa: 24/11/2026 con preavviso telefonico (3383797671). Scadenza Piano: 18/02/2027.';
    pants.dataRifornimento = '2026-08-21';
    pants.prossimaRichiesta = '2026-11-24';
    pants.prossimaConsegnaIndicativa = '2026-11-24';
    pants.scadenzaPiano = '2027-02-18';
    pants.dataScadenza = '2027-02-18';
    pants.giorniAlert = 15;
    pants.stato = 'In uso attivo regolare';

    // Aggiungi promemoria visita/consegna indicativa 24/11/2026 se non già presente
    rosaFoto.visite = rosaFoto.visite || [];
    if (!rosaFoto.visite.some(v => v.data === '2026-11-24' && (v.motivo || '').includes('PANTS'))) {
      rosaFoto.visite.push({
        id: Date.now() + 1,
        data: '2026-11-24',
        ora: '10:00',
        medico: 'Serenity S.p.A. / ASP Villa D\'Agri',
        motivo: 'Prossima consegna indicativa fornitura PANTS Serenity (previo appuntamento telefonico al 3383797671)',
        fatto: false
      });
    }
  }

  localStorage.setItem(DB_KEY, JSON.stringify(AppData));
}

function showSyncToast(msg, isSuccess) {
  var existing = document.getElementById('careassist-sync-toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.id = 'careassist-sync-toast';
  toast.style.cssText = 'position:fixed; bottom:75px; left:50%; transform:translateX(-50%); background:' + (isSuccess ? 'rgba(16, 185, 129, 0.95)' : 'rgba(14, 165, 233, 0.95)') + '; color:#fff; padding:9px 18px; border-radius:25px; font-size:12.5px; font-weight:700; z-index:999999; box-shadow:0 8px 24px rgba(0,0,0,0.4); display:flex; align-items:center; gap:8px; pointer-events:none; transition:all 0.3s;';
  toast.innerHTML = (isSuccess ? '✓ ' : '🔄 ') + msg;
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(function() { toast.remove(); }, 350);
  }, 3200);
}

function saveDb() {
  AppData.lastModified = Date.now();
  AppData.lastModifiedDevice = (window.innerWidth <= 900) ? 'smartphone' : 'pc';
  localStorage.setItem(DB_KEY, JSON.stringify(AppData));
  renderAll();

  // Flag per indicare modifiche in sospeso se offline
  localStorage.setItem('careassist_pending_sync', 'true');

  // Sincronizzazione automatica bidirezionale verso il server locale
  inviaModificheAlServer();
}

function inviaModificheAlServer(onSuccess) {
  try {
    var syncUrl = (window.location && window.location.protocol.indexOf('http') === 0)
      ? '/api/save-db'
      : 'http://127.0.0.1:3000/api/save-db';

    var sendData = JSON.stringify(AppData);

    fetch(syncUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: sendData,
      cache: 'no-store'
    }).then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function(data) {
      localStorage.removeItem('careassist_pending_sync');
      if (onSuccess) onSuccess(data);
    }).catch(function() {
      // Se fallisce, prova con l'IP Wi-Fi diretto
      fetch('http://192.168.1.5:3000/api/save-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: sendData,
        cache: 'no-store'
      }).then(function(r) { return r.json(); }).then(function(data) {
        localStorage.removeItem('careassist_pending_sync');
        if (onSuccess) onSuccess(data);
      }).catch(function() {
        console.log('PC non raggiungibile: modifiche salvate in locale, verranno inviate appena il PC si riaccende.');
      });
    });
  } catch (e) {
    console.warn('Sync save error:', e);
  }
}

// Funzione di caricamento e riconciliazione automatica del database dal server condiviso
var _isSyncingInProgress = false;
function sincronizzaDbDalServer(callback) {
  if (_isSyncingInProgress) return;
  _isSyncingInProgress = true;

  try {
    var baseUrl = (window.location && window.location.protocol.indexOf('http') === 0)
      ? ''
      : 'http://127.0.0.1:3000';

    var getUrl = baseUrl + '/api/get-db?_t=' + Date.now();

    var reconcileData = function(serverData) {
      if (serverData && serverData.pazienti && serverData.pazienti.length > 0) {
        var localTime = Number(AppData.lastModified) || 0;
        var serverTime = Number(serverData.lastModified) || 0;
        var isPendingSync = localStorage.getItem('careassist_pending_sync') === 'true';

        // Caso 1: Lo Smartphone ha modifiche più recenti fatte mentre il PC era spento
        if (isPendingSync && localTime > serverTime) {
          console.log('Rilevate modifiche offline sul dispositivo più recenti del PC. Invio al server...');
          inviaModificheAlServer(function() {
            showSyncToast('PC aggiornato con le modifiche dal cellulare!', true);
          });
        }
        // Caso 2: Il Server sul PC ha dati più recenti
        else if (serverTime > localTime) {
          console.log('Rilevate modifiche più recenti sul PC. Aggiornamento interfaccia...');
          AppData = serverData;
          localStorage.setItem(DB_KEY, JSON.stringify(serverData));
          localStorage.removeItem('careassist_pending_sync');
          renderAll();
          showSyncToast('Dati allineati all\'ultima versione dal PC!', true);
        }
        // Caso 3: Stessa versione o nessuna differenza
        else {
          localStorage.removeItem('careassist_pending_sync');
        }

        if (callback) callback(true);
      }
      _isSyncingInProgress = false;
    };

    fetch(getUrl, { cache: 'no-store' })
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(serverData) {
        reconcileData(serverData);
      })
      .catch(function() {
        // Fallback prova diretta su IP Wi-Fi
        fetch('http://192.168.1.5:3000/api/get-db?_t=' + Date.now(), { cache: 'no-store' })
          .then(function(r) { return r.json(); })
          .then(function(data) {
            reconcileData(data);
          })
          .catch(function() {
            _isSyncingInProgress = false;
          });
      });
  } catch(e) {
    _isSyncingInProgress = false;
    console.warn('Get-db sync error:', e);
  }
}

function getPazientiAccessibili() {
  const role = localStorage.getItem('milella_role') || localStorage.getItem('milella_last_authenticated_role');
  if (role === 'admin') return AppData.pazienti;

  let pazAbilitati = [];
  try {
    pazAbilitati = JSON.parse(localStorage.getItem('milella_paz_abilitati') || '[]');
  } catch(e) {
    pazAbilitati = [];
  }

  // Se è specificato 'all' o la lista è vuota (operatore non ristretto), vede tutti i pazienti
  if (!pazAbilitati || pazAbilitati.length === 0 || pazAbilitati.includes('all')) {
    return AppData.pazienti;
  }

  const filtrati = AppData.pazienti.filter(p => pazAbilitati.includes(p.id));
  return filtrati.length > 0 ? filtrati : AppData.pazienti;
}

function getActivePaziente() {
  const listaVisibile = getPazientiAccessibili();
  let p = listaVisibile.find(item => item.id === AppData.activePazienteId);
  if (!p && listaVisibile.length > 0) {
    AppData.activePazienteId = listaVisibile[0].id;
    p = listaVisibile[0];
  }
  return p || AppData.pazienti[0];
}

// Selettore Pazienti

// Calcola gli orari di ambulatorio e la sede di studio attiva oggi
function getInfoStudioOggi(paziente) {
  if (!paziente) return { testoOggi: '', orariCompleti: '', sedeOggi: '', eApertoOggi: false, statoTempoReale: '' };
  const orari = (paziente.medicoOrari || '').trim();
  const sedi = (paziente.medicoIndirizzo || paziente.medicoStudio || '').trim();
  const medNome = (paziente.medicoNome || paziente.medico || '').toLowerCase();

  if (!orari && !sedi && !medNome.includes('scarcia') && !medNome.includes('potenza')) {
    return { testoOggi: '', orariCompleti: '', sedeOggi: '', eApertoOggi: false, statoTempoReale: '' };
  }

  const giorni = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const now = new Date();
  const dayIndex = now.getDay(); // 0 = Dom, 1 = Lun, 2 = Mar, ..., 5 = Ven, 6 = Sab
  const nomeGiorno = giorni[dayIndex];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const orariLower = (orari + ' ' + sedi + ' ' + medNome).toLowerCase();

  // Definiamo i turni di apertura per oggi (fasce: [{ start: min, end: min, sede: str, label: str }])
  let turniOggi = [];
  let orarioTestualeOggi = '';
  let sedeOggi = '';

  // 1. DOTT. ROBERTO SCARCIA (BARI - VIA MUCIACCIA 11)
  if (orariLower.includes('scarcia') || orariLower.includes('muciaccia') || (orariLower.includes('bari') && !orariLower.includes('sarconi'))) {
    sedeOggi = 'Bari (Via Muciaccia 11)';
    if (dayIndex === 1) { // Lunedì: 10:00-13:00
      turniOggi = [{ start: 10 * 60, end: 13 * 60, sede: 'Via Muciaccia 11', label: '10:00 – 13:00' }];
      orarioTestualeOggi = '10:00 – 13:00';
    } else if (dayIndex === 2) { // Martedì: 10:00-13:00 e 16:00-19:00
      turniOggi = [
        { start: 10 * 60, end: 13 * 60, sede: 'Via Muciaccia 11', label: '10:00 – 13:00' },
        { start: 16 * 60, end: 19 * 60, sede: 'Via Muciaccia 11', label: '16:00 – 19:00' }
      ];
      orarioTestualeOggi = '10:00 – 13:00 & 16:00 – 19:00';
    } else if (dayIndex === 3) { // Mercoledì: 10:00-13:00
      turniOggi = [{ start: 10 * 60, end: 13 * 60, sede: 'Via Muciaccia 11', label: '10:00 – 13:00' }];
      orarioTestualeOggi = '10:00 – 13:00';
    } else if (dayIndex === 4) { // Giovedì: 16:00-19:00
      turniOggi = [{ start: 16 * 60, end: 19 * 60, sede: 'Via Muciaccia 11', label: '16:00 – 19:00' }];
      orarioTestualeOggi = '16:00 – 19:00';
    } else if (dayIndex === 5) { // Venerdì: 10:00-13:00
      turniOggi = [{ start: 10 * 60, end: 13 * 60, sede: 'Via Muciaccia 11', label: '10:00 – 13:00' }];
      orarioTestualeOggi = '10:00 – 13:00';
    }
  }
  // 2. DR.SSA CAROLINA POTENZA (SARCONI & MOLITERNO)
  else if (orariLower.includes('sarconi') || orariLower.includes('moliterno') || orariLower.includes('potenza')) {
    if (dayIndex === 1) { // Lunedì: 09:30-13:00 (Sarconi) / 15:00-18:00 (Moliterno)
      turniOggi = [
        { start: 9 * 60 + 30, end: 13 * 60, sede: 'Sarconi', label: '09:30 – 13:00' },
        { start: 15 * 60, end: 18 * 60, sede: 'Moliterno', label: '15:00 – 18:00' }
      ];
      sedeOggi = 'Sarconi (mattina) / Moliterno (pom.)';
      orarioTestualeOggi = '09:30 – 13:00 (Sarconi) & 15:00 – 18:00 (Moliterno)';
    } else if (dayIndex === 2) { // Martedì: 15:00-18:30 (Sarconi)
      turniOggi = [{ start: 15 * 60, end: 18 * 60 + 30, sede: 'Sarconi', label: '15:00 – 18:30' }];
      sedeOggi = 'Sarconi';
      orarioTestualeOggi = '15:00 – 18:30 (Sarconi)';
    } else if (dayIndex === 3) { // Mercoledì: 09:30-13:00 (Sarconi)
      turniOggi = [{ start: 9 * 60 + 30, end: 13 * 60, sede: 'Sarconi', label: '09:30 – 13:00' }];
      sedeOggi = 'Sarconi';
      orarioTestualeOggi = '09:30 – 13:00 (Sarconi)';
    } else if (dayIndex === 4) { // Giovedì: 09:00-13:00 (Moliterno) / 15:00-18:30 (Sarconi)
      turniOggi = [
        { start: 9 * 60, end: 13 * 60, sede: 'Moliterno', label: '09:00 – 13:00' },
        { start: 15 * 60, end: 18 * 60 + 30, sede: 'Sarconi', label: '15:00 – 18:30' }
      ];
      sedeOggi = 'Moliterno (mattina) / Sarconi (pom.)';
      orarioTestualeOggi = '09:00 – 13:00 (Moliterno) & 15:00 – 18:30 (Sarconi)';
    } else if (dayIndex === 5) { // Venerdì: 09:30-13:00 (Sarconi)
      turniOggi = [{ start: 9 * 60 + 30, end: 13 * 60, sede: 'Sarconi', label: '09:30 – 13:00' }];
      sedeOggi = 'Sarconi';
      orarioTestualeOggi = '09:30 – 13:00 (Sarconi)';
    }
  }

  // Helper formattazione ore e minuti (es. 85 min -> "1h e 25m", 35 min -> "35m")
  const formatDiff = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m} min`;
  };

  // CALCOLO DELLO STATO IN TEMPO REALE ADESSO
  let isOpenNow = false;
  let statoTempoReale = '';
  let badgeColore = '#047857'; // verde
  let badgeBg = '#ecfdf5';
  let badgeBorder = '#6ee7b7';
  let badgeIcona = '🟢';
  let pillText = '';

  if (turniOggi.length === 0) {
    // Studio non operativo oggi
    isOpenNow = false;
    pillText = `Oggi ${nomeGiorno}: Ambulatorio Chiuso (Reperibilità urgenze)`;
    badgeColore = '#b91c1c';
    badgeBg = '#fee2e2';
    badgeBorder = '#fca5a5';
    badgeIcona = '🔴';
  } else {
    // Cerchiamo se siamo dentro un turno
    const activeTurno = turniOggi.find(t => currentMinutes >= t.start && currentMinutes < t.end);

    if (activeTurno) {
      isOpenNow = true;
      const minsToClose = activeTurno.end - currentMinutes;
      const chiusuraStr = formatDiff(minsToClose);
      pillText = `APERTO ORA • Chiude tra ${chiusuraStr} (${activeTurno.label} ${activeTurno.sede})`;
      badgeColore = '#047857';
      badgeBg = '#ecfdf5';
      badgeBorder = '#6ee7b7';
      badgeIcona = '🟢';
    } else {
      // Non è aperto in questo preciso minuto. Controlliamo se apre più tardi oggi!
      const nextTurnoOggi = turniOggi.find(t => currentMinutes < t.start);

      if (nextTurnoOggi) {
        isOpenNow = false;
        const minsToOpen = nextTurnoOggi.start - currentMinutes;
        pillText = `Chiuso ora • Riapre alle ${nextTurnoOggi.label.split('–')[0].trim()} tra ${formatDiff(minsToOpen)} (${nextTurnoOggi.sede})`;
        badgeColore = '#b45309'; // ambra / arancione elegante
        badgeBg = '#fef3c7';
        badgeBorder = '#fcd34d';
        badgeIcona = '🟡';
      } else {
        // Ha terminato i turni di oggi
        isOpenNow = false;
        pillText = `Chiuso ora • Turno terminato per oggi (${orarioTestualeOggi})`;
        badgeColore = '#475569'; // grigio elegante riposo
        badgeBg = '#f1f5f9';
        badgeBorder = '#cbd5e1';
        badgeIcona = '⚪';
      }
    }
  }

  return {
    giorno: nomeGiorno,
    testoOggi: pillText,
    orarioTestualeOggi: orarioTestualeOggi,
    orariCompleti: orari || 'Riceve su appuntamento',
    sedi: sedi || sedeOggi,
    sedeOggi: sedeOggi,
    eApertoOggi: turniOggi.length > 0,
    isOpenNow: isOpenNow,
    badgeColore: badgeColore,
    badgeBg: badgeBg,
    badgeBorder: badgeBorder,
    badgeIcona: badgeIcona
  };
}

function renderPazientiSelector() {
  const select = document.getElementById('select-paziente-attivo');
  if (!select) return;

  const lista = getPazientiAccessibili();
  const role = localStorage.getItem('milella_role') || localStorage.getItem('milella_last_authenticated_role');
  
  // Se l'operatore non è admin, nascondi il tasto "Nuovo Assistito"
  const btnNuovo = document.querySelector('.btn-new-patient');
  if (btnNuovo) {
    btnNuovo.style.display = (role === 'admin') ? 'inline-flex' : 'none';
  }

  // Se l'assistito attualmente selezionato non è più nella lista accessibile, cambia subito
  if (!lista.some(p => p.id === AppData.activePazienteId) && lista.length > 0) {
    AppData.activePazienteId = lista[0].id;
  }

  select.innerHTML = lista.map(p => `
    <option value="${p.id}" ${p.id === AppData.activePazienteId ? 'selected' : ''}>
      👤 ${(p.nome || '').replace(/\s*\(\d+\s*anni\)/gi, '')} (${calcolaAnniDaData(p.dataNascita)} anni)
    </option>
  `).join('');

  if (lista.length === 1) {
    select.style.pointerEvents = 'none';
    select.style.opacity = '0.95';
    select.title = 'Paziente assegnato dal Supervisore';
  } else {
    select.style.pointerEvents = 'auto';
    select.style.opacity = '1';
    select.title = 'Seleziona assistito';
  }

  const activeP = getActivePaziente();
  const badgeInfo = document.getElementById('paziente-badge-info');
  if (badgeInfo && activeP) {
    const eta = calcolaAnniDaData(activeP.dataNascita);
    // Helper per pulire numeri di telefono per i link tel/sms/wa
    const cleanNum = (n) => (n || '').replace(/[^0-9+]/g, '');
    const waNum = (n) => {
      const clean = cleanNum(n);
      if (!clean) return '';
      return clean.startsWith('39') || clean.startsWith('+39') ? clean.replace('+', '') : '39' + clean;
    };
    const mapsLink = (addr) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;

    // 1. INDIRIZZO RESIDENZA CON GOOGLE MAPS
    const ind = activeP.indirizzo ? `
      <div class="meta-item clinica-zoom-item" style="cursor:pointer;" onmouseenter="mostraLenteClinica('Residenza & Domicilio Assistito', '${activeP.indirizzo.replace(/'/g, "\\'")}', '📍')" onmouseleave="nascondiLenteClinica()">
        <span>📍</span>
        <a href="${mapsLink(activeP.indirizzo)}" target="_blank" class="smart-link" title="Apri su Google Maps">
          <b>${activeP.indirizzo}</b>
        </a>
        <a href="${mapsLink(activeP.indirizzo)}" target="_blank" class="action-icon-btn map" title="Naviga con Google Maps">🗺️</a>
      </div>` : '';

    // 2. TELEFONO FISSO CASA (CHIAMATA & WHATSAPP)
    const tel = activeP.telefonoFisso ? `
      <div class="meta-item clinica-zoom-item" style="cursor:pointer;" onmouseenter="mostraLenteClinica('Telefono Abitazione / Fisso', '${activeP.telefonoFisso}', '☎️')" onmouseleave="nascondiLenteClinica()">
        <span>☎️</span>
        <span>Casa: <b>${activeP.telefonoFisso}</b></span>
        <a href="tel:${cleanNum(activeP.telefonoFisso)}" class="action-icon-btn call" title="Chiama Casa">📞</a>
        <a href="https://api.whatsapp.com/send?phone=${waNum(activeP.telefonoFisso)}" target="_blank" class="action-icon-btn wa" title="Chat WhatsApp con Telefono Casa">🟢</a>
      </div>` : '';

    // 3. CELLULARE ALDO (CHIAMATA, SMS, WHATSAPP)
    const cell = activeP.cellulare ? `
      <div class="meta-item clinica-zoom-item" style="cursor:pointer;" onmouseenter="mostraLenteClinica('Cellulare Assistito (${activeP.nome})', '${activeP.cellulare}', '📱')" onmouseleave="nascondiLenteClinica()">
        <span>📱</span>
        <span>Cell: <b>${activeP.cellulare}</b></span>
        <a href="tel:${cleanNum(activeP.cellulare)}" class="action-icon-btn call" title="Chiama Aldo">📞</a>
        <a href="sms:${cleanNum(activeP.cellulare)}" class="action-icon-btn sms" title="Invia SMS ad Aldo">💬</a>
        <a href="https://api.whatsapp.com/send?phone=${waNum(activeP.cellulare)}" target="_blank" class="action-icon-btn wa" title="Chat WhatsApp con Aldo">🟢</a>
      </div>` : '';

    // 4. CONTATTO DI RIFERIMENTO / CAREGIVER / FAMIGLIA (CHIAMATA, SMS, WHATSAPP, EMAIL)
    const parenteCell = activeP.moglieCellulare || '';
    const parenteNome = activeP.moglieNome || '';
    const parenteEmail = activeP.caregiverEmail || activeP.moglieEmail || '';
    const moglie = parenteNome ? `
      <div class="meta-item clinica-zoom-item" style="background:#eff6ff; border-color:#bfdbfe; color:#1e40af; cursor:pointer;" onmouseenter="mostraLenteClinica('Contatto di Riferimento / Caregiver', '${parenteNome} - Tel: ${parenteCell}${parenteEmail ? ' - Email: ' + parenteEmail : ''}', '👥')" onmouseleave="nascondiLenteClinica()">
        <span>👥</span>
        <span>Caregiver / Famiglia: <b>${parenteNome}</b></span>
        ${parenteCell ? `
          &bull; <span>📱 <b>${parenteCell}</b></span>
          <a href="tel:${cleanNum(parenteCell)}" class="action-icon-btn call" title="Chiama Caregiver / Familiare">📞</a>
          <a href="sms:${cleanNum(parenteCell)}" class="action-icon-btn sms" title="Invia SMS al Caregiver">💬</a>
          <a href="https://api.whatsapp.com/send?phone=${waNum(parenteCell)}" target="_blank" class="action-icon-btn wa" title="Chat WhatsApp con Caregiver / Familiare">🟢</a>
        ` : ''}
        ${parenteEmail ? `
          &bull; <span>✉️ <b style="font-size:11.5px;">${parenteEmail}</b></span>
          <a href="mailto:${parenteEmail}?subject=Comunicazione%20CareAssist%20Pro%20per%20${encodeURIComponent(activeP.nome || 'Assistito')}" class="action-icon-btn mail" title="Invia Email al Caregiver">✉️</a>
        ` : ''}
      </div>` : '';
    
    // 5. BADGE MEDICO CURANTE (LAYOUT CLINICO A 2 LIVELLI ELEGANTE & PROFESSIONALE)
    const medicoNome = activeP.medicoNome || activeP.medico || 'Dott. di Famiglia';
    const medCell = activeP.medicoTel || activeP.telMedico || '';
    const medEmail = activeP.medicoEmail || '';
    const medPec = activeP.medicoPec || '';
    const infoStudio = getInfoStudioOggi(activeP);
    
    let sediStudioPulite = activeP.medicoIndirizzo || '';
    if (!sediStudioPulite && activeP.medicoStudio && activeP.medicoStudio.includes('Sarconi')) {
      sediStudioPulite = activeP.medicoStudio;
    }
    const telFissoStudio = (activeP.medicoTelStudio || (activeP.medicoStudio && !activeP.medicoStudio.includes('Sarconi') && !activeP.medicoStudio.includes('Via') ? activeP.medicoStudio : ''));

    const medicoBadge = `
      <div class="clinica-zoom-item" style="background:#fefce8; border:1.5px solid #fde047; border-radius:12px; padding:10px 14px; color:#854d0e; cursor:pointer; display:flex; flex-direction:column; justify-content:space-between; gap:6px; box-shadow:0 1px 3px rgba(0,0,0,0.04); transition:all 0.15s ease;"
           onmouseenter="mostraLenteMedicoCurante()" 
           onmouseleave="nascondiLenteClinica()">
        
        <!-- LIVELLO 1: MEDICO, STATO AMBULATORIO OGGI E AZIONE ORARI -->
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:16px;">🩺</span>
            <span style="font-size:13.5px; font-weight:800; color:#713f12;">${medicoNome}</span>
            <span style="font-size:11px; font-weight:700; color:#a16207; background:#fef9c3; border:1px solid #fef08a; padding:1px 6px; border-radius:6px;">MMG</span>
          </div>

          <!-- BADGE DI STATO AMBULATORIO OGGI (IN PRIMO PIANO) -->
          ${infoStudio.testoOggi ? `
            <div style="background:${infoStudio.badgeBg}; color:${infoStudio.badgeColore}; border:1.5px solid ${infoStudio.badgeBorder}; padding:4px 12px; border-radius:20px; font-weight:800; font-size:12px; display:inline-flex; align-items:center; gap:6px; box-shadow:0 1px 2px rgba(0,0,0,0.03); transition:all 0.2s ease;">
              <span style="font-size:13px; line-height:1;">${infoStudio.badgeIcona}</span> 
              <span>${infoStudio.testoOggi}</span>
            </div>
          ` : ''}
        </div>

        <!-- LIVELLO 2: SEDI STUDI E CONTATTI COMPLETI SENZA DUPLICAZIONI -->
        <div style="display:flex; align-items:center; gap:12px; font-size:12px; color:#475569; flex-wrap:wrap; border-top:1px dashed #fef08a; padding-top:6px;">
          
          <!-- SEDI AMBULATORI -->
          ${sediStudioPulite ? `
            <div style="display:flex; align-items:center; gap:4px;" title="${sediStudioPulite}">
              <span style="font-size:13px;">📍</span>
              <span style="color:#64748b; font-weight:600;">Studi:</span>
              <b style="color:#0f172a;">${sediStudioPulite}</b>
            </div>
          ` : ''}

          <!-- TELEFONO FISSO STUDIO SE PRESENTE -->
          ${telFissoStudio ? `
            <div style="display:flex; align-items:center; gap:4px;">
              <span>☎️</span>
              <span style="color:#64748b; font-weight:600;">Studio:</span>
              <b style="color:#0f172a;">${telFissoStudio}</b>
              <a href="tel:${cleanNum(telFissoStudio)}" class="action-icon-btn call" title="Chiama Studio Medico">📞</a>
            </div>
          ` : ''}

          <!-- CELLULARE E WHATSAPP -->
          ${medCell ? `
            <div style="display:flex; align-items:center; gap:4px;">
              <span>📱</span>
              <span style="color:#64748b; font-weight:600;">Cell:</span>
              <b style="color:#0f172a;">${medCell}</b>
              <a href="tel:${cleanNum(medCell)}" class="action-icon-btn call" title="Chiama Medico">📞</a>
              <a href="sms:${cleanNum(medCell)}" class="action-icon-btn sms" title="Invia SMS al Medico">💬</a>
              <a href="https://api.whatsapp.com/send?phone=${waNum(medCell)}" target="_blank" class="action-icon-btn wa" title="WhatsApp col Medico">🟢</a>
            </div>
          ` : ''}

          <!-- EMAIL ORDINARIA -->
          ${medEmail ? `
            <div style="display:flex; align-items:center; gap:5px;">
              <span style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:6px; font-size:10px; font-weight:800; border:1px solid #bae6fd;">EMAIL</span>
              <a href="mailto:${medEmail}?subject=Richiesta%20Farmaci%20e%20Assistenza%20per%20${encodeURIComponent(activeP.nome || 'Paziente')}" class="smart-link" style="color:#0284c7; font-weight:700;" title="Invia Email Ordinaria al Medico Curante">
                <span>✉️</span> <b>${medEmail}</b>
              </a>
              <a href="mailto:${medEmail}?subject=Richiesta%20Farmaci%20e%20Assistenza%20per%20${encodeURIComponent(activeP.nome || 'Paziente')}" class="action-icon-btn mail" title="Invia Email Ordinaria">✉️</a>
            </div>
          ` : ''}

          <!-- PEC UFFICIALE SE PRESENTE -->
          ${medPec ? `
            <div style="display:flex; align-items:center; gap:5px;">
              <span style="background:#fef3c7; color:#92400e; padding:2px 6px; border-radius:6px; font-size:10px; font-weight:800; border:1px solid #fde68a;">PEC</span>
              <a href="mailto:${medPec}?subject=Comunicazione%20Ufficiale%20per%20${encodeURIComponent(activeP.nome || 'Paziente')}" class="smart-link" style="color:#b45309; font-weight:700;" title="Invia PEC Ufficiale al Medico Curante">
                <span>🔒</span> <b>${medPec}</b>
              </a>
              <a href="mailto:${medPec}?subject=Comunicazione%20Ufficiale%20per%20${encodeURIComponent(activeP.nome || 'Paziente')}" class="action-icon-btn mail" style="background:#fef3c7; border-color:#fde68a; color:#b45309;" title="Invia PEC">🔒</a>
            </div>
          ` : ''}
        </div>
      </div>`;
    
    // 6. BADGE FARMACIA TERRITORIALE PROFESSIONALE
    const farmNome = activeP.farmaciaDiRiferimento || 'Farmacia Territoriale';
    const farmInd = activeP.farmaciaIndirizzo || '';
    const farmTel = activeP.farmaciaTelefono || '';

    const farmaciaBadge = `
      <div class="clinica-zoom-item" style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:12px; padding:10px 14px; color:#14532d; display:flex; flex-direction:column; justify-content:space-between; gap:6px; box-shadow:0 1px 3px rgba(0,0,0,0.04); transition:all 0.15s ease;"
           onmouseenter="mostraLenteFarmacia()" 
           onmouseleave="nascondiLenteClinica()">
        
        <!-- LIVELLO 1: INTESTAZIONE FARMACIA -->
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:16px;">💊</span>
            <span style="font-size:13.5px; font-weight:800; color:#14532d;">${farmNome}</span>
            <span style="font-size:11px; font-weight:700; color:#15803d; background:#dcfce7; border:1px solid #bbf7d0; padding:1px 6px; border-radius:6px;">Ritiro Farmaci</span>
          </div>
          ${farmInd ? `
            <a href="${mapsLink(farmInd)}" target="_blank" class="btn btn-outline" style="font-size:11px; padding:2px 8px; border-color:#86efac; background:#fff; color:#166534; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:4px;" title="Apri navigatore Google Maps">
              <span>🗺️</span> Mappa
            </a>
          ` : ''}
        </div>

        <!-- LIVELLO 2: INDIRIZZO E CONTATTI RAPIDI -->
        <div style="display:flex; align-items:center; gap:12px; font-size:12px; color:#166534; flex-wrap:wrap; border-top:1px dashed #bbf7d0; padding-top:6px;">
          ${farmInd ? `
            <div style="display:flex; align-items:center; gap:4px;">
              <span style="font-size:13px;">📍</span>
              <a href="${mapsLink(farmInd)}" target="_blank" class="smart-link" style="color:#15803d; font-weight:600;" title="Indicazioni Stradali">
                <b>${farmInd}</b>
              </a>
            </div>
          ` : ''}

          ${farmTel ? `
            <div style="display:flex; align-items:center; gap:4px; margin-left:auto;">
              <span>☎️</span>
              <span style="color:#15803d; font-weight:600;">${farmTel}</span>
              <a href="tel:${cleanNum(farmTel)}" class="action-icon-btn call" title="Chiama Farmacia">📞</a>
              <a href="https://api.whatsapp.com/send?phone=${waNum(farmTel)}" target="_blank" class="action-icon-btn wa" title="WhatsApp Farmacia">🟢</a>
            </div>
          ` : ''}
        </div>
      </div>`;

    let ausiliBadge = '';
    if (activeP.ausili && activeP.ausili.length > 0) {
      const getIconaAusilio = (tipoStr) => {
        const s = (tipoStr || '').toLowerCase();
        if (s.includes('deambulatore') || s.includes('rollator') || s.includes('bastone') || s.includes('stampell')) return '🚶';
        if (s.includes('calz') || s.includes('elastich') || s.includes('antitrombo')) return '🧦';
        if (s.includes('pants') || s.includes('mutandin') || s.includes('pannolon') || s.includes('assorbent')) return '🩲';
        if (s.includes('materasso') || s.includes('letto')) return '🛏️';
        if (s.includes('posturale') || s.includes('rotazione')) return '🔄';
        if (s.includes('cpap') || s.includes('apnee') || s.includes('ossigeno') || s.includes('bombola')) return '🫁';
        if (s.includes('carrozzina') || s.includes('sedia a rotelle')) return '🧑‍🦽';
        return '🛡️';
      };

      const getDettaglioAusilio = (a) => {
        if (a.utilizzo) return a.utilizzo;
        if (a.stato) return a.stato;
        if (a.taglia) return `Taglia ${a.taglia}${a.fabbisogno ? ` &bull; ${a.fabbisogno}` : ''}`;
        if (a.note) return a.note;
        return 'In uso attivo domiciliare';
      };

      const items = activeP.ausili.map((a, idx) => {
        const scadenzaInfo = calcolaStatoScadenzaAusilio(a.prossimaRichiesta || a.dataScadenza, a.giorniAlert || 15);
        const icona = getIconaAusilio(a.tipo);
        const bordoCard = scadenzaInfo.stato === 'scaduto' ? '2px solid #ef4444' : scadenzaInfo.stato === 'in_scadenza' ? '2px solid #f59e0b' : '1px solid #bfdbfe';
        const bgCard = scadenzaInfo.stato === 'scaduto' ? '#fef2f2' : scadenzaInfo.stato === 'in_scadenza' ? '#fffbeb' : '#ffffff';

        return `
          <div class="clinica-zoom-item" style="background:${bgCard}; border:${bordoCard}; border-radius:10px; padding:7px 12px; display:inline-flex; align-items:center; gap:8px; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.04);" 
               onmouseenter="mostraLenteClinica('${(a.tipo || 'Ausilio Sanitario').replace(/'/g, "\\'")}', '${getDettaglioAusilio(a).replace(/'/g, "\\'")}${scadenzaInfo.testo ? ' • ' + scadenzaInfo.testo.replace(/'/g, "\\'") : ''}', '${icona}')" 
               onmouseleave="nascondiLenteClinica()">
            <span style="font-size:20px;">${icona}</span>
            <div>
              <div style="font-size:12.5px; font-weight:800; color:#1e3a8a; display:flex; align-items:center; gap:6px;">
                <span>${a.tipo}</span>
                ${scadenzaInfo.alertAttivo ? `
                  <span style="font-size:10px; font-weight:800; padding:1px 6px; border-radius:4px; background:${scadenzaInfo.stato === 'scaduto' ? '#dc2626' : '#d97706'}; color:white; text-transform:uppercase;">
                    ${scadenzaInfo.stato === 'scaduto' ? '🚨 SCADUTO' : '⚠️ IN SCADENZA'}
                  </span>
                ` : ''}
              </div>
              <div style="font-size:11px; color:#475569;">
                ${getDettaglioAusilio(a)}
                ${(a.cartoni || a.scortaPacchi) ? ` &bull; <b style="color:#b45309;">📦 ${a.cartoni || (a.scortaPacchi + ' pacchi')}</b>` : ''}
                ${a.dataRifornimento ? ` &bull; <span>📦 Ultimo rif.: <b>${new Date(a.dataRifornimento).toLocaleDateString('it-IT')}</b></span>` : ''}
                ${(a.prossimaRichiesta || a.dataScadenza) ? ` &bull; <b style="color:${scadenzaInfo.coloreTesto || '#dc2626'};">📅 Rinnovo: ${new Date(a.prossimaRichiesta || a.dataScadenza).toLocaleDateString('it-IT')} (${scadenzaInfo.diffGiorni >= 0 ? 'tra ' + scadenzaInfo.diffGiorni + ' gg' : 'scaduto da ' + Math.abs(scadenzaInfo.diffGiorni) + ' gg'})</b>` : ''}
              </div>
            </div>
            <button type="button" class="btn" style="background:#fee2e2; color:#b91c1c; border:none; border-radius:6px; padding:2px 6px; font-size:11px; margin-left:6px; cursor:pointer;" onclick="event.stopPropagation(); rimuoviAusilio(${idx});" title="Rimuovi questo ausilio">✕</button>
          </div>
        `;
      }).join('');

      ausiliBadge = `
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; background:#eff6ff; border:1px solid #93c5fd; border-radius:12px; padding:10px 12px; align-items:center;">
          <div style="width:100%; font-size:11.5px; font-weight:800; color:#1e40af; text-transform:uppercase; display:flex; justify-content:space-between; align-items:center;">
            <span style="display:flex; align-items:center; gap:6px;"><span>🛡️</span> AUSILI & PROTOCOLLI SANITARI ATTIVI:</span>
            <button type="button" class="btn btn-outline" style="background:#ffffff; color:#0284c7; border-color:#93c5fd; font-size:11.5px; font-weight:700; padding:3px 10px; border-radius:6px; cursor:pointer;" onclick="apriModalAggiungiAusilio()" title="Aggiungi un nuovo ausilio a questo assistito">➕ Aggiungi Ausilio</button>
          </div>
          ${items}
        </div>
      `;
    } else {
      ausiliBadge = `
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; background:#eff6ff; border:1px dashed #93c5fd; border-radius:12px; padding:8px 12px; align-items:center; justify-content:space-between;">
          <div style="font-size:12px; color:#64748b; font-weight:600; display:flex; align-items:center; gap:6px;">
            <span>🛡️</span> Nessun ausilio o presidio registrato per questo assistito.
          </div>
          <button type="button" class="btn btn-outline" style="background:#ffffff; color:#0284c7; border-color:#93c5fd; font-size:11.5px; font-weight:700; padding:3px 10px; border-radius:6px; cursor:pointer;" onclick="apriModalAggiungiAusilio()" title="Aggiungi un ausilio sanitario">➕ Aggiungi Ausilio</button>
        </div>
      `;
    }

    // 8. LISTA PATOLOGIE CRONICHE CON LENTE CENTRALE AL PASSAGGIO MOUSE
    let patologieHtml = '';
    if (activeP.patologie && activeP.patologie.length > 0) {
      const pTags = activeP.patologie.map(pat => `
        <span class="clinica-zoom-item patologia-pill" 
              style="background:#ffffff; border:1px solid #cbd5e1; border-radius:14px; padding:4px 10px; font-size:11.5px; font-weight:700; color:#1e293b; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.05); transition:all 0.15s ease;"
              onmouseenter="mostraLenteClinica('Diagnosi Clinica Assistito', '${pat.replace(/'/g, "\\'")}', '🩺')" 
              onmouseleave="nascondiLenteClinica()">
          • ${pat}
        </span>
      `).join('');

      patologieHtml = `
        <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center; margin-top:8px;">
          <span style="font-size:11px; font-weight:800; color:#475569; text-transform:uppercase; letter-spacing:0.3px;">Diagnosi & Quadro Clinico:</span>
          ${pTags}
        </div>
      `;
    }

        // LAYOUT DASHBOARD CLINICA MODERNO, PULITO & AD ALTO IMPATTO
    badgeInfo.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:10px;">
        <!-- RIGA 1: NOME PAZIENTE, BADGE CLINICI & CONTATTI RAPIDI DOMICILIO -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
          <div class="paziente-name" style="margin-bottom:0; display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <span style="font-size:24px; font-weight:800; color:#0f172a; letter-spacing:-0.5px;">${activeP.nome}</span>
            <span class="badge clinica-zoom-item ${activeP.allettato ? 'badge-danger' : 'badge-primary'}" style="cursor:pointer;" onmouseenter="mostraLenteClinica('Stato Motorio Assistito', '${activeP.allettato ? 'Paziente allettato con protocollo di rotazione posturale obbligatoria ogni 2 ore (q2h) per prevenzione lesioni da decubito.' : 'Paziente deambulante in modo autonomo o assistito.'}', '🛏️')" onmouseleave="nascondiLenteClinica()">
              ${activeP.allettato ? '🛏️ Paziente Allettato (q2h)' : '🚶 Deambulante'}
            </span>
            <span class="badge badge-warning clinica-zoom-item" style="font-size:12.5px; cursor:pointer;" onmouseenter="mostraLenteClinica('Anagrafica Assistito', 'Data di Nascita: ${new Date(activeP.dataNascita).toLocaleDateString('it-IT')} (${eta} anni compiuti)', '🎂')" onmouseleave="nascondiLenteClinica()">
              🎂 ${eta} anni
            </span>
            ${activeP.allettato ? '<span class="badge badge-danger clinica-zoom-item" style="background:#b91c1c; cursor:pointer;" onmouseenter="mostraLenteClinica(\'Valutazione Lesioni da Pressione (Braden)\', \'Rischio elevato di piaghe da decubito: rotazione q2h, materasso a pressione alternata e ispezione cutanea costante.\', \'⚠️\')" onmouseleave="nascondiLenteClinica()">⚠️ Rischio Piaghe Elevato (Braden)</span>' : ''}
            ${activeP.id === 'paz_angela' ? '<span class="badge badge-danger" style="background:#dc2626;">🫁 Ausilio CPAP Notturna (OSAS)</span>' : ''}
          </div>

          <!-- RECAPITI DOMICILIO & CAREGIVER IN CHIP ELEGANTE -->
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            ${ind}
            ${tel}
            ${cell}
            ${moglie}
          </div>
        </div>

        <!-- RIGA 2: DUE CARD CLINICHE PROFESSIONALI AFFIANCATE (MEDICO MMG & FARMACIA TERRITORIALE) -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap:12px; margin-top:2px;">
          <!-- CARD MEDICO CURANTE MMG -->
          ${medicoBadge}

          <!-- CARD FARMACIA TERRITORIALE DI RIFERIMENTO -->
          ${farmaciaBadge}
        </div>

        ${ausiliBadge}
        ${patologieHtml}
      </div>
    `;
  }
}

// Ingrandimento Clinico Centrale ad Alta Leggibilità (Lente HUD al Passaggio Mouse)
// Helper dedicati per Lente Clinica (chiamata pulita senza HTML inline nell'onmouseenter)
function mostraLenteMedicoCurante() {
  const p = getActivePaziente();
  if (!p) return;
  const medicoNome = p.medicoNome || p.medico || 'Dott. di Famiglia';
  const medCell = p.medicoTel || p.telMedico || '';
  const medEmail = p.medicoEmail || '';
  const infoStudio = getInfoStudioOggi(p);
  let sediStudioPulite = p.medicoIndirizzo || '';
  if (!sediStudioPulite && p.medicoStudio && p.medicoStudio.includes('Sarconi')) {
    sediStudioPulite = p.medicoStudio;
  }
  const telFissoStudio = (p.medicoTelStudio || (p.medicoStudio && !p.medicoStudio.includes('Sarconi') && !p.medicoStudio.includes('Via') ? p.medicoStudio : ''));

  const html = `
    <div style="display:flex; flex-direction:column; gap:8px; font-size:15px; color:#f8fafc; font-weight:normal; line-height:1.45;">
      <div style="font-size:18px; font-weight:800; color:#38bdf8; border-bottom:1px solid rgba(56, 189, 248, 0.3); padding-bottom:4px;">
        🩺 ${medicoNome} <span style="font-size:12px; background:#0284c7; color:#fff; padding:2px 6px; border-radius:4px; margin-left:6px;">MMG</span>
      </div>
      ${infoStudio.testoOggi ? `<div style="background:rgba(34, 197, 94, 0.15); border:1px solid #22c55e; border-radius:8px; padding:6px 12px; color:#86efac; font-weight:700;">⏰ ${infoStudio.testoOggi}</div>` : ''}
      <div style="display:flex; flex-direction:column; gap:4px; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:8px;">
        ${sediStudioPulite ? `<div>📍 <b style="color:#e2e8f0;">Sedi Studi:</b> ${sediStudioPulite}</div>` : ''}
        ${telFissoStudio ? `<div>☎️ <b style="color:#e2e8f0;">Tel. Studio:</b> ${telFissoStudio}</div>` : ''}
        ${medCell ? `<div>📱 <b style="color:#e2e8f0;">Cellulare / WhatsApp:</b> ${medCell}</div>` : ''}
        ${medEmail ? `<div>✉️ <b style="color:#e2e8f0;">Email:</b> ${medEmail}</div>` : ''}
        ${p.medicoPec ? `<div>🔒 <b style="color:#fde68a;">PEC:</b> ${p.medicoPec}</div>` : ''}
      </div>
      <div style="font-size:13px; color:#94a3b8; background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:8px; border-left:3px solid #38bdf8;">
        📅 <b style="color:#e2e8f0;">Orari Settimanali Completi:</b><br>
        <span style="color:#cbd5e1;">${(infoStudio.orariCompleti || 'Riceve su appuntamento eccetto urgenze').replace(/\n/g, '<br>')}</span>
      </div>
    </div>
  `;

  mostraLenteClinica('Dettagli Medico Curante & Orari', html, '🩺');
}

function mostraLenteFarmacia() {
  const p = getActivePaziente();
  if (!p) return;
  const farmNome = p.farmaciaDiRiferimento || 'Farmacia Territoriale';
  const farmInd = p.farmaciaIndirizzo || 'Corleto Perticara';
  const farmTel = p.farmaciaTelefono || '';

  const html = `
    <div style="display:flex; flex-direction:column; gap:8px; font-size:15px; color:#f8fafc; font-weight:normal; line-height:1.45;">
      <div style="font-size:18px; font-weight:800; color:#4ade80; border-bottom:1px solid rgba(74, 222, 128, 0.3); padding-bottom:4px;">
        💊 ${farmNome} <span style="font-size:12px; background:#16a34a; color:#fff; padding:2px 6px; border-radius:4px; margin-left:6px;">Ritiro Farmaci</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:4px; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:8px;">
        ${farmInd ? `<div>📍 <b style="color:#e2e8f0;">Indirizzo Farmacia:</b> ${farmInd}</div>` : ''}
        ${farmTel ? `<div>📞 <b style="color:#e2e8f0;">Telefono / WhatsApp:</b> ${farmTel}</div>` : ''}
      </div>
      <div style="font-size:13px; color:#94a3b8; font-style:italic;">
        Presidio farmaceutico convenzionato per ritiro ricette e dispensazione piano terapeutico.
      </div>
    </div>
  `;

  mostraLenteClinica('Farmacia di Riferimento Assistito', html, '💊');
}

function mostraLenteClinica(titolo, testo, icona = '🩺') {
  const overlay = document.getElementById('clinica-lente-overlay');
  const txtTitolo = document.getElementById('lente-titolo');
  const txtCorpo = document.getElementById('lente-testo');
  const txtIcona = document.getElementById('lente-icona');

  if (!overlay || !txtCorpo) return;

  if (txtTitolo) txtTitolo.textContent = titolo || 'Quadro Clinico Assistito';
  if (txtCorpo) {
    if (typeof testo === 'string' && (testo.includes('<') || testo.includes('&'))) {
      txtCorpo.innerHTML = testo;
      txtCorpo.style.fontSize = '16px';
      txtCorpo.style.fontWeight = '500';
    } else {
      txtCorpo.textContent = testo || '';
      txtCorpo.style.fontSize = (testo && testo.length > 80) ? '18px' : '22px';
      txtCorpo.style.fontWeight = '700';
    }
  }
  if (txtIcona) txtIcona.textContent = icona;

  overlay.style.display = 'block';
  overlay.style.opacity = '0';
  overlay.style.transform = 'translate(-50%, -50%) scale(0.92)';

  requestAnimationFrame(() => {
    overlay.style.transition = 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)';
    overlay.style.opacity = '1';
    overlay.style.transform = 'translate(-50%, -50%) scale(1)';
  });
}

function nascondiLenteClinica() {
  const overlay = document.getElementById('clinica-lente-overlay');
  if (!overlay) return;
  overlay.style.opacity = '0';
  overlay.style.transform = 'translate(-50%, -50%) scale(0.94)';
  setTimeout(() => {
    if (overlay.style.opacity === '0') {
      overlay.style.display = 'none';
    }
  }, 160);
}

// Finestra di Conferma Personalizzata (Custom Dialog Elegante)
function customConfirm(titolo, testo, icona = '💊') {
  return new Promise((resolve) => {
    const modal = document.getElementById('modal-custom-confirm');
    document.getElementById('confirm-modal-title').textContent = titolo;
    document.getElementById('confirm-modal-text').textContent = testo;
    document.getElementById('confirm-modal-icon').textContent = icona;

    const btnOk = document.getElementById('confirm-modal-ok');
    const btnCancel = document.getElementById('confirm-modal-cancel');

    modal.classList.add('active');

    const handleOk = () => {
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      modal.classList.remove('active');
      btnOk.removeEventListener('click', handleOk);
      btnCancel.removeEventListener('click', handleCancel);
    };

    btnOk.addEventListener('click', handleOk);
    btnCancel.addEventListener('click', handleCancel);
  });
}

// CODICE PUK DI SICUREZZA SEGRETO PER CANCELLAZIONI PROTETTE
const PUK_SEGRETO_OSS = 'SOS999';

function chiediPukSicurezza() {
  return new Promise((resolve) => {
    const modal = document.getElementById('modal-puk-auth');
    const input = document.getElementById('puk-input-field');
    const errorMsg = document.getElementById('puk-error-msg');
    const btnConfirm = document.getElementById('puk-btn-confirm');
    const btnCancel = document.getElementById('puk-btn-cancel');

    input.value = '';
    errorMsg.style.display = 'none';
    modal.classList.add('active');
    setTimeout(() => input.focus(), 150);

    const cleanup = () => {
      modal.classList.remove('active');
      btnConfirm.removeEventListener('click', verify);
      btnCancel.removeEventListener('click', onCancel);
      input.removeEventListener('keydown', onKey);
    };

    const verify = () => {
      const inserito = input.value.trim().toUpperCase();
      if (inserito === PUK_SEGRETO_OSS) {
        cleanup();
        resolve(true);
      } else {
        errorMsg.style.display = 'block';
        input.value = '';
        input.focus();
      }
    };

    const onCancel = () => {
      cleanup();
      resolve(false);
    };

    const onKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        verify();
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };

    btnConfirm.addEventListener('click', verify);
    btnCancel.addEventListener('click', onCancel);
    input.addEventListener('keydown', onKey);
  });
}

// Notifica Toast Elegante al posto dei popup brutti del browser
function showToast(messaggio, tipo = 'success') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.style.borderLeftColor = tipo === 'success' ? '#10b981' : (tipo === 'warning' ? '#f59e0b' : '#ef4444');
  toast.innerHTML = `
    <span style="font-size:18px;">${tipo === 'success' ? '✅' : 'ℹ️'}</span>
    <span>${messaggio}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.2s reverse forwards';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

function cambiaPaziente(pazId) {
  AppData.activePazienteId = pazId;
  saveDb();
}

// Gestione Intelligente Patologie Cliniche (Chip Rapidi & Catalogo Dinamico)
function togglePatologiaChip(elem, patologiaNome) {
  const textarea = document.getElementById('nuovo-paz-patologie-testo');
  if (!textarea) return;

  let currentText = textarea.value.trim();
  let righe = currentText ? currentText.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0) : [];

  const index = righe.findIndex(r => r.toLowerCase() === patologiaNome.toLowerCase());
  if (index >= 0) {
    // Rimuove
    righe.splice(index, 1);
    elem.classList.remove('selezionato');
    elem.textContent = '+ ' + patologiaNome.split(' ')[0];
  } else {
    // Aggiunge
    righe.push(patologiaNome);
    elem.classList.add('selezionato');
    elem.textContent = '✓ ' + patologiaNome.split(' ')[0];
  }

  textarea.value = righe.join('\n');
}

function aggiungiPatologiaPersonalizzata() {
  const input = document.getElementById('nuovo-paz-input-nuova-patologia');
  const textarea = document.getElementById('nuovo-paz-patologie-testo');
  const datalist = document.getElementById('datalist-patologie');
  const containerChip = document.getElementById('container-chip-patologie');

  if (!input || !textarea) return;

  const nuovaPatologia = input.value.trim();
  if (!nuovaPatologia) {
    showToast('Digita il nome della patologia da aggiungere', 'warning');
    return;
  }

  // Aggiunge alla textarea
  let currentText = textarea.value.trim();
  let righe = currentText ? currentText.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0) : [];

  if (!righe.some(r => r.toLowerCase() === nuovaPatologia.toLowerCase())) {
    righe.push(nuovaPatologia);
    textarea.value = righe.join('\n');
  }

  // Aggiunge al datalist suggerimenti per il futuro
  if (datalist && ![...datalist.options].some(opt => opt.value.toLowerCase() === nuovaPatologia.toLowerCase())) {
    const opt = document.createElement('option');
    opt.value = nuovaPatologia;
    datalist.appendChild(opt);
  }

  // Aggiunge un nuovo chip visivo istantaneo
  if (containerChip) {
    const nuovoChip = document.createElement('span');
    nuovoChip.className = 'chip-patologia selezionato';
    nuovoChip.textContent = '✓ ' + nuovaPatologia;
    nuovoChip.onclick = function() {
      togglePatologiaChip(this, nuovaPatologia);
    };
    containerChip.appendChild(nuovoChip);
  }

  input.value = '';
  showToast(`Patologia "${nuovaPatologia}" aggiunta ed inclusa nel catalogo!`);
}

function salvaNuovoPaziente(e) {
  e.preventDefault();
  const nome = document.getElementById('nuovo-paz-nome').value.trim();
  const dataNascita = document.getElementById('nuovo-paz-nascita').value;
  const mobilita = document.getElementById('nuovo-paz-mobilita').value;
  const indirizzo = document.getElementById('nuovo-paz-indirizzo').value.trim();
  const telCasa = formattaNumeroTelefonico(document.getElementById('nuovo-paz-telefono').value.trim());
  const cellulare = formattaNumeroTelefonico(document.getElementById('nuovo-paz-cellulare').value.trim());
  const parenteNome = document.getElementById('nuovo-paz-parente-nome').value.trim();
  const parenteCell = formattaNumeroTelefonico(document.getElementById('nuovo-paz-parente-cell').value.trim());

  const patologieTesto = document.getElementById('nuovo-paz-patologie-testo').value.trim();
  const isCpap = document.getElementById('nuovo-paz-cpap').checked;
  const isMaterasso = document.getElementById('nuovo-paz-materasso').checked;
  const bombolaStato = document.getElementById('nuovo-paz-bombola-attiva').value;
  const dataBombola = document.getElementById('nuovo-paz-data-bombola').value;
  const altriAusili = document.getElementById('nuovo-paz-altri-ausili').value.trim();

  const medicoNome = document.getElementById('nuovo-paz-medico-nome').value.trim();
  const medicoTel = formattaNumeroTelefonico(document.getElementById('nuovo-paz-medico-tel').value.trim());
  const medicoEmail = document.getElementById('nuovo-paz-medico-email').value.trim();
  const farmaciaNome = document.getElementById('nuovo-paz-farmacia').value.trim();
  const farmaciaTel = formattaNumeroTelefonico(document.getElementById('nuovo-paz-farmacia-tel').value.trim());

  if (!nome || !dataNascita) return;

  const newId = 'paz_' + Date.now();
  const newPaz = createPazienteTemplate(newId, nome, dataNascita, patologieTesto);
  newPaz.allettato = (mobilita === 'allettato');
  newPaz.indirizzo = indirizzo;
  newPaz.telefonoFisso = telCasa;
  newPaz.cellulare = cellulare;
  newPaz.moglieNome = parenteNome;
  newPaz.moglieCellulare = parenteCell;

  newPaz.medico = medicoNome || 'Dott. Curante';
  newPaz.medicoNome = medicoNome;
  newPaz.medicoTel = medicoTel;
  newPaz.medicoEmail = medicoEmail;
  newPaz.farmaciaDiRiferimento = farmaciaNome || 'Farmacia di Riferimento';
  newPaz.farmaciaTelefono = farmaciaTel;

  // Elaborazione Patologie Personalizzate
  newPaz.patologie = [];
  if (patologieTesto) {
    const righe = patologieTesto.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
    newPaz.patologie.push(...righe);
  }
  if (newPaz.allettato && !newPaz.patologie.some(p => p.toLowerCase().includes('piaghe') || p.toLowerCase().includes('allettato'))) {
    newPaz.patologie.unshift('Paziente allettato a rischio piaghe da decubito (Rotazione q2h)');
  }

  // Elaborazione Ausili dal Catalogo Interattivo
  newPaz.ausili = estraiAusiliSelezionatiDaForm('nuovo-aus');

  // Se è allettato e non ha il materasso spuntato, aggiungilo come presidio di sicurezza
  if (newPaz.allettato && !newPaz.ausili.some(a => (a.tipo || '').toLowerCase().includes('materasso'))) {
    newPaz.ausili.unshift({
      tipo: 'Materasso Antidecubito a Pressione Alternata',
      utilizzo: 'Gonfiaggio continuo a ciclo alternato per prevenzione lesioni da pressione',
      prossimaRichiesta: '',
      stato: 'In uso attivo'
    });
  }

  // Genera promemoria scadenze rifornimento nel calendario visite
  newPaz.ausili.forEach(a => {
    if (a.dataScadenza) {
      newPaz.visite.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        data: a.dataScadenza,
        ora: '10:00',
        medico: medicoNome || 'ASL / Servizio Territoriale',
        motivo: `Rinnovo ricetta / Rifornimento ASL per ${a.tipo}`,
        fatto: false
      });
    }
  });

  AppData.pazienti.push(newPaz);
  AppData.activePazienteId = newId;

  closeModal('modal-nuovo-paziente');
  document.getElementById('form-nuovo-paziente').reset();
  const preview = document.getElementById('nuovo-paz-eta-preview');
  if (preview) preview.value = '';
  saveDb();
  showToast(`Cartella clinica completa creata per "${nome}"!`);
}

// Funzione intelligente di formattazione elegante dei numeri di telefono italiani
function formattaNumeroTelefonico(inputStr) {
  if (!inputStr) return '';
  // Rimuovi spazi e caratteri speciali tranne il + iniziale
  let str = inputStr.trim();
  const hasPlus = str.startsWith('+');
  let clean = str.replace(/[^0-9]/g, '');

  if (!clean) return inputStr;

  // Se c'è prefisso internazionale 39 o +39
  let prefix = '';
  if (hasPlus && clean.startsWith('39')) {
    prefix = '+39 ';
    clean = clean.slice(2);
  }

  // 1. Cellulari (iniziano con 3, solitamente 10 cifre: 338 306 69 05 oppure 347 126 59 71)
  if (clean.startsWith('3')) {
    if (clean.length === 10) {
      return prefix + `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 8)} ${clean.slice(8, 10)}`;
    } else if (clean.length === 9) {
      return prefix + `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 9)}`;
    }
  }

  // 2. Fissi con prefisso a 3 cifre come Bari 080 (080 561 57 14 oppure 080 557 4490 -> 080 557 44 90)
  if (clean.startsWith('080') || clean.startsWith('081') || clean.startsWith('011') || clean.startsWith('051') || clean.startsWith('055') || clean.startsWith('091')) {
    const pref = clean.slice(0, 3);
    const rest = clean.slice(3);
    if (rest.length === 7) {
      return prefix + `${pref} ${rest.slice(0, 3)} ${rest.slice(3, 5)} ${rest.slice(5, 7)}`;
    } else if (rest.length === 6) {
      return prefix + `${pref} ${rest.slice(0, 3)} ${rest.slice(3, 6)}`;
    } else if (rest.length > 3) {
      return prefix + `${pref} ${rest.slice(0, 3)} ${rest.slice(3)}`;
    }
  }

  // 3. Fissi Roma/Milano 06 / 02
  if (clean.startsWith('06') || clean.startsWith('02')) {
    const pref = clean.slice(0, 2);
    const rest = clean.slice(2);
    if (rest.length === 8) {
      return prefix + `${pref} ${rest.slice(0, 4)} ${rest.slice(4, 6)} ${rest.slice(6, 8)}`;
    } else if (rest.length === 7) {
      return prefix + `${pref} ${rest.slice(0, 3)} ${rest.slice(3, 5)} ${rest.slice(5, 7)}`;
    }
  }

  // Fissi italiani a 10 cifre (es. Potenza 0971 xxx xxx)
  if (clean.startsWith('0') && clean.length === 10) {
    return prefix + `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7, 10)}`;
  }

  // Generico: cellulare o recapito a 10 cifre
  if (clean.length === 10) {
    return prefix + `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 8)} ${clean.slice(8, 10)}`;
  }

  // Se contiene testo o più numeri (es. orari o note), mantieni l'input dell'utente senza alterarlo
  return inputStr;
}


// Funzioni Pianificatore Orari Settimanali Intuitivo

function impostaGiornoChiuso(giornoId) {
  const elOra = document.getElementById('orario-giorno-' + giornoId);
  const elSede = document.getElementById('sede-giorno-' + giornoId);
  const elBadge = document.getElementById('badge-' + giornoId);
  if (elOra) elOra.value = '';
  if (elSede) elSede.value = 'Chiuso';
  if (elBadge) {
    elBadge.textContent = 'Chiuso';
    elBadge.style.background = '#f1f5f9';
    elBadge.style.color = '#94a3b8';
  }
  sincronizzaPlannerVersoTesto();
}

function toggleOrariManuale() {
  const box = document.getElementById('planner-orari-manuale-box');
  if (!box) return;
  box.style.display = (box.style.display === 'none' || !box.style.display) ? 'block' : 'none';
}

function applicaOrarioModello(tipo) {
  if (tipo === 'potenza') {
    const elLunO = document.getElementById('orario-giorno-lun');
    const elLunS = document.getElementById('sede-giorno-lun');
    const elMarO = document.getElementById('orario-giorno-mar');
    const elMarS = document.getElementById('sede-giorno-mar');
    const elMerO = document.getElementById('orario-giorno-mer');
    const elMerS = document.getElementById('sede-giorno-mer');
    const elGioO = document.getElementById('orario-giorno-gio');
    const elGioS = document.getElementById('sede-giorno-gio');
    const elVenO = document.getElementById('orario-giorno-ven');
    const elVenS = document.getElementById('sede-giorno-ven');

    if (elLunO) elLunO.value = '09:30-13:00 / 15:00-18:00';
    if (elLunS) elLunS.value = 'Sarconi / Moliterno';

    if (elMarO) elMarO.value = '15:00-18:30';
    if (elMarS) elMarS.value = 'Sarconi';

    if (elMerO) elMerO.value = '09:30-13:00';
    if (elMerS) elMerS.value = 'Sarconi';

    if (elGioO) elGioO.value = '09:00-13:00 / 15:00-18:30';
    if (elGioS) elGioS.value = 'Moliterno / Sarconi';

    if (elVenO) elVenO.value = '09:30-13:00';
    if (elVenS) elVenS.value = 'Sarconi';

    sincronizzaPlannerVersoTesto();
  }
}

function popolaPlannerDaTesto(testo) {
  if (!testo) testo = '';
  const txt = testo.toLowerCase();

  const elLunO = document.getElementById('orario-giorno-lun');
  const elLunS = document.getElementById('sede-giorno-lun');
  const elMarO = document.getElementById('orario-giorno-mar');
  const elMarS = document.getElementById('sede-giorno-mar');
  const elMerO = document.getElementById('orario-giorno-mer');
  const elMerS = document.getElementById('sede-giorno-mer');
  const elGioO = document.getElementById('orario-giorno-gio');
  const elGioS = document.getElementById('sede-giorno-gio');
  const elVenO = document.getElementById('orario-giorno-ven');
  const elVenS = document.getElementById('sede-giorno-ven');

  if (txt.includes('muciaccia') || txt.includes('scarcia') || txt.includes('bari')) {
    if (elLunO) elLunO.value = '10:00-13:00';
    if (elLunS) elLunS.value = 'Bari (Via Muciaccia 11)';
    if (elMarO) elMarO.value = '10:00-13:00 / 16:00-19:00';
    if (elMarS) elMarS.value = 'Bari (Via Muciaccia 11)';
    if (elMerO) elMerO.value = '10:00-13:00';
    if (elMerS) elMerS.value = 'Bari (Via Muciaccia 11)';
    if (elGioO) elGioO.value = '16:00-19:00';
    if (elGioS) elGioS.value = 'Bari (Via Muciaccia 11)';
    if (elVenO) elVenO.value = '10:00-13:00';
    if (elVenS) elVenS.value = 'Bari (Via Muciaccia 11)';
    aggiornaTuttiBadgePlanner();
    sincronizzaPlannerVersoTesto();
    return;
  } else if (txt.includes('sarconi') || txt.includes('moliterno')) {
    if (elLunO) elLunO.value = '09:30-13:00 / 15:00-18:00';
    if (elLunS) elLunS.value = 'Sarconi / Moliterno';

    if (elMarO) elMarO.value = '15:00-18:30';
    if (elMarS) elMarS.value = 'Sarconi';

    if (elMerO) elMerO.value = '09:30-13:00';
    if (elMerS) elMerS.value = 'Sarconi';

    if (elGioO) elGioO.value = '09:00-13:00 / 15:00-18:30';
    if (elGioS) elGioS.value = 'Moliterno / Sarconi';

    if (elVenO) elVenO.value = '09:30-13:00';
    if (elVenS) elVenS.value = 'Sarconi';
  } else {
    // Default se testo non articolato
    if (elLunO) elLunO.value = '';
    if (elLunS) elLunS.value = '';
    if (elMarO) elMarO.value = '';
    if (elMarS) elMarS.value = '';
    if (elMerO) elMerO.value = '';
    if (elMerS) elMerS.value = '';
    if (elGioO) elGioO.value = '';
    if (elGioS) elGioS.value = '';
    if (elVenO) elVenO.value = '';
    if (elVenS) elVenS.value = '';
  }
}


function aggiornaTuttiBadgePlanner() {
  const giorni = ['lun', 'mar', 'mer', 'gio', 'ven'];
  const todayIdx = new Date().getDay(); // 1 = Lun, 2 = Mar, ..., 5 = Ven

  giorni.forEach((g, idx) => {
    const elOra = document.getElementById('orario-giorno-' + g);
    const elBadge = document.getElementById('badge-' + g);
    const elRow = document.getElementById('row-' + g);
    if (!elBadge) return;

    const oraVal = elOra ? elOra.value.trim() : '';
    const isToday = (idx + 1) === todayIdx;

    if (isToday) {
      elBadge.innerHTML = 'Oggi ⭐';
      elBadge.style.background = '#dcfce7';
      elBadge.style.color = '#15803d';
      elBadge.style.fontWeight = '800';
      if (elRow) {
        elRow.style.background = '#f0fdf4';
        elRow.style.borderColor = '#86efac';
      }
    } else if (oraVal && oraVal.toLowerCase() !== 'chiuso') {
      elBadge.textContent = 'Attivo';
      elBadge.style.background = '#e0f2fe';
      elBadge.style.color = '#0369a1';
      elBadge.style.fontWeight = '800';
      if (elRow) {
        elRow.style.background = '#f8fafc';
        elRow.style.borderColor = '#e2e8f0';
      }
    } else {
      elBadge.textContent = 'Chiuso';
      elBadge.style.background = '#f1f5f9';
      elBadge.style.color = '#94a3b8';
      elBadge.style.fontWeight = '600';
      if (elRow) {
        elRow.style.background = '#f8fafc';
        elRow.style.borderColor = '#e2e8f0';
      }
    }
  });
}

function sincronizzaPlannerVersoTesto() {
  const elLunO = (document.getElementById('orario-giorno-lun')?.value || '').trim();
  const elLunS = (document.getElementById('sede-giorno-lun')?.value || '').trim();
  const elMarO = (document.getElementById('orario-giorno-mar')?.value || '').trim();
  const elMarS = (document.getElementById('sede-giorno-mar')?.value || '').trim();
  const elMerO = (document.getElementById('orario-giorno-mer')?.value || '').trim();
  const elMerS = (document.getElementById('sede-giorno-mer')?.value || '').trim();
  const elGioO = (document.getElementById('orario-giorno-gio')?.value || '').trim();
  const elGioS = (document.getElementById('sede-giorno-gio')?.value || '').trim();
  const elVenO = (document.getElementById('orario-giorno-ven')?.value || '').trim();
  const elVenS = (document.getElementById('sede-giorno-ven')?.value || '').trim();

  const parti = [];
  if (elLunO) parti.push('Lun ' + elLunO + (elLunS ? ' (' + elLunS + ')' : ''));
  if (elMarO) parti.push('Mar ' + elMarO + (elMarS ? ' (' + elMarS + ')' : ''));
  if (elMerO) parti.push('Mer ' + elMerO + (elMerS ? ' (' + elMerS + ')' : ''));
  if (elGioO) parti.push('Gio ' + elGioO + (elGioS ? ' (' + elGioS + ')' : ''));
  if (elVenO) parti.push('Ven ' + elVenO + (elVenS ? ' (' + elVenS + ')' : ''));

  const textarea = document.getElementById('edit-paz-medico-orari');
  if (textarea) {
    textarea.value = parti.length > 0 ? (parti.join(', ') + ' (Si riceve su appuntamento eccetto urgenze).') : '';
  }
}


// Aggiorna dinamicamente le note cliniche se viene modificata la spunta Allettato o la data di nascita
function sincronizzaNoteAllettatoDinamico() {
  const chkAllettato = document.getElementById('edit-paz-allettato');
  const txtNote = document.getElementById('edit-paz-note');
  const birthVal = document.getElementById('edit-paz-nascita')?.value;
  if (!chkAllettato || !txtNote) return;

  const eta = birthVal ? calcolaAnniDaData(birthVal) : 88;
  const currentText = txtNote.value.trim();

  if (chkAllettato.checked) {
    // Se è allettato, assicurati che menzioni l'allettamento e l'età esatta
    if (!currentText || currentText.includes('91 anni') || currentText.includes('Assistita a Corleto') || currentText.includes('Cardiopatia')) {
      txtNote.value = `Paziente allettata ${eta} anni. Monitoraggio rotazione posturale q2h per prevenzione lesioni da decubito, cardiopatia ipertensiva cronica e osteoartrosi.`;
    } else if (currentText.includes('anni')) {
      txtNote.value = currentText.replace(/\d+\s*anni/gi, `${eta} anni`);
    }
  } else {
    // Se non è allettato, rimuovi la dicitura di allettato e mantieni le patologie
    if (currentText.includes('Paziente allettata') || currentText.includes('Paziente allettato')) {
      txtNote.value = `Paziente deambulante ${eta} anni. Cardiopatia ipertensiva in buon compenso, osteoartrosi diffusa e insufficienza venosa periferica.`;
    }
  }
}

function cambiaTabAnagrafica(tabId) {
  ['paziente', 'medico', 'orari', 'ausili'].forEach(t => {
    const btn = document.getElementById('tab-btn-' + t);
    const pane = document.getElementById('pane-anagrafica-' + t);
    if (btn) btn.classList.toggle('active', t === tabId);
    if (pane) pane.classList.toggle('active', t === tabId);
  });
}

function apriModificaAnagrafica() {
  const p = getActivePaziente();
  if (!p) return;

  cambiaTabAnagrafica('paziente');

  document.getElementById('edit-paz-nome').value = p.nome || '';
  document.getElementById('edit-paz-nascita').value = p.dataNascita || '1935-04-18';
  document.getElementById('edit-paz-eta').value = `${calcolaAnniDaData(p.dataNascita)} anni`;
  document.getElementById('edit-paz-indirizzo').value = p.indirizzo || '';
  const defaultCaregiverNome = (p.id === 'paz_rosa' && (!p.moglieNome || p.moglieNome.trim() === ''))
    ? 'Maria Carmela (Figlia / Caregiver)'
    : (p.moglieNome || '');
  const defaultCaregiverCell = (p.id === 'paz_rosa' && (!p.moglieCellulare || p.moglieCellulare.trim() === ''))
    ? '338 739 76 71'
    : (p.moglieCellulare || '');
  const defaultCaregiverEmail = p.caregiverEmail || p.moglieEmail || '';
  const defaultTelFisso = (p.id === 'paz_rosa' && (!p.telefonoFisso || p.telefonoFisso.trim() === ''))
    ? '097 169 32 21'
    : (p.telefonoFisso || '');

  document.getElementById('edit-paz-telefono').value = formattaNumeroTelefonico(defaultTelFisso);
  document.getElementById('edit-paz-cellulare').value = formattaNumeroTelefonico(p.cellulare || '');
  document.getElementById('edit-paz-moglie-nome').value = defaultCaregiverNome;
  document.getElementById('edit-paz-moglie-cell').value = formattaNumeroTelefonico(defaultCaregiverCell);
  const elCaregiverMail = document.getElementById('edit-paz-caregiver-email');
  if (elCaregiverMail) elCaregiverMail.value = defaultCaregiverEmail;

  document.getElementById('edit-paz-medico-nome').value = p.medicoNome || p.medico || 'Dott. Roberto Scarcia';
  // Sincronizzazione automatica orari e studio Dott. Scarcia sia per Aldo che per Angela
  const isScarcia = (p.id === 'paz_aldo' || p.id === 'paz_angela' || (p.medicoNome || '').includes('Scarcia') || (p.indirizzo || '').includes('Bari'));
  if (isScarcia && (!p.medicoOrari || !p.medicoOrari.includes('10:00'))) {
    p.medicoNome = 'Dott. Roberto Scarcia';
    p.medicoIndirizzo = 'Via Muciaccia 11, 70121 Bari';
    p.medicoStudio = 'Via Muciaccia 11, 70121 Bari';
    p.medicoTelStudio = '080 557 44 90';
    p.medicoOrari = 'Lunedì: 10:00-13:00. Martedì: 10:00-13:00 e 16:00-19:00. Mercoledì: 10:00-13:00. Giovedì: 16:00-19:00. Venerdì: 10:00-13:00 (Bari - Via Muciaccia 11)';
  }

  const elMedInd = document.getElementById('edit-paz-medico-indirizzo');
  if (elMedInd) elMedInd.value = p.medicoIndirizzo || (isScarcia ? 'Via Muciaccia 11, 70121 Bari' : (p.medicoStudio && p.medicoStudio.includes('Sarconi') ? p.medicoStudio : ''));
  const elMedOra = document.getElementById('edit-paz-medico-orari');
  if (elMedOra) elMedOra.value = p.medicoOrari || '';

  if (isScarcia) {
    applicaOrarioModello('scarcia');
  } else {
    popolaPlannerDaTesto(p.medicoOrari || '');
  }
  const telStudioVal = (p.medicoTelStudio || (p.medicoStudio && !p.medicoStudio.includes('Sarconi') && !p.medicoStudio.includes('Via') ? p.medicoStudio : ''));
  document.getElementById('edit-paz-medico-studio').value = formattaNumeroTelefonico(telStudioVal);
  document.getElementById('edit-paz-medico-tel').value = formattaNumeroTelefonico(p.medicoTel || p.telMedico || '');
  
  // Assegnazione Email Ordinaria e PEC separata
  const elMedEmail = document.getElementById('edit-paz-medico-email');
  if (elMedEmail) {
    elMedEmail.value = p.medicoEmail || (p.id === 'paz_rosa' ? 'carolina.potenza@gmail.com' : 'scarcia.roberto@alice.it');
  }
  const elMedPec = document.getElementById('edit-paz-medico-pec');
  if (elMedPec) {
    elMedPec.value = p.medicoPec || (p.id === 'paz_rosa' ? 'carolina.potenza@pec.it' : 'roberto.scarcia@pec.it');
  }

  document.getElementById('edit-paz-farmacia').value = p.farmaciaDiRiferimento || 'Farmacia MACARIO';
  const elFarmTel = document.getElementById('edit-paz-farmacia-tel');
  if (elFarmTel) elFarmTel.value = formattaNumeroTelefonico(p.farmaciaTelefono || '');
  const elFarmInd = document.getElementById('edit-paz-farmacia-indirizzo');
  if (elFarmInd) elFarmInd.value = p.farmaciaIndirizzo || '';
  document.getElementById('edit-paz-allettato').checked = !!p.allettato;
  // Se la nota era quella di Aldo con 91 anni, reimposta con l'età corretta di questo paziente
  if (p.note && (p.note.includes('91 anni') && p.id !== 'paz_aldo')) {
    p.note = `Paziente ${p.allettato ? 'allettata' : 'deambulante'} ${calcolaAnniDaData(p.dataNascita)} anni. Cardiopatia ipertensiva in buon compenso, osteoartrosi diffusa e limitazione funzionale.`;
  }
  document.getElementById('edit-paz-note').value = p.note || '';

  const elAllettatoChk = document.getElementById('edit-paz-allettato');
  if (elAllettatoChk) {
    elAllettatoChk.onchange = sincronizzaNoteAllettatoDinamico;
  }
  document.getElementById('edit-paz-note').value = p.note || '';

  // Caricamento e rendering interattivo del Catalogo Ausili Sanitari con scadenze
  renderCatalogoAusiliForm('container-catalogo-ausili-edit', p.ausili || []);

  // Collega auto-formattazione all'uscita dal campo (blur) o alla digitazione
  ['edit-paz-telefono', 'edit-paz-cellulare', 'edit-paz-moglie-cell', 'edit-paz-medico-studio', 'edit-paz-medico-tel', 'edit-paz-farmacia-tel'].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.dataset.hasPhoneFormatter) {
      el.dataset.hasPhoneFormatter = 'true';
      el.addEventListener('blur', () => {
        el.value = formattaNumeroTelefonico(el.value);
      });
    }
  });

  openModal('modal-modifica-anagrafica');
}

function aggiornaEtaEdit(val) {
  const eta = calcolaAnniDaData(val);
  const el = document.getElementById('edit-paz-eta');
  if (el) el.value = `${eta} anni`;
}

function salvaModificaAnagrafica(e) {
  e.preventDefault();
  const p = getActivePaziente();
  if (!p) return;

  p.nome = document.getElementById('edit-paz-nome').value.trim();
  p.dataNascita = document.getElementById('edit-paz-nascita').value;
  p.eta = calcolaAnniDaData(p.dataNascita);
  p.indirizzo = document.getElementById('edit-paz-indirizzo').value.trim();
  p.telefonoFisso = formattaNumeroTelefonico(document.getElementById('edit-paz-telefono').value.trim());
  p.cellulare = formattaNumeroTelefonico(document.getElementById('edit-paz-cellulare').value.trim());
  p.moglieNome = document.getElementById('edit-paz-moglie-nome').value.trim();
  p.moglieCellulare = formattaNumeroTelefonico(document.getElementById('edit-paz-moglie-cell').value.trim());
  const elCaregiverMailVal = document.getElementById('edit-paz-caregiver-email');
  if (elCaregiverMailVal) {
    p.caregiverEmail = elCaregiverMailVal.value.trim();
    p.moglieEmail = p.caregiverEmail;
  }
  p.medicoNome = document.getElementById('edit-paz-medico-nome').value.trim();
  p.medico = p.medicoNome;
  const elMedIndVal = document.getElementById('edit-paz-medico-indirizzo');
  if (elMedIndVal) p.medicoIndirizzo = elMedIndVal.value.trim();
  const elMedOraVal = document.getElementById('edit-paz-medico-orari');
  if (elMedOraVal) p.medicoOrari = elMedOraVal.value.trim();
  const medStudioVal = document.getElementById('edit-paz-medico-studio').value.trim();
  p.medicoStudio = p.medicoIndirizzo || medStudioVal;
  p.medicoTelStudio = medStudioVal;
  p.medicoTel = formattaNumeroTelefonico(document.getElementById('edit-paz-medico-tel').value.trim());
  p.telMedico = p.medicoTel;
  p.medicoEmail = document.getElementById('edit-paz-medico-email').value.trim();
  const elMedPecVal = document.getElementById('edit-paz-medico-pec');
  if (elMedPecVal) {
    p.medicoPec = elMedPecVal.value.trim();
  }
  p.farmaciaDiRiferimento = document.getElementById('edit-paz-farmacia').value.trim() || 'Farmacia MACARIO';
  const elFarmTelVal = document.getElementById('edit-paz-farmacia-tel');
  if (elFarmTelVal) p.farmaciaTelefono = formattaNumeroTelefonico(elFarmTelVal.value.trim());
  const elFarmIndVal = document.getElementById('edit-paz-farmacia-indirizzo');
  if (elFarmIndVal) p.farmaciaIndirizzo = elFarmIndVal.value.trim();

  const eraAllettatoPrima = p.allettato;
  p.allettato = document.getElementById('edit-paz-allettato').checked;

  // Se è appena stato attivato come allettato con la spunta, azzera e fai partire il timer da adesso (2 ore piene)
  if (!eraAllettatoPrima && p.allettato) {
    p.registrazioni = (p.registrazioni || []).filter(r => r.tipo !== 'postura');
    p.registrazioni.push({
      id: 'log_' + Date.now(),
      tipo: 'postura',
      timestamp: new Date().toISOString(),
      posizione: 'Supino (Schiena a letto)',
      cute: 'Integra e rosea (Normale)',
      operatore: 'Operatore OSS / Famiglia'
    });
    ultimoSuonoScadutoTimestamp = 0;
  }
  p.note = document.getElementById('edit-paz-note').value.trim();

  // Estrazione e salvataggio del Catalogo Ausili con Rifornimenti e Scadenze
  p.ausili = estraiAusiliSelezionatiDaForm('edit-aus');

  // Sincronizza diagnosi collegate agli ausili (OSAS per CPAP)
  if (!p.patologie) p.patologie = [];
  const haCpap = p.ausili.some(a => (a.tipo || '').toLowerCase().includes('cpap'));
  if (haCpap && !p.patologie.some(pat => pat.toLowerCase().includes('osas') || pat.toLowerCase().includes('apnee'))) {
    p.patologie.push('Sindrome delle Apnee Ostruttive nel Sonno (OSAS)');
  }

  // Se è presente una data di rifornimento bombola o fornitura, crea promemoria visite se assente
  p.ausili.forEach(a => {
    if (a.dataScadenza && !p.visite.some(v => v.data === a.dataScadenza && v.motivo.includes(a.tipo.slice(0, 10)))) {
      p.visite.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        data: a.dataScadenza,
        ora: '10:00',
        medico: p.medicoNome || 'ASL / Servizio Territoriale',
        motivo: `Rinnovo ricetta / Rifornimento ASL per ${a.tipo}`,
        fatto: false
      });
    }
  });

  closeModal('modal-modifica-anagrafica');
  saveDb();
  showToast(`Scheda e ausili di "${p.nome}" salvati con successo!`);
}

async function eliminaPazienteAttivo() {
  const p = getActivePaziente();
  if (!p) return;
  if (AppData.pazienti.length <= 1) {
    showToast('Impossibile eliminare l\'unico paziente presente.', 'warning');
    return;
  }

  const ok = await customConfirm(
    'Elimina Cartella Paziente',
    `Sei sicuro di voler eliminare la cartella di "${p.nome}" e tutti i dati registrati?`,
    '⚠️'
  );
  if (ok) {
    AppData.pazienti = AppData.pazienti.filter(item => item.id !== p.id);
    AppData.activePazienteId = AppData.pazienti[0].id;
    saveDb();
    showToast(`Cartella di "${p.nome}" eliminata.`);
  }
}

// ==========================================================================
// CATALOGO AUSILI STANDARD SANITARI & GESTIONE RIFORNIMENTI CON SCADENZE
// ==========================================================================
const CATALOGO_AUSILI_STANDARD = [
  {
    tipo: 'Deambulatore Rollator con freno per interni/esterni',
    icona: '🚶',
    richiedeRifornimento: false,
    utilizzoDefault: 'Uso quotidiano per deambulazione autonoma o assistita in sicurezza'
  },
  {
    tipo: 'Calze elastiche antitrombo a compressione graduata',
    icona: '🧦',
    richiedeRifornimento: true,
    mesiDurata: 6,
    utilizzoDefault: 'In uso diurno per favorire il ritorno venoso e prevenzione edemi'
  },
  {
    tipo: 'Mutandina Assorbente PANTS (Pull-Up monouso)',
    icona: '🩲',
    richiedeRifornimento: true,
    mesiDurata: 3,
    utilizzoDefault: 'Taglia M (4 cambi/die) - Fornitura Trimestrale ASP'
  },
  {
    tipo: 'Materasso Antidecubito a Pressione Alternata',
    icona: '🛏️',
    richiedeRifornimento: false,
    utilizzoDefault: 'Gonfiaggio continuo a ciclo alternato per prevenzione lesioni da pressione'
  },
  {
    tipo: 'Sedia a rotelle / Carrozzina pieghevole',
    icona: '🧑‍🦽',
    richiedeRifornimento: false,
    utilizzoDefault: 'Trasferimenti e uscite all\'esterno'
  },
  {
    tipo: 'CPAP Notturna (Ventilazione a Pressione Positiva)',
    icona: '🫁',
    richiedeRifornimento: true,
    mesiDurata: 12,
    utilizzoDefault: 'Tutte le notti durante il riposo per apnee notturne e desaturazione'
  },
  {
    tipo: 'Bombola di Ossigeno Terapeutico Domiciliare',
    icona: '🫁',
    richiedeRifornimento: true,
    mesiDurata: 1,
    utilizzoDefault: 'Ossigenoterapia domiciliare / Scorta di emergenza'
  },
  {
    tipo: 'Letto ortopedico a manovella o elettrico con sponde',
    icona: '🛏️',
    richiedeRifornimento: false,
    utilizzoDefault: 'Posizionamento posturale, alzatesta e spondine di sicurezza'
  },
  {
    tipo: 'Cuscino antidecubito sagomato / fibra cava',
    icona: '💺',
    richiedeRifornimento: false,
    utilizzoDefault: 'Uso continuo su carrozzina o poltrona per scarico ischiatico'
  },
  {
    tipo: 'Bastone da passeggio / Quadripode a base allargata',
    icona: '🦯',
    richiedeRifornimento: false,
    utilizzoDefault: 'Supporto per la deambulazione assistita'
  }
];

function calcolaStatoScadenzaAusilio(dataScadenzaStr, giorniAlert = 15) {
  if (!dataScadenzaStr) return { stato: 'normale', testo: '', badgeClass: '', alertAttivo: false };
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  const scad = new Date(dataScadenzaStr);
  scad.setHours(0, 0, 0, 0);

  const diffMs = scad - oggi;
  const diffGiorni = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffGiorni < 0) {
    return {
      stato: 'scaduto',
      testo: `🚨 Rifornimento Scaduto da ${Math.abs(diffGiorni)} gg! Richiedere ricetta/fornitura subito.`,
      badgeClass: 'badge-danger',
      coloreTesto: '#dc2626',
      alertAttivo: true,
      diffGiorni
    };
  } else if (diffGiorni <= giorniAlert) {
    return {
      stato: 'in_scadenza',
      testo: `⚠️ In scadenza tra ${diffGiorni} giorni (${scad.toLocaleDateString('it-IT')}) - Preparare rinnovo ricetta!`,
      badgeClass: 'badge-warning',
      coloreTesto: '#d97706',
      alertAttivo: true,
      diffGiorni
    };
  } else {
    return {
      stato: 'regolare',
      testo: `Prossimo rinnovo: ${scad.toLocaleDateString('it-IT')} (tra ${diffGiorni} gg)`,
      badgeClass: 'badge-success',
      coloreTesto: '#16a34a',
      alertAttivo: false,
      diffGiorni
    };
  }
}

// Genera la UI della checklist sia per Nuovo Paziente che per Modifica Anagrafica
function renderCatalogoAusiliForm(containerId, ausiliEsistenti = []) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const prefix = containerId.includes('edit') ? 'edit-aus' : 'nuovo-aus';

  const html = CATALOGO_AUSILI_STANDARD.map((item, index) => {
    const esistente = ausiliEsistenti.find(a => (a.tipo || '').toLowerCase().includes(item.tipo.toLowerCase().slice(0, 15)));
    const checked = !!esistente;
    const utilizzo = esistente ? (esistente.utilizzo || '') : item.utilizzoDefault;
    const dataRif = esistente ? (esistente.dataRifornimento || '') : '';
    const dataScad = esistente ? (esistente.prossimaRichiesta || esistente.dataScadenza || '') : '';
    const giorniAlert = esistente ? (esistente.giorniAlert || 15) : 15;

    return `
      <div style="background:#ffffff; border:1px solid ${checked ? '#3b82f6' : '#cbd5e1'}; border-radius:10px; padding:10px 12px; transition:all 0.15s ease;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <label style="display:flex; align-items:center; gap:8px; font-weight:700; font-size:13px; color:#0f172a; cursor:pointer; margin-bottom:0;">
            <input type="checkbox" id="${prefix}-chk-${index}" data-tipo="${item.tipo.replace(/"/g, '&quot;')}" ${checked ? 'checked' : ''} 
                   style="width:18px; height:18px;" onchange="toggleDettagliAusilioForm('${prefix}', ${index})">
            <span>${item.icona}</span> <span>${item.tipo}</span>
          </label>
          ${item.richiedeRifornimento ? `
            <span style="font-size:11px; font-weight:700; background:#fef3c7; color:#b45309; padding:2px 8px; border-radius:6px; border:1px solid #fde68a;">
              📦 Richiede Rifornimento Periodico
            </span>
          ` : ''}
        </div>

        <div id="${prefix}-dettagli-${index}" style="display:${checked ? 'block' : 'none'}; margin-top:8px; padding-top:8px; border-top:1px dashed #cbd5e1;">
          <!-- RIGA 1: Dettagli Presidio, Modello e DDT a tutta larghezza -->
          <div style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <label style="font-size:11.5px; font-weight:800; color:#334155; display:flex; align-items:center; gap:5px;">
                <span>📝</span> Specifiche Ausilio, Modello & Dettagli DDT Fornitore:
              </label>
              ${item.tipo.includes('PANTS') ? `
                <a href="FORNITURA_PANTS_ROSA.html" target="_blank" style="font-size:11px; font-weight:700; color:#0284c7; text-decoration:none; background:#e0f2fe; padding:2px 8px; border-radius:5px; border:1px solid #bae6fd; display:inline-flex; align-items:center; gap:4px;">
                  📄 Apri Scheda A4 Completa Pants & DDT ↗
                </a>
              ` : ''}
            </div>
            <textarea id="${prefix}-utilizzo-${index}" class="form-control" rows="2" style="font-size:12px; line-height:1.4; padding:6px 10px; width:100%; border:1px solid #cbd5e1; border-radius:6px; resize:vertical;" placeholder="Es. Serenity Pants Taglia L Extra (Cod. 00037212200021) - DDT Serenity N. 2286626418 del 21/08/2026...">${utilizzo}</textarea>
          </div>

          <!-- RIGA 2: Quantità, Date Rifornimento e Scadenze in colonne ordinate -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap:10px; margin-bottom:8px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:#b45309; display:flex; align-items:center; gap:4px; margin-bottom:3px;">
                <span>📦</span> Cartoni / Confezioni Scorta:
              </label>
              <input type="text" id="${prefix}-cartoni-${index}" class="form-control" style="font-size:12px; padding:6px 8px; width:100%;" value="${esistente ? (esistente.cartoni || (esistente.scortaPacchi ? esistente.scortaPacchi + ' pacchi' : '')) : ''}" placeholder="Es. 10 confezioni (140 pz)">
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:#0369a1; display:flex; align-items:center; gap:4px; margin-bottom:3px;">
                <span>🚚</span> Data Consegna / Rifornimento:
              </label>
              <input type="date" id="${prefix}-data-rif-${index}" class="form-control" style="font-size:12px; padding:6px 8px; width:100%;" value="${dataRif}" onchange="aggiornaTempiAusilioCalcolo('${prefix}', ${index})">
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:#b91c1c; display:flex; align-items:center; gap:4px; margin-bottom:3px;">
                <span>📅</span> Prossima Consegna / Rinnovo:
              </label>
              <input type="date" id="${prefix}-data-scad-${index}" class="form-control" style="font-size:12px; padding:6px 8px; width:100%; border-color:#fca5a5; font-weight:700;" value="${dataScad}" onchange="aggiornaTempiAusilioCalcolo('${prefix}', ${index})">
            </div>
          </div>

          <!-- BARRA INFORMATIVA TEMPI E PREAVVISO ALERT -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; background:#f8fafc; padding:8px 12px; border-radius:8px; border:1px solid #e2e8f0;">
            <div id="${prefix}-tempi-badge-${index}" style="font-size:11.5px; font-weight:800;">
              ${dataScad ? (() => {
                const info = calcolaStatoScadenzaAusilio(dataScad, giorniAlert);
                return `<span style="color:${info.coloreTesto || '#0369a1'};">⏳ ${info.testo}</span>`;
              })() : '<span style="color:#64748b;">⏳ Inserisci la data di rinnovo per calcolare i tempi rimanenti</span>'}
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <label style="font-size:11px; color:#c2410c; font-weight:700; margin-bottom:0;">🔔 Preavviso Alert:</label>
              <select id="${prefix}-alert-${index}" style="font-size:11.5px; padding:3px 8px; border-radius:5px; border:1px solid #cbd5e1; background:#ffffff;" onchange="aggiornaTempiAusilioCalcolo('${prefix}', ${index})">
                <option value="7" ${giorniAlert == 7 ? 'selected' : ''}>7 giorni prima</option>
                <option value="15" ${giorniAlert == 15 ? 'selected' : ''}>15 giorni prima (Consigliato)</option>
                <option value="30" ${giorniAlert == 30 ? 'selected' : ''}>30 giorni prima (Trimestrale)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Aggiungi anche gli ausili personalizzati già esistenti che non sono nel catalogo standard
  const personalizzati = ausiliEsistenti.filter(a => {
    return !CATALOGO_AUSILI_STANDARD.some(std => (a.tipo || '').toLowerCase().includes(std.tipo.toLowerCase().slice(0, 15)));
  });

  const customRows = personalizzati.map((ca, cIdx) => `
    <div id="${prefix}-custom-box-${cIdx}" style="background:#f8fafc; border:1px solid #94a3b8; border-radius:10px; padding:10px 12px; margin-top:6px;">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px;">
        <span style="font-size:12px; font-weight:800; color:#1e293b;">🛠️ Ausilio Personalizzato</span>
        <button type="button" class="btn" style="background:#fee2e2; color:#b91c1c; border:none; padding:2px 6px; font-size:11px; border-radius:4px; cursor:pointer;" onclick="this.closest('#${prefix}-custom-box-${cIdx}').remove()">✕ Rimuovi</button>
      </div>
      <div class="form-row" style="display:flex; gap:10px;">
        <div style="flex:1.5;">
          <input type="text" class="${prefix}-custom-tipo" class="form-control" style="font-size:12px; font-weight:700;" value="${(ca.tipo || '').replace(/"/g, '&quot;')}" placeholder="Nome ausilio">
        </div>
        <div style="flex:2;">
          <input type="text" class="${prefix}-custom-utilizzo" class="form-control" style="font-size:12px;" value="${(ca.utilizzo || '').replace(/"/g, '&quot;')}" placeholder="Indicazioni d'uso">
        </div>
        <div style="flex:1;">
          <input type="date" class="${prefix}-custom-scad" class="form-control" style="font-size:12px;" value="${ca.prossimaRichiesta || ca.dataScadenza || ''}">
        </div>
      </div>
    </div>
  `).join('');

  container.innerHTML = html + (customRows ? `<div id="${prefix}-custom-container">${customRows}</div>` : `<div id="${prefix}-custom-container"></div>`);
}

function toggleDettagliAusilioForm(prefix, index) {
  const chk = document.getElementById(`${prefix}-chk-${index}`);
  const dett = document.getElementById(`${prefix}-dettagli-${index}`);
  if (chk && dett) {
    dett.style.display = chk.checked ? 'block' : 'none';
  }
}

function aggiungiRigaAusilioNuovo() {
  aggiungiRigaAusilioPersonalizzato('container-catalogo-ausili-nuovo', 'nuovo-aus');
}

function aggiungiRigaAusilioModifica() {
  aggiungiRigaAusilioPersonalizzato('container-catalogo-ausili-edit', 'edit-aus');
}

function aggiungiRigaAusilioPersonalizzato(containerId, prefix) {
  let customContainer = document.getElementById(`${prefix}-custom-container`);
  if (!customContainer) {
    customContainer = document.createElement('div');
    customContainer.id = `${prefix}-custom-container`;
    document.getElementById(containerId).appendChild(customContainer);
  }

  const div = document.createElement('div');
  div.style.cssText = 'background:#f8fafc; border:1px solid #94a3b8; border-radius:10px; padding:10px 12px; margin-top:6px;';
  div.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px;">
      <span style="font-size:12px; font-weight:800; color:#1e293b;">🛠️ Nuovo Ausilio Personalizzato</span>
      <button type="button" class="btn" style="background:#fee2e2; color:#b91c1c; border:none; padding:2px 6px; font-size:11px; border-radius:4px; cursor:pointer;" onclick="this.closest('div').parentElement.remove()">✕ Rimuovi</button>
    </div>
    <div class="form-row" style="display:flex; gap:10px;">
      <div style="flex:1.5;">
        <input type="text" class="${prefix}-custom-tipo" class="form-control" style="font-size:12px; font-weight:700;" placeholder="Nome ausilio / presidio *">
      </div>
      <div style="flex:2;">
        <input type="text" class="${prefix}-custom-utilizzo" class="form-control" style="font-size:12px;" placeholder="Istruzioni d'uso, taglia o fornitura">
      </div>
      <div style="flex:1;">
        <input type="date" class="${prefix}-custom-scad" class="form-control" style="font-size:12px;" title="Data Scadenza / Rinnovo">
      </div>
    </div>
  `;
  customContainer.appendChild(div);
}

function aggiornaTempiAusilioCalcolo(prefix, index) {
  const dataScad = document.getElementById(`${prefix}-data-scad-${index}`)?.value || '';
  const giorniAlert = parseInt(document.getElementById(`${prefix}-alert-${index}`)?.value || '15', 10);
  const badge = document.getElementById(`${prefix}-tempi-badge-${index}`);
  if (badge) {
    if (dataScad) {
      const info = calcolaStatoScadenzaAusilio(dataScad, giorniAlert);
      badge.innerHTML = `<span style="color:${info.coloreTesto || '#0369a1'};">⏳ ${info.testo}</span>`;
    } else {
      badge.innerHTML = '<span style="color:#64748b;">⏳ Inserisci la data di rinnovo per calcolare i tempi rimanenti</span>';
    }
  }
}

function estraiAusiliSelezionatiDaForm(prefix) {
  const result = [];

  const pActive = getActivePaziente();
  const ausiliEsistentiPaz = (pActive && pActive.ausili) ? pActive.ausili : [];

  CATALOGO_AUSILI_STANDARD.forEach((std, index) => {
    const chk = document.getElementById(`${prefix}-chk-${index}`);
    if (chk && chk.checked) {
      const tipo = chk.getAttribute('data-tipo') || std.tipo;
      const utilizzo = (document.getElementById(`${prefix}-utilizzo-${index}`)?.value || '').trim() || std.utilizzoDefault;
      const cartoni = (document.getElementById(`${prefix}-cartoni-${index}`)?.value || '').trim();
      const dataRifornimento = document.getElementById(`${prefix}-data-rif-${index}`)?.value || '';
      const dataScadenza = document.getElementById(`${prefix}-data-scad-${index}`)?.value || '';
      const giorniAlert = parseInt(document.getElementById(`${prefix}-alert-${index}`)?.value || '15', 10);

      // Cerca se esisteva già questo ausilio nel paziente per non perdere ddtNumero, codiceArticolo, ecc.
      const prev = ausiliEsistentiPaz.find(a => (a.tipo || '').toLowerCase().includes(tipo.toLowerCase().slice(0, 15))) || {};

      result.push(Object.assign({}, prev, {
        tipo: tipo,
        utilizzo: utilizzo,
        cartoni: cartoni,
        dataRifornimento: dataRifornimento,
        prossimaRichiesta: dataScadenza,
        dataScadenza: dataScadenza,
        giorniAlert: giorniAlert,
        stato: prev.stato || 'In uso attivo regolare'
      }));
    }
  });

  // Estrai ausili personalizzati aggiuntivi
  const customTipi = document.querySelectorAll(`.${prefix}-custom-tipo`);
  const customUtilizzi = document.querySelectorAll(`.${prefix}-custom-utilizzo`);
  const customScadenze = document.querySelectorAll(`.${prefix}-custom-scad`);

  customTipi.forEach((inputTipo, i) => {
    const t = inputTipo.value.trim();
    if (t) {
      result.push({
        tipo: t,
        utilizzo: customUtilizzi[i]?.value.trim() || 'In uso attivo domiciliare',
        prossimaRichiesta: customScadenze[i]?.value || '',
        dataScadenza: customScadenze[i]?.value || '',
        giorniAlert: 15,
        stato: 'In uso'
      });
    }
  });

  return result;
}

// Inserimento singolo rapido da pulsante "+ Aggiungi Ausilio"
function apriModalAggiungiAusilio() {
  const p = getActivePaziente();
  if (!p) {
    showToast('Nessun assistito attivo selezionato.', 'warning');
    return;
  }
  const modal = document.getElementById('modal-aggiungi-ausilio');
  if (modal) {
    const form = document.getElementById('form-nuovo-ausilio');
    if (form) form.reset();
    openModal('modal-aggiungi-ausilio');
  }
}

function aggiornaTempiNuovoAusilioModal() {
  const dataScad = document.getElementById('nuovo-ausilio-scadenza')?.value || '';
  const giorniAlert = parseInt(document.getElementById('nuovo-ausilio-giorni-alert')?.value || '15', 10);
  const badge = document.getElementById('nuovo-ausilio-tempi-badge');
  if (badge) {
    if (dataScad) {
      const info = calcolaStatoScadenzaAusilio(dataScad, giorniAlert);
      badge.innerHTML = `<span style="color:${info.coloreTesto || '#0369a1'};">⏳ ${info.testo}</span>`;
    } else {
      badge.innerHTML = '<span style="color:#64748b;">⏳ Inserisci la data per calcolare i tempi rimanenti</span>';
    }
  }
}

function salvaNuovoAusilio(e) {
  if (e) e.preventDefault();
  const p = getActivePaziente();
  if (!p) return;

  const tipo = (document.getElementById('nuovo-ausilio-tipo').value || '').trim();
  const utilizzo = (document.getElementById('nuovo-ausilio-utilizzo').value || '').trim();
  const cartoni = (document.getElementById('nuovo-ausilio-cartoni')?.value || '').trim();
  const dataRifornimento = document.getElementById('nuovo-ausilio-data-rifornimento')?.value || '';
  const prossimaRichiesta = document.getElementById('nuovo-ausilio-scadenza')?.value || '';
  const giorniAlert = parseInt(document.getElementById('nuovo-ausilio-giorni-alert')?.value || '15', 10);

  if (!tipo) {
    showToast('Inserisci il nome o la tipologia dell\'ausilio.', 'warning');
    return;
  }

  if (!p.ausili) p.ausili = [];
  p.ausili.push({
    tipo: tipo,
    utilizzo: utilizzo || 'In uso attivo domiciliare',
    cartoni: cartoni,
    dataRifornimento: dataRifornimento,
    prossimaRichiesta: prossimaRichiesta,
    dataScadenza: prossimaRichiesta,
    giorniAlert: giorniAlert,
    stato: 'In uso'
  });

  closeModal('modal-aggiungi-ausilio');
  saveDb();
  renderApp();
  showToast(`Ausilio "${tipo}" aggiunto con successo a ${p.nome}!`);
}

async function rimuoviAusilio(idx) {
  const p = getActivePaziente();
  if (!p || !p.ausili || !p.ausili[idx]) return;

  const ausilioDaRimuovere = p.ausili[idx];
  const ok = await customConfirm(
    'Rimuovi Ausilio Sanitario',
    `Vuoi rimuovere l'ausilio "${ausilioDaRimuovere.tipo}" dalla cartella di ${p.nome}?`,
    '🗑️'
  );
  if (ok) {
    p.ausili.splice(idx, 1);
    saveDb();
    renderApp();
    showToast(`Ausilio "${ausilioDaRimuovere.tipo}" rimosso.`);
  }
}

// Navigazione Tab
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      
      tab.classList.add('active');
      const target = tab.getAttribute('data-target');
      document.getElementById(target).style.display = 'block';
    });
  });
}

// Allarme Alvo Intelligente
function checkAlvoAlarm() {
  const p = getActivePaziente();
  const alertContainer = document.getElementById('alvo-alert-container');
  if (!alertContainer || !p) return;

  const alvoLogs = (p.registrazioni || [])
    .filter(r => r.tipo === 'alvo')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (!alvoLogs.length) {
    alertContainer.innerHTML = `
      <div class="alert-banner warning">
        <div>
          <div class="alert-title">⚠️ Nessuna evacuazione registrata per ${p.nome}</div>
          <div class="alert-desc">Registra la prima evacuazione per attivare il monitoraggio dell'alvo e prevenire la stipsi da allettamento.</div>
        </div>
        <button class="btn btn-primary" onclick="openModal('modal-alvo')">+ Segna Evacuazione</button>
      </div>`;
    return;
  }

  const lastEvac = new Date(alvoLogs[0].timestamp);
  const now = new Date();
  const diffHours = Math.floor((now - lastEvac) / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours >= 72) {
    const waAlvoMsg = `🚨 ALLARME CLINICO CAREASSIST PRO\nPaziente: ${p.nome}\nMotivo: NESSUNA EVACUAZIONE DA ${diffDays} GIORNI (${diffHours} ORE).\nUltima evacuazione: ${lastEvac.toLocaleDateString('it-IT')} ore ${lastEvac.toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'})}.\nRischio occlusione/fecaloma: Si richiede consulto immediato con Medico Curante.`;
    const waAlvoUrl = `https://wa.me/?text=${encodeURIComponent(waAlvoMsg)}`;

    alertContainer.innerHTML = `
      <div class="alert-banner">
        <div>
          <div class="alert-title">🚨 ALLARME ALVO (${p.nome}): NESSUNA EVACUAZIONE DA ${diffDays} GIORNI (${diffHours} ORE)</div>
          <div class="alert-desc">Ultima evacuazione: <b>${lastEvac.toLocaleDateString('it-IT')} ore ${lastEvac.toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'})}</b> (${alvoLogs[0].consistenza || 'Normale'}).<br>Rischio occlusione/fecaloma: consultare il Medico Curante per valutare clisma o lassativo!</div>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          <a href="${waAlvoUrl}" target="_blank" class="btn btn-outline" style="background:#25d366; color:#0b0f19; font-weight:800; border:none; text-decoration:none; padding:8px 14px; border-radius:8px; display:inline-flex; align-items:center; gap:6px;">
            💬 Invia Allarme WhatsApp
          </a>
          <button class="btn btn-danger btn-lg" onclick="openModal('modal-alvo')">+ Registra Evacuazione ORA</button>
        </div>
      </div>`;

    // Notifica di Sistema di Emergenza se il browser la supporta
    if ('Notification' in window && Notification.permission === 'granted' && navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(`🚨 ALLARME ALVO: ${p.nome}`, {
          body: `Nessuna evacuazione da ${diffDays} giorni (${diffHours} ore). Rischio clinico!`,
          icon: './careassist_icon.jpg',
          vibrate: [300, 100, 300, 100, 300]
        });
      });
    }
  } else if (diffHours >= 48) {
    alertContainer.innerHTML = `
      <div class="alert-banner warning">
        <div>
          <div class="alert-title">⚠️ ATTENZIONE ALVO (${p.nome}): Nessuna evacuazione da 2 giorni (${diffHours} ore)</div>
          <div class="alert-desc">Ultima evacuazione: <b>${lastEvac.toLocaleDateString('it-IT')} alle ${lastEvac.toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'})}</b>. Favorire idratazione.</div>
        </div>
        <button class="btn btn-outline" onclick="openModal('modal-alvo')">+ Registra Evacuazione</button>
      </div>`;
  } else {
    alertContainer.innerHTML = `
      <div class="alert-banner good">
        <div>
          <div class="alert-title">✅ ALVO REGOLARE (${p.nome})</div>
          <div class="alert-desc">Ultima evacuazione: <b>${lastEvac.toLocaleDateString('it-IT')} alle ${lastEvac.toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'})}</b> (${alvoLogs[0].consistenza || 'Normale'}).</div>
        </div>
        <button class="btn btn-success" onclick="openModal('modal-alvo')">+ Nuova Evacuazione</button>
      </div>`;
  }
}

// Allarme Scorte Farmaci Intelligente (Preavviso Personalizzabile 1-30 giorni per ogni farmaco)
function checkFarmaciScorteAlert() {
  const p = getActivePaziente();
  const cDashboard = document.getElementById('farmaci-alert-scorte-dashboard');
  const cTerapie = document.getElementById('farmaci-alert-scorte-terapie');
  if (!p) {
    if (cDashboard) cDashboard.innerHTML = '';
    if (cTerapie) cTerapie.innerHTML = '';
    return;
  }

  const terapie = p.terapie || [];
  // Farmaci in allarme: o scorta zero o autonomia <= giorniAlert (default 7, range 1-30)
  const inAllarme = terapie.filter(t => {
    const scorta = typeof t.scorta !== 'undefined' ? t.scorta : 0;
    const sogliaAlert = Math.min(30, Math.max(1, parseInt(t.giorniAlert) || 7));
    const giorniAutonomia = calcolaGiorniAutonomiaFarmaco(t);
    return giorniAutonomia <= sogliaAlert;
  });

  if (inAllarme.length === 0) {
    if (cDashboard) cDashboard.innerHTML = '';
    if (cTerapie) cTerapie.innerHTML = '';
    return;
  }

  // Costruisci le pillole dei farmaci in allerta
  const pillsHtml = inAllarme.map(t => {
    const scorta = typeof t.scorta !== 'undefined' ? t.scorta : 0;
    const soglia = Math.min(30, Math.max(1, parseInt(t.giorniAlert) || 7));
    const isZero = scorta <= 0;
    const giorniAutonomia = calcolaGiorniAutonomiaFarmaco(t);
    let dataTermineStr = 'Esaurito';
    if (giorniAutonomia > 0) {
      const d = new Date();
      d.setDate(d.getDate() + giorniAutonomia);
      dataTermineStr = d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
    }
    const bgPill = isZero ? '#fee2e2' : '#fef3c7';
    const borderPill = isZero ? '#f87171' : '#f59e0b';
    const textPill = isZero ? '#991b1b' : '#92400e';
    const iconPill = isZero ? '🔴' : '⚠️';

    return `
      <div style="background:${bgPill}; border:1px solid ${borderPill}; color:${textPill}; border-radius:8px; padding:6px 12px; display:inline-flex; align-items:center; gap:8px; font-size:12.5px; font-weight:700;">
        <span>${iconPill} <b>${t.farmaco}</b></span>
        <span style="background:rgba(255,255,255,0.85); padding:2px 6px; border-radius:6px; font-size:11px;">
          ${isZero ? 'ESAURITO (0 cpr)' : `Autonomia: <b>${giorniAutonomia} gg</b> (${scorta} cpr) • Fine: ${dataTermineStr}`}
        </span>
      </div>`;
  }).join(' ');

  const bannerHtml = `
    <div class="alert-banner" style="background: linear-gradient(135deg, #fff1f2 0%, #fef2f2 100%); border: 1.5px solid #f87171; border-radius: 12px; padding: 14px 16px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.08); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
      <div style="flex: 1; min-width: 280px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span style="font-size: 22px;">🚨</span>
          <div style="font-size: 15px; font-weight: 800; color: #991b1b;">
            ALLERTA SCORTE FARMACI (${p.nome}): ${inAllarme.length} ${inAllarme.length === 1 ? 'farmaco in esaurimento' : 'farmaci in esaurimento'}!
          </div>
        </div>
        <div style="font-size: 12px; color: #7f1d1d; margin-bottom: 8px;">
          I seguenti farmaci hanno raggiunto o superato il limite di preavviso impostato (1-30 gg). Richiedere subito il rinnovo delle ricette al Medico Curante:
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${pillsHtml}
        </div>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <button class="btn btn-primary" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); font-weight: 800; font-size: 12.5px; padding: 8px 14px; border-radius: 8px;" onclick="apriRichiestaRicetteMedico()">
          📲 Richiedi Ricette al Medico
        </button>
        <button class="btn btn-success" style="font-weight: 700; font-size: 12.5px; padding: 8px 14px; border-radius: 8px;" onclick="apriRicaricaScorta()">
          📦 Carica Scatole
        </button>
      </div>
    </div>`;

  if (cDashboard) cDashboard.innerHTML = bannerHtml;
  if (cTerapie) cTerapie.innerHTML = bannerHtml;
}

// Allarme Rifornimenti Ausili Sanitari & Forniture ASL (Alert Scadenza)
function checkAusiliScadenzeAlert() {
  const p = getActivePaziente();
  const cDashboard = document.getElementById('ausili-alert-scorte-dashboard');
  if (!cDashboard) return;
  if (!p || !p.ausili || p.ausili.length === 0) {
    cDashboard.innerHTML = '';
    return;
  }

  const inAllerta = [];
  p.ausili.forEach(a => {
    const dataScad = a.prossimaRichiesta || a.dataScadenza;
    if (dataScad) {
      const info = calcolaStatoScadenzaAusilio(dataScad, a.giorniAlert || 15);
      if (info.alertAttivo) {
        inAllerta.push({ ausilio: a, info: info });
      }
    }
  });

  if (inAllerta.length === 0) {
    cDashboard.innerHTML = '';
    return;
  }

  const pills = inAllerta.map(item => {
    const a = item.ausilio;
    const info = item.info;
    const isScaduto = info.stato === 'scaduto';
    const bgPill = isScaduto ? '#fee2e2' : '#fef3c7';
    const borderPill = isScaduto ? '#f87171' : '#f59e0b';
    const textPill = isScaduto ? '#991b1b' : '#92400e';
    const iconPill = isScaduto ? '🚨' : '⚠️';

    return `
      <div style="background:${bgPill}; border:1px solid ${borderPill}; border-radius:8px; padding:6px 10px; display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:700; color:${textPill};">
        <span>${iconPill}</span>
        <span><b>${a.tipo}</b>: ${info.testo}</span>
      </div>
    `;
  }).join('');

  cDashboard.innerHTML = `
    <div class="alert-banner" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1.5px solid #f59e0b; border-radius: 12px; padding: 14px 16px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.08); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
      <div style="flex: 1; min-width: 280px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span style="font-size: 22px;">🛡️</span>
          <div style="font-size: 15px; font-weight: 800; color: #92400e;">
            ALERT RIFORNIMENTO AUSILI SANITARI (${p.nome}): ${inAllerta.length} ${inAllerta.length === 1 ? 'ausilio da rinnovare' : 'ausili da rinnovare'}!
          </div>
        </div>
        <div style="font-size: 12px; color: #78350f; margin-bottom: 8px;">
          Rinnovo fornitura ASL o prescrizione periodica in scadenza o scaduta:
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${pills}
        </div>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <button class="btn btn-outline" style="border-color:#b45309; color:#92400e; font-weight:700; font-size:12px; background:#fff;" onclick="apriModificaAnagrafica()">
          ✏️ Aggiorna Date Ausili
        </button>
      </div>
    </div>
  `;
}

// Rendering Terapie & Scarico Scorte
function renderTerapie() {
  const p = getActivePaziente();
  const container = document.getElementById('terapie-table-body');
  const preview = document.getElementById('terapie-preview-body');
  if (!container || !p) return;

  const role = localStorage.getItem('milella_role') || localStorage.getItem('milella_last_authenticated_role');
  const canEdit = (role === 'admin') || (localStorage.getItem('milella_can_edit_terapie') === 'true');

  const html = (p.terapie || []).map(t => {
    // Calcolo giorni autonomia e data presunta termine scorta considerando dosi frazionate/alternate
    const giorniAutonomia = calcolaGiorniAutonomiaFarmaco(t);
    const consumoGiornaliero = calcolaConsumoGiornalieroFarmaco(t);
    
    // Calcolo Data Presunta Termine Capsule esatta
    let dataTermineStr = 'Esaurito';
    if (giorniAutonomia > 0) {
      const dataTermine = new Date();
      dataTermine.setDate(dataTermine.getDate() + giorniAutonomia);
      dataTermineStr = dataTermine.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    // Soglia Alert Personalizzata (1-30 giorni, predefinito 7)
    const sogliaAlert = Math.min(30, Math.max(1, parseInt(t.giorniAlert) || 7));
    
    // Stato Visivo Scorta: CARICATO / ALLERTA SCORTA / MANCANTE
    let statusBadge = '';
    if (t.scorta <= 0) {
      statusBadge = '<span class="badge badge-danger" style="font-weight:800; font-size:11px; background:#b91c1c; color:#fff;">🔴 SCORTA ZERO / MANCANTE</span>';
    } else if (giorniAutonomia <= sogliaAlert) {
      statusBadge = `<span class="badge badge-danger" style="font-weight:800; font-size:11px; background:#ea580c; color:#fff; border:1px solid #c2410c;" title="Allerta configurata a ${sogliaAlert} giorni di preavviso">🚨 ALLERTA SCORTA (≤${sogliaAlert}gg)</span>`;
    } else if (giorniAutonomia <= sogliaAlert + 5) {
      statusBadge = `<span class="badge badge-warning" style="font-weight:800; font-size:11px; background:#fef08a; color:#854d0e; border:1px solid #facc15;" title="Autonomia rimanente: ${giorniAutonomia} giorni">🟡 SCORTA IN CALO</span>`;
    } else {
      statusBadge = '<span class="badge badge-success" style="font-weight:800; font-size:11px; background:#16a34a; color:#fff;">🟢 FARMACIA CARICATA</span>';
    }

    // Informazioni ultimo ritiro
    const farmaciaNome = t.farmacia || p.farmaciaDiRiferimento || 'Farmacia MACARIO';
    const ritiroInfo = t.ultimoRitiro 
      ? `<div style="font-size:10px; color:#0369a1; font-weight:700; margin-top:3px;">📅 Ritirato: <b>${new Date(t.ultimoRitiro).toLocaleDateString('it-IT')}</b></div><div style="font-size:9.5px; color:#047857; font-weight:600;">🏥 ${farmaciaNome}</div>`
      : `<div style="font-size:10px; color:#64748b; margin-top:3px;">Prescrizione Attiva</div><div style="font-size:9.5px; color:#64748b;">${farmaciaNome}</div>`;

    return `
      <tr id="terapia-row-${t.id}" class="terapia-row-item" data-farmaco-id="${t.id}">
        <td>
  ${(() => {
    if (t.cadenzaTipo === 'alternata_mezza_intera') {
      const doseAlt = getDoseOdiernaAlternata(t);
      const bgDose = doseAlt.isMezza ? '#fef3c7' : '#dcfce7';
      const colDose = doseAlt.isMezza ? '#b45309' : '#15803d';
      const iconDose = doseAlt.isMezza ? '🌓' : '🌕';
      return `<span class="badge" style="background:${bgDose}; color:${colDose}; font-weight:800; border:1px solid ${colDose};">${iconDose} OGGI: ${doseAlt.testo}</span> <b>${t.ora}</b>`;
    }
    if (t.cadenzaTipo === 'alterni') {
      if (!isTerapiaPrevistaOggi(t)) {
        return `<span class="badge" style="background:#e2e8f0; color:#475569; font-weight:700;">🔁 Giorni alterni</span><br><small style="color:#64748b; font-size:10.5px;">Non prevista oggi (tocca domani)</small>`;
      }
      return `<span class="badge badge-warning" style="background:#fef08a; color:#854d0e; font-weight:800; border:1px solid #facc15;">🔁 OGGI TOCCA (alterni)</span> <b>${t.ora}</b>`;
    }
    if (t.cadenzaTipo === 'quindicinale_15_30' || ((t.farmaco || '').toUpperCase().indexOf('DIBASE') >= 0 && (t.modo || '').indexOf('15') >= 0)) {
      const previstaOggi = isTerapiaPrevistaOggi(t);
      if (!previstaOggi) {
        return `<span class="badge" style="background:#e2e8f0; color:#475569; font-weight:700;">📅 Ogni 15gg (15 e 30)</span><br><small style="color:#64748b; font-size:10.5px;">Non prevista oggi</small>`;
      } else {
        return `<span class="badge badge-warning" style="background:#fef08a; color:#854d0e; font-weight:800; border:1px solid #facc15;">🌟 OGGI È IL GIORNO (15 o 30)!</span> <b>${t.ora}</b>`;
      }
    }
    return `<span class="badge badge-primary">${t.fascia}</span> <b>${t.ora}</b>`;
  })()}
</td>
        <td>
          <div class="audit-pill-clickable" onclick="mostraAuditFarmaco(${t.id})" title="Clicca per aprire la tracciabilità e la cronologia">
            <b style="color:var(--primary); font-size:14.5px; text-decoration: underline; text-decoration-color: rgba(37,99,235,0.4);">${t.farmaco}</b>
            <span style="font-size:11px; margin-left:4px;" title="Storico">🔍</span>
            ${t.ultimaModificaClinica ? `<span style="display:inline-block; font-size:10px; font-weight:800; background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd; padding:1px 6px; border-radius:6px; margin-left:4px;" title="${t.ultimaModificaClinica.motivo || ''}">🩺 Agg. ${t.ultimaModificaClinica.fonte || 'Medico'} (${t.ultimaModificaClinica.data || ''})</span>` : ''}
            ${t.principio ? `<br><small style="color:#64748b;">Principio: ${t.principio}</small>` : ''}
          </div>
        </td>
        <td><b>${t.dosaggio}</b></td>
        <td>
          ${(() => {
            const isSinemet = (t.farmaco || '').toUpperCase().includes('SINEMET');
            const isAverelix = (t.farmaco || '').toUpperCase().includes('AVERELIX');
            let avvisoBox = '';
            if (isSinemet) {
              avvisoBox = '<div style="background:#fef3c7; border:1px solid #f59e0b; color:#92400e; font-weight:800; font-size:10.5px; padding:2px 6px; border-radius:6px; margin-bottom:4px; display:inline-block;">⚡ STOMACO VUOTO (30 min prima dei pasti)</div><br>';
            } else if (isAverelix) {
              avvisoBox = '<div style="background:#ecfdf5; border:1px solid #10b981; color:#047857; font-weight:800; font-size:10.5px; padding:2px 6px; border-radius:6px; margin-bottom:4px; display:inline-block;">🛡️ ANTIAGGREGANTE A PRANZO</div><br>';
            }
            return avvisoBox + `<small style="color:#334155; font-size:12.5px;">${t.modo}</small>`;
          })()}
        </td>
        <td style="text-align: center;">
          ${statusBadge}
          <div style="font-size:13px; font-weight:800; color:#0f172a; margin-top:4px;">
            📦 ${t.scorta} compresse
          </div>
          <div style="font-size:10.5px; color:#64748b;">Autonomia: <b>~${giorniAutonomia} giorni</b></div>
          <div style="font-size:9.5px; color:#d97706; font-weight:700;" title="Giorni di preavviso allerta configurabili da 1 a 30">🔔 Alert impostato: <b>${sogliaAlert} gg</b></div>
          <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:2px 6px; margin-top:4px; display:inline-block;">
            <span style="font-size:10px; color:#1e40af; font-weight:700;">⏳ Fine Scorta: <b>${dataTermineStr}</b></span>
          </div>
          ${ritiroInfo}
        </td>
        <td style="text-align: center;">
          <button class="btn btn-outline" style="padding:6px 10px; font-size:11.5px; font-weight:700; border-color:#10b981; color:#047857; background:#ecfdf5; border-radius:8px;" onclick="caricaScatolaRapida(${t.id})" title="Aggiungi automaticamente 1 scatola intera ritirata (+${t.cprPerScatola || 28} cpr)">
            +1 Scatola (${t.cprPerScatola || 28} cpr)
          </button>
        </td>
        <td style="text-align: center;">
          ${(() => {
            const isBisogno = t.fascia === 'Al Bisogno' || t.fascia === 'Al Bisogno (SOS)' || t.ora === 'Al Bisogno' || (t.frequenzaTipo === 'bisogno');
            if (isBisogno && !t.fattoOggi) {
              return `
                <div style="display:flex; flex-direction:column; gap:4px; align-items:center;">
                  <button class="btn btn-outline" style="min-width: 125px; background:#fef3c7; border-color:#f59e0b; color:#b45309; font-weight:800;" onclick="toggleFarmacoConScarico(${t.id})" title="Clicca per registrare che questo farmaco è stato assunto al bisogno oggi">
                    ⚡ Somministra al Bisogno
                  </button>
                  <span style="font-size:10px; color:#b45309; font-weight:600;">Sintomatico / SOS</span>
                </div>
              `;
            }
            if (t.fattoOggi) {
              return `<button class="btn btn-success" style="min-width: 120px;" onclick="toggleFarmacoConScarico(${t.id})">✓ Assunto Oggi</button>` + (isBisogno ? `<div style="font-size:10px; color:#15803d; font-weight:700; margin-top:3px;">⚡ Assunto al bisogno</div>` : '');
            }
            if (t.saltatoOggi) {
              return `
                <button class="btn btn-danger" style="min-width: 120px; background:#b91c1c; border-color:#991b1b;" onclick="toggleFarmacoConScarico(${t.id})" title="Terapia saltata/omessa: ${t.motivoSalto || ''}. Clicca se vuoi comunque somministrare ora.">
                  ❌ Saltato
                </button>
                <div style="font-size:10px; color:#b91c1c; margin-top:3px; font-weight:800;" title="${t.motivoSalto || ''}">${(t.motivoSalto || 'Dose omessa').slice(0, 20)}...</div>
              `;
            }
            const check = verificaStatoOrarioFarmaco(t.ora);
            if (!check.consentito) {
              return `
                <div style="display:flex; flex-direction:column; gap:4px; align-items:center;">
                  <button class="btn btn-outline" style="min-width: 120px; background:#fffbeb; border-color:#f59e0b; color:#b45309; font-weight:700;" onclick="toggleFarmacoConScarico(${t.id})" title="Previsto alle ${t.ora}. Clicca per somministrare ora (spunta)">
                    🕒 Alle ${t.ora} (Spunta)
                  </button>
                  <span style="font-size:10px; color:#d97706; font-weight:700;">Previsto alle ${t.ora}</span>
                  <button type="button" class="btn btn-outline" style="padding:1px 6px; font-size:10px; border-color:#e2e8f0; color:#64748b;" onclick="apriModalSaltaFarmaco(${t.id})" title="Registra mancata assunzione o rifiuto">Salta dose</button>
                </div>
              `;
            }
            if (check.inRitardo) {
              const rOre = Math.floor(check.minutiRitardo / 60);
              const rMin = check.minutiRitardo % 60;
              const ritardoTesto = rOre > 0 ? `+${rOre}h ${rMin}m` : `+${rMin} min`;
              return `
                <div style="display:flex; flex-direction:column; gap:4px; align-items:center;">
                  <button class="btn farmaco-in-ritardo-btn" style="min-width: 120px;" onclick="toggleFarmacoConScarico(${t.id})" title="ATTENZIONE: Terapia in ritardo! Clicca per somministrare ora.">
                    🔔 RITARDO!
                  </button>
                  <span style="display:inline-block; background:#dc2626; color:#ffffff !important; font-weight:800; font-size:11px; padding:3px 10px; border-radius:12px; margin-top:3px; box-shadow:0 1px 3px rgba(220,38,38,0.3);">Scaduto da ${ritardoTesto}</span>
                  <button type="button" class="btn btn-outline" style="padding:2px 8px; font-size:10.5px; border-color:#fca5a5; color:#b91c1c; background:#fef2f2; border-radius:6px;" onclick="apriModalSaltaFarmaco(${t.id})" title="Se non può essere preso (rifiuto, addormentato, vomito), registralo come dose saltata">
                    ❌ Non somministrato?
                  </button>
                </div>
              `;
            }
            return `
              <div style="display:flex; flex-direction:column; gap:4px; align-items:center;">
                <button class="btn btn-outline" style="min-width: 120px;" onclick="toggleFarmacoConScarico(${t.id})">⚪ Da dare</button>
                <button type="button" class="btn btn-outline" style="padding:1px 6px; font-size:10px; border-color:#e2e8f0; color:#64748b;" onclick="apriModalSaltaFarmaco(${t.id})" title="Registra mancata assunzione o rifiuto">Salta dose</button>
              </div>
            `;
          })()}
        </td>
        <td style="text-align: center;">
          ${canEdit ? `
            <button class="btn btn-outline" style="padding:5px 8px; font-size:11px;" onclick="apriModificaFarmaco(${t.id})" title="Modifica dati e orario del farmaco">✏️ Modifica</button>
            <button class="btn btn-outline" style="padding:5px 6px; font-size:11px;" onclick="eliminaTerapia(${t.id})" title="Elimina farmaco">🗑️</button>
          ` : `
            <span style="font-size:11px; color:#64748b; font-weight:600;" title="Sola somministrazione e spunta (Modifiche riservate all'Amministratore)">🔒 Sola Lettura</span>
          `}
          <button class="btn btn-outline" style="padding:5px 8px; font-size:11px; margin-left:3px;" onclick="mostraAuditFarmaco(${t.id})" title="Tracciabilità e cronologia controlli">🕒 Traccia</button>
        </td>
      </tr>
    `;
  }).join('');

  // Gestione visibilità pulsante "+ Nuovo Farmaco" in cima alla tabella
  const btnNuovoFarmaco = document.querySelector('button[onclick="openModal(\'modal-farmaco\')"]');
  if (btnNuovoFarmaco) {
    btnNuovoFarmaco.style.display = canEdit ? 'inline-block' : 'none';
  }

  container.innerHTML = html || '<tr><td colspan="8" style="text-align:center; color:#94a3b8; padding:16px;">Nessun farmaco in terapia per questo paziente.</td></tr>';

  if (preview) {
    preview.innerHTML = (p.terapie || []).slice(0, 6).map(t => {
      let btnPreview = `<button class="btn ${t.fattoOggi ? 'btn-success' : 'btn-outline'}" style="padding:3px 8px; font-size:11px;" onclick="toggleFarmacoConScarico(${t.id})">${t.fattoOggi ? '✅ Fatto' : '⚪ Da dare'}</button>`;
      if (!t.fattoOggi) {
        const check = verificaStatoOrarioFarmaco(t.ora);
        if (!check.consentito) {
          btnPreview = `<button class="btn btn-outline" style="padding:3px 8px; font-size:11px; background:#fffbeb; color:#b45309; border-color:#fde68a;" onclick="toggleFarmacoConScarico(${t.id})" title="Orario non raggiunto">🕒 ${t.ora}</button>`;
        } else if (check.inRitardo) {
          btnPreview = `<button class="btn farmaco-in-ritardo-btn" style="padding:3px 8px; font-size:11px;" onclick="toggleFarmacoConScarico(${t.id})" title="Terapia in ritardo!">🔔 Ritardo!</button>`;
        }
      }
      return `
      <tr>
        <td>${canEdit ? `<b style="cursor:pointer; color:#0284c7;" onclick="apriModificaFarmaco(${t.id})" title="Clicca per modificare orario">${t.ora} ✏️</b>` : `<b style="color:#0f172a;">${t.ora}</b>`}</td>
        <td>
          <div class="audit-pill-clickable" onclick="mostraAuditFarmaco(${t.id})" title="Clicca per visualizzare la traccia oraria">
            <b style="color:var(--primary);">${t.farmaco}</b><br>
            <small style="color:#64748b;">${t.modo}</small>
          </div>
        </td>
        <td>
          <span class="badge ${t.scorta <= 5 ? 'badge-danger' : 'badge-primary'}">${t.scorta} cpr</span>
        </td>
        <td>
          ${btnPreview}
        </td>
      </tr>
    `;
    }).join('') || '<tr><td colspan="4" style="text-align:center; color:#94a3b8;">Nessun farmaco configurato.</td></tr>';
  }

  // Popola anche la select nel modal di ricarica
  popolaSelectRicarica();

  // Aggiorna le etichette con la data odierna del giorno di terapia
  aggiornaDataGiornoTerapia();
}

// Funzione dedicata per aggiornare la data del giorno terapia e orologio live
function aggiornaDataGiornoTerapia() {
  const now = new Date();
  
  // 1. Data estesa per giorno terapia (es. "Sabato 17 Ottobre 2026")
  const dataEstesa = now.toLocaleDateString('it-IT', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  const dataEstesaCapitalizzata = dataEstesa.charAt(0).toUpperCase() + dataEstesa.slice(1);

  // 2. Data compatta (es. "17/10/2026")
  const dataCompatta = now.toLocaleDateString('it-IT', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  // 3. Orario live (es. "22:15:30")
  const oraLive = now.toLocaleTimeString('it-IT', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });

  // Aggiorna Badge nella card Terapie Farmacologiche
  const elBadgeTerapia = document.getElementById('data-giorno-terapia-testo');
  if (elBadgeTerapia) {
    elBadgeTerapia.textContent = dataEstesaCapitalizzata;
  }

  // Aggiorna intestazione colonna "Azione Oggi (17/10/2026)"
  const elColOggi = document.getElementById('col-header-data-oggi');
  if (elColOggi) {
    elColOggi.textContent = dataCompatta;
  }

  // Aggiorna anteprima rapida dashboard
  const elDashTerapie = document.getElementById('dashboard-data-terapie-oggi');
  if (elDashTerapie) {
    elDashTerapie.textContent = `📅 Terapie di Oggi: ${dataEstesaCapitalizzata}`;
  }

  // Aggiorna data nell'header superiore live
  const elHeaderData = document.getElementById('header-data-live-testo');
  if (elHeaderData) {
    elHeaderData.textContent = dataEstesaCapitalizzata;
  }
  const elHeaderOra = document.getElementById('header-ora-live-testo');
  if (elHeaderOra) {
    elHeaderOra.textContent = `Ore ${oraLive}`;
  }

  // Aggiorna badge data nell'hero card paziente
  const elHeroData = document.getElementById('hero-badge-data-oggi');
  if (elHeroData) {
    elHeroData.textContent = `📅 Oggi: ${dataCompatta}`;
  }
}

// Controllo di Sicurezza Oraria della Terapia & Monitoraggio Farmaci Saltati/In Ritardo
function verificaStatoOrarioFarmaco(orarioStr) {
  if (!orarioStr) return { consentito: true, futuro: false, inRitardo: false, minutiMancanti: 0, minutiRitardo: 0 };
  const [oreF, minF] = orarioStr.split(':').map(Number);
  if (isNaN(oreF) || isNaN(minF)) return { consentito: true, futuro: false, inRitardo: false, minutiMancanti: 0, minutiRitardo: 0 };

  const now = new Date();
  const adessoMinuti = now.getHours() * 60 + now.getMinutes();
  const farmacoMinuti = oreF * 60 + minF;

  const diff = farmacoMinuti - adessoMinuti; // >0 se nel futuro, <0 se già passato

  // Se l'orario è nel futuro oltre 30 minuti di tolleranza
  if (diff > 30) {
    return {
      consentito: false,
      futuro: true,
      inRitardo: false,
      minutiMancanti: diff,
      minutiRitardo: 0,
      orarioStr: orarioStr
    };
  }

  // Se l'orario è passato da più di 15 minuti e non ancora preso: RITARDO / TERAPIA SALTATA!
  if (diff <= -5) {
    return {
      consentito: true,
      futuro: false,
      inRitardo: true,
      minutiMancanti: 0,
      minutiRitardo: Math.abs(diff),
      orarioStr: orarioStr
    };
  }

  return { consentito: true, futuro: false, inRitardo: false, minutiMancanti: 0, minutiRitardo: 0 };
}


// Sblocco automatico immediato audio sui browser (Autoplay Policy) al primo clic/tasto/movimento
['click', 'touchstart', 'keydown', 'mousedown'].forEach(evt => {
  window.addEventListener(evt, () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        if (allarmeTerapieAttivo && Date.now() - ultimoSuonoFarmacoRitardo > 3000) {
          ultimoSuonoFarmacoRitardo = Date.now();
          suonaChimeInsistenteElegante();
        }
      });
    } else if (allarmeTerapieAttivo && Date.now() - ultimoSuonoFarmacoRitardo > 3000) {
      ultimoSuonoFarmacoRitardo = Date.now();
      suonaChimeInsistenteElegante();
    }
  }, { passive: true });
});

// Suono di Allarme Terapie In Ritardo / Saltate (Chime Clinico Insistente ed Elegante)
let allarmeTerapieAttivo = false;
let allarmeTerapieSnoozeFinoA = 0;
let ultimoSuonoFarmacoRitardo = 0;
let audioSbloccatoDaGesto = false; // se l'utente chiude il popup, non riapre per 5 minuti

function suonaChimeInsistenteElegante() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t0 = ctx.currentTime;

    // Sequenza a tre toni arpeggiati nitidi (Mi5 659.25Hz -> Sol#5 830.61Hz -> Si5 987.77Hz)
    // Elegante, penetrante e insistente senza essere sgradevole
    const note = [659.25, 830.61, 987.77, 1318.51]; // Mi5, Sol#5, Si5, Mi6
    note.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startNota = t0 + (idx * 0.12);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startNota);
      
      gain.gain.setValueAtTime(0, startNota);
      gain.gain.linearRampToValueAtTime(0.12, startNota + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startNota + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startNota);
      osc.stop(startNota + 0.6);
    });

  } catch(e) {
    console.log('Audio non autorizzato', e);
  }
}

// Funzione globale che analizza i pazienti accessibili per rilevare chi ha terapie in ritardo
function controllaTerapieGlobaliTuttiPazienti() {
  if (!AppData || !AppData.pazienti) return;

  const adessoMs = Date.now();
  if (adessoMs < allarmeTerapieSnoozeFinoA) return; // in pausa dopo chiusura

  const pazientiConRitardi = [];
  const listaPazienti = typeof getPazientiAccessibili === 'function' ? getPazientiAccessibili() : AppData.pazienti;

  listaPazienti.forEach(p => {
    const terapieInRitardo = (p.terapie || []).filter(t => isTerapiaPrevistaOggi(t) && !t.fattoOggi && !t.saltatoOggi && verificaStatoOrarioFarmaco(t.ora).inRitardo);
    if (terapieInRitardo.length > 0) {
      pazientiConRitardi.push({
        paziente: p,
        farmaci: terapieInRitardo
      });
    }
  });

  const modalAllarme = document.getElementById('modal-allarme-terapie');
  const listaContainer = document.getElementById('lista-pazienti-terapie-ritardo');

  if (pazientiConRitardi.length > 0) {
    allarmeTerapieAttivo = true;

    // Popola lista pazienti e terapie scadute
    if (listaContainer) {
      listaContainer.innerHTML = pazientiConRitardi.map(item => {
        const p = item.paziente;
        const righeFarmaci = item.farmaci.map(f => {
          const check = verificaStatoOrarioFarmaco(f.ora);
          const rOre = Math.floor(check.minutiRitardo / 60);
          const rMin = check.minutiRitardo % 60;
          const ritardoStr = rOre > 0 ? `+${rOre}h ${rMin}m` : `+${rMin} min`;
          return `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #fecaca; border-radius:8px; padding:8px 12px; margin-top:6px; flex-wrap:wrap; gap:8px;">
              <div>
                <div style="font-weight:800; color:#0f172a; font-size:15px;">🕒 <span style="color:#dc2626; font-weight:900;">Ore ${f.ora}</span>: <b>${f.farmaco}</b></div>
                <div style="font-size:12px; color:#334155; font-weight:500; margin-top:2px;">${f.modo} &bull; Dosaggio: <b style="color:#0f172a;">${f.dosaggio}</b></div>
              </div>
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <span class="badge" style="background:#dc2626; color:#ffffff !important; font-weight:800; font-size:12px; padding:6px 14px; border-radius:20px; box-shadow:0 2px 6px rgba(220,38,38,0.3); letter-spacing:0.3px;">⏰ Scaduto da ${ritardoStr}</span>
                <button type="button" class="btn btn-primary" style="padding:6px 14px; font-size:12px; font-weight:800; background:#2563eb; color:#ffffff; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:4px; box-shadow:0 2px 6px rgba(37,99,235,0.3);" onclick="vaiADirettoFarmacoDaAllarme('${p.id}', ${f.id})">
                  <span>👉</span> Vai a questo farmaco ➔
                </button>
                <button type="button" class="btn" style="padding:6px 10px; font-size:11.5px; font-weight:800; border:1.5px solid #dc2626; color:#991b1b; background:#ffffff; border-radius:8px; cursor:pointer; box-shadow:0 1px 4px rgba(0,0,0,0.06);" onclick="azioneRapidaMancanzaDaAllarme('${p.id}', ${f.id})">
                  ❌ Salta
                </button>
              </div>
            </div>
          `;
        }).join('');

        return `
          <div style="background:#fff5f5; border:2px solid #fca5a5; border-radius:14px; padding:14px; box-shadow:0 2px 6px rgba(0,0,0,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #fee2e2; padding-bottom:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:22px;">👤</span>
                <div>
                  <div style="font-size:15px; font-weight:800; color:#1e293b;">${p.nome} (${calcolaAnniDaData(p.dataNascita)} anni)</div>
                  <div style="font-size:11px; color:#ef4444; font-weight:700;">⚠️ ${item.farmaci.length} Terapia/e in ritardo!</div>
                </div>
              </div>
              <button class="btn btn-primary" style="padding:6px 14px; font-size:12px; font-weight:800;" onclick="vaiACartellaPazienteDaAllarme('${p.id}', ${item.farmaci[0] ? item.farmaci[0].id : null})">
                Vai alla Cartella di ${p.nome.split(' ')[0]} ➔
              </button>
            </div>
            ${righeFarmaci}
          </div>
        `;
      }).join('');
    }

    // Mostra il popup modale se non già aperto (e non se l'utente ha un'altra modale aperta)
    if (modalAllarme && !modalAllarme.classList.contains('active')) {
      const anyOtherModalOpen = document.querySelector('.modal-overlay.active:not(#modal-allarme-terapie)');
      if (!anyOtherModalOpen) {
        modalAllarme.classList.add('active');
      }
    }

    // Suono insistente elegante ripetuto ogni 3.5 secondi
    if (audioPosturaAbilitato && (adessoMs - ultimoSuonoFarmacoRitardo >= 3500)) {
      ultimoSuonoFarmacoRitardo = adessoMs;
      suonaChimeInsistenteElegante();
    }

  } else {
    // Nessun ritardo attivo
    allarmeTerapieAttivo = false;
    if (modalAllarme && modalAllarme.classList.contains('active')) {
      modalAllarme.classList.remove('active');
    }
  }
}

// Chiusura allarme da parte dell'utente: arresta il suono e mette in pausa per 5 minuti
function chiudiModalAllarmeSenzaSnooze() {
  const modal = document.getElementById('modal-allarme-terapie');
  if (modal) modal.classList.remove('active');
  allarmeTerapieAttivo = false;
  // Solo 15 secondi di respiro per navigare e cliccare senza che il popup si riapra istantaneamente
  allarmeTerapieSnoozeFinoA = Date.now() + 15000;
}

function chiudiAllarmeTerapieGlobali() {
  const modal = document.getElementById('modal-allarme-terapie');
  if (modal) modal.classList.remove('active');
  allarmeTerapieAttivo = false;
  allarmeTerapieSnoozeFinoA = Date.now() + (5 * 60 * 1000); // 5 minuti di snooze
  showToast('Allarme acustico silenziato per 5 minuti. Ricordati di somministrare i farmaci!');
}

function vaiACartellaPazienteDaAllarme(pazId, farmacoId) {
  chiudiModalAllarmeSenzaSnooze();
  cambiaPaziente(pazId);
  // Passa automaticamente alla scheda terapie
  var tabBtn = document.querySelector('[data-target="tab-farmaci"]');
  if (tabBtn) tabBtn.click();

  if (farmacoId) {
    evidenziaEScrollaAFarmaco(farmacoId);
  }
}

function vaiADirettoFarmacoDaAllarme(pazId, farmacoId) {
  chiudiModalAllarmeSenzaSnooze();
  cambiaPaziente(pazId);
  var tabBtn = document.querySelector('[data-target="tab-farmaci"]');
  if (tabBtn) tabBtn.click();

  if (farmacoId) {
    evidenziaEScrollaAFarmaco(farmacoId);
  }
}

// FUNZIONE PER SCROLL FLUIDO ED EFFETTO FARO/EVIDENZIATORE SUL FARMACO INTERESSATO
function evidenziaEScrollaAFarmaco(farmacoId) {
  setTimeout(function() {
    var row = document.getElementById('terapia-row-' + farmacoId);
    if (!row) {
      // Prova a cercare per data attribute
      row = document.querySelector('tr[data-farmaco-id="' + farmacoId + '"]');
    }

    if (row) {
      // Scroll fluido immediato che centra l'elemento verticalmente nello schermo
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Rimuovi precedenti evidenziazioni
      document.querySelectorAll('.terapia-row-highlight').forEach(function(el) {
        el.classList.remove('terapia-row-highlight');
      });

      // Applica la classe evidenziatore faro
      row.classList.add('terapia-row-highlight');

      // Mostra toast di orientamento per l'utente
      showToast('👉 Ecco il farmaco da somministrare!', 'info');

      // Rimuovi dopo 4.5 secondi
      setTimeout(function() {
        if (row) row.classList.remove('terapia-row-highlight');
      }, 4500);
    }
  }, 350); // piccolo timeout per consentire il rendering del cambio paziente
}

function azioneRapidaMancanzaDaAllarme(pazId, farmacoId) {
  chiudiAllarmeTerapieGlobali();
  cambiaPaziente(pazId);
  // Passa alla scheda farmaci e apri la registrazione omissione
  const tabBtn = document.querySelector('[data-target="tab-farmaci"]');
  if (tabBtn) tabBtn.click();
  apriModalSaltaFarmaco(farmacoId);
}

// SIMULATORE ISTANTANEO PER TEST CLINICO
function simulaAllarmeTerapieTest() {
  allarmeTerapieSnoozeFinoA = 0; // Azzera qualsiasi pausa/snooze
  ultimoSuonoFarmacoRitardo = 0;

  // Assicura che l'audio context sia sbloccato dal clic
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }

  // Se nessun paziente ha un farmaco marcato in ritardo nell'ora attuale,
  // imposta temporaneamente un orario passato di test (es. 20:30 o 08:30) per permettere il test immediato
  const p = getActivePaziente();
  if (p && p.terapie && p.terapie.length > 0) {
    const giaInRitardo = p.terapie.some(t => !t.fattoOggi && verificaStatoOrarioFarmaco(t.ora).inRitardo);
    if (!giaInRitardo) {
      // Imposta il primo farmaco come non fatto e con orario di 1 ora fa
      const oraPassata = new Date(Date.now() - 45 * 60 * 1000);
      const hh = String(oraPassata.getHours()).padStart(2, '0');
      const mm = String(oraPassata.getMinutes()).padStart(2, '0');
      p.terapie[0].fattoOggi = false;
      p.terapie[0].ora = `${hh}:${mm}`;
      saveDb();
    }
  }

  // Suona subito la prima volta e lancia il controllo
  suonaChimeInsistenteElegante();
  controllaTerapieGlobaliTuttiPazienti();
  showToast('🚨 Simulazione avviata! Popup aperto e suono insistente attivo ogni 3.5s.', 'warning');
}

// SCARICO AUTOMATICO DELLA COMPRESSA ALLA SOMMINISTRAZIONE CON TRACCIABILITÀ & BLOCCO ORARIO
async function toggleFarmacoConScarico(id) {
  const p = getActivePaziente();
  if (!p) return;
  const t = p.terapie.find(item => item.id === id);
  if (!t) return;

  const now = new Date();
  const oraFormattata = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  const dataFormattata = now.toLocaleDateString('it-IT');

  const nomeOperatore = localStorage.getItem('milella_user_nome') || localStorage.getItem('milella_last_authenticated_user') || 'Operatore OSS / Caregiver';

  if (!t.fattoOggi) {
    // Controllo se l'orario della terapia è nel futuro
    const checkOrario = verificaStatoOrarioFarmaco(t.ora);
    if (!checkOrario.consentito) {
      const oreManc = Math.floor(checkOrario.minutiMancanti / 60);
      const minManc = checkOrario.minutiMancanti % 60;
      const attesaStr = oreManc > 0 ? `${oreManc}h e ${minManc} min` : `${minManc} minuti`;

      // Dialogo di Allerta Anticipo: permette all'operatore di confermare la somministrazione
      const anticipoForzato = await customConfirm(
        '⏰ Somministrazione Anticipata',
        `"${t.farmaco}" è programmato per le ore ${t.ora} (mancano circa ${attesaStr}).\n\nConfermi di aver somministrato la terapia adesso?`,
        '💊'
      );

      if (!anticipoForzato) {
        return;
      }
    }

    // Controllo se assunto con ritardo (> 15 minuti rispetto all'orario)
    const inRitardo = checkOrario.inRitardo;
    const minutiRitardo = checkOrario.minutiRitardo || 0;

    // Si somministra: SCALARE LA DOSE EFFETTIVA DALLA SCORTA (Supporta 0.5 cpr, 1 cpr, ecc.)
    t.fattoOggi = true;
    delete t.saltatoOggi;
    delete t.motivoSalto;

    var quantitaDoseScarico = 1;
    var infoDoseDettaglio = '1 compressa';

    if (t.cadenzaTipo === 'alternata_mezza_intera') {
      var doseAlt = getDoseOdiernaAlternata(t);
      quantitaDoseScarico = doseAlt.quantita;
      infoDoseDettaglio = doseAlt.testo;
    } else {
      quantitaDoseScarico = parseFloat(t.quantitaQuota) || calcolaConsumoGiornalieroFarmaco(t) || 1;
      infoDoseDettaglio = quantitaDoseScarico === 0.5 ? '½ compressa (0,5 cpr)' : (quantitaDoseScarico + ' cpr');
    }

    if (t.scorta > 0) {
      t.scorta = Math.max(0, Math.round((t.scorta - quantitaDoseScarico) * 100) / 100);
    }
    t.ultimaDoseSomministrata = quantitaDoseScarico;

    // Registra nel diario OSS con dettagli tracciabili
    let tipoLog = 'farmaco';
    let dettaglioLog = `Dose registrata alle ore ${oraFormattata} (Orario previsto: ${t.ora}). Rimanenza scorta: ${t.scorta} cpr.`;

    if (inRitardo) {
      tipoLog = 'farmaco_ritardo';
      const rOre = Math.floor(minutiRitardo / 60);
      const rMin = minutiRitardo % 60;
      const ritardoStr = rOre > 0 ? `${rOre} ore e ${rMin} min` : `${rMin} minuti`;
      dettaglioLog = `⚠️ SOMMINISTRATO CON RITARDO DI ${ritardoStr}! Orario previsto: ${t.ora} - Orario effettivo assunzione: ${oraFormattata}. Rimanenza scorta: ${t.scorta} cpr.`;
    }

    const logEntry = {
      id: 'log_' + Date.now(),
      tipo: tipoLog,
      timestamp: now.toISOString(),
      farmacoId: t.id,
      farmaco: t.farmaco,
      dosaggio: t.dosaggio,
      orarioPrevisto: t.ora,
      orarioReale: oraFormattata,
      minutiRitardo: minutiRitardo,
      azione: 'somministrazione',
      dettaglio: dettaglioLog,
      operatore: nomeOperatore
    };
    p.registrazioni.push(logEntry);

    if (inRitardo) {
      showToast(`⚠️ Terapia registrata con ${minutiRitardo} min di ritardo! Tracciata nello storico.`, 'warning');
    } else {
      showToast(`✓ Somministrato "${t.farmaco}" alle ore ${oraFormattata} da ${nomeOperatore}`);
    }

  } else {
    // Si annulla per errore o modifica con DIALOG ELEGANTE
    const confermato = await customConfirm(
      'Annullare Somministrazione?',
      `Vuoi annullare l'assunzione di "${t.farmaco}" e ripristinare 1 compressa nella scorta? Verrà tenuta traccia della modifica nello storico.`,
      '💊'
    );
    if (confermato) {
      t.fattoOggi = false;
      delete t.saltatoOggi;
      delete t.motivoSalto;
      var qtaRipristino = t.ultimaDoseSomministrata || parseFloat(t.quantitaQuota) || 1;
      t.scorta = Math.round((t.scorta + qtaRipristino) * 100) / 100;

      // Registra l'annullamento per tracciabilità
      p.registrazioni.push({
        id: 'log_' + Date.now(),
        tipo: 'farmaco_annullato',
        timestamp: now.toISOString(),
        farmacoId: t.id,
        farmaco: t.farmaco,
        dosaggio: t.dosaggio,
        azione: 'annullamento',
        dettaglio: `Somministrazione annullata alle ore ${oraFormattata}. 1 compressa riaccreditata in scorta (${t.scorta} cpr).`,
        operatore: nomeOperatore
      });

      showToast(`Somministrazione annullata alle ${oraFormattata}: 1 compressa ripristinata.`);
    }
  }

  saveDb();
}

// APRE IL MODAL PER REGISTRARE UNA MANCANZA / TERAPIA SALTATA (DOSE NON ASSUNTA)
function apriModalSaltaFarmaco(farmacoId) {
  const p = getActivePaziente();
  if (!p) return;
  const t = p.terapie.find(item => item.id === farmacoId);
  if (!t) return;

  document.getElementById('salta-farmaco-id').value = farmacoId;
  document.getElementById('salta-farmaco-titolo').textContent = `Mancata Assunzione: ${t.farmaco}`;
  document.getElementById('salta-farmaco-sottotitolo').textContent = `Dose prevista alle ore ${t.ora} (${t.dosaggio})`;
  document.getElementById('salta-farmaco-note').value = '';
  openModal('modal-salta-farmaco');
}

// CONFERMA E ARCHIVIAZIONE NELLO STORICO DELLA MANCANZA TERAPIA
function confermaRegistrazioneFarmacoSaltato(e) {
  e.preventDefault();
  const p = getActivePaziente();
  if (!p) return;

  const farmacoId = parseInt(document.getElementById('salta-farmaco-id').value);
  const t = p.terapie.find(item => item.id === farmacoId);
  if (!t) return;

  const motivo = document.getElementById('salta-farmaco-motivo').value;
  const note = document.getElementById('salta-farmaco-note').value.trim();
  const operatore = document.getElementById('salta-farmaco-operatore').value.trim() || 'Operatore OSS / Caregiver';

  const now = new Date();
  const oraFormattata = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  // Segna sul farmaco per la giornata odierna
  t.fattoOggi = false;
  t.saltatoOggi = true;
  t.motivoSalto = motivo;

  const logEntry = {
    id: 'log_' + Date.now(),
    tipo: 'farmaco_saltato',
    timestamp: now.toISOString(),
    farmacoId: t.id,
    farmaco: t.farmaco,
    dosaggio: t.dosaggio,
    orarioPrevisto: t.ora,
    motivo: motivo,
    note: note,
    azione: 'omissione_clinica',
    dettaglio: `❌ TERAPIA NON ASSUNTA / SALTATA. Orario previsto: ${t.ora}. Motivazione: ${motivo}${note ? ' - Note: ' + note : ''}. (Scorta inalterata: ${t.scorta} cpr)`,
    operatore: operatore
  };

  p.registrazioni.push(logEntry);
  closeModal('modal-salta-farmaco');
  saveDb();
  showToast(`❌ Mancanza registrata per "${t.farmaco}": archiviata nello storico!`, 'warning');
}

// MOSTRA AUDIT FARMACO (CRONOLOGIA COMPLETA E TRACCIABILITÀ DEI CONTROLLI)
function mostraAuditFarmaco(farmacoId) {
  const p = getActivePaziente();
  if (!p) return;
  const t = p.terapie.find(item => item.id === farmacoId);
  if (!t) return;

  // Popola Header Modal
  document.getElementById('audit-farmaco-titolo').innerHTML = `<span>💊</span> <span>${t.farmaco}</span>`;
  document.getElementById('audit-farmaco-sottotitolo').textContent = `Fascia: ${t.fascia} (Orario abituale: ${t.ora}) • Dosaggio: ${t.dosaggio}`;

  // Popola Box Info
  const infoBox = document.getElementById('audit-farmaco-info-box');
  const badgeScorta = t.scorta <= 5 ? '#fee2e2; color:#b91c1c;' : (t.scorta <= 10 ? '#fef3c7; color:#b45309;' : '#ecfdf5; color:#047857;');
  const dataRitiroStr = t.ultimoRitiro 
    ? new Date(t.ultimoRitiro).toLocaleDateString('it-IT') + ' ore ' + new Date(t.ultimoRitiro).toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'})
    : 'Iniziale (Prescrizione)';

  infoBox.innerHTML = `
    <div>
      <div style="font-size:12px; color:#475569;">Stato Somministrazione:</div>
      <div style="font-size:14px; font-weight:800; color:${t.fattoOggi ? '#10b981' : '#f59e0b'};">
        ${t.fattoOggi ? '✅ Somministrato oggi' : '⚪ In attesa di somministrazione'}
      </div>
      <div style="font-size:11px; color:#64748b; margin-top:4px;">
        📦 Confezione: <b>${t.cprPerScatola || 28} compresse/scatola</b>
      </div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:12px; color:#475569;">Scorta Rimanente (Disponibile):</div>
      <div style="display:flex; align-items:center; justify-content:flex-end; gap:6px; margin-top:2px;">
        <span class="badge ${badgeScorta}" style="font-size:13px; font-weight:800; padding:4px 12px; border-radius:20px;">
          📦 ${t.scorta} compresse (~${t.scorta} gg)
        </span>
        <button type="button" onclick="impostaScortaManuale(${t.id})" title="Rettifica numero compresse scorta esatta" style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:3px 7px; font-size:11px; cursor:pointer;">✏️ Correggi</button>
      </div>
      <div style="font-size:11px; color:#0369a1; margin-top:4px;">
        🏥 Ultimo Ritiro: <b>${dataRitiroStr}</b> (${t.farmacia || p.farmaciaDiRiferimento || 'Farmacia MACARIO'})
      </div>
      <div style="font-size:11px; color:#b45309; font-weight:700; margin-top:3px;">
        ⏳ Data Presunta Esaurimento: <b>${(() => {
          if (!t.scorta || t.scorta <= 0) return 'Esaurito';
          const dt = new Date();
          dt.setDate(dt.getDate() + t.scorta);
          return dt.toLocaleDateString('it-IT');
        })()}</b>
      </div>
    </div>
  `;

  // Filtra registrazioni legate a questo farmaco (per nome o farmacoId)
  const cronologia = (p.registrazioni || []).filter(r => {
    if (r.farmacoId && r.farmacoId === t.id) return true;
    if (r.farmaco && (r.farmaco === t.farmaco || t.farmaco.toLowerCase().includes(r.farmaco.toLowerCase()) || r.farmaco.toLowerCase().includes(t.farmaco.toLowerCase()))) return true;
    if (r.desc && r.desc.includes(t.farmaco)) return true;
    return false;
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const counter = document.getElementById('audit-farmaco-counter');
  counter.textContent = `${cronologia.length} registrazioni`;

  const timeline = document.getElementById('audit-farmaco-timeline');

  if (cronologia.length === 0) {
    timeline.innerHTML = `
      <div style="padding: 24px; text-align: center; color: #94a3b8; background:#f8fafc; border-radius:12px; border:1px dashed #cbd5e1;">
        <div style="font-size:24px; margin-bottom:6px;">🕒</div>
        Nessuna variazione o somministrazione registrata finora per questo farmaco.<br>
        <small style="color:#64748b;">Ogni volta che viene dato o modificato il farmaco, comparirà qui la data e l'ora esatta.</small>
      </div>
    `;
  } else {
    timeline.innerHTML = cronologia.map(item => {
      const d = new Date(item.timestamp);
      const dataStr = d.toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
      const oraStr = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      let dotClass = 'blue';
      let icon = 'ℹ️';
      let titoloAzione = 'Controllo Farmaco';
      let testoDettaglio = item.dettaglio || item.desc || '';

      if (item.tipo === 'farmaco' || item.azione === 'somministrazione') {
        dotClass = 'green';
        icon = '✅';
        titoloAzione = 'Somministrazione Eseguita';
        if (!testoDettaglio) testoDettaglio = `Dose di ${item.dosaggio || t.dosaggio} somministrata al paziente. 1 compressa scalata dalla scorta.`;
      } else if (item.tipo === 'farmaco_ritardo') {
        dotClass = 'red';
        icon = '⚠️';
        titoloAzione = `Somministrazione con Ritardo (${item.minutiRitardo || ''} min)`;
        if (!testoDettaglio) testoDettaglio = `Assunzione eseguita alle ${item.orarioReale || oraStr} invece delle ore ${item.orarioPrevisto || t.ora}.`;
      } else if (item.tipo === 'farmaco_saltato' || item.azione === 'omissione_clinica') {
        dotClass = 'red';
        icon = '❌';
        titoloAzione = 'Mancata Assunzione / Dose Saltata';
        if (!testoDettaglio) testoDettaglio = `Dose non somministrata alle ore ${item.orarioPrevisto || t.ora}. Motivo: ${item.motivo || 'Non specificato'}.`;
      } else if (item.tipo === 'farmaco_annullato' || item.azione === 'annullamento') {
        dotClass = 'orange';
        icon = '↩️';
        titoloAzione = 'Somministrazione Annullata / Rettifica';
        if (!testoDettaglio) testoDettaglio = `Somministrazione revocata con riaccredito di 1 compressa in scorta.`;
      } else if (item.tipo === 'scorta') {
        dotClass = 'blue';
        icon = '📦';
        titoloAzione = 'Rifornimento Farmacia';
        if (!testoDettaglio) testoDettaglio = item.desc;
      }

      return `
        <div class="audit-timeline-item" id="audit-item-${item.id}">
          <div class="audit-timeline-dot ${dotClass}">${icon}</div>
          <div class="audit-timeline-content">
            <div class="audit-timeline-header">
              <span class="audit-time">📅 ${dataStr} alle <b>${oraStr}</b></span>
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="audit-operator">👤 ${item.operatore || 'Operatore OSS'}</span>
                <button type="button" onclick="eliminaAuditSingolo('${item.id}', ${t.id})" title="Rimuovi voce di prova" style="background:transparent; border:none; color:#94a3b8; cursor:pointer; font-size:12px; padding:2px 4px; border-radius:4px; transition:color 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#94a3b8'">🗑️</button>
              </div>
            </div>
            <div style="font-weight:700; font-size:13px; color:#0f172a; margin-bottom:4px;">${titoloAzione}</div>
            <div class="audit-desc">${testoDettaglio}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Memorizza l'id farmaco corrente sul modal per eventuali pulizie
  document.getElementById('modal-audit-farmaco').setAttribute('data-farmaco-id', farmacoId);
  openModal('modal-audit-farmaco');
}

// CANCELLAZIONE DISCRETA SINGOLO EVENTO DI PROVA PROTETTA DA PUK
async function eliminaAuditSingolo(logId, farmacoId) {
  const p = getActivePaziente();
  if (!p) return;

  const autorizzato = await chiediPukSicurezza();
  if (!autorizzato) return;

  p.registrazioni = (p.registrazioni || []).filter(r => r.id !== logId);
  saveDb();
  showToast('Voce di test rimossa con successo.');
  mostraAuditFarmaco(farmacoId);
}

// CANCELLAZIONE COMPLETA TEST / SIMULAZIONE PER QUESTO FARMACO PROTETTA DA PUK
async function azzeraCronologiaTestFarmaco() {
  const modal = document.getElementById('modal-audit-farmaco');
  const farmacoId = parseInt(modal.getAttribute('data-farmaco-id'));
  const p = getActivePaziente();
  if (!p || !farmacoId) return;
  const t = p.terapie.find(item => item.id === farmacoId);

  // 1. Richiesta Codice PUK Segreto
  const autorizzato = await chiediPukSicurezza();
  if (!autorizzato) return;

  // 2. Conferma finale
  const ok = await customConfirm(
    'Azzera Prove di Simulazione',
    `PUK valido. Vuoi cancellare tutte le registrazioni di test per "${t ? t.farmaco : 'questo farmaco'}" e ripartire da zero?`,
    '🧹'
  );

  if (ok) {
    p.registrazioni = (p.registrazioni || []).filter(r => {
      if (r.farmacoId && r.farmacoId === farmacoId) return false;
      if (t && r.farmaco && (r.farmaco === t.farmaco || t.farmaco.toLowerCase().includes(r.farmaco.toLowerCase()))) return false;
      return true;
    });

    // Ripristina anche la scorta del farmaco alla singola scatola iniziale (es. 28 cpr)
    if (t) {
      t.scorta = t.cprPerScatola || 28;
      t.fattoOggi = false;
      delete t.ultimoRitiro;
    }

    saveDb();
    showToast(`Test azzerati: scorta di "${t ? t.farmaco : 'farmaco'}" reimpostata a 1 scatola (${t ? t.scorta : 28} cpr).`);
    mostraAuditFarmaco(farmacoId);
  }
}

// MODAL ELEGANTE PER INSERIRE LA SCORTA (ZERO PROMPT DEL BROWSER)
function chiediScortaManualeElegante(nomeFarmaco, scortaAttuale) {
  return new Promise((resolve) => {
    const modal = document.getElementById('modal-rettifica-scorta');
    const desc = document.getElementById('rettifica-farmaco-desc');
    const input = document.getElementById('rettifica-input-cpr');
    const btnConfirm = document.getElementById('rettifica-btn-confirm');
    const btnCancel = document.getElementById('rettifica-btn-cancel');

    desc.innerHTML = `Inserisci il numero esatto di compresse attualmente presenti a casa per <b>"${nomeFarmaco}"</b>:`;
    input.value = scortaAttuale;
    modal.classList.add('active');
    setTimeout(() => {
      input.focus();
      input.select();
    }, 150);

    const cleanup = () => {
      modal.classList.remove('active');
      btnConfirm.removeEventListener('click', onConfirm);
      btnCancel.removeEventListener('click', onCancel);
      input.removeEventListener('keydown', onKey);
    };

    const onConfirm = () => {
      const val = parseInt(input.value);
      cleanup();
      resolve(isNaN(val) ? null : val);
    };

    const onCancel = () => {
      cleanup();
      resolve(null);
    };

    const onKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };

    btnConfirm.addEventListener('click', onConfirm);
    btnCancel.addEventListener('click', onCancel);
    input.addEventListener('keydown', onKey);
  });
}

// RETTIFICA RAPIDA O RESET MANUALE COMPRESSE SCORTA
async function impostaScortaManuale(farmacoId) {
  const p = getActivePaziente();
  if (!p) return;
  const t = p.terapie.find(item => item.id === farmacoId);
  if (!t) return;

  const autorizzato = await chiediPukSicurezza();
  if (!autorizzato) return;

  const nuovaScorta = await chiediScortaManualeElegante(t.farmaco, t.scorta);
  if (nuovaScorta === null || nuovaScorta < 0) return;

  t.scorta = nuovaScorta;
  saveDb();
  showToast(`Scorta di "${t.farmaco}" aggiornata a ${nuovaScorta} compresse.`);
  mostraAuditFarmaco(farmacoId);
}

// CARICO NUOVE SCATOLE RITIRATE DALLA FARMACIA
function popolaSelectRicarica() {
  const select = document.getElementById('ricarica-farmaco-select');
  if (!select) return;
  const p = getActivePaziente();
  if (!p) return;

  select.innerHTML = (p.terapie || []).map(t => `
    <option value="${t.id}">${t.farmaco} (Scorta attuale: ${t.scorta} cpr - Scatola da ${t.cprPerScatola || 28} cpr)</option>
  `).join('');
}

function apriRicaricaScorta(farmacoId) {
  popolaSelectRicarica();
  if (farmacoId) {
    document.getElementById('ricarica-farmaco-select').value = farmacoId;
  }
  openModal('modal-ricarica-scorta');
}

// CARICO AUTOMATICO ISTANTANEO DI 1 SCATOLA INTERA (1-CLICK)
async function caricaScatolaRapida(farmacoId) {
  const p = getActivePaziente();
  if (!p) return;
  const t = p.terapie.find(item => item.id === farmacoId);
  if (!t) return;

  const cprDaAggiungere = t.cprPerScatola || 28;
  const ok = await customConfirm(
    'Conferma Ritiro Scatola Farmacia',
    `Vuoi caricare 1 nuova scatola di "${t.farmaco}" (+${cprDaAggiungere} compresse) ritirata oggi dalla farmacia?`,
    '📦'
  );

  if (ok) {
    t.scorta += cprDaAggiungere;
    const now = new Date();
    t.ultimoRitiro = now.toISOString();

    p.registrazioni.push({
      id: 'log_' + Date.now(),
      tipo: 'scorta',
      farmacoId: t.id,
      farmaco: t.farmaco,
      azione: 'carico_farmacia',
      numScatole: 1,
      cprAggiunte: cprDaAggiungere,
      timestamp: now.toISOString(),
      desc: `Carico Farmacia: Ritiro di 1 scatola di ${t.farmaco} (+${cprDaAggiungere} cpr). Nuova scorta: ${t.scorta} cpr.`,
      operatore: 'Operatore OSS / Famiglia'
    });

    saveDb();
    showToast(`Caricata 1 scatola di "${t.farmaco}" (+${cprDaAggiungere} cpr). Nuova scorta: ${t.scorta} compresse!`);
  }
}

function cambiaModalitaCarico(modo) {
  const boxScatole = document.getElementById('box-carico-scatole');
  const boxSfuse = document.getElementById('box-carico-sfuse');
  if (modo === 'scatole') {
    boxScatole.style.display = 'block';
    boxSfuse.style.display = 'none';
  } else {
    boxScatole.style.display = 'none';
    boxSfuse.style.display = 'block';
    document.getElementById('ricarica-num-sfuse').focus();
  }
}

function aggiornaInfoModalCarico() {
  const farmId = parseInt(document.getElementById('ricarica-farmaco-select').value);
  const p = getActivePaziente();
  if (!p || !farmId) return;
  const t = p.terapie.find(item => item.id === farmId);
  const help = document.getElementById('ricarica-scatole-help');
  if (t && help) {
    help.innerHTML = `Ogni scatola di <b>${t.farmaco}</b> contiene <b>${t.cprPerScatola || 28} compresse</b>. Scorta attuale a casa: <b>${t.scorta} cpr</b>.`;
  }
}

function salvaRicaricaScorta(e) {
  e.preventDefault();
  const p = getActivePaziente();
  if (!p) return;

  const farmId = parseInt(document.getElementById('ricarica-farmaco-select').value);
  const t = p.terapie.find(item => item.id === farmId);
  if (!t) return;

  const modalita = document.querySelector('input[name="modalita_carico"]:checked').value;
  let cprAggiunte = 0;
  let descEvento = '';

  if (modalita === 'scatole') {
    const numScatole = parseInt(document.getElementById('ricarica-num-scatole').value) || 1;
    cprAggiunte = (t.cprPerScatola || 28) * numScatole;
    descEvento = `Carico Farmacia: Ritiro di ${numScatole} scatola/e di ${t.farmaco} (+${cprAggiunte} compresse).`;
  } else {
    cprAggiunte = parseInt(document.getElementById('ricarica-num-sfuse').value) || 0;
    if (cprAggiunte <= 0) {
      showToast('Inserisci un numero valido di capsule sfuse.', 'warning');
      return;
    }
    descEvento = `Inventario Domiciliare: Aggiunte ${cprAggiunte} capsule/compresse sfuse trovate a casa per ${t.farmaco}.`;
  }

  t.scorta += cprAggiunte;
  const now = new Date();
  t.ultimoRitiro = now.toISOString();

  // Registra nel diario
  p.registrazioni.push({
    id: 'log_' + Date.now(),
    tipo: 'scorta',
    farmacoId: t.id,
    farmaco: t.farmaco,
    azione: modalita === 'scatole' ? 'carico_farmacia' : 'carico_sfuse',
    cprAggiunte: cprAggiunte,
    timestamp: now.toISOString(),
    desc: `${descEvento} Nuova scorta totale: ${t.scorta} compresse.`,
    operatore: 'Operatore OSS / Famiglia'
  });

  closeModal('modal-ricarica-scorta');
  // Reset campi
  document.getElementById('ricarica-num-scatole').value = 1;
  document.getElementById('ricarica-num-sfuse').value = '';
  saveDb();
  showToast(`Aggiunte +${cprAggiunte} compresse a "${t.farmaco}". Scorta totale: ${t.scorta} cpr!`);
}

// ==========================================================================
// MODULO RICHIESTA RICETTE FARMACI AL MEDICO (WHATSAPP, EMAIL O ENTRAMBI)
// ==========================================================================
function apriRichiestaRicetteMedico() {
  const p = getActivePaziente();
  if (!p) return;

  // Mostra nome medico e farmacia
  const medicoBadge = document.getElementById('richiesta-medico-nome-badge');
  if (medicoBadge) {
    medicoBadge.textContent = p.medicoNome || p.medico || 'Dott. di Famiglia';
  }

  // Genera lista checkbox farmaci
  const container = document.getElementById('richiesta-farmaci-checkboxes');
  if (container) {
    container.innerHTML = (p.terapie || []).map(t => {
      const giorni = t.scorta > 0 ? t.scorta : 0;
      const sogliaAlert = Math.min(30, Math.max(1, parseInt(t.giorniAlert) || 7));
      const isUrgent = giorni <= sogliaAlert;
      return `
        <label style="display:flex; align-items:center; justify-content:space-between; padding:6px 4px; border-bottom:1px solid #f1f5f9; cursor:pointer; font-size:13px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <input type="checkbox" class="chk-richiesta-farmaco" value="${t.id}" ${isUrgent ? 'checked' : ''} onchange="aggiornaAnteprimaTestoRichiesta()" style="width:16px; height:16px;">
            <span style="font-weight:700; color:#0f172a;">${t.farmaco}</span>
            <small style="color:#64748b;">(${t.dosaggio})</small>
          </div>
          <div>
            <span class="badge ${giorni <= 5 ? 'badge-danger' : (giorni <= 12 ? 'badge-warning' : 'badge-primary')}" style="font-size:10px;">
              ${t.scorta} cpr (~${giorni} gg)
            </span>
          </div>
        </label>
      `;
    }).join('') || '<div style="color:#94a3b8; font-size:12px;">Nessun farmaco presente in terapia.</div>';
  }

  aggiornaAnteprimaTestoRichiesta();
  openModal('modal-richiesta-medico');
}

function selezionaTuttiFarmaciRichiesta(stato) {
  document.querySelectorAll('.chk-richiesta-farmaco').forEach(chk => chk.checked = stato);
  aggiornaAnteprimaTestoRichiesta();
}

function selezionaSoloInScadenzaRichiesta() {
  const p = getActivePaziente();
  if (!p) return;
  document.querySelectorAll('.chk-richiesta-farmaco').forEach(chk => {
    const t = p.terapie.find(item => item.id === parseInt(chk.value));
    if (t) {
      chk.checked = (t.scorta <= 12);
    }
  });
  aggiornaAnteprimaTestoRichiesta();
}

function generaTestoRichiesta() {
  const p = getActivePaziente();
  if (!p) return '';

  const checkedIds = Array.from(document.querySelectorAll('.chk-richiesta-farmaco:checked')).map(c => parseInt(c.value));
  const farmaciSelezionati = (p.terapie || []).filter(t => checkedIds.includes(t.id));
  const noteExtra = document.getElementById('richiesta-note-extra') ? document.getElementById('richiesta-note-extra').value.trim() : '';

  const medicoNome = p.medicoNome || p.medico || 'Dottore';
  const farmaciaNome = p.farmaciaDiRiferimento || 'Farmacia MACARIO';
  const oggi = new Date().toLocaleDateString('it-IT');

  let elenco = '';
  if (farmaciSelezionati.length === 0) {
    elenco = '(Nessun farmaco selezionato)';
  } else {
    elenco = farmaciSelezionati.map(t => {
      const dt = new Date();
      const scorta = typeof t.scorta !== 'undefined' ? t.scorta : 0;
      const ggAutonomia = calcolaGiorniAutonomiaFarmaco(t);
      dt.setDate(dt.getDate() + (ggAutonomia > 0 ? ggAutonomia : 0));
      const fineScortaStr = ggAutonomia > 0 ? dt.toLocaleDateString('it-IT') : 'ESAURITO OGGI';
      const soglia = Math.min(30, Math.max(1, parseInt(t.giorniAlert) || 7));
      const urgenza = scorta <= 0 ? '🔴 URGENTE (Scorta a zero)' : (ggAutonomia <= soglia ? `⚠️ IN SCADENZA (Autonomia: ${ggAutonomia} giorni)` : `Autonomia: ${ggAutonomia} gg`);
      const schemaNote = t.cadenzaTipo === 'alternata_mezza_intera' ? ' [Posologia: ½ cpr / 1 cpr a giorni alterni]' : '';
      return `• ${t.farmaco} (Dosaggio: ${t.dosaggio}${schemaNote}) -> ${urgenza} [Rimanenza: ${scorta} cpr - Fine stimata: ${fineScortaStr}]`;
    }).join('\n');
  }

  let testo = `Gentile ${medicoNome},\n\n`;
  testo += `Le invio la presente richiesta di rinnovo ricette dematerializzate / prescrizioni per il paziente:\n`;
  testo += `👤 PAZIENTE: ${p.nome} (nato il ${p.dataNascita ? new Date(p.dataNascita).toLocaleDateString('it-IT') : '18/04/1935'})\n`;
  testo += `📍 Indirizzo: ${p.indirizzo || 'Via Giovanni Modugno, 25 - Bari'}\n`;
  testo += `☎️ Contatti: Tel. ${p.telefonoFisso || '080 561 57 14'} | Cell. ${p.cellulare || '338 306 69 05'}\n`;
  testo += `Caregiver / Familiare: ${p.moglieNome || 'Mazzicone Angela'} (Cell. ${p.moglieCellulare || '338 944 96 10'})\n\n`;
  testo += `FARMACI IN ESAURIMENTO DA PRESCRIVERE:\n${elenco}\n\n`;
  testo += `🏥 FARMACIA DI RIFERIMENTO PER IL RITIRO:\n${farmaciaNome}\n\n`;
  
  if (noteExtra) {
    testo += `NOTE E INDICAZIONI AGGIUNTIVE:\n${noteExtra}\n\n`;
  }

  testo += `La ringraziamo cordialmente per la consueta disponibilità e collaborazione.\n`;
  testo += `Data richiesta: ${oggi} - Assistenza Domiciliare (CareAssist Pro)`;

  return testo;
}

function aggiornaAnteprimaTestoRichiesta() {
  const anteprima = document.getElementById('richiesta-anteprima-testo');
  if (anteprima) {
    anteprima.value = generaTestoRichiesta();
  }
}

function copiaTestoRichiesta() {
  const testo = generaTestoRichiesta();
  if (!testo) return;
  navigator.clipboard.writeText(testo).then(() => {
    showToast('Testo della richiesta copiato negli appunti! 📋');
  }).catch(() => {
    showToast('Seleziona e copia il testo manualmente.');
  });
}

function inviaRichiestaVia(canale) {
  const p = getActivePaziente();
  if (!p) return;

  const testo = generaTestoRichiesta();
  const checked = document.querySelectorAll('.chk-richiesta-farmaco:checked').length;
  if (checked === 0) {
    showToast('Seleziona almeno un farmaco da richiedere!', 'warning');
    return;
  }

  // Prepara destinatari
  const telMedico = (p.medicoTel || p.telMedico || '').replace(/[^0-9]/g, '');
  const emailMedico = p.medicoEmail || '';
  const oggettoEmail = encodeURIComponent(`Richiesta Rinnovo Prescrizioni Farmaci - ${p.nome}`);
  const corpoUrl = encodeURIComponent(testo);

  if (canale === 'whatsapp' || canale === 'entrambi') {
    let whatsappUrl = '';
    if (telMedico) {
      whatsappUrl = `https://api.whatsapp.com/send?phone=39${telMedico}&text=${corpoUrl}`;
    } else {
      whatsappUrl = `https://api.whatsapp.com/send?text=${corpoUrl}`;
    }
    window.open(whatsappUrl, '_blank');
  }

  if (canale === 'email' || canale === 'entrambi') {
    const mailtoUrl = `mailto:${emailMedico}?subject=${oggettoEmail}&body=${corpoUrl}`;
    // Apri client di posta
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, canale === 'entrambi' ? 600 : 0);
  }

  // Registra l'evento di richiesta nel diario
  p.registrazioni.push({
    id: 'log_' + Date.now(),
    tipo: 'richiesta_medico',
    timestamp: new Date().toISOString(),
    desc: `Richiesta Prescrizioni Farmaci inoltrata al Medico Curante via ${canale.toUpperCase()} (${checked} farmaci richiesti). Farmacia: ${p.farmaciaDiRiferimento || 'Farmacia MACARIO'}.`,
    operatore: 'Operatore OSS / Assistenza'
  });

  saveDb();
  showToast(`Richiesta farmaci inviata con successo via ${canale.toUpperCase()}! 🚀`);
  closeModal('modal-richiesta-medico');
}

async function eliminaTerapia(id) {
  const p = getActivePaziente();
  if (!p) return;
  const ok = await customConfirm(
    'Elimina Farmaco',
    'Vuoi eliminare questo farmaco dal piano terapeutico?',
    '🗑️'
  );
  if (ok) {
    p.terapie = p.terapie.filter(t => t.id !== id);
    saveDb();
    showToast('Farmaco rimosso dalla terapia.');
  }
}

// Rendering Registro Attività Recenti (Diario OSS)
function renderDiario() {
  const p = getActivePaziente();
  const container = document.getElementById('diario-table-body');
  const fullContainer = document.getElementById('diario-full-table-body');
  if (!container || !p) return;

  const sorted = [...(p.registrazioni || [])].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (!sorted.length) {
    const emptyHtml = '<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding:20px;">Nessuna registrazione recente per questo paziente.</td></tr>';
    container.innerHTML = emptyHtml;
    if (fullContainer) fullContainer.innerHTML = emptyHtml;
    return;
  }

  const renderRows = (list) => list.map(r => {
    let icon = '📝';
    let badge = 'badge-primary';
    let desc = '';

    if (r.tipo === 'alvo') {
      icon = '💩';
      badge = 'badge-warning';
      desc = `Evacuazione: <b>${r.consistenza}</b> ${r.clisma ? '(con clisma/lassativo)' : ''} - Note: ${r.note || 'Regolare'}`;
    } else if (r.tipo === 'parametri') {
      icon = '❤️';
      badge = 'badge-success';
      desc = `PA: <b>${r.pa_max}/${r.pa_min} mmHg</b> | FC: <b>${r.fc} bpm</b> | SpO2: <b>${r.spo2}%</b> | Temp: <b>${r.temp}°C</b>`;
      if (r.glicemia) {
        const gVal = parseFloat(r.glicemia);
        let gBadge = '#1e40af';
        let gAlert = '';
        if (gVal < 70) { gBadge = '#dc2626'; gAlert = ' ⚠️ IPOGLICEMIA!'; }
        else if (gVal > 200) { gBadge = '#ea580c'; gAlert = ' ⚠️ IPERGLICEMIA!'; }
        desc += ` | Glicemia: <b style="color:${gBadge};">${r.glicemia} mg/dl${gAlert}</b>`;
      }
      if (r.temp >= 37.5 || (r.glicemia && (parseFloat(r.glicemia) < 70 || parseFloat(r.glicemia) > 200))) badge = 'badge-danger';
    } else if (r.tipo === 'postura') {
      icon = '🔄';
      badge = 'badge-primary';
      desc = `Cambio Postura: <b>${r.posizione}</b> | Cute: <b>${r.cute || 'Integra'}</b>`;
    } else if (r.tipo === 'idratazione') {
      icon = '💧';
      badge = 'badge-primary';
      desc = `Idratazione: <b>+${r.ml} ml</b> (${r.bevanda}) &rarr; Totale oggi: <b>${r.totaleGiorno || ''} ml</b>`;
    } else if (r.tipo === 'diuresi') {
      icon = '🧪';
      badge = 'badge-warning';
      desc = `Diuresi [${r.raccolta}]: <b>${r.volume}</b> | Aspetto: <b>${r.aspetto}</b> ${r.note ? `| Note: <i>${r.note}</i>` : ''}`;
    } else if (r.tipo === 'glicemia') {
      icon = '🩸';
      const valG = parseFloat(r.valore) || 0;
      badge = valG < 70 ? 'badge-danger' : (valG > 200 ? 'badge-warning' : 'badge-primary');
      desc = `Glicemia: <b>${r.valore} mg/dl</b> [${r.momento}] ${r.insulina ? `| Insulina: <b>${r.insulina} UI</b>` : ''} ${r.note ? `| Note: <i>${r.note}</i>` : ''}`;
    } else if (r.tipo === 'pasto') {
      icon = '🍲';
      badge = 'badge-success';
      desc = `Nutrizione [${r.pasto}]: Assunto <b>${r.quantita}</b> | Dettaglio: <i>${r.alimenti}</i>`;
    } else if (r.tipo === 'braden') {
      icon = '🎯';
      badge = 'badge-primary';
      desc = `Valutazione Scala di Braden: Punteggio <b>${r.score}/23</b> &rarr; <b>${r.fascia}</b>`;
    } else if (r.tipo === 'caduta') {
      icon = '⚠️';
      badge = 'badge-danger';
      desc = `<b>INCIDENT CADUTA:</b> ${r.dinamica} | Coscienza: <b>${r.coscienza}</b> | Esito: <b>${r.esito}</b> | Azioni: <i>${r.azioni}</i>`;
    } else if (r.tipo === 'consegna') {
      icon = '📋';
      badge = 'badge-success';
      desc = `<b>Consegna di Turno Generata</b> | Condivisa per continuità assistenziale`;
    } else if (r.tipo === 'farmaco') {
      icon = '💊';
      badge = 'badge-success';
      desc = `Somministrato: <b>${r.farmaco}</b> (${r.dosaggio}) &rarr; <small style="color:#059669;">1 compressa scalata dalla scorta</small>`;
    } else if (r.tipo === 'farmaco_ritardo') {
      icon = '⚠️';
      badge = 'badge-danger';
      const rOre = Math.floor((r.minutiRitardo || 0) / 60);
      const rMin = (r.minutiRitardo || 0) % 60;
      const ritardoStr = rOre > 0 ? `${rOre}h ${rMin}m` : `${rMin} min`;
      desc = `<b style="color:#dc2626;">RITARDO SOMMINISTRAZIONE:</b> <b>${r.farmaco}</b> (${r.dosaggio}) &rarr; <span class="badge badge-danger" style="background:#dc2626; font-size:11px; padding:2px 7px;">+${ritardoStr} di ritardo</span> (Previsto ore <b>${r.orarioPrevisto || ''}</b> &bull; Dato alle <b>${r.orarioReale || ''}</b>)`;
    } else if (r.tipo === 'farmaco_saltato') {
      icon = '❌';
      badge = 'badge-danger';
      desc = `<b style="color:#b91c1c;">TERAPIA NON ASSUNTA / SALTATA:</b> <b>${r.farmaco}</b> (${r.dosaggio}) &rarr; Motivo: <b style="color:#991b1b;">${r.motivo || 'Non specificato'}</b> ${r.note ? `<i>(${r.note})</i>` : ''} <small style="color:#64748b;">[Previsto ore ${r.orarioPrevisto || ''} - Scorta non scalata]</small>`;
    } else if (r.tipo === 'farmaco_annullato') {
      icon = '↩️';
      badge = 'badge-warning';
      desc = `Rettifica Terapia: <b>${r.farmaco}</b> &rarr; <small style="color:#d97706;">Somministrazione annullata (+1 cpr restituita)</small>`;
    } else if (r.tipo === 'scorta') {
      icon = '📦';
      badge = 'badge-primary';
      desc = `<b>${r.desc}</b>`;
    } else if (r.tipo === 'nota_turno') {
      icon = '📝';
      badge = 'badge-success';
      desc = `<b style="color:#0369a1;">NOTA DI TURNO:</b> <i>"${r.testo || ''}"</i>`;
    }

    const d = new Date(r.timestamp);
    const dataStr = `${d.toLocaleDateString('it-IT')} ${d.toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'})}`;

    return `
      <tr>
        <td><b>${dataStr}</b></td>
        <td><span class="badge ${badge}">${icon} ${r.tipo.toUpperCase()}</span></td>
        <td>${desc}</td>
        <td><small>${r.operatore || 'Caregiver'}</small></td>
        <td><button class="btn btn-outline" style="padding:2px 6px; font-size:10px;" onclick="eliminaLog('${r.id}')">✕</button></td>
      </tr>
    `;
  }).join('');

  container.innerHTML = renderRows(sorted.slice(0, 10));
  if (fullContainer) fullContainer.innerHTML = renderRows(sorted);
}

async function eliminaLog(id) {
  const p = getActivePaziente();
  if (!p) return;
  const ok = await customConfirm(
    'Elimina Annotazione',
    'Sei sicuro di voler eliminare questa annotazione dal registro?',
    '🗑️'
  );
  if (ok) {
    p.registrazioni = p.registrazioni.filter(r => r.id !== id);
    saveDb();
    showToast('Registrazione rimossa.');
  }
}

// Rendering Visite Mediche
function renderVisite() {
  const p = getActivePaziente();
  const container = document.getElementById('visite-table-body');
  const preview = document.getElementById('visite-preview-body');
  if (!container || !p) return;

  if (!p.visite || !p.visite.length) {
    const emptyHtml = '<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding:16px;">Nessuna visita o appuntamento in programma.</td></tr>';
    container.innerHTML = emptyHtml;
    if (preview) preview.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#94a3b8;">Nessun appuntamento imminente.</td></tr>';
    return;
  }

  container.innerHTML = p.visite.map(v => `
    <tr>
      <td><b>${new Date(v.data).toLocaleDateString('it-IT')}</b> ore ${v.ora}</td>
      <td><b>${v.medico}</b></td>
      <td>${v.motivo}</td>
      <td><span class="badge ${v.fatto ? 'badge-success' : 'badge-warning'}">${v.fatto ? 'Eseguita' : 'In attesa'}</span></td>
      <td>
        <button class="btn ${v.fatto ? 'btn-outline' : 'btn-success'}" style="padding:4px 8px; font-size:11px;" onclick="toggleVisita(${v.id})">
          ${v.fatto ? 'Riapri' : '✓ Fatto'}
        </button>
        <button class="btn btn-outline" style="padding:4px 8px; font-size:11px;" onclick="eliminaVisita(${v.id})">🗑️</button>
      </td>
    </tr>
  `).join('');

  if (preview) {
    preview.innerHTML = p.visite.slice(0, 4).map(v => `
      <tr>
        <td><b>${new Date(v.data).toLocaleDateString('it-IT')}</b></td>
        <td><b>${v.medico}</b></td>
        <td>${v.motivo}</td>
        <td><span class="badge ${v.fatto ? 'badge-success' : 'badge-warning'}">${v.fatto ? 'Fatto' : 'In attesa'}</span></td>
      </tr>
    `).join('');
  }
}

function toggleVisita(id) {
  const p = getActivePaziente();
  if (!p) return;
  const v = p.visite.find(item => item.id === id);
  if (v) {
    v.fatto = !v.fatto;
    saveDb();
  }
}

async function eliminaVisita(id) {
  const p = getActivePaziente();
  if (!p) return;
  const ok = await customConfirm(
    'Elimina Appuntamento',
    'Sei sicuro di voler cancellare questo appuntamento / visita medica?',
    '📅'
  );
  if (ok) {
    p.visite = p.visite.filter(v => v.id !== id);
    saveDb();
    showToast('Appuntamento eliminato.');
  }
}

// Gestione Modali
function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');

    // Inietta o aggiorna in automatico l'indicazione chiara del paziente attivo
    const p = getActivePaziente();
    if (p && id !== 'modal-nuovo-paziente') {
      const header = el.querySelector('.modal-header');
      if (header) {
        // Cerca o crea il badge del paziente
        let badge = header.querySelector('.modal-patient-badge');
        if (!badge) {
          badge = document.createElement('div');
          badge.className = 'modal-patient-badge';
          // Se c'è un modal-title, appendi al title o inserisci subito prima del tasto chiudi
          const titleEl = header.querySelector('.modal-title');
          if (titleEl) {
            titleEl.appendChild(badge);
          } else {
            header.insertBefore(badge, header.firstChild);
          }
        }
        badge.innerHTML = `👤 Assistito: <b>${p.nome}</b>`;
        badge.title = `Stai operando sulla cartella clinica di ${p.nome}`;
      }
    }

    if (id === 'modal-nuovo-paziente') {
      renderCatalogoAusiliForm('container-catalogo-ausili-nuovo', []);
    }
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

// Salvataggi dai Form Modali
function salvaAlvo(e) {
  e.preventDefault();
  const p = getActivePaziente();
  if (!p) return;
  const entry = {
    id: 'log_' + Date.now(),
    tipo: 'alvo',
    timestamp: new Date().toISOString(),
    consistenza: document.getElementById('alvo-consistenza').value,
    clisma: document.getElementById('alvo-clisma').checked,
    note: document.getElementById('alvo-note').value,
    operatore: document.getElementById('alvo-operatore').value || 'Caregiver'
  };
  p.registrazioni.push(entry);
  closeModal('modal-alvo');
  saveDb();
}

function salvaParametri(e) {
  e.preventDefault();
  const p = getActivePaziente();
  if (!p) return;
  const entry = {
    id: 'log_' + Date.now(),
    tipo: 'parametri',
    timestamp: new Date().toISOString(),
    pa_max: document.getElementById('param-pa-max').value,
    pa_min: document.getElementById('param-pa-min').value,
    fc: document.getElementById('param-fc').value,
    spo2: document.getElementById('param-spo2').value,
    temp: document.getElementById('param-temp').value,
    glicemia: document.getElementById('param-glicemia') ? document.getElementById('param-glicemia').value.trim() : '',
    operatore: document.getElementById('param-operatore').value || 'Caregiver'
  };
  p.registrazioni.push(entry);
  closeModal('modal-parametri');
  saveDb();
}

function salvaPostura(e) {
  e.preventDefault();
  const p = getActivePaziente();
  if (!p) return;
  const entry = {
    id: 'log_' + Date.now(),
    tipo: 'postura',
    timestamp: new Date().toISOString(),
    posizione: document.getElementById('postura-pos').value,
    cute: document.getElementById('postura-cute').value,
    operatore: document.getElementById('postura-operatore').value || 'Caregiver'
  };
  p.registrazioni.push(entry);
  closeModal('modal-postura');
  saveDb();
}

// DATABASE DI RIFERIMENTO FARMACI ANZIANI & CARDIOLOGICI / NEUROLOGICI (AUTOSUGGERIMENTI)
const DB_FARMACI_COMUNI = [
  { nome: 'Cardioaspirina 100 mg', principio: 'Acido acetilsalicilico', dosaggio: '100 mg (1 cpr)', modo: 'A pranzo a stomaco pieno (Antiaggregante piastrinico / Prevenzione ictus e infarto)', cpr: 30, ora: '13:00', fascia: 'Pranzo' },
  { nome: 'Lasix 25 mg', principio: 'Furosemide', dosaggio: '25 mg (1 cpr)', modo: 'Al mattino (Diuretico dell\'ansa / Riduzione edemi e pressione)', cpr: 30, ora: '08:30', fascia: 'Mattina (Colazione)' },
  { nome: 'Pantoprazolo 20 mg', principio: 'Pantoprazolo', dosaggio: '20 mg (1 cpr)', modo: 'A digiuno 30 min prima di colazione (Gastroprotettore gastrico)', cpr: 28, ora: '07:30', fascia: 'Mattina (Digiuno)' },
  { nome: 'Pantoprazolo 40 mg', principio: 'Pantoprazolo', dosaggio: '40 mg (1 cpr)', modo: 'A DIGIUNO, 30 min prima di colazione (Protezione gastrica reflusso e ulcere)', cpr: 28, ora: '07:30', fascia: 'Mattina (Digiuno)' },
  { nome: 'Bisoprololo 1,25 mg', principio: 'Bisoprololo fumarato', dosaggio: '1,25 mg (1 cpr)', modo: 'A colazione (Beta-bloccante / Controllo frequenza cardiaca e pressione)', cpr: 28, ora: '08:30', fascia: 'Mattina (Colazione)' },
  { nome: 'Bisoprololo 2,5 mg', principio: 'Bisoprololo fumarato', dosaggio: '2,5 mg (1 cpr)', modo: 'A colazione (Beta-bloccante / Controllo battiti e ipertensione)', cpr: 28, ora: '08:30', fascia: 'Mattina (Colazione)' },
  { nome: 'Silodyx 8 mg', principio: 'Silodosina', dosaggio: '8 mg (1 capsula)', modo: 'A CENA a stomaco pieno (Controllo ipertrofia prostatica e facilitazione diuresi)', cpr: 30, ora: '20:00', fascia: 'Sera (Cena)' },
  { nome: 'Vimpat 100 mg', principio: 'Lacosamide', dosaggio: '100 mg (1 cpr)', modo: 'Dopo i pasti con acqua (Antiepilettico / Modulatore neurologico)', cpr: 56, ora: '08:30', fascia: 'Mattina (Colazione)' },
  { nome: 'Quetiapina 25 mg', principio: 'Quetiapina', dosaggio: '25 mg (1 cpr)', modo: 'Prima di dormire con acqua (Antipsicotico atipico / Regolatore umore e sonno)', cpr: 30, ora: '21:30', fascia: 'Notte (Prima di dormire)' },
  { nome: 'Tachipirina 1000 mg', principio: 'Paracetamolo', dosaggio: '1000 mg (1 cpr)', modo: 'Al bisogno per dolore o febbre > 37.5°C a stomaco pieno (Antipiretico / Antidolorifico)', cpr: 16, ora: '14:00', fascia: 'Al Bisogno' },
  { nome: 'Eliquis 5 mg', principio: 'Apixaban', dosaggio: '5 mg (1 cpr)', modo: 'Ogni 12 ore con acqua (Anticoagulante orale / Prevenzione ictus fibrillazione)', cpr: 56, ora: '08:30', fascia: 'Mattina (Colazione)' },
  { nome: 'Xarelto 20 mg', principio: 'Rivaroxaban', dosaggio: '20 mg (1 cpr)', modo: 'A cena a stomaco pieno (Anticoagulante orale / Prevenzione tromboembolica)', cpr: 28, ora: '20:00', fascia: 'Sera (Cena)' },
  { nome: 'Triatec 2,5 mg', principio: 'Ramipril', dosaggio: '2,5 mg (1 cpr)', modo: 'Al mattino a colazione (ACE-inibitore / Protezione cardiaca e pressione)', cpr: 28, ora: '08:30', fascia: 'Mattina (Colazione)' },
  { nome: 'Norvasc 5 mg', principio: 'Amlodipina', dosaggio: '5 mg (1 cpr)', modo: 'A colazione (Calcio-antagonista / Controllo pressione arteriosa)', cpr: 28, ora: '08:30', fascia: 'Mattina (Colazione)' }
];

function autoCompilaDatiFarmaco(testoInput) {
  const query = (testoInput || '').trim().toLowerCase();
  const box = document.getElementById('farm-suggerimenti-box');
  if (!box) return;

  if (query.length < 2) {
    box.innerHTML = '';
    return;
  }

  const match = DB_FARMACI_COMUNI.filter(f => f.nome.toLowerCase().includes(query) || f.principio.toLowerCase().includes(query));

  if (!match.length) {
    box.innerHTML = '';
    return;
  }

  box.innerHTML = match.slice(0, 3).map(f => `
    <button type="button" class="btn btn-outline" style="padding:2px 8px; font-size:11px; background:#eff6ff; color:#1e40af; border-color:#bfdbfe; border-radius:12px;" onclick="applicaSuggerimentoFarmaco('${f.nome.replace(/'/g, "\\'")}')">
      ✨ Suggerisci: <b>${f.nome}</b>
    </button>
  `).join('');
}

function applicaSuggerimentoFarmaco(nomeEsatto) {
  const f = DB_FARMACI_COMUNI.find(item => item.nome === nomeEsatto);
  if (!f) return;

  document.getElementById('farm-nome').value = f.nome;
  document.getElementById('farm-principio').value = f.principio;
  document.getElementById('farm-dosaggio').value = f.dosaggio;
  document.getElementById('farm-modo').value = f.modo;
  document.getElementById('farm-cpr-scatola').value = f.cpr;
  document.getElementById('farm-scorta').value = f.cpr;
  if (f.ora) document.getElementById('farm-ora').value = f.ora;
  if (f.fascia) document.getElementById('farm-fascia').value = f.fascia;

  document.getElementById('farm-suggerimenti-box').innerHTML = '';
  showToast(`Dati e descrizione clinica compilati per "${f.nome}"! ✨`);
}

function apriCercaBugiardinoWeb() {
  const nomeFarm = (document.getElementById('farm-nome').value || '').trim();
  const query = nomeFarm ? `${nomeFarm} indicazioni terapeutiche bugiardino AIFA` : 'farmaci indicazioni terapeutiche AIFA';
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.open(url, '_blank');
}


// Gestione dinamica frequenze farmaco
function aggiornaCampiFrequenzaFarmaco() {
  var tipoEl = document.getElementById('farm-frequenza-tipo');
  if (!tipoEl) return;
  var tipo = tipoEl.value;
  var grpVal = document.getElementById('group-frequenza-valore');
  var lblVal = document.getElementById('label-frequenza-valore');
  var unitVal = document.getElementById('unit-frequenza-valore');
  var inpVal = document.getElementById('farm-frequenza-valore');
  var boxSuddiv = document.getElementById('box-suddivisione-giornaliera');

  if (tipo === 'intervallo_ore') {
    if (grpVal) grpVal.style.display = 'block';
    if (lblVal) lblVal.textContent = 'Ogni quante ore:';
    if (unitVal) unitVal.textContent = 'ore';
    if (inpVal && (!inpVal.value || inpVal.value > 24)) inpVal.value = 8;
    if (boxSuddiv) boxSuddiv.style.display = 'none';
  } else if (tipo === 'intervallo_giorni') {
    if (grpVal) grpVal.style.display = 'block';
    if (lblVal) lblVal.textContent = 'Ogni quanti giorni:';
    if (unitVal) unitVal.textContent = 'giorni';
    if (inpVal && (!inpVal.value || inpVal.value < 2)) inpVal.value = 3;
    if (boxSuddiv) boxSuddiv.style.display = 'block';
  } else if (tipo === 'bisogno') {
    if (grpVal) grpVal.style.display = 'none';
    if (boxSuddiv) boxSuddiv.style.display = 'none';
  } else {
    if (grpVal) grpVal.style.display = 'none';
    if (boxSuddiv) boxSuddiv.style.display = 'block';
  }
}

function toggleDoseField(doseNum) {
  var chk = document.getElementById('farm-dose' + doseNum + '-enable');
  var inpOra = document.getElementById('farm-dose' + doseNum + '-ora');
  var inpQta = document.getElementById('farm-dose' + doseNum + '-qta');
  if (chk && inpOra && inpQta) {
    inpOra.disabled = !chk.checked;
    inpQta.disabled = !chk.checked;
  }
}


var _dosiExtraCounter = 0;

function aggiungiNuovaDoseModifica(oraPredefinita, fasciaPredefinita, quantitaPredefinita) {
  _dosiExtraCounter++;
  var idDose = 'dose_extra_' + _dosiExtraCounter;
  var container = document.getElementById('edit-farm-dosi-extra-list');
  if (!container) return;

  var currentRows = container.querySelectorAll('.form-row').length;
  var numDoseEffettiva = currentRows + 2; // la 1ª dose è in alto nel form, queste sono 2ª, 3ª, 4ª

  var oraVal = oraPredefinita || '13:30';
  var fasciaVal = fasciaPredefinita || 'Pranzo';
  var qtaVal = quantitaPredefinita || '1 cpr';

  var row = document.createElement('div');
  row.id = idDose;
  row.className = 'form-row';
  row.style.background = '#ffffff';
  row.style.border = '1.5px solid #86efac';
  row.style.borderRadius = '10px';
  row.style.padding = '10px 12px';
  row.style.marginBottom = '8px';
  row.style.alignItems = 'center';
  row.style.boxShadow = '0 2px 5px rgba(0,0,0,0.03)';

  row.innerHTML = 
    '<div style="flex:0.6; min-width:85px;">' +
      '<span style="display:inline-block; font-size:11.5px; font-weight:800; color:#166534; background:#dcfce7; padding:4px 8px; border-radius:6px; border:1px solid #bbf7d0;">' +
        '💊 ' + numDoseEffettiva + 'ª Dose' +
      '</span>' +
    '</div>' +
    '<div class="form-group" style="flex:1; margin-bottom:0;">' +
      '<label style="font-size:10.5px; font-weight:800; color:#334155; margin-bottom:2px; display:block;">⏰ Orario</label>' +
      '<input type="time" class="form-control edit-extra-ora" value="' + oraVal + '" style="font-size:13px; padding:4px 6px; font-weight:800; color:#1e3a8a; background:#f0f9ff; border-color:#bae6fd;">' +
    '</div>' +
    '<div class="form-group" style="flex:1.3; margin-bottom:0;">' +
      '<label style="font-size:10.5px; font-weight:800; color:#334155; margin-bottom:2px; display:block;">Fascia Giorno</label>' +
      '<select class="form-control edit-extra-fascia" style="font-size:12px; padding:4px 6px; font-weight:600;">' +
        '<option value="Mattina (Colazione)"' + (fasciaVal.indexOf('Colazione') >= 0 ? ' selected' : '') + '>Mattina (Colazione)</option>' +
        '<option value="Pranzo"' + (fasciaVal.indexOf('Pranzo') >= 0 ? ' selected' : '') + '>Pranzo</option>' +
        '<option value="Pomeriggio"' + (fasciaVal.indexOf('Pomeriggio') >= 0 ? ' selected' : '') + '>Pomeriggio</option>' +
        '<option value="Sera (Cena)"' + (fasciaVal.indexOf('Cena') >= 0 ? ' selected' : '') + '>Sera (Cena)</option>' +
        '<option value="Notte (Prima di dormire)"' + (fasciaVal.indexOf('Notte') >= 0 ? ' selected' : '') + '>Notte (Prima di dormire)</option>' +
      '</select>' +
    '</div>' +
    '<div class="form-group" style="flex:1; margin-bottom:0;">' +
      '<label style="font-size:10.5px; font-weight:800; color:#334155; margin-bottom:2px; display:block;">Dose / Q.tà</label>' +
      '<input type="text" class="form-control edit-extra-qta" value="' + qtaVal + '" style="font-size:12px; padding:4px 6px; font-weight:700;">' +
    '</div>' +
    '<div style="flex:0.25; text-align:center; margin-top:14px;">' +
      '<button type="button" class="btn btn-outline" style="color:#dc2626; border-color:#fca5a5; padding:5px 8px; font-size:12px; border-radius:8px;" onclick="rimuoviDoseExtraRow(\'' + idDose + '\')" title="Rimuovi dose">✕</button>' +
    '</div>';

  container.appendChild(row);
  aggiornaMessaggioDosiExtra();
}

function rimuoviDoseExtraRow(idRow) {
  var el = document.getElementById(idRow);
  if (el) el.remove();
  aggiornaMessaggioDosiExtra();
  var container = document.getElementById('edit-farm-dosi-extra-list');
  var count = container ? container.querySelectorAll('.form-row').length : 0;
  var elNumDosi = document.getElementById('edit-farm-num-dosi');
  if (elNumDosi) elNumDosi.value = count + 1;
}

function aggiornaMessaggioDosiExtra() {
  var container = document.getElementById('edit-farm-dosi-extra-list');
  var emptyMsg = document.getElementById('edit-farm-dosi-empty-msg');
  if (!container) return;
  var count = container.querySelectorAll('.form-row').length;
  if (emptyMsg) {
    emptyMsg.style.display = (count === 0) ? 'block' : 'none';
  }
}

function rimuoviDoseExtraRow(idRow) {
  var el = document.getElementById(idRow);
  if (el) el.remove();
}


// ============================================================================
// LOGICA AUTOMATICA CALCOLO DOSI MULTIPLE SECONDO PRESCRIZIONE MEDICA
// ============================================================================

// ============================================================================
// CALCOLO AVANZATO CONSUMO CLINICO, DOSI FRAZIONATE & SCHEMA ALTERNATO
// ============================================================================
function calcolaConsumoGiornalieroFarmaco(t) {
  if (!t) return 1;
  // Se al bisogno, consumo standard indicativo stimato
  if (t.cadenzaTipo === 'bisogno' || t.fascia === 'Al Bisogno' || t.ora === 'Al Bisogno') {
    return 0.5;
  }
  // Schema alternato: 1/2 cpr un giorno e 1 cpr il giorno dopo -> 1.5 cpr ogni 2 giorni = 0.75 cpr/die
  if (t.cadenzaTipo === 'alternata_mezza_intera') {
    return 0.75;
  }
  // Giorni alterni standard: 1 dose ogni 2 giorni = 0.5 dose/die
  if (t.cadenzaTipo === 'alterni') {
    var q = parseFloat(t.quantitaQuota) || 1;
    return q / 2;
  }
  // Cadenza quindicinale: 2 dosi al mese ~ 2/30 = 0.0667 cpr/die
  if (t.cadenzaTipo === 'quindicinale_15_30' || ((t.farmaco || '').toUpperCase().indexOf('DIBASE') >= 0 && (t.modo || '').indexOf('15') >= 0)) {
    var q = parseFloat(t.quantitaQuota) || 1;
    return (q * 2) / 30;
  }
  // Settimanale: 1 volta ogni 7 giorni
  if (t.cadenzaTipo === 'settimanale') {
    var q = parseFloat(t.quantitaQuota) || 1;
    return q / 7;
  }
  // Quotidiana: basata su quantitaQuota (es. 0.5 cpr, 1 cpr, 0.25 cpr)
  var quota = parseFloat(t.quantitaQuota);
  if (!isNaN(quota) && quota > 0) {
    return quota;
  }
  // Deduzione automatica da stringa dosaggio o modo
  var str = ((t.dosaggio || '') + ' ' + (t.modo || '')).toLowerCase();
  if (str.indexOf('1/2') >= 0 || str.indexOf('mezza') >= 0 || str.indexOf('0,5') >= 0 || str.indexOf('0.5') >= 0) {
    return 0.5;
  }
  if (str.indexOf('1/4') >= 0 || str.indexOf('un quarto') >= 0 || str.indexOf('0,25') >= 0 || str.indexOf('0.25') >= 0) {
    return 0.25;
  }
  if (str.indexOf('2 cpr') >= 0 || str.indexOf('2 compresse') >= 0) {
    return 2;
  }
  return 1;
}

function calcolaGiorniAutonomiaFarmaco(t) {
  if (!t || typeof t.scorta === 'undefined') return 0;
  var scorta = parseFloat(t.scorta) || 0;
  if (scorta <= 0) return 0;
  var consumoDie = calcolaConsumoGiornalieroFarmaco(t);
  if (consumoDie <= 0) consumoDie = 1;
  return Math.floor(scorta / consumoDie);
}

function getDoseOdiernaAlternata(t) {
  if (!t || t.cadenzaTipo !== 'alternata_mezza_intera') {
    return parseFloat(t.quantitaQuota) || 1;
  }
  var oggi = new Date();
  var oggiMezzanotte = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());
  var inizio = new Date(2026, 9, 1); // 1 Ottobre 2026 come riferimento
  if (t.dataInizioAlterni) {
    var pz = t.dataInizioAlterni.split('-').map(Number);
    inizio = new Date(pz[0], pz[1] - 1, pz[2]);
  }
  var diffGiorni = Math.round((oggiMezzanotte - inizio) / 86400000);
  // Giorno pari: 1/2 cpr (0.5), Giorno dispari: 1 cpr (1.0)
  var isMezza = (diffGiorni % 2 === 0);
  return {
    quantita: isMezza ? 0.5 : 1.0,
    testo: isMezza ? '½ cpr (Mezza Dose)' : '1 cpr (Dose Intera)',
    isMezza: isMezza
  };
}

function calcolaOrarioSuccessivo(oraInizio, oreDaAggiungere) {
  if (!oraInizio || oraInizio.indexOf(':') < 0) oraInizio = '08:00';
  var parti = oraInizio.split(':');
  var ore = parseInt(parti[0]) || 0;
  var min = parseInt(parti[1]) || 0;
  var minTot = (ore * 60 + min + Math.round(oreDaAggiungere * 60)) % (24 * 60);
  if (minTot < 0) minTot += 24 * 60;
  var h = Math.floor(minTot / 60);
  var m = minTot % 60;
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

function deduciFasciaDaOrario(oraStr) {
  if (!oraStr) return 'Mattina (Colazione)';
  var h = parseInt(oraStr.split(':')[0]) || 8;
  if (h >= 5 && h < 8) return 'Mattina (Digiuno)';
  if (h >= 8 && h < 11) return 'Mattina (Colazione)';
  if (h >= 11 && h < 15) return 'Pranzo';
  if (h >= 15 && h < 19) return 'Pomeriggio';
  if (h >= 19 && h < 22) return 'Sera (Cena)';
  return 'Notte (Prima di dormire)';
}

function applicaSchemaDosiModifica(forceRecalc) {
  var selectDosi = document.getElementById('edit-farm-num-dosi');
  var selectIntervallo = document.getElementById('edit-farm-intervallo-tipo');
  var inpOra1 = document.getElementById('edit-farm-ora');
  var dosaggio = (document.getElementById('edit-farm-dosaggio') ? document.getElementById('edit-farm-dosaggio').value : '') || '1 cpr';
  var modoEl = document.getElementById('edit-farm-modo');

  if (!selectDosi || !inpOra1) return;
  var numDosi = parseInt(selectDosi.value) || 1;
  var criterio = selectIntervallo ? selectIntervallo.value : '12h';
  var ora1 = inpOra1.value || '08:00';

  // Pulisci contenitore dosi extra (2ª, 3ª, 4ª dose)
  var containerDosiExtra = document.getElementById('edit-farm-dosi-extra-list');
  if (containerDosiExtra) containerDosiExtra.innerHTML = '';
  _dosiExtraCounter = 0;

  var orariCalcolati = [ora1];

  if (numDosi === 2) {
    var ora2 = '20:00';
    if (criterio === '12h') {
      ora2 = calcolaOrarioSuccessivo(ora1, 12);
    } else if (criterio === '8h') {
      ora2 = calcolaOrarioSuccessivo(ora1, 8);
    } else if (criterio === 'pasti') {
      var h1 = parseInt(ora1.split(':')[0]) || 8;
      ora2 = (h1 < 12) ? '19:30' : '22:00';
    } else {
      ora2 = calcolaOrarioSuccessivo(ora1, 12);
    }
    orariCalcolati.push(ora2);
    aggiungiNuovaDoseModifica(ora2, deduciFasciaDaOrario(ora2), dosaggio);
  } else if (numDosi === 3) {
    var ora2, ora3;
    if (criterio === 'pasti') {
      ora2 = '13:00';
      ora3 = '20:00';
    } else {
      // default 8 ore
      ora2 = calcolaOrarioSuccessivo(ora1, 8);
      ora3 = calcolaOrarioSuccessivo(ora1, 16);
    }
    orariCalcolati.push(ora2, ora3);
    aggiungiNuovaDoseModifica(ora2, deduciFasciaDaOrario(ora2), dosaggio);
    aggiungiNuovaDoseModifica(ora3, deduciFasciaDaOrario(ora3), dosaggio);
  } else if (numDosi === 4) {
    var o2 = calcolaOrarioSuccessivo(ora1, 6);
    var o3 = calcolaOrarioSuccessivo(ora1, 12);
    var o4 = calcolaOrarioSuccessivo(ora1, 18);
    orariCalcolati.push(o2, o3, o4);
    aggiungiNuovaDoseModifica(o2, deduciFasciaDaOrario(o2), dosaggio);
    aggiungiNuovaDoseModifica(o3, deduciFasciaDaOrario(o3), dosaggio);
    aggiungiNuovaDoseModifica(o4, deduciFasciaDaOrario(o4), dosaggio);
  }

  // Aggiornamento o suggerimento istruzione clinica automatica se vuota o default
  if (modoEl && (!modoEl.value || modoEl.value.indexOf('somministrazion') >= 0 || modoEl.value.indexOf('Dose') >= 0 || forceRecalc)) {
    if (numDosi === 1) {
      // singola dose
    } else if (numDosi === 2) {
      modoEl.value = 'Prescrizione: 2 somministrazioni al giorno a distanza di 12 ore (ore ' + orariCalcolati.join(' e ') + ').';
    } else if (numDosi === 3) {
      modoEl.value = 'Prescrizione: 3 somministrazioni al giorno (ore ' + orariCalcolati.join(', ') + '). Assumere con abbondante acqua.';
    } else if (numDosi === 4) {
      modoEl.value = 'Prescrizione frazionata: 4 dosi giornaliere ogni 6 ore (ore ' + orariCalcolati.join(', ') + ').';
    }
  }
  aggiornaMessaggioDosiExtra();
}

function ricalcolaDosiMultipleModifica() {
  var selectDosi = document.getElementById('edit-farm-num-dosi');
  if (selectDosi && parseInt(selectDosi.value) > 1) {
    applicaSchemaDosiModifica(false);
  }
}

function apriModificaFarmaco(farmacoId) {
  var p = getActivePaziente();
  if (!p || !p.terapie) return;
  var t = p.terapie.find(function(item) { return item.id === farmacoId; });
  if (!t) return;

  var elPaziente = document.getElementById('edit-farm-header-paziente');
  var elFarmaco = document.getElementById('edit-farm-header-nome');
  if (elPaziente) elPaziente.textContent = (p.nome || 'Paziente').replace(/\s*\(\d+\s*anni\)/gi, '');
  if (elFarmaco) elFarmaco.textContent = t.farmaco || 'Farmaco';

  document.getElementById('edit-farm-id').value = t.id;
  document.getElementById('edit-farm-ora').value = t.ora || '08:00';
    document.getElementById('edit-farm-fascia').value = t.fascia || 'Mattina (Colazione)';
  var elCad = document.getElementById('edit-farm-cadenza');
  if (elCad) {
    if (t.cadenzaTipo) {
      elCad.value = t.cadenzaTipo;
    } else if ((t.farmaco || '').toUpperCase().indexOf('DIBASE') >= 0 || (t.modo || '').indexOf('15') >= 0) {
      elCad.value = 'quindicinale_15_30';
    } else {
      elCad.value = 'giornaliera';
    }
  }
  document.getElementById('edit-farm-nome').value = t.farmaco || '';
  document.getElementById('edit-farm-principio').value = t.principio || '';
  document.getElementById('edit-farm-dosaggio').value = t.dosaggio || '';
  var elQuota = document.getElementById('edit-farm-frazione-quota');
  if (elQuota) elQuota.value = t.quantitaQuota || (t.cadenzaTipo === 'alternata_mezza_intera' ? '0.5' : '1');
  var elMotivoMod = document.getElementById('edit-farm-motivo-modifica');
  if (elMotivoMod) elMotivoMod.value = t.ultimaModificaClinica ? (t.ultimaModificaClinica.motivo || '') : '';
  var elMedNome = document.getElementById('edit-farm-medico-nome');
  if (elMedNome) elMedNome.value = t.ultimaModificaClinica ? (t.ultimaModificaClinica.medico || '') : (p.medicoNome || '');
  document.getElementById('edit-farm-cpr-scatola').value = t.cprPerScatola || 28;
  document.getElementById('edit-farm-scorta').value = typeof t.scorta !== 'undefined' ? t.scorta : 28;
  var elGiorniAlert = document.getElementById('edit-farm-giorni-alert');
  if (elGiorniAlert) elGiorniAlert.value = Math.min(30, Math.max(1, parseInt(t.giorniAlert) || 7));
  document.getElementById('edit-farm-modo').value = t.modo || '';

  // Pulisci contenitore dosi extra
  var containerDosiExtra = document.getElementById('edit-farm-dosi-extra-list');
  if (containerDosiExtra) containerDosiExtra.innerHTML = '';
  _dosiExtraCounter = 0;

  // Cerca se esistono già altre dosi dello stesso farmaco registrate (es. VIMPAT dose 2, 3...)
  var nomeBase = (t.farmaco || '').split('(')[0].trim().toLowerCase();
  var altreDosi = p.terapie.filter(function(item) {
    if (item.id === t.id) return false;
    var n = (item.farmaco || '').split('(')[0].trim().toLowerCase();
    return n.length > 2 && (n === nomeBase || nomeBase.indexOf(n) >= 0 || n.indexOf(nomeBase) >= 0);
  });

  var totDosi = 1 + (altreDosi ? altreDosi.length : 0);
  var elNumDosi = document.getElementById('edit-farm-num-dosi');
  var elInterv = document.getElementById('edit-farm-intervallo-tipo');
  if (elNumDosi) elNumDosi.value = Math.min(4, Math.max(1, totDosi));

  if (altreDosi && altreDosi.length > 0) {
    altreDosi.forEach(function(doseColl) {
      aggiungiNuovaDoseModifica(doseColl.ora, doseColl.fascia, doseColl.dosaggio);
    });
  }
  aggiornaMessaggioDosiExtra();

  // Ricalcola subito previsione scorte e simulatore cadenza per il farmaco aperto
  if (typeof ricalcolaAutonomiaScorteModifica === 'function') ricalcolaAutonomiaScorteModifica();
  if (typeof ricalcolaSimulatoreCadenzaOggi === 'function') ricalcolaSimulatoreCadenzaOggi();

  // Aggancia ascoltatori per calcolo in tempo reale durante la digitazione
  var elScortaInput = document.getElementById('edit-farm-scorta');
  var elQuotaInput = document.getElementById('edit-farm-frazione-quota');
  var elCadInput = document.getElementById('edit-farm-cadenza');
  var elAlertInput = document.getElementById('edit-farm-giorni-alert');
  if (elScortaInput) elScortaInput.oninput = ricalcolaAutonomiaScorteModifica;
  if (elAlertInput) elAlertInput.oninput = ricalcolaAutonomiaScorteModifica;
  if (elQuotaInput) {
    elQuotaInput.onchange = function() {
      ricalcolaAutonomiaScorteModifica();
      ricalcolaSimulatoreCadenzaOggi();
    };
  }
  if (elCadInput) {
    elCadInput.onchange = function() {
      ricalcolaAutonomiaScorteModifica();
      ricalcolaSimulatoreCadenzaOggi();
    };
  }

  openModal('modal-modifica-farmaco');
}

function salvaModificaFarmaco(e) {
  e.preventDefault();
  var p = getActivePaziente();
  if (!p || !p.terapie) return;

  var farmId = parseInt(document.getElementById('edit-farm-id').value);
  var t = p.terapie.find(function(item) { return item.id === farmId; });
  if (!t) return;

  var nome = document.getElementById('edit-farm-nome').value.trim();
  var principio = document.getElementById('edit-farm-principio').value.trim();
  var dosaggio = document.getElementById('edit-farm-dosaggio').value.trim();
  var cprPerScatola = parseInt(document.getElementById('edit-farm-cpr-scatola').value) || 28;
  var scorta = parseInt(document.getElementById('edit-farm-scorta').value) || 0;
  var modo = document.getElementById('edit-farm-modo').value.trim();

  // 1. Aggiorna la 1ª dose principale
  t.ora = document.getElementById('edit-farm-ora').value;
  t.fascia = document.getElementById('edit-farm-fascia').value;
  t.farmaco = nome;
  t.principio = principio;
  t.dosaggio = dosaggio;
  t.cprPerScatola = cprPerScatola;
  t.scorta = scorta;
  var elEditGiorniAlert = document.getElementById('edit-farm-giorni-alert');
  if (elEditGiorniAlert) {
    t.giorniAlert = Math.min(30, Math.max(1, parseInt(elEditGiorniAlert.value) || 7));
  }
  var elCadSave = document.getElementById('edit-farm-cadenza');
  if (elCadSave) {
    t.cadenzaTipo = elCadSave.value;
    if (elCadSave.value === 'quindicinale_15_30') {
      if (modo.indexOf('15 e 30 del mese') < 0) {
        modo = modo + ' [Assunzione ogni 15 giorni: il 15 e il 30 del mese]';
      }
    } else if (elCadSave.value === 'alternata_mezza_intera') {
      if (modo.indexOf('Dose alternata') < 0) {
        modo = modo + ' [Schema alternato: ½ cpr un giorno e 1 cpr il giorno successivo]';
      }
    }
  }

  var elQuotaSave = document.getElementById('edit-farm-frazione-quota');
  if (elQuotaSave) {
    t.quantitaQuota = parseFloat(elQuotaSave.value) || 1;
  }

  // Registrazione fonte clinica variazione
  var fonteTipoEl = document.getElementById('edit-farm-fonte-tipo');
  var medNomeEl = document.getElementById('edit-farm-medico-nome');
  var motivoModEl = document.getElementById('edit-farm-motivo-modifica');

  var fonteTipo = fonteTipoEl ? fonteTipoEl.value : 'medico_famiglia';
  var fonteNome = fonteTipo === 'visita_specialistica' ? 'Visita Specialistica' : (fonteTipo === 'dimissione_ospedaliera' ? 'Dimissione Ospedaliera' : (fonteTipo === 'caregiver' ? 'Caregiver/Famiglia' : 'Medico di Base (MMG)'));
  var nomeDoc = medNomeEl ? medNomeEl.value.trim() : '';
  var motivoMod = motivoModEl ? motivoModEl.value.trim() : '';
  var oggiStr = new Date().toLocaleDateString('it-IT');

  t.ultimaModificaClinica = {
    data: oggiStr,
    fonte: fonteNome,
    medico: nomeDoc,
    motivo: motivoMod || 'Variazione posologia / orario'
  };

  // Registra nello storico clinico del paziente
  if (!p.registrazioni) p.registrazioni = [];
  p.registrazioni.push({
    id: 'log_mod_' + Date.now(),
    tipo: 'variazione_clinica',
    farmacoId: t.id,
    farmaco: t.farmaco,
    dosaggio: t.dosaggio,
    orario: t.ora,
    timestamp: new Date().toISOString(),
    azione: 'modifica_terapia',
    fonte: fonteNome,
    medico: nomeDoc,
    desc: 'Variazione Terapia disposta da ' + fonteNome + (nomeDoc ? ' (' + nomeDoc + ')' : '') + ': ' + (motivoMod || 'Aggiornamento orario/posologia.') + ' (Orario: ' + t.ora + ', Cadenza: ' + (t.cadenzaTipo || 'quotidiana') + ', Dose: ' + (t.quantitaQuota || 1) + ' cpr).',
    operatore: localStorage.getItem('milella_user_nome') || 'Amministratore'
  });

  t.modo = modo;

  // 2. Rimuovi eventuali vecchie dosi collegate dello stesso farmaco per ricrearle coerentemente
  var nomeBase = nome.split('(')[0].trim().toLowerCase();
  p.terapie = p.terapie.filter(function(item) {
    if (item.id === t.id) return true;
    var n = (item.farmaco || '').split('(')[0].trim().toLowerCase();
    var isColl = n.length > 2 && (n === nomeBase || nomeBase.indexOf(n) >= 0 || n.indexOf(nomeBase) >= 0);
    return !isColl;
  });

  // 3. Raccogli e inserisci le dosi extra aggiunte (fino a 4 dosi totali)
  var extraRows = document.querySelectorAll('#edit-farm-dosi-extra-list .form-row');
  var doseProgressivo = 2;
  if (extraRows && extraRows.length > 0) {
    // Rinomina la dose 1 con suffisso per chiarezza
    t.farmaco = nome + ' (1ª dose - ore ' + t.ora + ')';

    extraRows.forEach(function(row) {
      var oraExtra = row.querySelector('.edit-extra-ora').value || '13:30';
      var fasciaExtra = row.querySelector('.edit-extra-fascia').value || 'Pranzo';
      var qtaExtra = row.querySelector('.edit-extra-qta').value || dosaggio;

      p.terapie.push({
        id: Date.now() + doseProgressivo * 137,
        ora: oraExtra,
        fascia: fasciaExtra,
        farmaco: nome + ' (' + doseProgressivo + 'ª dose - ore ' + oraExtra + ')',
        principio: principio,
        dosaggio: qtaExtra,
        modo: modo,
        cprPerScatola: cprPerScatola,
        scorta: scorta,
        fattoOggi: false
      });
      doseProgressivo++;
    });
  }

  // Riordina cronologicamente le terapie del paziente
  p.terapie.sort(function(a, b) { return (a.ora || '').localeCompare(b.ora || ''); });

  closeModal('modal-modifica-farmaco');
  saveDb();
  showToast('Terapia per "' + nome + '" aggiornata con successo con tutte le dosi programmate! ⏰');
}


function salvaNuovoFarmaco(e) {
  e.preventDefault();
  var p = getActivePaziente();
  if (!p) return;

  var nome = document.getElementById('farm-nome').value.trim();
  var principio = document.getElementById('farm-principio').value.trim() || '';
  var dosaggioBase = document.getElementById('farm-dosaggio').value.trim();
  var cprPerScatola = parseInt(document.getElementById('farm-cpr-scatola').value) || 28;
  var scortaTotale = parseInt(document.getElementById('farm-scorta').value) || 28;
  var giorniAlertInput = document.getElementById('farm-giorni-alert');
  var giorniAlertVal = giorniAlertInput ? Math.min(30, Math.max(1, parseInt(giorniAlertInput.value) || 7)) : 7;
  var modoBase = document.getElementById('farm-modo').value.trim();
  var tipoFreqEl = document.getElementById('farm-frequenza-tipo');
  var tipoFreq = tipoFreqEl ? tipoFreqEl.value : 'giornaliera';
  var valFreqEl = document.getElementById('farm-frequenza-valore');
  var valFreq = valFreqEl ? (parseInt(valFreqEl.value) || 1) : 1;

  if (!p.terapie) p.terapie = [];

  if (tipoFreq === 'intervallo_ore') {
    var oreStep = Math.max(1, Math.min(24, valFreq));
    var startHour = 8;
    var numDosi = Math.floor(24 / oreStep);

    for (var i = 0; i < numDosi; i++) {
      var h = (startHour + i * oreStep) % 24;
      var hStr = (h < 10 ? '0' : '') + h + ':00';
      p.terapie.push({
        id: Date.now() + i * 17,
        ora: hStr,
        fascia: 'Ogni ' + oreStep + ' ore (Dose ' + (i + 1) + '/' + numDosi + ')',
        farmaco: nome,
        principio: principio,
        dosaggio: dosaggioBase,
        modo: modoBase + ' [Cadenza: ogni ' + oreStep + ' ore]',
        frequenzaTipo: 'intervallo_ore',
        frequenzaVal: oreStep,
        cprPerScatola: cprPerScatola,
        scorta: scortaTotale, giorniAlert: giorniAlertVal, fattoOggi: false
      });
    }
  } else if (tipoFreq === 'bisogno') {
    p.terapie.push({
      id: Date.now(),
      ora: 'Al Bisogno',
      fascia: 'Al Bisogno (SOS)',
      farmaco: nome,
      principio: principio,
      dosaggio: dosaggioBase,
      modo: modoBase + ' [Al bisogno / sintomatico]',
      frequenzaTipo: 'bisogno',
      cprPerScatola: cprPerScatola,
      scorta: scortaTotale, giorniAlert: giorniAlertVal, fattoOggi: false
    });
  } else {
    var dosiSelezionate = [];
    for (var d = 1; d <= 4; d++) {
      var chk = document.getElementById('farm-dose' + d + '-enable');
      if (chk && chk.checked) {
        var elOra = document.getElementById('farm-dose' + d + '-ora');
        var elQta = document.getElementById('farm-dose' + d + '-qta');
        var ora = (elOra && elOra.value) ? elOra.value : '08:00';
        var qta = (elQta && elQta.value) ? elQta.value : '1 cpr';
        dosiSelezionate.push({ doseNum: d, ora: ora, qta: qta });
      }
    }

    if (dosiSelezionate.length === 0) {
      dosiSelezionate.push({ doseNum: 1, ora: '08:00', qta: '1 cpr' });
    }

    var noteFrequenza = tipoFreq === 'alternati' ? ' [A giorni alterni]' : (tipoFreq === 'intervallo_giorni' ? ' [Ogni ' + valFreq + ' giorni]' : '');

    dosiSelezionate.forEach(function(item, idx) {
      var fasciaNome = 'Giornaliera';
      var hInt = parseInt(item.ora.split(':')[0]) || 8;
      if (hInt < 9) fasciaNome = 'Mattina (Colazione)';
      else if (hInt < 14) fasciaNome = 'Pranzo';
      else if (hInt < 18) fasciaNome = 'Pomeriggio';
      else if (hInt < 21) fasciaNome = 'Sera (Cena)';
      else fasciaNome = 'Notte (Prima di dormire)';

      var nomeSuffisso = dosiSelezionate.length > 1 ? ' (' + item.doseNum + 'ª dose - ore ' + item.ora + ')' : '';

      p.terapie.push({
        id: Date.now() + idx * 29,
        ora: item.ora,
        fascia: fasciaNome,
        farmaco: nome + nomeSuffisso,
        principio: principio,
        dosaggio: dosaggioBase + ' (' + item.qta + ')',
        modo: modoBase + noteFrequenza,
        frequenzaTipo: tipoFreq,
        frequenzaVal: valFreq,
        cprPerScatola: cprPerScatola,
        scorta: scortaTotale, giorniAlert: giorniAlertVal, fattoOggi: false
      });
    });
  }

  p.terapie.sort(function(a, b) { return (a.ora || '').localeCompare(b.ora || ''); });

  closeModal('modal-farmaco');
  saveDb();
  showToast('Farmaco "' + nome + '" inserito con successo!');
}

function salvaNuovaVisita(e) {
  e.preventDefault();
  const p = getActivePaziente();
  if (!p) return;
  const v = {
    id: Date.now(),
    data: document.getElementById('vis-data').value,
    ora: document.getElementById('vis-ora').value,
    medico: document.getElementById('vis-medico').value,
    motivo: document.getElementById('vis-motivo').value,
    fatto: false
  };
  p.visite.push(v);
  closeModal('modal-visita');
  saveDb();
}

// Backup & Reset Multi-Paziente
function esportaBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppData, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `CareAssist_MultiPaziente_Backup_${new Date().toISOString().slice(0,10)}.json`);
  dlAnchor.click();
}

function importaBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.pazienti) {
        AppData = parsed;
      }
      saveDb();
      showToast('Backup ripristinato con successo!');
    } catch(err) {
      showToast('Errore nel file di backup JSON!', 'error');
    }
  };
  reader.readAsText(file);
}

function stampaReport() {
  window.print();
}

/* ==========================================================================
   LOGICA MODULI RSA: OROLOGIO POSTURALE Q2H, IDRATAZIONE, CADUTE & HANDOVER
   ========================================================================== */

// Gestione Audio Segnale Dolce allo Scadere delle 2 Ore (Web Audio API)
let audioPosturaAbilitato = true;
let ultimoSuonoScadutoTimestamp = 0;
let audioCtxInstance = null;

function getAudioContext() {
  if (!audioCtxInstance) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtxInstance = new AudioContext();
  }
  if (audioCtxInstance && audioCtxInstance.state === 'suspended') {
    audioCtxInstance.resume();
  }
  return audioCtxInstance;
}

// Riproduce un rintocco rilassante e dolce (due note armoniche morbide tipo carillon/chime ospedaliero dolce)
function suonaSegnaleDolce() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const ora = ctx.currentTime;
    
    // Prima nota dolce (La 440 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ora); // C5 (Do dolce)
    gain1.gain.setValueAtTime(0, ora);
    gain1.gain.linearRampToValueAtTime(0.08, ora + 0.08); // attacco morbidissimo
    gain1.gain.exponentialRampToValueAtTime(0.001, ora + 1.2); // decadimento lungo e dolce
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ora);
    osc1.stop(ora + 1.3);

    // Seconda nota armonica a salire (Mi 659.25 Hz) dopo 250ms
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, ora + 0.25); // E5 (Mi dolce)
    gain2.gain.setValueAtTime(0, ora + 0.25);
    gain2.gain.linearRampToValueAtTime(0.09, ora + 0.33);
    gain2.gain.exponentialRampToValueAtTime(0.001, ora + 1.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ora + 0.25);
    osc2.stop(ora + 1.7);

  } catch(err) {
    console.log('Audio non avviabile automaticamente senza interazione utente', err);
  }
}

function testSegnaleDolce() {
  suonaSegnaleDolce();
  showToast('🎵 Segnale acustico dolce riprodotto (Do-Mi carillon)');
}

function toggleAudioPostura() {
  audioPosturaAbilitato = !audioPosturaAbilitato;
  const btn = document.getElementById('btn-toggle-audio-postura');
  if (btn) {
    btn.innerHTML = audioPosturaAbilitato ? '🔔 Audio ON' : '🔕 Audio MUTO';
    btn.classList.toggle('active', audioPosturaAbilitato);
  }
  showToast(audioPosturaAbilitato ? 'Audio cambio postura attivato' : 'Audio silenziato');
}

// 1. OROLOGIO POSTURALE & PREVENZIONE DECUBITO (Q2H)
function aggiornaOrologioPosturale() {
  const p = getActivePaziente();
  if (!p) return;

  const cardOrologio = document.getElementById('card-orologio-posturale');
  const tileCute = document.getElementById('tile-ispezione-cute');

  // GESTIONE PAZIENTE DEAMBULANTE (es. Angela): Disattiva e nasconde l'orologio posturale q2h
  if (!p.allettato) {
    if (cardOrologio) {
      cardOrologio.style.display = 'none';
    }
    if (tileCute) {
      tileCute.style.display = 'none';
    }
    ultimoSuonoScadutoTimestamp = 0;
    return;
  } else {
    // PAZIENTE ALLETTATO (es. Aldo): Mostra e attiva regolarmente
    if (cardOrologio) {
      cardOrologio.style.display = 'block';
    }
    if (tileCute) {
      tileCute.style.display = 'flex';
    }
  }

  const logsPostura = (p.registrazioni || [])
    .filter(r => r.tipo === 'postura')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const txtPos = document.getElementById('postura-attuale-testo');
  const txtUltimo = document.getElementById('postura-ultimo-cambio');
  const circle = document.getElementById('postura-circle');
  const circleIcon = document.getElementById('postura-circle-icon');
  const circleLabel = document.getElementById('postura-circle-label');
  const timerBadge = document.getElementById('postura-timer-badge');
  const lblNome = document.getElementById('postura-label-nome-paziente');

  if (!txtPos) return;

  // Aggiorna etichetta con il nome esatto dell'assistito corrente
  if (lblNome) {
    lblNome.textContent = `Posizione Attuale di ${p.nome.split(' ')[0]}:`;
  }

  // Se è appena diventato allettato o non ha ancora registrazioni posturali,
  // inizializzalo SUBITO da adesso (ora attuale) in posizione Supino!
  if (!logsPostura.length) {
    const oraInit = new Date().toISOString();
    p.registrazioni.push({
      id: 'log_' + Date.now(),
      tipo: 'postura',
      timestamp: oraInit,
      posizione: 'Supino (Schiena a letto)',
      cute: 'Integra e rosea (Iniziale)',
      operatore: 'Sistema Automatico CareAssist'
    });
    saveDb();
    // Richiama l'aggiornamento con la nuova registrazione
    return aggiornaOrologioPosturale();
  }

  const last = logsPostura[0];
  const lastTime = new Date(last.timestamp);
  const now = new Date();
  const diffMs = now - lastTime;
  const diffSec = Math.floor(diffMs / 1000);
  const totalLimitSec = 120 * 60; // 2 ore esatte = 7200 secondi
  const remSec = totalLimitSec - diffSec;

  // Formatta tempo trascorso in mm:ss o hh:mm:ss
  const pad = (n) => String(n).padStart(2, '0');
  const tOre = Math.floor(diffSec / 3600);
  const tMin = Math.floor((diffSec % 3600) / 60);
  const tSec = diffSec % 60;
  const trascorsoStr = tOre > 0 ? `${tOre}h ${pad(tMin)}m` : `${tMin} min`;

  txtPos.textContent = last.posizione;
  txtUltimo.textContent = `Dalle ore ${lastTime.toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'})} (da ${trascorsoStr}) - Cute: ${last.cute || 'Integra'}`;

  // Calcolo Posizione Precedente e Suggerimento Prossima Rotazione
  const prev = logsPostura.length > 1 ? logsPostura[1] : null;
  const posPrecedente = prev ? prev.posizione : 'Nessuna (Inizio giornata)';

  // Sequenza posturale clinica standard di rotazione antidecubito:
  // Supino -> Fianco Destro -> Fianco Sinistro -> Supino (o Semiseduto se orario pasti)
  let posSuggerita = '';
  let idBtnSuggerito = '';

  const posAttualeLower = (last.posizione || '').toLowerCase();

  if (posAttualeLower.includes('supino')) {
    // Da Supino si ruota preferibilmente sul fianco opposto alla penultima postura
    if (prev && prev.posizione.toLowerCase().includes('destro')) {
      posSuggerita = 'Fianco Sinistro (inclinato 30°)';
      idBtnSuggerito = 'btn-postura-fianco-sx';
    } else {
      posSuggerita = 'Fianco Destro (inclinato 30°)';
      idBtnSuggerito = 'btn-postura-fianco-dx';
    }
  } else if (posAttualeLower.includes('destro')) {
    // Da Fianco Dx si ruota sul Fianco Sx (scarico totale sacro) o Supino
    posSuggerita = 'Fianco Sinistro (inclinato 30°)';
    idBtnSuggerito = 'btn-postura-fianco-sx';
  } else if (posAttualeLower.includes('sinistro')) {
    // Da Fianco Sx si ruota su Supino o Fianco Dx
    posSuggerita = 'Supino (Schiena a letto)';
    idBtnSuggerito = 'btn-postura-supino';
  } else {
    // Se Semiseduto (dopo pranzo/cena) si torna a letto su un fianco
    posSuggerita = 'Fianco Destro (inclinato 30°)';
    idBtnSuggerito = 'btn-postura-fianco-dx';
  }

  // Evidenzia pulsante attivo e fa lampeggiare il pulsante suggerito
  document.querySelectorAll('.postura-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase().includes(last.posizione.slice(0, 5).toLowerCase()));
    btn.classList.remove('suggerita');
  });

  const btnSuggerito = document.getElementById(idBtnSuggerito);
  if (btnSuggerito && !btnSuggerito.classList.contains('active')) {
    btnSuggerito.classList.add('suggerita');
  }

  // Aggiorna box di supporto visivo per i colleghi
  const suggBox = document.getElementById('postura-suggerimento-testo');
  if (suggBox) {
    suggBox.innerHTML = `
      <span>Posizione precedente: <b>${posPrecedente}</b> &bull; Prossima consigliata: <b style="color:#059669; text-decoration:underline;">${posSuggerita}</b> (pulsante lampeggiante verde)</span>
    `;
  }

  if (remSec <= 0) {
    // TEMPO SCADUTO (RITARDO IN CONTEGGIO POSITIVO)
    const overSec = Math.abs(remSec);
    const oOre = Math.floor(overSec / 3600);
    const oMin = Math.floor((overSec % 3600) / 60);
    const oSec = overSec % 60;
    const overFmt = oOre > 0 ? `+${oOre}:${pad(oMin)}:${pad(oSec)}` : `+${pad(oMin)}:${pad(oSec)}`;

    // SEGNALE COSTANTE E DOLCE: Riproduce ogni 4 secondi un rintocco dolce continuo finché non viene cliccato il cambio postura
    const nowTimeMs = Date.now();
    if (audioPosturaAbilitato && (nowTimeMs - ultimoSuonoScadutoTimestamp >= 4000)) {
      ultimoSuonoScadutoTimestamp = nowTimeMs;
      suonaSegnaleDolce();
    }

    if (circle) {
      circle.className = 'postura-status-circle urgent';
      circleIcon.textContent = '⌛';
      circleLabel.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:1px; line-height:1.1;">
          <span style="font-size:13px; font-weight:800; font-family:monospace; color:#b91c1c;">${overFmt}</span>
          <span style="font-size:9.5px; font-weight:800; color:#ef4444; letter-spacing:0.5px;">SCADUTO</span>
        </div>`;
    }
    if (timerBadge) {
      timerBadge.className = 'badge badge-danger';
      timerBadge.innerHTML = `⌛ SCADUTO DA ${overFmt} &bull; RUOTARE ORA! 🔔`;
    }
  } else {
    // CONTO ALLA ROVESCIA ATTIVO (HH:MM:SS)
    const rOre = Math.floor(remSec / 3600);
    const rMin = Math.floor((remSec % 3600) / 60);
    const rSec = remSec % 60;
    const countFmt = `${pad(rOre)}:${pad(rMin)}:${pad(rSec)}`;

    if (remSec <= 30 * 60) {
      // Meno di 30 minuti: Avviso giallo
      if (circle) {
        circle.className = 'postura-status-circle warning';
        circleIcon.textContent = '⏳';
        circleLabel.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:1px; line-height:1.1;">
            <span style="font-size:13px; font-weight:800; font-family:monospace; color:#a16207;">${countFmt}</span>
            <span style="font-size:9px; font-weight:800; color:#854d0e; letter-spacing:0.5px;">SCADENZA</span>
          </div>`;
      }
      if (timerBadge) {
        timerBadge.className = 'badge badge-warning';
        timerBadge.innerHTML = `⏳ Conto alla rovescia: <b>${countFmt}</b> al cambio postura`;
      }
    } else {
      // Regolare: Verde con countdown in tempo reale
      if (circle) {
        circle.className = 'postura-status-circle ok';
        circleIcon.textContent = '⏳';
        circleLabel.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; gap:1px; line-height:1.1;">
            <span style="font-size:13.5px; font-weight:800; font-family:monospace; color:#15803d;">${countFmt}</span>
            <span style="font-size:9.5px; font-weight:800; color:#166534; letter-spacing:0.5px;">RIMASTI</span>
          </div>`;
      }
      if (timerBadge) {
        timerBadge.className = 'badge badge-success';
        timerBadge.innerHTML = `⏳ Conto alla rovescia: <b>${countFmt}</b> (In posizione da ${trascorsoStr})`;
      }
    }
  }
}

function cambioPosturaRapido(nuovaPosizione) {
  const p = getActivePaziente();
  if (!p) return;

  // Interrompe immediatamente il loop sonoro di allarme
  ultimoSuonoScadutoTimestamp = 0;

  const entry = {
    id: 'log_' + Date.now(),
    tipo: 'postura',
    timestamp: new Date().toISOString(),
    posizione: nuovaPosizione,
    cute: 'Integra e rosea (Normale)',
    operatore: 'Operatore OSS / Famiglia'
  };

  p.registrazioni.push(entry);
  saveDb();
  showToast(`Postura aggiornata: "${nuovaPosizione}"! Allarme arrestato e timer q2h azzerato.`);
}

// 2. BILANCIO IDRICO GIORNALIERO (RSA HYDRATION)
function aggiornaIdratazioneUI() {
  const p = getActivePaziente();
  if (!p) return;

  const oggiStr = new Date().toISOString().slice(0, 10);
  const logsOggi = (p.registrazioni || [])
    .filter(r => r.tipo === 'idratazione' && r.timestamp.startsWith(oggiStr));

  const totMl = logsOggi.reduce((acc, r) => acc + (r.ml || 0), 0);
  const target = 1200; // ml raccomandati per 91 anni allettato
  const perc = Math.min(Math.round((totMl / target) * 100), 100);

  const counter = document.getElementById('hydration-counter');
  const bar = document.getElementById('hydration-bar-fill');

  if (counter) counter.textContent = `${totMl} / ${target} ml (${perc}%)`;
  if (bar) {
    bar.style.width = `${perc}%`;
    bar.textContent = `${perc}%`;
    if (perc >= 100) {
      bar.style.background = 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
    } else {
      bar.style.background = 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)';
    }
  }
}

function aggiungiAcqua(ml, bevanda = 'Acqua naturale') {
  const p = getActivePaziente();
  if (!p) return;

  const oggiStr = new Date().toISOString().slice(0, 10);
  const logsOggi = (p.registrazioni || [])
    .filter(r => r.tipo === 'idratazione' && r.timestamp.startsWith(oggiStr));
  const totAttuale = logsOggi.reduce((acc, r) => acc + (r.ml || 0), 0) + ml;

  const entry = {
    id: 'log_' + Date.now(),
    tipo: 'idratazione',
    timestamp: new Date().toISOString(),
    ml: ml,
    bevanda: bevanda,
    totaleGiorno: totAttuale,
    operatore: 'Operatore OSS'
  };

  p.registrazioni.push(entry);
  saveDb();
  showToast(`Registrati +${ml} ml (${bevanda})! Totale oggi: ${totAttuale} ml.`);
}

async function azzeraIdratazioneOggi() {
  const p = getActivePaziente();
  if (!p) return;
  const ok = await customConfirm(
    'Azzera Bilancio Idrico',
    'Vuoi azzerare il conteggio dei liquidi per la giornata di oggi?',
    '💧'
  );
  if (ok) {
    const oggiStr = new Date().toISOString().slice(0, 10);
    p.registrazioni = p.registrazioni.filter(r => !(r.tipo === 'idratazione' && r.timestamp.startsWith(oggiStr)));
    saveDb();
    showToast('Bilancio idrico odierno azzerato.');
  }
}

// 3. REGISTRA CADUTA & ALERT WHATSAPP ALLA FAMIGLIA (RSA SAFETY)
function apriModalCaduta() {
  openModal('modal-caduta');
}

function salvaEventoCaduta(e) {
  e.preventDefault();
  const p = getActivePaziente();
  if (!p) return;

  const dinamica = document.getElementById('caduta-dinamica').value;
  const coscienza = document.getElementById('caduta-coscienza').value;
  const esito = document.getElementById('caduta-esito').value;
  const operatore = document.getElementById('caduta-operatore').value.trim() || 'Operatore OSS';
  const azioni = document.getElementById('caduta-azioni').value.trim();
  const notificaWa = document.getElementById('caduta-notifica-wa').checked;

  const entry = {
    id: 'log_' + Date.now(),
    tipo: 'caduta',
    timestamp: new Date().toISOString(),
    dinamica: dinamica,
    coscienza: coscienza,
    esito: esito,
    azioni: azioni,
    operatore: operatore
  };

  p.registrazioni.push(entry);
  closeModal('modal-caduta');
  saveDb();
  showToast('Evento caduta registrato nel Diario Clinico!', 'warning');

  // Invio notifica WhatsApp immediata alla famiglia se selezionato
  if (notificaWa) {
    const cellAngela = (p.moglieCellulare || '3389449610').replace(/[^0-9]/g, '');
    const dataOra = new Date().toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'});
    const msgWa = encodeURIComponent(
      `⚠️ NOTIFICA ASSISTENZA PER ${p.nome.toUpperCase()}\n` +
      `Ore ${dataOra} - Registrato evento: Caduta / Scivolamento accidentale.\n\n` +
      `📍 Dinamica: ${dinamica}\n` +
      `🧠 Stato di coscienza: ${coscienza}\n` +
      `🩺 Conseguenze: ${esito}\n` +
      `🛠️ Azioni immediate: ${azioni}\n` +
      `👤 Operatore presente: ${operatore}\n\n` +
      `Monitoraggio parametri vitali in corso.`
    );
    const waUrl = cellAngela.startsWith('39') 
      ? `https://api.whatsapp.com/send?phone=${cellAngela}&text=${msgWa}`
      : `https://api.whatsapp.com/send?phone=39${cellAngela}&text=${msgWa}`;
    window.open(waUrl, '_blank');
  }
}

// 4. CONSEGNA DI TURNO CONDIVISA (SHIFT HANDOVER)
function apriConsegnaTurno() {
  const p = getActivePaziente();
  if (!p) return;

  const d = new Date();
  const dataStr = d.toLocaleDateString('it-IT', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const oraStr = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  const oggiIso = d.toISOString().slice(0, 10);

  // Calcolo dati odierni
  const farmaciSomministrati = (p.terapie || []).filter(t => t.fattoOggi).length;
  const farmaciTotali = (p.terapie || []).length;
  
  // Terapie saltate odierne
  const saltatiOggi = (p.registrazioni || []).filter(r => r.tipo === 'farmaco_saltato' && r.timestamp.startsWith(oggiIso));
  const ritardiOggi = (p.registrazioni || []).filter(r => r.tipo === 'farmaco_ritardo' && r.timestamp.startsWith(oggiIso));

  let infoAnomalieFarmaci = '';
  if (saltatiOggi.length > 0) {
    infoAnomalieFarmaci += `\n   ❌ MANCATE ASSUNZIONI (${saltatiOggi.length}):\n` + saltatiOggi.map(s => `      - ${s.farmaco} (ore ${s.orarioPrevisto}): ${s.motivo}`).join('\n');
  }
  if (ritardiOggi.length > 0) {
    infoAnomalieFarmaci += `\n   ⚠️ ASSUNTI CON RITARDO (${ritardiOggi.length}):\n` + ritardiOggi.map(r => `      - ${r.farmaco} (Previsto ${r.orarioPrevisto} -> Dato alle ${r.orarioReale}, +${r.minutiRitardo} min)`).join('\n');
  }

  const alvoOggi = (p.registrazioni || []).find(r => r.tipo === 'alvo' && r.timestamp.startsWith(oggiIso));
  const alvoStr = alvoOggi ? `Regolare (${alvoOggi.consistenza})` : 'Nessuna evacuazione registrata oggi';

  const lastParam = (p.registrazioni || []).filter(r => r.tipo === 'parametri').sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  const paramStr = lastParam ? `PA: ${lastParam.pa_max}/${lastParam.pa_min} mmHg | FC: ${lastParam.fc} bpm | Temp: ${lastParam.temp}°C | SpO2: ${lastParam.spo2}%` : 'Non rilevati oggi';

  const totAcqua = (p.registrazioni || []).filter(r => r.tipo === 'idratazione' && r.timestamp.startsWith(oggiIso)).reduce((acc, r) => acc + (r.ml || 0), 0);

  const lastDiuresi = (p.registrazioni || []).filter(r => r.tipo === 'diuresi').sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  const diuresiStr = lastDiuresi ? `${lastDiuresi.volume} [${lastDiuresi.raccolta}] - Aspetto: ${lastDiuresi.aspetto}` : 'Nessuna registrazione oggi';

  const lastPasto = (p.registrazioni || []).filter(r => r.tipo === 'pasto').sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  const pastoStr = lastPasto ? `${lastPasto.pasto}: ${lastPasto.quantita} (${lastPasto.alimenti})` : 'Nessun pasto registrato oggi';

  const lastPostura = (p.registrazioni || []).filter(r => r.tipo === 'postura').sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  const posturaStr = lastPostura ? `${lastPostura.posizione} (Cute: ${lastPostura.cute || 'Integra'})` : 'Supino a letto';

  const report = 
`📋 PASSAGGIO CONSEGNE TURNO - ${p.nome.toUpperCase()}
📅 ${dataStr} (ore ${oraStr})
------------------------------------------------
💊 TERAPIA FARMACOLOGICA:
   Assunti regolarmente: ${farmaciSomministrati} su ${farmaciTotali} farmaci previsti.${infoAnomalieFarmaci}

❤️ ULTIMI PARAMETRI VITALI:
   ${paramStr}

💩 MONITORAGGIO ALVO:
   ${alvoStr}

🧪 MONITORAGGIO DIURESI (SILODYX):
   ${diuresiStr}

💧 BILANCIO IDRICO:
   ${totAcqua} ml assunti (Target: 1.200 ml)

🍲 NUTRIZIONE & APPETITO:
   ${pastoStr}

🛏️ POSTURA ATTUALE E CUTE:
   ${posturaStr}

📝 NOTE GENERALI:
   Paziente tranquillo e assistito secondo protocollo domiciliare.`;

  document.getElementById('consegna-testo').value = report;
  openModal('modal-consegna-turno');
}

// ==========================================================================
// SEZIONE: DIARIO GLICEMICO & NOTE CLINICHE (INSULINA & SINTOMI)
// ==========================================================================
function aggiornaFeedbackGlicemiaLive(valStr) {
  const box = document.getElementById('glicemia-feedback-box');
  if (!box) return;
  const val = parseFloat(valStr);
  if (isNaN(val) || val <= 0) {
    box.innerHTML = '';
    return;
  }
  if (val < 70) {
    box.innerHTML = '<span style="color:#dc2626; background:#fee2e2; border:1px solid #f87171; padding:3px 8px; border-radius:6px; display:inline-block;">⚠️ ATTENZIONE: IPOGLICEMIA (&lt;70 mg/dl)! Rischio debolezza e confusione.</span>';
  } else if (val <= 140) {
    box.innerHTML = '<span style="color:#15803d; background:#dcfce7; border:1px solid #86efac; padding:3px 8px; border-radius:6px; display:inline-block;">✅ VALORE OTTIMALE (70-140 mg/dl)</span>';
  } else if (val <= 180) {
    box.innerHTML = '<span style="color:#854d0e; background:#fef9c3; border:1px solid #fde047; padding:3px 8px; border-radius:6px; display:inline-block;">ℹ️ VALORE ACCETTABILE / POST-PRANDIALE (&le;180 mg/dl)</span>';
  } else {
    box.innerHTML = '<span style="color:#c2410c; background:#ffedd5; border:1px solid #fdba74; padding:3px 8px; border-radius:6px; display:inline-block;">⚠️ GLICEMIA ELEVATA (&gt;180 mg/dl). Verificare idratazione e dose.</span>';
  }
}

function salvaGlicemiaDedicata(e) {
  e.preventDefault();
  const p = getActivePaziente();
  if (!p) return;

  const valore = parseFloat(document.getElementById('glicemia-valore').value);
  const insulina = document.getElementById('glicemia-insulina').value.trim();
  const momento = document.getElementById('glicemia-momento').value;
  const note = document.getElementById('glicemia-note').value.trim();
  const operatore = document.getElementById('glicemia-operatore').value.trim() || 'Caregiver';

  const entry = {
    id: 'log_glic_' + Date.now(),
    tipo: 'glicemia',
    timestamp: new Date().toISOString(),
    valore: valore,
    insulina: insulina,
    momento: momento,
    note: note,
    operatore: operatore
  };

  if (!p.registrazioni) p.registrazioni = [];
  p.registrazioni.push(entry);

  closeModal('modal-glicemia');
  document.getElementById('glicemia-valore').value = '';
  document.getElementById('glicemia-insulina').value = '';
  document.getElementById('glicemia-note').value = '';
  
  saveDb();
  renderGlicemie();

  if (valore < 70) {
    showToast(`⚠️ ALLERTA IPOGLICEMIA (${valore} mg/dl)! Fornire zuccheri semplici e avvisare il Medico!`, 'danger');
  } else if (valore > 200) {
    showToast(`⚠️ Glicemia elevata (${valore} mg/dl)! Verificare idratazione e terapia.`, 'warning');
  } else {
    showToast(`Misurazione glicemica (${valore} mg/dl) registrata con successo! 🩸`);
  }
}

function eliminaGlicemia(logId) {
  const p = getActivePaziente();
  if (!p || !p.registrazioni) return;
  if (!confirm('Vuoi eliminare questa registrazione glicemica?')) return;
  p.registrazioni = p.registrazioni.filter(r => r.id !== logId);
  saveDb();
  renderGlicemie();
  showToast('Registrazione glicemica eliminata.');
}

function renderGlicemie() {
  const p = getActivePaziente();
  const container = document.getElementById('glicemia-table-body');
  const badgePaz = document.getElementById('badge-paziente-glicemia');
  if (badgePaz && p) {
    badgePaz.textContent = p.nome;
  }
  if (!container || !p) return;

  const logs = (p.registrazioni || [])
    .filter(r => r.tipo === 'glicemia')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Calcolo statistiche
  const elUltima = document.getElementById('stat-glicemia-ultima');
  const elData = document.getElementById('stat-glicemia-data');
  const elMedia = document.getElementById('stat-glicemia-media');
  const elConteggio = document.getElementById('stat-glicemia-conteggio');
  const elIpo = document.getElementById('stat-glicemia-ipo');
  const elIper = document.getElementById('stat-glicemia-iper');

  if (logs.length === 0) {
    if (elUltima) elUltima.textContent = '-- mg/dl';
    if (elData) elData.textContent = 'Nessuna registrazione';
    if (elMedia) elMedia.textContent = '-- mg/dl';
    if (elConteggio) elConteggio.textContent = '0 misurazioni';
    if (elIpo) elIpo.textContent = '0';
    if (elIper) elIper.textContent = '0';
    container.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding:24px;">Nessuna misurazione glicemica registrata per questo paziente. Clicca su "+ Registra Nuova Glicemia".</td></tr>';
    return;
  }

  const ultima = logs[0];
  const uData = new Date(ultima.timestamp);
  const uDataStr = uData.toLocaleDateString('it-IT') + ' ore ' + uData.toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'});
  const sum = logs.reduce((acc, cur) => acc + (parseFloat(cur.valore) || 0), 0);
  const media = Math.round(sum / logs.length);
  const countIpo = logs.filter(r => (parseFloat(r.valore) || 0) < 70).length;
  const countIper = logs.filter(r => (parseFloat(r.valore) || 0) > 200).length;

  if (elUltima) {
    elUltima.textContent = `${ultima.valore} mg/dl`;
    elUltima.style.color = ultima.valore < 70 ? '#dc2626' : (ultima.valore > 200 ? '#ea580c' : '#15803d');
  }
  if (elData) elData.textContent = uDataStr;
  if (elMedia) elMedia.textContent = `${media} mg/dl`;
  if (elConteggio) elConteggio.textContent = `${logs.length} misurazioni`;
  if (elIpo) elIpo.textContent = countIpo;
  if (elIper) elIper.textContent = countIper;

  container.innerHTML = logs.map(r => {
    const val = parseFloat(r.valore) || 0;
    let badgeClass = 'background:#dcfce7; color:#15803d; border:1px solid #86efac;';
    let statoLabel = 'NORMALE';

    if (val < 70) {
      badgeClass = 'background:#fee2e2; color:#991b1b; border:1px solid #f87171; font-weight:800;';
      statoLabel = '⚠️ IPOGLICEMIA';
    } else if (val <= 140) {
      badgeClass = 'background:#ecfdf5; color:#047857; border:1px solid #a7f3d0;';
      statoLabel = 'OTTIMALE';
    } else if (val <= 180) {
      badgeClass = 'background:#fef9c3; color:#854d0e; border:1px solid #fde047;';
      statoLabel = 'ACCETTABILE';
    } else {
      badgeClass = 'background:#ffedd5; color:#c2410c; border:1px solid #fdba74; font-weight:800;';
      statoLabel = '⚠️ ELEVATA';
    }

    const d = new Date(r.timestamp);
    const dataOraStr = d.toLocaleDateString('it-IT') + ' ' + d.toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'});

    return `
      <tr>
        <td><b>${dataOraStr}</b></td>
        <td style="text-align: center;">
          <div style="font-size:16px; font-weight:900; color:#0f172a;">${r.valore} <small style="font-size:11px; font-weight:600;">mg/dl</small></div>
          <span style="font-size:10px; padding:2px 6px; border-radius:4px; ${badgeClass}">${statoLabel}</span>
        </td>
        <td><b>${r.momento || 'Non specificato'}</b></td>
        <td style="text-align: center;">
          ${r.insulina ? `<span style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-weight:800; padding:2px 8px; border-radius:6px; font-size:11.5px;">💉 ${r.insulina} UI</span>` : '<span style="color:#94a3b8; font-size:11px;">Nessuna</span>'}
        </td>
        <td><small style="color:#334155; font-size:12px;">${r.note || 'Nessuna nota aggiuntiva.'}</small></td>
        <td><small style="color:#64748b;">👤 ${r.operatore || 'Caregiver'}</small></td>
        <td style="text-align: center;">
          <button class="btn btn-outline" style="padding:2px 6px; font-size:10.5px; color:#dc2626; border-color:#fca5a5;" onclick="eliminaGlicemia('${r.id}')" title="Elimina misurazione">✕</button>
        </td>
      </tr>
    `;
  }).join('');
}

// 5. GESTIONE DIURESI & CATETERE / SILODYX
function salvaDiuresi(e) {
  e.preventDefault();
  const p = getActivePaziente();
  if (!p) return;

  const entry = {
    id: 'log_' + Date.now(),
    tipo: 'diuresi',
    timestamp: new Date().toISOString(),
    raccolta: document.getElementById('diuresi-tipo').value,
    volume: document.getElementById('diuresi-volume').value,
    aspetto: document.getElementById('diuresi-aspetto').value,
    operatore: document.getElementById('diuresi-operatore').value.trim() || 'Operatore OSS',
    note: document.getElementById('diuresi-note').value.trim()
  };

  p.registrazioni.push(entry);
  closeModal('modal-diuresi');
  saveDb();
  showToast('Controllo diuresi registrato con successo! 🧪');
}

// 6. DIARIO NUTRIZIONALE PASTI
function salvaPasto(e) {
  e.preventDefault();
  const p = getActivePaziente();
  if (!p) return;

  const entry = {
    id: 'log_' + Date.now(),
    tipo: 'pasto',
    timestamp: new Date().toISOString(),
    pasto: document.getElementById('pasto-tipo').value,
    quantita: document.getElementById('pasto-quantita').value,
    alimenti: document.getElementById('pasto-alimenti').value.trim(),
    operatore: document.getElementById('pasto-operatore').value.trim() || 'Operatore OSS'
  };

  p.registrazioni.push(entry);
  closeModal('modal-pasti');
  saveDb();
  showToast(`Pasto [${entry.pasto}] registrato nel diario! 🍲`);
}

// 7. CALCOLATORE UFFICIALE SCALA DI BRADEN
function calcolaBradenScore() {
  const s1 = parseInt(document.getElementById('braden-sensoriale').value) || 0;
  const s2 = parseInt(document.getElementById('braden-umidita').value) || 0;
  const s3 = parseInt(document.getElementById('braden-attivita').value) || 0;
  const s4 = parseInt(document.getElementById('braden-mobilita').value) || 0;
  const s5 = parseInt(document.getElementById('braden-nutrizione').value) || 0;
  const s6 = parseInt(document.getElementById('braden-frizione').value) || 0;

  const totale = s1 + s2 + s3 + s4 + s5 + s6;
  const txtTot = document.getElementById('braden-punti-totali');
  const txtFascia = document.getElementById('braden-fascia-rischio');
  const txtIndicazione = document.getElementById('braden-indicazione-clinica');

  if (txtTot) txtTot.textContent = `${totale} / 23`;

  if (totale <= 9) {
    if (txtFascia) {
      txtFascia.textContent = '🚨 RISCHIO ELEVATISSIMO DI LESIONI DA PRESSIONE';
      txtFascia.style.color = '#b91c1c';
    }
    if (txtIndicazione) txtIndicazione.textContent = 'Priorità clinica assoluta: rotazione q2h rigorosa, materasso ad aria dinamico, idratazione attiva e protezione prominenze ossee.';
  } else if (totale <= 12) {
    if (txtFascia) {
      txtFascia.textContent = '⚠️ RISCHIO ELEVATO DI LESIONI DA PRESSIONE';
      txtFascia.style.color = '#dc2626';
    }
    if (txtIndicazione) txtIndicazione.textContent = 'Indicato materasso antidecubito a pressione alternata, rotazione q2h e crema barriera protettiva.';
  } else if (totale <= 14) {
    if (txtFascia) {
      txtFascia.textContent = '🟡 RISCHIO MODERATO';
      txtFascia.style.color = '#d97706';
    }
    if (txtIndicazione) txtIndicazione.textContent = 'Monitoraggio cute quotidiano, frequenti cambi posturali e cuscino antidecubito.';
  } else {
    if (txtFascia) {
      txtFascia.textContent = '🟢 BASSO RISCHIO';
      txtFascia.style.color = '#15803d';
    }
    if (txtIndicazione) txtIndicazione.textContent = 'Cute in buone condizioni. Mantenere regolare igiene e deambulazione assistita.';
  }

  return { totale, fascia: txtFascia ? txtFascia.textContent : '' };
}

function salvaValutazioneBraden() {
  const p = getActivePaziente();
  if (!p) return;

  const res = calcolaBradenScore();
  const entry = {
    id: 'log_' + Date.now(),
    tipo: 'braden',
    timestamp: new Date().toISOString(),
    score: res.totale,
    fascia: res.fascia,
    operatore: 'Operatore OSS / Infermiere ADI'
  };

  p.registrazioni.push(entry);
  closeModal('modal-braden');
  saveDb();
  showToast(`Valutazione Braden (Score: ${res.totale}/23) registrata nel fascicolo clinico! 🎯`);
}

function copiaTestoConsegna() {
  const txt = document.getElementById('consegna-testo');
  txt.select();
  document.execCommand('copy');
  showToast('Report consegna copiato negli appunti! 📋');
}

function inviaConsegnaWhatsApp() {
  const p = getActivePaziente();
  if (!p) return;
  const txt = document.getElementById('consegna-testo').value;
  const cellAngela = (p.moglieCellulare || '3389449610').replace(/[^0-9]/g, '');
  const waUrl = cellAngela.startsWith('39') 
    ? `https://api.whatsapp.com/send?phone=${cellAngela}&text=${encodeURIComponent(txt)}`
    : `https://api.whatsapp.com/send?phone=39${cellAngela}&text=${encodeURIComponent(txt)}`;
  window.open(waUrl, '_blank');

  // Registra nel diario
  p.registrazioni.push({
    id: 'log_' + Date.now(),
    tipo: 'consegna',
    timestamp: new Date().toISOString(),
    operatore: 'Operatore OSS'
  });
  saveDb();
}

// Inizializzazione Globale

// Controllo e ripristino automatico al cambio di giorno (Mezzanotte)
function verificaCambioDataAutomatico() {
  if (!AppData) return;
  var oggiStr = new Date().toISOString().split('T')[0];

  if (AppData.ultimoGiornoOperativo !== oggiStr) {
    if (AppData.ultimoGiornoOperativo) {
      // Calcolo giorni trascorsi dall'ultimo giorno operativo registrato
      try {
        var d1 = new Date(AppData.ultimoGiornoOperativo);
        var d2 = new Date(oggiStr);
        var diffTime = Math.abs(d2 - d1);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 1) {
          window._giorniAssenzaRilevati = diffDays;
          setTimeout(function() {
            apriModalRiconciliazione(diffDays, AppData.ultimoGiornoOperativo);
          }, 800);
        }
      } catch(e) { console.error('Data check error:', e); }

      (AppData.pazienti || []).forEach(function(p) {
        (p.terapie || []).forEach(function(t) {
          t.fattoOggi = false;
          delete t.saltatoOggi;
          delete t.motivoSalto;
        });
        p.idratazioneOggi = 0;
      });
      AppData.ultimoGiornoOperativo = oggiStr;
      saveDb();
      return;
    }
    AppData.ultimoGiornoOperativo = oggiStr;
    saveDb();
  }
}

function apriModalSmartphone() {
  var img = document.getElementById('img-qr-smartphone');
  if (img && window.QR_CODE_SMARTPHONE_DATA_URL) {
    img.src = window.QR_CODE_SMARTPHONE_DATA_URL;
  }

  var labelIp = document.getElementById('label-ip-smartphone');
  var linkBrowser = document.getElementById('link-browser-smartphone');
  var currentUrl = 'http://192.168.1.5:3000/launcher.html';
  if (labelIp) labelIp.textContent = currentUrl;
  if (linkBrowser) linkBrowser.href = currentUrl;
  
  // Verifica stato server locale
  var dot = document.getElementById('dot-status-server');
  var txt = document.getElementById('text-status-server');
  var box = document.getElementById('status-server-smartphone');
  
  if (dot && txt && box) {
    fetch('http://127.0.0.1:3000/launcher.html', { method: 'HEAD', mode: 'no-cors' })
      .then(function() {
        dot.style.background = '#10b981';
        dot.style.boxShadow = '0 0 8px #10b981';
        txt.style.color = '#065f46';
        txt.textContent = 'Server Smartphone Attivo & Pronto';
        box.style.background = '#ecfdf5';
        box.style.borderColor = '#a7f3d0';
      })
      .catch(function() {
        // Se non risponde prova con l'IP Wi-Fi
        fetch('http://192.168.1.5:3000/launcher.html', { method: 'HEAD', mode: 'no-cors' })
          .then(function() {
            dot.style.background = '#10b981';
            dot.style.boxShadow = '0 0 8px #10b981';
            txt.style.color = '#065f46';
            txt.textContent = 'Server Smartphone Attivo & Pronto';
            box.style.background = '#ecfdf5';
            box.style.borderColor = '#a7f3d0';
          })
          .catch(function() {
            dot.style.background = '#f59e0b';
            dot.style.boxShadow = '0 0 8px #f59e0b';
            txt.style.color = '#92400e';
            txt.textContent = 'Verifica connessione in corso...';
          });
      });
  }

  openModal('modal-smartphone');
}

function apriModalRiconciliazione(giorni, ultimaData) {
  var modal = document.getElementById('modal-riconciliazione');
  var msgIntro = document.getElementById('riconciliazione-messaggio-intro');
  var inputGg = document.getElementById('riconciliazione-giorni-input');
  if (!modal) return;

  var ultimaDataStr = ultimaData ? new Date(ultimaData).toLocaleDateString('it-IT') : 'data precedente';
  if (msgIntro) {
    msgIntro.innerHTML = 'Bentornato! L\'ultimo accesso al software risale a <b>' + ultimaDataStr + '</b> (' + giorni + ' ' + (giorni === 1 ? 'giorno fa' : 'giorni fa') + ').';
  }
  if (inputGg) {
    inputGg.value = Math.max(1, giorni);
  }
  openModal('modal-riconciliazione');
}

function eseguiRiconciliazioneScorte() {
  var inputGg = document.getElementById('riconciliazione-giorni-input');
  var giorni = inputGg ? (parseInt(inputGg.value) || 1) : 1;
  if (giorni <= 0) {
    closeModal('modal-riconciliazione');
    return;
  }

  var totaleScalate = 0;
  (AppData.pazienti || []).forEach(function(p) {
    (p.terapie || []).forEach(function(t) {
      var isBisogno = t.fascia === 'Al Bisogno' || t.fascia === 'Al Bisogno (SOS)' || (t.frequenzaTipo === 'bisogno');
      if (isBisogno) return; // non scalare farmaci al bisogno automaticamente

      var dosiDaScalare = giorni;
      if (t.cadenzaTipo === 'alterni') {
        dosiDaScalare = Math.round(giorni / 2);
      } else if (t.cadenzaTipo === 'quindicinale_15_30') {
        dosiDaScalare = 0;
      }

      if (dosiDaScalare > 0 && typeof t.scorta !== 'undefined') {
        t.scorta = Math.max(0, t.scorta - dosiDaScalare);
        totaleScalate += dosiDaScalare;
      }
    });
  });

  closeModal('modal-riconciliazione');
  saveDb();
  showToast('Riconciliazione completata: aggiornate le scorte per ' + giorni + ' giorni passati! 🔄');
}

// Helper per determinare se una terapia periodica è attiva oggi
function isTerapiaPrevistaOggi(t) {
  if (!t) return true;
  var oggi = new Date();
  var giornoMese = oggi.getDate();

  // Schema alternato mezza / intera: prevista OGNI GIORNO (con dosaggio variabile 0.5 o 1)
  if (t.cadenzaTipo === 'alternata_mezza_intera') {
    return true;
  }

  // 0. Giorni alterni: prevista se i giorni trascorsi dalla data di inizio sono pari (date locali)
  if (t.cadenzaTipo === 'alterni' && t.dataInizioAlterni) {
    var pz = t.dataInizioAlterni.split('-').map(Number);
    var inizio = new Date(pz[0], pz[1] - 1, pz[2]);
    var oggiMezzanotte = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());
    var diffGiorni = Math.round((oggiMezzanotte - inizio) / 86400000);
    return diffGiorni >= 0 && diffGiorni % 2 === 0;
  }

  // 1. Cadenza quindicinale (il 15 e il 30 del mese)
  if (t.cadenzaTipo === 'quindicinale_15_30' || ((t.farmaco || '').toUpperCase().indexOf('DIBASE') >= 0 && (t.modo || '').indexOf('15') >= 0)) {
    // Il 15 e l'ultimo giorno del mese (30 o 31, o 28/29 febbraio)
    var ultimoGiornoMese = new Date(oggi.getFullYear(), oggi.getMonth() + 1, 0).getDate();
    return (giornoMese === 15 || giornoMese === 30 || giornoMese === ultimoGiornoMese);
  }

  // 2. Al bisogno
  if (t.cadenzaTipo === 'bisogno' || t.fascia === 'Al Bisogno' || t.ora === 'Al Bisogno') {
    return true; // sempre richiamabile
  }

  // 3. Quotidiana o default
  return true;
}


function renderAll() {
  verificaCambioDataAutomatico();
  aggiornaCardBuongiornoMattino();
  renderPazientiSelector();
  checkAlvoAlarm();
  checkFarmaciScorteAlert();
  checkAusiliScadenzeAlert();
  aggiornaOrologioPosturale();
  aggiornaIdratazioneUI();
  renderTerapie();
  renderDiario();
  renderVisite();
  renderGlicemie();
}

window.addEventListener('DOMContentLoaded', () => {
  initTabs();
  renderAll();

  // Sincronizza immediatamente il database condiviso dal server (se online)
  sincronizzaDbDalServer();

  // Polling automatico rapido ogni 2 secondi per sincronizzazione istantanea tra PC e Smartphone
  setInterval(() => {
    sincronizzaDbDalServer();
  }, 2000);

  // Sincronizza all'istante non appena l'utente tocca lo schermo o torna sulla scheda del browser
  window.addEventListener('focus', () => { sincronizzaDbDalServer(); });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) sincronizzaDbDalServer();
  });

  // Monitoraggio continuo in tempo reale (Data/Orologio ogni secondo, Postura ogni secondo, Terapie globali)
  aggiornaDataGiornoTerapia();
  setInterval(() => {
    aggiornaDataGiornoTerapia();
    aggiornaOrologioPosturale();
    controllaTerapieGlobaliTuttiPazienti();
    verificaRintoccoOrarioTerapiaAttuale();
  }, 1000);
});

function sbloccaAudioManualmente() {
  const ctx = getAudioContext();
  if (ctx) {
    ctx.resume().then(() => {
      suonaChimeInsistenteElegante();
      const banner = document.getElementById('avviso-sblocco-audio-f5');
      if (banner) banner.style.display = 'none';
      showToast('Suono allarme attivato regolarmente! 🔔');
    });
  }
}


// ==========================================================================
// MODULO STAMPA KIT CARTACEO CLINICO A4 PERSONALIZZATO PER PAZIENTE ATTIVO
// ==========================================================================

function apriModalKitCartaceo() {
  const p = getActivePaziente();
  if (!p) return;
  const eta = calcolaAnniDaData(p.dataNascita);
  document.getElementById('kit-modal-titolo').textContent = `Kit Clinico Cartaceo A4: ${p.nome}`;
  document.getElementById('kit-modal-sottotitolo').textContent = `Assistito di ${eta} anni • ${p.allettato ? 'Paziente Allettato (q2h)' : 'Paziente Deambulante / Non allettato'}`;

  const cardPosture = document.getElementById('kit-card-posture');
  const btnPosture = document.getElementById('btn-stampa-posture');

  if (cardPosture && btnPosture) {
    if (!p.allettato) {
      // Disattiva il controllo posture
      cardPosture.style.opacity = '0.45';
      cardPosture.style.background = '#f8fafc';
      cardPosture.style.borderColor = '#cbd5e1';
      cardPosture.classList.add('disabled-card');
      btnPosture.disabled = true;
      btnPosture.className = 'btn btn-outline';
      btnPosture.style.background = '#e2e8f0';
      btnPosture.style.color = '#64748b';
      btnPosture.style.borderColor = '#cbd5e1';
      btnPosture.style.cursor = 'not-allowed';
      btnPosture.innerHTML = '⚪ Non Allettato (Disattivato)';
      btnPosture.title = 'Controllo rotazione posturale non necessario: il paziente è deambulante';
    } else {
      // Attiva regolarmente per paziente allettato (es. Aldo)
      cardPosture.style.opacity = '1';
      cardPosture.style.background = '#ffffff';
      cardPosture.style.borderColor = '#e2e8f0';
      cardPosture.classList.remove('disabled-card');
      btnPosture.disabled = false;
      btnPosture.className = 'btn btn-success';
      btnPosture.style.background = '#059669';
      btnPosture.style.color = '#ffffff';
      btnPosture.style.borderColor = '#047857';
      btnPosture.style.cursor = 'pointer';
      btnPosture.innerHTML = '🖨️ Stampa Posture';
      btnPosture.title = 'Stampa griglia rotazione q2h obbligatoria';
    }
  }

  openModal('modal-kit-cartaceo');
}

function apriStampaScheda(tipoScheda) {
  const p = getActivePaziente();
  if (!p) return;

  const eta = calcolaAnniDaData(p.dataNascita);
  const dataNascitaFmt = new Date(p.dataNascita).toLocaleDateString('it-IT');
  const medicoNome = p.medicoNome || p.medico || 'Dott. Roberto Scarcia';
  const medStudio = p.medicoStudio || '';
  const medCell = p.medicoTel || p.telMedico || '';
  const medEmail = p.medicoEmail || 'scarcia.roberto@alice.it';
  const farmNome = p.farmaciaDiRiferimento || 'Farmacia MACARIO';
  const farmTel = p.farmaciaTelefono || '080 542 8061';
  const farmInd = p.farmaciaIndirizzo || 'Via G. Petroni, 69/b - Bari';
  const coniugeNome = p.moglieNome || 'Mazzicone Angela';
  const coniugeCell = p.moglieCellulare || '338 944 96 10';

  let htmlContent = '';

  const commonHead = (title, orientation = 'portrait') => `
    <meta charset="utf-8">
    <title>${title} - ${p.nome}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
      @page { size: A4 ${orientation}; margin: 10mm 12mm; }
      * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      body { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 0; font-size: 9.5pt; background: #ffffff; }
      .sheet-container { width: 100%; max-width: 1000px; margin: 0 auto; }
      .header-card { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white; border-radius: 14px; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.2); margin-bottom: 14px; }
      .header-card.danger { background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%); box-shadow: 0 4px 14px rgba(220, 38, 38, 0.25); }
      .header-card.success { background: linear-gradient(135deg, #047857 0%, #059669 100%); box-shadow: 0 4px 14px rgba(5, 150, 105, 0.2); }
      .header-card.purple { background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); box-shadow: 0 4px 14px rgba(79, 70, 229, 0.2); }
      .header-title { font-size: 16pt; font-weight: 900; letter-spacing: -0.3px; margin: 0; line-height: 1.2; text-transform: uppercase; }
      .header-subtitle { font-size: 9.5pt; opacity: 0.9; margin-top: 3px; font-weight: 500; }
      .patient-badge-header { background: rgba(255, 255, 255, 0.18); backdrop-filter: blur(4px); border: 1px solid rgba(255, 255, 255, 0.35); border-radius: 10px; padding: 6px 14px; text-align: right; }
      .patient-badge-header .name { font-size: 12pt; font-weight: 800; color: #ffffff; }
      .patient-badge-header .details { font-size: 8.5pt; color: #f0fdf4; opacity: 0.95; }
      .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
      .kpi-card { background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 8px 12px; }
      .kpi-label { font-size: 8pt; font-weight: 700; color: #64748b; text-transform: uppercase; }
      .kpi-value { font-size: 10.5pt; font-weight: 800; color: #0f172a; margin-top: 2px; }
      .custom-table { width: 100%; border-collapse: separate; border-spacing: 0; border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-top: 8px; }
      .custom-table th { background: #f1f5f9; color: #1e293b; font-weight: 800; font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 10px; border-bottom: 2px solid #cbd5e1; }
      .custom-table td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; font-size: 9pt; }
      .custom-table tr:last-child td { border-bottom: none; }
      .custom-table tr:nth-child(even) td { background: #f8fafc; }
      .time-pill { background: #e0f2fe; color: #0369a1; font-weight: 800; font-size: 9.5pt; padding: 4px 10px; border-radius: 20px; display: inline-block; border: 1px solid #bae6fd; }
      .check-square { width: 22px; height: 22px; border: 2px solid #0284c7; border-radius: 6px; margin: auto; background: #fff; }
      .info-box { border-radius: 10px; padding: 10px 14px; margin: 12px 0; display: flex; align-items: center; gap: 10px; }
      .info-box.blue { background: #f0f9ff; border: 1.5px solid #bae6fd; color: #0369a1; }
      .info-box.red { background: #fef2f2; border: 1.5px solid #fecaca; color: #991b1b; }
      .info-box.green { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #166534; }
      .section-card { background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; margin-bottom: 12px; }
      .section-title { font-size: 11pt; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
      .footer-sign { margin-top: 18px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 8.5pt; color: #64748b; }
      .sign-box { text-align: center; width: 200px; border-top: 1.5px dashed #94a3b8; padding-top: 4px; font-weight: 600; }
    </style>
  `;

  if (tipoScheda === 'farmaci') {
    // 1. SCHEDA TERAPIA FARMACI A4 ORIZZONTALE
    const righeTerapie = (p.terapie || []).map(t => `
      <tr>
        <td style="text-align:center;"><span class="time-pill">🕒 ${t.ora}</span></td>
        <td>
          <b style="font-size:10pt; color:#0f172a;">${t.farmaco}</b><br>
          <small style="color:#64748b; font-weight:600;">Principio: ${t.principio || 'N/D'}</small>
        </td>
        <td style="text-align:center;"><span style="background:#f1f5f9; font-weight:800; padding:3px 8px; border-radius:6px; color:#334155;">${t.dosaggio}</span></td>
        <td style="color:#334155; font-size:8.5pt; line-height:1.35;">${t.modo}</td>
        <td style="text-align:center;"><div class="check-square"></div></td>
        <td style="text-align:center; color:#94a3b8; font-size:8pt; border-left:1px dashed #cbd5e1;">___ / ___</td>
      </tr>
    `).join('');

    htmlContent = `
      <!DOCTYPE html>
      <html lang="it">
      <head>${commonHead('Piano Terapia Farmacologica', 'landscape')}</head>
      <body>
        <div class="sheet-container">
          <div class="header-card">
            <div>
              <h1 class="header-title">💊 PIANO TERAPIA FARMACOLOGICA GIORNALIERA</h1>
              <div class="header-subtitle">Registro clinico ufficiale di somministrazione &bull; Spuntare con una [X] all'assunzione</div>
            </div>
            <div class="patient-badge-header">
              <div class="name">👤 ${p.nome}</div>
              <div class="details">Nascita: ${dataNascitaFmt} (${eta} anni) &bull; Domicilio: ${p.indirizzo || 'Bari'}</div>
            </div>
          </div>

          <div class="kpi-row">
            <div class="kpi-card"><div class="kpi-label">Medico Curante</div><div class="kpi-value">🩺 ${medicoNome}</div></div>
            <div class="kpi-card"><div class="kpi-label">Farmacia di Riferimento</div><div class="kpi-value">🏥 ${farmNome} (${farmTel})</div></div>
            <div class="kpi-card"><div class="kpi-label">Stato Assistito</div><div class="kpi-value">${p.allettato ? '🛌 Allettato (q2h)' : '🚶 Deambulante'}</div></div>
            <div class="kpi-card"><div class="kpi-label">Numero Farmaci Attivi</div><div class="kpi-value">📦 ${(p.terapie || []).length} Terapie / Giorno</div></div>
          </div>

          <table class="custom-table">
            <thead>
              <tr>
                <th style="width:12%; text-align:center;">Orario</th>
                <th style="width:28%;">Specialità Medicinale & Principio</th>
                <th style="width:12%; text-align:center;">Dosaggio</th>
                <th style="width:34%;">Istruzioni, Assunzione & Pasti</th>
                <th style="width:7%; text-align:center;">Assunto</th>
                <th style="width:7%; text-align:center;">Firma</th>
              </tr>
            </thead>
            <tbody>
              ${righeTerapie || '<tr><td colspan="6" style="text-align:center; padding:20px; color:#94a3b8;">Nessuna terapia farmacologica configurata.</td></tr>'}
            </tbody>
          </table>

          <div class="info-box blue" style="margin-top:14px;">
            <span style="font-size:20px;">ℹ️</span>
            <div style="font-size:8.5pt; line-height:1.4;">
              <b>PROTOCOLLO DI SICUREZZA FARMACOLOGICA:</b> Somministrare sempre con acqua a temperatura ambiente. In caso di disfagia, sonnolenza o vomito, non forzare l'assunzione e contattare immediatamente il medico curante o la famiglia.
            </div>
          </div>

          <div class="footer-sign">
            <div>Data Emissione Scheda: <b>${new Date().toLocaleDateString('it-IT')}</b> &bull; CareAssist Pro Medical Suite</div>
            <div class="sign-box">Firma Medico Curante / OSS</div>
          </div>
        </div>
      </body>
      </html>
    `;

  } else if (tipoScheda === 'emergenza') {
    // 2. SCHEDA EMERGENZA A4 VERTICALE AD ALTA VISIBILITÀ
    htmlContent = `
      <!DOCTYPE html>
      <html lang="it">
      <head>${commonHead('Scheda Emergenza Rapida', 'portrait')}</head>
      <body>
        <div class="sheet-container">
          <div class="header-card danger">
            <div>
              <h1 class="header-title">🚨 SCHEDA DI EMERGENZA & CONTATTI RAPIDI</h1>
              <div class="header-subtitle">Da affiggere all'ingresso della stanza o vicino al letto dell'assistito</div>
            </div>
            <div class="patient-badge-header">
              <div class="name">👤 ${p.nome}</div>
              <div class="details">${eta} anni &bull; ${p.indirizzo || 'Bari'}</div>
            </div>
          </div>

          <div class="info-box red" style="background:#fee2e2; border:2px solid #ef4444; justify-content:center; text-align:center; padding:12px;">
            <span style="font-size:28px;">📞</span>
            <div>
              <div style="font-size:14pt; font-weight:900; color:#991b1b; letter-spacing:0.5px;">IN CASO DI EMERGENZA GRAVE O ARRESTO: CHIAMARE 112 / 118</div>
              <div style="font-size:9pt; color:#b91c1c; font-weight:600;">Comunicare all'operatore l'indirizzo esatto: <b>${p.indirizzo || 'Via Giovanni Modugno, 25 - BARI'}</b></div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-title"><span>👤</span> DATI ANAGRAFICI & QUADRO CLINICO ESSENZIALE</div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:9.5pt;">
              <div>Assistito: <b style="font-size:11.5pt; color:#0f172a;">${p.nome}</b></div>
              <div>Data di Nascita: <b>${dataNascitaFmt} (${eta} anni)</b></div>
              <div>Indirizzo Residenza: <b>${p.indirizzo || 'Via Giovanni Modugno, 25 - BARI (BA)'}</b></div>
              <div>Telefono Fisso Casa: <b style="font-size:11pt; color:#0284c7;">${p.telefonoFisso || '080 561 57 14'}</b></div>
            </div>
            <div style="margin-top:10px; padding-top:8px; border-top:1px dashed #e2e8f0; font-size:9pt; color:#475569;">
              <b>Patologie Rilevanti:</b> <span style="color:#0f172a; font-weight:700;">${(p.patologie || []).join(' &bull; ') || 'Nessuna patologia inserita'}</span>
            </div>
          </div>

          <div class="section-card">
            <div class="section-title"><span>☎️</span> RUBRICA RECAPITI MEDICI & FAMIGLIA DI PRIMO INTERVENTO</div>
            <table class="custom-table" style="margin-top:4px;">
              <thead>
                <tr>
                  <th style="width:32%;">Figura di Riferimento</th>
                  <th style="width:38%;">Nome & Ruolo</th>
                  <th style="width:30%; text-align:center;">Numero Telefonico Diretto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>🩺 Medico di Base</b></td>
                  <td><b>${medicoNome}</b></td>
                  <td style="text-align:center;"><b style="font-size:13pt; color:#b91c1c; background:#fef2f2; padding:3px 10px; border-radius:6px; display:inline-block;">${medCell || medStudio || '347 126 59 71'}</b></td>
                </tr>
                <tr>
                  <td><b>👥 Coniuge / Primo Familiare</b></td>
                  <td><b>${coniugeNome}</b></td>
                  <td style="text-align:center;"><b style="font-size:13pt; color:#0369a1; background:#eff6ff; padding:3px 10px; border-radius:6px; display:inline-block;">${coniugeCell}</b></td>
                </tr>
                <tr>
                  <td><b>🏥 Farmacia di Riferimento</b></td>
                  <td><b>${farmNome}</b> (${farmInd})</td>
                  <td style="text-align:center;"><b style="font-size:12pt; color:#047857;">${farmTel}</b></td>
                </tr>
                <tr>
                  <td><b>🚑 Guardia Medica / ADI</b></td>
                  <td>Continuità Assistenziale ASL Bari</td>
                  <td style="text-align:center;"><b style="font-size:12pt; color:#334155;">080 584 11 11</b></td>
                </tr>
                <tr style="background:#fff1f2;">
                  <td><b style="color:#dc2626;">🚨 Numero Unico Emergenze</b></td>
                  <td><b style="color:#dc2626;">Pronto Soccorso / Emergenza 118</b></td>
                  <td style="text-align:center;"><b style="font-size:15pt; color:#dc2626; font-weight:900;">112 / 118</b></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="footer-sign">
            <div>Scheda Clinica di Emergenza Domiciliare &bull; CareAssist Pro</div>
            <div class="sign-box">Firma Responsabile Assistenza</div>
          </div>
        </div>
      </body>
      </html>
    `;

  } else if (tipoScheda === 'posture') {
    // 3. REGISTRO POSTURE q2h A4 ORIZZONTALE AD ALTA LEGGIBILITÀ
    htmlContent = `
      <!DOCTYPE html>
      <html lang="it">
      <head>${commonHead('Registro Rotazione Posturale q2h', 'landscape')}</head>
      <body>
        <div class="sheet-container">
          <div class="header-card success">
            <div>
              <h1 class="header-title">🔄 REGISTRO ROTAZIONE POSTURE (Q2H) & CONTROLLO CUTE</h1>
              <div class="header-subtitle">Protocollo prevenzione lesioni da decubito &bull; Mobilizzare ogni 2 ore e verificare le prominenze ossee</div>
            </div>
            <div class="patient-badge-header">
              <div class="name">👤 ${p.nome}</div>
              <div class="details">${eta} anni &bull; Ausilio: <b>Materasso a Pressione Alternata</b></div>
            </div>
          </div>

          <table class="custom-table">
            <thead>
              <tr>
                <th style="width:10%; text-align:center;">Data</th>
                <th style="width:9%; text-align:center;">08:00 (Dx)</th>
                <th style="width:9%; text-align:center;">10:00 (Sup)</th>
                <th style="width:9%; text-align:center;">12:00 (Sx)</th>
                <th style="width:10%; text-align:center;">14:00 (Pasto)</th>
                <th style="width:9%; text-align:center;">16:00 (Dx)</th>
                <th style="width:9%; text-align:center;">18:00 (Sup)</th>
                <th style="width:9%; text-align:center;">20:00 (Sx)</th>
                <th style="width:9%; text-align:center;">22:00 (Notte)</th>
                <th style="width:17%; text-align:center;">Ispezione Cute & Note</th>
              </tr>
            </thead>
            <tbody>
              ${['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'].map((g, idx) => `
                <tr style="height:32px;">
                  <td style="font-weight:800; text-align:center; background:#f8fafc; color:#1e293b;">${g}<br><span style="font-size:7.5pt; color:#64748b;">__/__/2026</span></td>
                  <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                  <td style="font-size:8pt; color:#475569; text-align:left; padding-left:12px;">
                    <span style="display:inline-block; margin-right:8px;">Integra [ ]</span>
                    <span>Arrossata [ ]</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="display:grid; grid-template-columns: 3fr 1fr; gap:12px; margin-top:12px;">
            <div class="info-box green" style="margin:0;">
              <span style="font-size:22px;">💡</span>
              <div style="font-size:8pt; line-height:1.35;">
                <b>LEGENDA CLINICA ROTAZIONI:</b> <b>Dx:</b> Fianco Destro a 30° con cuscino sotto la schiena &bull; <b>Sup:</b> Supino (schiena) con cuscino sotto polpacci per scaricare talloni &bull; <b>Sx:</b> Fianco Sinistro a 30° &bull; <b>Pasto:</b> Semiseduto a 45°-60°. Non posizionare mai direttamente sul grande trocantere a 90°.
              </div>
            </div>
            <div class="kpi-card" style="margin:0; text-align:center; display:flex; flex-direction:column; justify-content:center;">
              <div class="kpi-label">Valutazione Braden</div>
              <div class="kpi-value" style="color:#b91c1c; font-size:10pt;">🚨 Rischio Elevato</div>
            </div>
          </div>

          <div class="footer-sign">
            <div>Registro Settimanale Assistenza Domiciliare &bull; CareAssist Pro</div>
            <div class="sign-box">Firma Operatore OSS / Caregiver</div>
          </div>
        </div>
      </body>
      </html>
    `;

  } else if (tipoScheda === 'parametri') {
    // 4. REGISTRO PARAMETRI VITALI, ALVO & BILANCIO IDRICO A4 ORIZZONTALE
    htmlContent = `
      <!DOCTYPE html>
      <html lang="it">
      <head>${commonHead('Registro Parametri Vitali & Alvo', 'landscape')}</head>
      <body>
        <div class="sheet-container">
          <div class="header-card" style="background:linear-gradient(135deg, #d97706 0%, #b45309 100%);">
            <div>
              <h1 class="header-title">❤️ REGISTRO PARAMETRI VITALI, ALVO & IDRATAZIONE</h1>
              <div class="header-subtitle">Rilevazione clinica quotidiana di sicurezza per il medico curante e la famiglia</div>
            </div>
            <div class="patient-badge-header">
              <div class="name">👤 ${p.nome}</div>
              <div class="details">Target Idrico: <b>1.200 ml / giorno</b> &bull; Medico: ${medicoNome}</div>
            </div>
          </div>

          <table class="custom-table">
            <thead>
              <tr>
                <th style="width:10%; text-align:center;">Data</th>
                <th style="width:14%; text-align:center;">Pressione (PA mmHg)</th>
                <th style="width:12%; text-align:center;">Battiti (FC bpm)</th>
                <th style="width:12%; text-align:center;">Temperatura (°C)</th>
                <th style="width:14%; text-align:center;">Saturazione (SpO2 %)</th>
                <th style="width:14%; text-align:center;">Evacuazione Alvo</th>
                <th style="width:12%; text-align:center;">Liquidi Assunti (ml)</th>
                <th style="width:12%; text-align:center;">Firma Rilevatore</th>
              </tr>
            </thead>
            <tbody>
              ${['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'].map((g, idx) => `
                <tr style="height:32px;">
                  <td style="font-weight:800; text-align:center; background:#f8fafc; color:#1e293b;">${g}<br><span style="font-size:7.5pt; color:#64748b;">__/__</span></td>
                  <td style="text-align:center; font-weight:700;">____ / ____</td>
                  <td style="text-align:center;">____ bpm</td>
                  <td style="text-align:center;">____ °C</td>
                  <td style="text-align:center; font-weight:700;">____ %</td>
                  <td style="font-size:8pt; text-align:center;">Regolare [ ] / Clisma [ ]</td>
                  <td style="text-align:center; font-weight:700;">____ ml</td>
                  <td></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="info-box red" style="margin-top:12px;">
            <span style="font-size:22px;">⚠️</span>
            <div style="font-size:8.5pt; line-height:1.4;">
              <b>VALORI CRITICI DI ALLERTA IMMEDIATA:</b> Pressione Massima > 160 o < 100 mmHg &bull; Frequenza Cardiaca > 100 o < 50 bpm &bull; Temperatura > 37.5°C &bull; Saturazione SpO2 < 92% &bull; Alvo: nessuna evacuazione da oltre 48 ore.
            </div>
          </div>

          <div class="footer-sign">
            <div>Cartella Parametri Domiciliari &bull; CareAssist Pro</div>
            <div class="sign-box">Firma Medico Curante / OSS</div>
          </div>
        </div>
      </body>
      </html>
    `;

  } else if (tipoScheda === 'guida') {
    // 5. GUIDA CLINICA OPERATIVA A4 VERTICALE GRAFICA
    htmlContent = `
      <!DOCTYPE html>
      <html lang="it">
      <head>${commonHead('Manuale & Guida Operativa Assistito', 'portrait')}</head>
      <body>
        <div class="sheet-container">
          <div class="header-card purple">
            <div>
              <h1 class="header-title">📘 MANUALE & GUIDA OPERATIVA ASSISTENZA DOMICILIARE</h1>
              <div class="header-subtitle">Standard operativi di cura, igiene, nutrizione e sicurezza per l'assistito</div>
            </div>
            <div class="patient-badge-header">
              <div class="name">👤 ${p.nome}</div>
              <div class="details">${eta} anni &bull; Prescrizione Dott. ${medicoNome}</div>
            </div>
          </div>

          ${p.allettato ? `
          <div class="section-card">
            <div class="section-title"><span>🛡️</span> 1. PREVENZIONE LESIONI DA PRESSIONE (DECUBITO) & PROTOCOLLO Q2H</div>
            <div class="info-box green" style="margin: 6px 0 10px 0;">
              <span style="font-size:20px;">⏱️</span>
              <div style="font-size:9pt; font-weight:700;">
                Regola Aurea delle 2 Ore: Ruotare sempre l'assistito ogni 2 ore (fianco dx 30°, supino, fianco sx 30°). Non posizionare mai direttamente a 90° sul trocantere.
              </div>
            </div>
            <ul style="margin:0 0 6px 18px; padding:0; font-size:9pt; color:#334155; line-height:1.5;">
              <li>Mantenere costantemente in funzione il compressore del <b>materasso a pressione alternata</b>.</li>
              <li>Applicare crema barriera protettiva all'ossido di zinco ad ogni cambio ausilio per incontinenza.</li>
              <li>Mantenere le lenzuola perfettamente tese e pulite: pieghe e umidità sono le cause scatenanti delle lesioni.</li>
            </ul>
          </div>` : `
          <div class="section-card">
            <div class="section-title"><span>🚶</span> 1. MOBILIZZAZIONE ATTIVA, DEAMBULAZIONE & PREVENZIONE CADUTE</div>
            <div class="info-box blue" style="margin: 6px 0 10px 0;">
              <span style="font-size:20px;">ℹ️</span>
              <div style="font-size:9pt; font-weight:700;">
                Assistito Deambulante / Non Allettato: Protocollo decubito q2h non necessario. Promuovere il movimento sicuro e la camminata assistita.
              </div>
            </div>
            <ul style="margin:0 0 6px 18px; padding:0; font-size:9pt; color:#334155; line-height:1.5;">
              <li>Incoraggiare piccoli spostamenti quotidiani e seduta attiva su poltrona comoda.</li>
              <li>Utilizzare calzature chiuse, stabili e con suola antiscivolo; rimuovere tappeti o intralci a pavimento.</li>
              <li>${p.id === 'paz_angela' ? 'Utilizzo della <b>CPAP notturna</b> prescritto per OSAS (Apnee Ostruttive nel Sonno): verificare posizionamento maschera e pulizia circuito.' : 'Garantire supervisione durante i cambi di postura da seduto a in piedi per prevenire ipotensione ortostatica.'}</li>
            </ul>
          </div>`} 

          <div class="section-card">
            <div class="section-title"><span>🍲</span> 2. NUTRIZIONE, IDRATAZIONE & PREVENZIONE POLMONITE AB INGESTIS</div>
            <div class="info-box blue" style="margin: 6px 0 10px 0;">
              <span style="font-size:20px;">🪑</span>
              <div style="font-size:9pt; font-weight:700;">
                Postura Pasti: Alimentare SEMPRE l'assistito con schienale sollevato ad almeno 45°-60° (mai disteso). Mantenere la posizione seduta per 30 minuti dopo il pasto.
              </div>
            </div>
            <ul style="margin:0 0 6px 18px; padding:0; font-size:9pt; color:#334155; line-height:1.5;">
              <li>Garantire almeno <b>1.200 ml di liquidi al giorno</b> suddivisi in piccoli sorsi durante tutto l'arco della giornata.</li>
              <li>Somministrare cibi morbidi ed omogenei. In caso di colpi di tosse, fermare subito il pasto e verificare la respirazione.</li>
            </ul>
          </div>

          <div class="section-card">
            <div class="section-title"><span>💊</span> 3. GESTIONE TERAPIE FARMACOLOGICHE & ALLERTE MEDICHE</div>
            <ul style="margin:0 0 6px 18px; padding:0; font-size:9pt; color:#334155; line-height:1.5;">
              <li>Rispettare scrupolosamente gli orari programmati (es. gastroprotettore a digiuno 30 min prima di colazione).</li>
              <li>In caso di sonnolenza profonda o difficoltà di deglutizione, non forzare l'assunzione di compresse e avvisare il medico.</li>
            </ul>
          </div>

          <div class="footer-sign">
            <div>Linee Guida Assistenziali Domiciliari &bull; CareAssist Pro Medical Suite</div>
            <div class="sign-box">Firma Presa Visione OSS / Caregiver</div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Apertura finestra di stampa pulita con layout professionale
  const printWin = window.open('', '_blank');
  printWin.document.write(htmlContent);
  printWin.document.close();
  printWin.focus();
  setTimeout(() => {
    printWin.print();
  }, 450);
}


// ==========================================================================
// RUBRICA MEDICI & FARMACIE STRUTTURA / RSA / TERRITORIO (AUTO-COMPILAZIONE)
// ==========================================================================
const DB_PRESET_MEDICI_FARMACIE = {
  scarcia_macario: {
    medicoNome: 'Dott. Roberto Scarcia',
    medicoIndirizzo: 'Via Muciaccia, 11 - 70121 Bari',
    medicoStudio: 'Via Muciaccia, 11 - 70121 Bari',
    medicoTelStudio: '080 557 44 90',
    medicoCell: '347 126 59 71',
    medicoEmail: 'scarcia.roberto@alice.it',
    medicoPec: 'roberto.scarcia@pec.it',
    medicoOrari: 'Lunedì: 10:00-13:00. Martedì: 10:00-13:00 e 16:00-19:00. Mercoledì: 10:00-13:00. Giovedì: 16:00-19:00. Venerdì: 10:00-13:00 (Bari - Via Muciaccia 11)',
    farmaciaNome: 'Farmacia Dott. MACARIO',
    farmaciaIndirizzo: 'Via G. Petroni, 69/b - Bari',
    farmaciaTel: '080 542 8061'
  },
  potenza: {
    medicoNome: 'Dr.ssa Carolina Potenza',
    medicoIndirizzo: 'Sarconi: Via Provinciale 1 / Moliterno: Via Parco del Seggio 1',
    medicoStudio: 'Sarconi: Via Provinciale 1 / Moliterno: Via Parco del Seggio 1',
    medicoCell: '338 379 05 64',
    medicoEmail: 'carolina.potenza@aspbasilicata.it',
    medicoPec: 'carolina.potenza@pec.it',
    medicoOrari: 'Sarconi: Lun-Mer-Ven 9:30-13:00, Mar-Gio 15:00-18:30. Moliterno: Lun 15:00-18:00, Gio 9:00-13:00 (su appuntamento)',
    farmaciaNome: 'Farmacia Girasole Picconi',
    farmaciaIndirizzo: 'Via Ariosto, 4 / 16 - 85012 Corleto Perticara (PZ)',
    farmaciaTel: '0971 963055'
  },
  medico_rsa: {
    medicoNome: 'Dott. Direttore Sanitario RSA / Reparto',
    medicoStudio: '080 500 11 22',
    medicoCell: '335 123 45 67',
    medicoEmail: 'direzione.sanitaria@rsa-bari.it',
    medicoPec: 'direzione.sanitaria@pec.rsa-bari.it',
    farmaciaNome: 'Farmacia Ospedaliera / Struttura RSA',
    farmaciaIndirizzo: 'Presidio Domiciliare Struttura',
    farmaciaTel: '080 500 11 33'
  },
  adi_bari: {
    medicoNome: 'Servizio Medico Territoriale ADI ASL Bari',
    medicoStudio: '080 584 11 11',
    medicoCell: '080 584 22 22',
    medicoEmail: 'adi.territorio@asl.bari.it',
    medicoPec: 'protocollo.aslbari@pec.rupar.puglia.it',
    farmaciaNome: 'Farmacia Territoriale Distretto ASL',
    farmaciaIndirizzo: 'Distretto Socio Sanitario Bari',
    farmaciaTel: '080 584 33 44'
  }
};

function applicaPresetMedicoFarmacia(chiave, modalType) {
  if (!chiave || chiave === 'manuale') return;
  const dati = DB_PRESET_MEDICI_FARMACIE[chiave];
  if (!dati) return;

  if (modalType === 'nuovo') {
    const elMedNome = document.getElementById('nuovo-paz-medico-nome');
    const elMedTel = document.getElementById('nuovo-paz-medico-tel');
    const elMedEmail = document.getElementById('nuovo-paz-medico-email');
    const elFarmNome = document.getElementById('nuovo-paz-farmacia');
    const elFarmTel = document.getElementById('nuovo-paz-farmacia-tel');

    if (elMedNome) elMedNome.value = dati.medicoNome;
    if (elMedTel) elMedTel.value = dati.medicoStudio || dati.medicoCell;
    if (elMedEmail) elMedEmail.value = dati.medicoEmail;
    if (elFarmNome) elFarmNome.value = dati.farmaciaNome + (dati.farmaciaIndirizzo ? ' (' + dati.farmaciaIndirizzo + ')' : '');
    if (elFarmTel) elFarmTel.value = dati.farmaciaTel;

    showToast('Campi Medico e Farmacia auto-compilati da Rubrica! ✨');

  } else if (modalType === 'edit') {
    const elMedNome = document.getElementById('edit-paz-medico-nome');
    const elMedStudio = document.getElementById('edit-paz-medico-studio');
    const elMedCell = document.getElementById('edit-paz-medico-tel');
    const elMedEmail = document.getElementById('edit-paz-medico-email');
    const elMedPec = document.getElementById('edit-paz-medico-pec');
    const elFarmNome = document.getElementById('edit-paz-farmacia');

    if (elMedNome) elMedNome.value = dati.medicoNome;
    const elMedInd = document.getElementById('edit-paz-medico-indirizzo');
    if (elMedInd) elMedInd.value = dati.medicoIndirizzo || dati.medicoStudio || '';
    const elMedOra = document.getElementById('edit-paz-medico-orari');
    if (elMedOra) elMedOra.value = dati.medicoOrari || '';
    popolaPlannerDaTesto(dati.medicoOrari || '');
    if (elMedStudio) elMedStudio.value = dati.medicoStudio || '';
    if (elMedCell) elMedCell.value = dati.medicoCell;
    if (elMedEmail) elMedEmail.value = dati.medicoEmail;
    if (elMedPec) elMedPec.value = dati.medicoPec || '';
    if (elFarmNome) elFarmNome.value = dati.farmaciaNome;
    const elFarmTel = document.getElementById('edit-paz-farmacia-tel');
    if (elFarmTel) elFarmTel.value = formattaNumeroTelefonico(dati.farmaciaTel || '');
    const elFarmInd = document.getElementById('edit-paz-farmacia-indirizzo');
    if (elFarmInd) elFarmInd.value = dati.farmaciaIndirizzo || '';

    showToast('Campi Medico e Farmacia aggiornati da Rubrica! ✨');
  }
}


// Timer di aggiornamento in tempo reale del badge studio medico (ogni 30s)
if (!window._smartStudioTimerStarted) {
  window._smartStudioTimerStarted = true;
  setInterval(() => {
    const activeP = getActivePaziente();
    if (activeP) {
      renderPazientiSelector();
    }
  }, 30000);
}

// Rintocco Sonoro Discreto all'Orario Esatto di Somministrazione (Soft Chime)
let _ultimoMinutoNotificatoTerapia = '';
function verificaRintoccoOrarioTerapiaAttuale() {
  const p = getActivePaziente();
  if (!p || !p.terapie) return;

  const now = new Date();
  const hStr = (now.getHours() < 10 ? '0' : '') + now.getHours();
  const mStr = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
  const oraCorrente = hStr + ':' + mStr;

  if (_ultimoMinutoNotificatoTerapia === oraCorrente) return;

  // Cerca se esiste una terapia prevista per oggi programmata esattamente a questo minuto
  const terapieOra = p.terapie.filter(t => isTerapiaPrevistaOggi(t) && !t.fattoOggi && !t.saltatoOggi && t.ora === oraCorrente);
  if (terapieOra.length > 0) {
    _ultimoMinutoNotificatoTerapia = oraCorrente;
    try {
      const ctx = getAudioContext();
      if (ctx) {
        if (ctx.state === 'suspended') ctx.resume();
        const t0 = ctx.currentTime;
        // Dolce doppio rintocco campanella armonico (La5 880Hz -> Do#6 1108Hz)
        [880.0, 1108.73].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const tN = t0 + (idx * 0.18);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, tN);
          gain.gain.setValueAtTime(0, tN);
          gain.gain.linearRampToValueAtTime(0.08, tN + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, tN + 0.7);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(tN);
          osc.stop(tN + 0.75);
        });
      }
    } catch(e) { console.error('Audio error:', e); }

    const nomi = terapieOra.map(t => t.farmaco).join(', ');
    showToast(`🔔 Promemoria Orario (${oraCorrente}): Somministrare ${nomi} a ${p.nome}`, 'warning');
  }
}

// Gestione Note di Turno e Report WhatsApp Operatore
function apriModalNuovaNotaTurno() {
  const p = getActivePaziente();
  if (!p) return;
  const opNome = localStorage.getItem('milella_user_nome') || '';
  const inPaz = document.getElementById('nota-turno-paziente-nome');
  const inOp = document.getElementById('nota-turno-operatore');
  const inTesto = document.getElementById('nota-turno-testo');
  if (inPaz) inPaz.value = p.nome;
  if (inOp) inOp.value = opNome;
  if (inTesto) inTesto.value = '';
  openModal('modal-nota-turno');
}

function salvaNotaTurno() {
  const p = getActivePaziente();
  if (!p) return;
  const inOp = document.getElementById('nota-turno-operatore');
  const inTesto = document.getElementById('nota-turno-testo');
  const opNome = inOp ? inOp.value.trim() : '';
  const testo = inTesto ? inTesto.value.trim() : '';

  if (!testo) {
    alert('Inserisci una nota prima di salvare.');
    return;
  }

  p.registrazioni = p.registrazioni || [];
  p.registrazioni.unshift({
    id: 'nota_' + Date.now(),
    timestamp: new Date().toISOString(),
    tipo: 'nota_turno',
    operatore: opNome || 'Operatore',
    testo: testo
  });

  saveDb();
  closeModal('modal-nota-turno');
  showToast('✅ Nota di turno registrata con successo nel Diario!');
}

function inviaReportTurnoWhatsApp() {
  const p = getActivePaziente();
  if (!p) return;

  const oggi = new Date();
  const dataOggiStr = oggi.toLocaleDateString('it-IT');
  const opNome = localStorage.getItem('milella_user_nome') || 'Operatore';

  // Terapie di oggi
  const terapieOggi = (p.terapie || []).filter(t => isTerapiaPrevistaOggi(t));
  const fatte = terapieOggi.filter(t => t.fattoOggi);
  const saltate = terapieOggi.filter(t => t.saltatoOggi);
  const daFare = terapieOggi.filter(t => !t.fattoOggi && !t.saltatoOggi);

  // Ultime note o parametri
  const ultimeNote = (p.registrazioni || [])
    .filter(r => {
      const d = new Date(r.timestamp);
      return d.toDateString() === oggi.toDateString();
    })
    .slice(0, 5);

  let msg = `📋 *REPORT TURNO ASSISTENZA - ${dataOggiStr}*\n`;
  msg += `👤 Assistito: *${p.nome}*\n`;
  msg += `👷 Operatore: *${opNome}*\n\n`;

  msg += `💊 *TERAPIE FARMACOLOGICHE:*\n`;
  msg += `✅ Somministrate: ${fatte.length} di ${terapieOggi.length}\n`;
  if (saltate.length > 0) {
    msg += `❌ Saltate/Rifiutate: ${saltate.map(s => s.farmaco + ' (' + (s.motivoSalto || '') + ')').join(', ')}\n`;
  }
  if (daFare.length > 0) {
    msg += `⏳ Da somministrare: ${daFare.map(d => d.farmaco + ' (' + d.ora + ')').join(', ')}\n`;
  }

  if (ultimeNote.length > 0) {
    msg += `\n📝 *ANNOTAZIONI & EVENTI DI OGGI:*\n`;
    ultimeNote.forEach(n => {
      const oraStr = new Date(n.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      if (n.tipo === 'nota_turno') {
        msg += `• [${oraStr}] Nota: ${n.testo}\n`;
      } else if (n.tipo === 'parametri') {
        msg += `• [${oraStr}] Parametri: PA ${n.pa_max}/${n.pa_min}, FC ${n.fc}, SpO2 ${n.spo2}%\n`;
      } else if (n.tipo === 'alvo') {
        msg += `• [${oraStr}] Alvo: ${n.consistenza} (${n.note || 'regolare'})\n`;
      }
    });
  }

  msg += `\n_Inviato da CareAssist Pro - Suite C. Milella_`;

  const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}



// ============================================================================
// AGGIORNAMENTO FORZATO & PULIZIA CACHE PER VISUALIZZARE NUOVE SCHEDE
// ============================================================================
async function forzaAggiornamentoApp() {
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let reg of registrations) {
        await reg.unregister();
      }
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      for (let k of keys) {
        await caches.delete(k);
      }
    }
  } catch (err) {
    console.warn('Errore pulizia cache:', err);
  }
  showToast('Aggiornamento forzato completato! Ricarica in corso...');
  setTimeout(() => {
    window.location.reload(true);
  }, 400);
}


// ============================================================================
// GUIDA INTERATTIVA AI CONTROLLI (TOUCH MOBILE & DESKTOP)
// ============================================================================
function toggleHelpBubble(bubbleId) {
  var el = document.getElementById(bubbleId);
  if (!el) return;
  var isAct = el.classList.contains('active');
  // Se già attivo, chiudi
  if (isAct) {
    el.classList.remove('active');
  } else {
    // Chiudi altri se aperti
    document.querySelectorAll('.field-help-bubble.active').forEach(function(b) {
      b.classList.remove('active');
    });
    el.classList.add('active');
  }
}

var _tuttiAiutiAperti = false;
function toggleTuttiAiutiCampi() {
  _tuttiAiutiAperti = !_tuttiAiutiAperti;
  var bubbles = document.querySelectorAll('.field-help-bubble');
  bubbles.forEach(function(b) {
    if (_tuttiAiutiAperti) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
  var btnText = document.getElementById('btn-toggle-help-text');
  if (btnText) {
    btnText.textContent = _tuttiAiutiAperti ? 'Nascondi Guida' : 'Mostra Guida Campi';
  }
}


// ============================================================================
// 4 SUPER ARRICCHIMENTI CLINICI (CALCOLO SCORTE, WHATSAPP, VOCE, PROSPETTO TASCABILE)
// ============================================================================

// 1. CALCOLO PREVISIONE SCORTE & DATA ESAURIMENTO
function ricalcolaAutonomiaScorteModifica() {
  var elScorta = document.getElementById('edit-farm-scorta');
  var elQuota = document.getElementById('edit-farm-frazione-quota');
  var elCad = document.getElementById('edit-farm-cadenza');
  var elAlert = document.getElementById('edit-farm-giorni-alert');
  var elTesto = document.getElementById('scorta-data-fine-testo');
  var box = document.getElementById('box-autonomia-scorte');
  if (!elScorta || !elTesto) return;

  var scorta = parseFloat(elScorta.value) || 0;
  var quotaDose = elQuota ? (parseFloat(elQuota.value) || 1) : 1;
  var cadTipo = elCad ? elCad.value : 'giornaliera';
  var alertGg = elAlert ? (parseInt(elAlert.value) || 7) : 7;

  // Calcola consumo giornaliero stimato (in cpr/giorno)
  var consumoGiornaliero = quotaDose;
  if (cadTipo === 'alternata_mezza_intera') {
    consumoGiornaliero = 0.75; // media tra 0.5 e 1 cpr al giorno
  } else if (cadTipo === 'alternati') {
    consumoGiornaliero = quotaDose / 2;
  } else if (cadTipo === 'settimanale') {
    consumoGiornaliero = quotaDose / 7;
  } else if (cadTipo === 'quindicinale_15_30') {
    consumoGiornaliero = (quotaDose * 2) / 30;
  } else if (cadTipo === 'mensile') {
    consumoGiornaliero = quotaDose / 30;
  } else if (cadTipo === 'bisogno') {
    consumoGiornaliero = quotaDose * 0.2; // stima al bisogno
  }

  if (consumoGiornaliero <= 0) consumoGiornaliero = 1;

  var giorniRimanenti = Math.floor(scorta / consumoGiornaliero);
  var dataFine = new Date();
  dataFine.setDate(dataFine.getDate() + giorniRimanenti);

  var opzioniData = { day: 'numeric', month: 'long', year: 'numeric' };
  var dataFineStr = dataFine.toLocaleDateString('it-IT', opzioniData);

  var statoColore = '#15803d'; // Verde
  var statoBg = '#f0fdf4';
  var statoBorder = '#86efac';

  if (giorniRimanenti <= 3) {
    statoColore = '#b91c1c'; // Rosso esaurimento critico
    statoBg = '#fef2f2';
    statoBorder = '#fca5a5';
  } else if (giorniRimanenti <= alertGg) {
    statoColore = '#b45309'; // Arancione preavviso
    statoBg = '#fffbeb';
    statoBorder = '#fcd34d';
  }

  if (box) {
    box.style.background = statoBg;
    box.style.borderColor = statoBorder;
  }

  elTesto.style.color = statoColore;
  elTesto.innerHTML = 'Scorta sufficiente per <b>' + giorniRimanenti + ' giorni</b> (fino al <b>' + dataFineStr + '</b>)';
}

// 2. SIMULATORE INTERATTIVO CADENZA (COSA TOCCA OGGI?)
function ricalcolaSimulatoreCadenzaOggi() {
  var elCad = document.getElementById('edit-farm-cadenza');
  var elQuota = document.getElementById('edit-farm-frazione-quota');
  var elTesto = document.getElementById('simulatore-cadenza-testo');
  var elBadge = document.getElementById('simulatore-cadenza-badge');
  if (!elCad || !elTesto) return;

  var cadTipo = elCad.value;
  var oggi = new Date();
  var giornoMese = oggi.getDate();
  var giornoSettimana = oggi.toLocaleDateString('it-IT', { weekday: 'long' });

  // Calcolo per dosi alternate (1/2 cpr o 1 cpr)
  var msPerDay = 86400000;
  var epochDays = Math.floor(oggi.getTime() / msPerDay);
  var isGiornoPari = (epochDays % 2 === 0);

  if (cadTipo === 'alternata_mezza_intera') {
    var doseOggi = isGiornoPari ? '1/2 compressa (Mezza dose)' : '1 compressa intera';
    var doseDomani = isGiornoPari ? '1 compressa intera' : '1/2 compressa (Mezza dose)';
    elTesto.innerHTML = 'Oggi tocca: <b style="color:#1e40af;">' + doseOggi + '</b> (Domani: ' + doseDomani + ')';
    if (elBadge) {
      elBadge.textContent = isGiornoPari ? 'Dose 0,5' : 'Dose 1,0';
      elBadge.style.background = isGiornoPari ? '#fef3c7' : '#dbeafe';
      elBadge.style.color = isGiornoPari ? '#b45309' : '#1d4ed8';
    }
  } else if (cadTipo === 'quindicinale_15_30') {
    var toccaOggi = (giornoMese === 15 || giornoMese === 30 || (giornoMese === 28 && oggi.getMonth() === 1));
    elTesto.innerHTML = toccaOggi ? '<b style="color:#15803d;">OGGI È GIORNO DI ASSUNZIONE!</b> (15 o 30 del mese)' : 'Oggi <b>NON</b> va assunto. Si assume il 15 e il 30.';
    if (elBadge) {
      elBadge.textContent = toccaOggi ? '✅ SI OGGI' : '❌ NO OGGI';
      elBadge.style.background = toccaOggi ? '#dcfce7' : '#fee2e2';
      elBadge.style.color = toccaOggi ? '#15803d' : '#dc2626';
    }
  } else if (cadTipo === 'alternati') {
    var toccaAlterni = isGiornoPari;
    elTesto.innerHTML = toccaAlterni ? '<b style="color:#15803d;">Oggi SI assume</b> (Giorno alterno attivo)' : '<b style="color:#64748b;">Oggi NON si assume</b> (Giorno di pausa)';
    if (elBadge) {
      elBadge.textContent = toccaAlterni ? '✅ SI' : '⏸️ PAUSA';
      elBadge.style.background = toccaAlterni ? '#dcfce7' : '#f1f5f9';
      elBadge.style.color = toccaAlterni ? '#15803d' : '#64748b';
    }
  } else if (cadTipo === 'giornaliera') {
    var qStr = elQuota && elQuota.options[elQuota.selectedIndex] ? elQuota.options[elQuota.selectedIndex].text : '1 compressa';
    elTesto.innerHTML = 'Assunzione quotidiana regolare: <b>' + qStr + '</b> tutti i giorni';
    if (elBadge) {
      elBadge.textContent = 'Quotidiano';
      elBadge.style.background = '#dbeafe';
      elBadge.style.color = '#1d4ed8';
    }
  } else {
    elTesto.innerHTML = 'Regola periodica: ' + elCad.options[elCad.selectedIndex].text;
    if (elBadge) {
      elBadge.textContent = 'Periodico';
      elBadge.style.background = '#e2e8f0';
      elBadge.style.color = '#475569';
    }
  }
}

// 3. INVIO RICHIESTA RICETTA AUTOMATICA SU WHATSAPP AL MEDICO
function inviaRichiestaRicettaWhatsApp() {
  var p = getActivePaziente();
  if (!p) return;

  var farmaco = document.getElementById('edit-farm-nome').value.trim() || 'Farmaco';
  var dosaggio = document.getElementById('edit-farm-dosaggio').value.trim() || '';
  var scorta = document.getElementById('edit-farm-scorta').value.trim() || '0';
  var medicoNome = p.medicoNome || 'Dottore';
  var pazienteNome = (p.nome || 'Paziente').replace(/\s*\(\d+\s*anni\)/gi, '');

  var testoMsg = 'Gentile ' + medicoNome + ', Le scrivo per conto dell\'assistito/a ' + pazienteNome + '. ' +
    'Le scorte del farmaco *' + farmaco + '* (' + dosaggio + ') sono quasi esaurite (rimangono *' + scorta + ' compresse*). ' +
    'Le chiediamo cortesemente se può predisporre la ricetta medica per il rinnovo della confezione. Cordiali saluti.';

  var urlWa = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(testoMsg);
  window.open(urlWa, '_blank');
}

// 4. SINTESI VOCALE CLINICA: ASCOLTA LE ISTRUZIONI AD ALTA VOCE
var _synthInCorso = null;
function leggiIstruzioniFarmacoVoce() {
  if (!('speechSynthesis' in window)) {
    alert('Spiacenti, il tuo browser non supporta la sintesi vocale.');
    return;
  }

  var btnText = document.getElementById('btn-voce-text');
  var btnIcon = document.getElementById('btn-voce-icon');

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    if (btnText) btnText.textContent = 'Ascolta Istruzioni';
    if (btnIcon) btnIcon.textContent = '🔊';
    return;
  }

  var farmaco = document.getElementById('edit-farm-nome').value.trim() || 'Farmaco';
  var ora = document.getElementById('edit-farm-ora').value || '';
  var fascia = document.getElementById('edit-farm-fascia').value || '';
  var modo = document.getElementById('edit-farm-modo').value.trim() || '';
  var elQuota = document.getElementById('edit-farm-frazione-quota');
  var doseDesc = elQuota && elQuota.options[elQuota.selectedIndex] ? elQuota.options[elQuota.selectedIndex].text : 'una dose';

  var testoDaLeggere = 'Istruzioni per ' + farmaco + '. Da assumere alle ore ' + ora + ', ' + fascia + '. Quantità: ' + doseDesc + '. ' + modo;

  var utterance = new SpeechSynthesisUtterance(testoDaLeggere);
  utterance.lang = 'it-IT';
  utterance.rate = 0.95; // ritmo calmo e chiaro per anziani e famiglie
  utterance.pitch = 1.0;

  utterance.onstart = function() {
    if (btnText) btnText.textContent = 'In riproduzione... (Tocca per fermare)';
    if (btnIcon) btnIcon.textContent = '⏹️';
  };

  utterance.onend = function() {
    if (btnText) btnText.textContent = 'Ascolta Istruzioni';
    if (btnIcon) btnIcon.textContent = '🔊';
  };

  utterance.onerror = function() {
    if (btnText) btnText.textContent = 'Ascolta Istruzioni';
    if (btnIcon) btnIcon.textContent = '🔊';
  };

  window.speechSynthesis.speak(utterance);
}

// 5. PROSPETTO TASCABILE MEDICO CON QR CODE
function apriModalProspettoTascabile() {
  var p = getActivePaziente();
  if (!p || !p.terapie) return;

  var elNome = document.getElementById('tascabile-paziente-nome');
  var elInfo = document.getElementById('tascabile-paziente-info');
  var elData = document.getElementById('tascabile-data-generazione');
  var container = document.getElementById('tascabile-lista-farmaci');

  if (elNome) elNome.textContent = (p.nome || 'Paziente').replace(/\s*\(\d+\s*anni\)/gi, '');
  if (elInfo) elInfo.textContent = (p.diagnosi || p.note || 'Assistito domiciliare') + ' • Medico: ' + (p.medicoNome || 'Curante');
  if (elData) elData.textContent = new Date().toLocaleDateString('it-IT');

  if (container) {
    container.innerHTML = p.terapie.map(function(t, idx) {
      return '<div style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:' + (idx % 2 === 0 ? '#f8fafc' : '#ffffff') + '; border:1px solid #e2e8f0; border-radius:8px; font-size:12px;">' +
        '<div>' +
          '<b style="color:#1e3a8a;">' + (t.ora || '--:--') + '</b> &bull; ' +
          '<b>' + (t.farmaco || 'Farmaco') + '</b> ' +
          '<span style="color:#64748b; font-size:11px;">(' + (t.principio || '') + ')</span><br>' +
          '<span style="font-size:11px; color:#334155;">' + (t.modo || '') + '</span>' +
        '</div>' +
        '<div style="text-align:right; font-weight:700; color:#0369a1; font-size:11px;">' +
          (t.dosaggio || '') +
        '</div>' +
      '</div>';
    }).join('');
  }

  // Genera QR Code semplice sul canvas
  generaQrCodeTascabileCanvas(p);

  openModal('modal-prospetto-tascabile');
}

function generaQrCodeTascabileCanvas(p) {
  var canvas = document.getElementById('tascabile-qrcode-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Se è inclusa la libreria qrcode o qrcode_data_uri, usala, altrimenti disegna una matrice segnaposto pulita
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(4, 4, 20, 20);
  ctx.fillRect(44, 4, 20, 20);
  ctx.fillRect(4, 44, 20, 20);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(8, 8, 12, 12);
  ctx.fillRect(48, 8, 12, 12);
  ctx.fillRect(8, 48, 12, 12);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(11, 11, 6, 6);
  ctx.fillRect(51, 11, 6, 6);
  ctx.fillRect(11, 51, 6, 6);

  // Micro pixel matrix
  for (var x = 28; x <= 40; x += 4) {
    for (var y = 4; y <= 64; y += 4) {
      if ((x + y) % 3 === 0) ctx.fillRect(x, y, 3, 3);
    }
  }
}

function stampaProspettoTascabile() {
  window.print();
}


// ============================================================================
// ☀️ REGALO DEL MATTINO: MORNING BRIEFING & ROUTINE COLAZIONE MULTI-PAZIENTE
// ============================================================================
function aggiornaCardBuongiornoMattino() {
  var card = document.getElementById('card-buongiorno-mattino');
  if (!card) return;

  var adesso = new Date();
  var ora = adesso.getHours();

  // 1. Riconoscimento dinamico dell'operatore autenticato
  var opNome = localStorage.getItem('milella_user_nome') || localStorage.getItem('milella_last_authenticated_user') || 'Ciro';
  // Puliamo suffissi tipo (Admin) per un saluto elegante
  var nomeDisplay = opNome.replace(/\(Admin\)/gi, '').trim();

  // Saluto dinamico in base all'ora e all'operatore autenticato
  var salutoElem = document.getElementById('buongiorno-saluto-testo');
  var badgeElem = document.getElementById('buongiorno-orario-badge');
  if (salutoElem) {
    if (ora >= 5 && ora < 12) {
      salutoElem.textContent = 'Buongiorno ' + nomeDisplay + '! ☀️ Buon inizio giornata!';
      if (badgeElem) badgeElem.textContent = '☕ Colazione & Mattino';
    } else if (ora >= 12 && ora < 15) {
      salutoElem.textContent = 'Buon Pomeriggio ' + nomeDisplay + '! 🍲 Turno di Pranzo';
      if (badgeElem) badgeElem.textContent = '🍲 Orario Pranzo';
    } else if (ora >= 15 && ora < 19) {
      salutoElem.textContent = 'Pomeriggio Assistenziale ' + nomeDisplay + ' 🌤️';
      if (badgeElem) badgeElem.textContent = '🌤️ Pomeriggio';
    } else {
      salutoElem.textContent = 'Buonasera ' + nomeDisplay + '! 🌙 Terapie Serali & Riposo';
      if (badgeElem) badgeElem.textContent = '🌙 Orario Sera / Cena';
    }
  }

  var container = document.getElementById('buongiorno-chips-container');
  if (!container || !AppData || !AppData.pazienti) return;

  // 2. Filtro privacy: mostra SOLO i pazienti a cui l'operatore è abilitato (es. solo Rosa per M.C. Stoppelli)
  var listaPazientiVisibili = typeof getPazientiAccessibili === 'function' ? getPazientiAccessibili() : AppData.pazienti;

  var cardsPazientiHtml = listaPazientiVisibili.map(function(p) {
    var terapieMattino = (p.terapie || []).filter(function(t) {
      var f = (t.fascia || '').toLowerCase();
      var o = t.ora || '';
      return f.indexOf('mattina') >= 0 || f.indexOf('digiuno') >= 0 || f.indexOf('colazione') >= 0 || (o >= '06:00' && o <= '10:30');
    });

    var fatteMattino = terapieMattino.filter(function(t) { return t.fattoOggi; }).length;
    var totMattino = terapieMattino.length;
    var tutteFatte = totMattino > 0 && fatteMattino === totMattino;
    var stAuto = tutteFatte ? '✅ Colazione Completata' : (totMattino > 0 ? ('☕ ' + fatteMattino + '/' + totMattino + ' Terapie Mattino') : 'Nessuna terapia mattutina');

    var pNomePrimo = (p.nome || 'Paziente').split(' ')[0];
    var isAttivo = (p.id === AppData.activePazienteId);

    return '<div style="background: ' + (isAttivo ? '#ffffff' : 'rgba(255,255,255,0.7)') + '; border: 1.5px solid ' + (isAttivo ? '#d97706' : '#fde68a') + '; border-radius: 12px; padding: 10px 12px; cursor: pointer; transition: all 0.2s ease; box-shadow: ' + (isAttivo ? '0 2px 6px rgba(217,119,6,0.15)' : 'none') + ';" onclick="cambiaPazienteDaBuongiorno(\'' + p.id + '\')">' +
      '<div style="display:flex; justify-content:space-between; align-items:center;">' +
        '<b style="font-size: 13px; color: #0f172a;">👤 ' + pNomePrimo + '</b>' +
        '<span style="font-size: 10.5px; font-weight: 800; color: ' + (tutteFatte ? '#15803d' : '#b45309') + ';">' + (tutteFatte ? '✓ OK' : 'Da dare') + '</span>' +
      '</div>' +
      '<div style="font-size: 11.5px; color: #475569; margin-top: 4px; font-weight: 600;">' +
        stAuto +
      '</div>' +
    '</div>';
  }).join('');

  container.innerHTML = cardsPazientiHtml;
}

function cambiaPazienteDaBuongiorno(pazId) {
  cambiaPaziente(pazId);
  var tabBtn = document.querySelector('[data-target="tab-farmaci"]');
  if (tabBtn) tabBtn.click();
  showToast('Aperto piano terapeutico di ' + (getActivePaziente() ? getActivePaziente().nome.split(' ')[0] : 'assistito'));
}

function avviaRoutineMattino() {
  var tabBtn = document.querySelector('[data-target="tab-farmaci"]');
  if (tabBtn) tabBtn.click();
  setTimeout(function() {
    var primoFarmacoMattino = document.querySelector('#terapie-table-body tr');
    if (primoFarmacoMattino) {
      primoFarmacoMattino.scrollIntoView({ behavior: 'smooth', block: 'center' });
      primoFarmacoMattino.classList.add('terapia-row-highlight');
      setTimeout(function() {
        primoFarmacoMattino.classList.remove('terapia-row-highlight');
      }, 4000);
    }
  }, 250);
  showToast('☕ Routine del mattino avviata! Ecco i farmaci da verificare per colazione.');
}

function chiudiCardBuongiorno() {
  var card = document.getElementById('card-buongiorno-mattino');
  if (card) {
    card.style.display = 'none';
    showToast('Card ridotta. Buona giornata!');
  }
}
