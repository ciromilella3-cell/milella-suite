const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
process.on('uncaughtException', (err) => {
    console.error('[ERRORE NON GESTITO]', err);
    try { fs.appendFileSync(path.join(__dirname, 'server_exit.log'), 'Uncaught: ' + err.stack + '\n'); } catch(e){}
});
process.on('unhandledRejection', (reason) => {
    console.error('[PROMESSA NON GESTITA]', reason);
    try { fs.appendFileSync(path.join(__dirname, 'server_exit.log'), 'UnhandledRejection: ' + reason + '\n'); } catch(e){}
});
process.on('exit', (code) => {
    try { fs.appendFileSync(path.join(__dirname, 'server_exit.log'), `Exit code: ${code} at ${new Date().toISOString()}\n`); } catch(e){}
});

async function startServer() {
    let createProxyMiddleware;
    try {
        const hpm = await import('http-proxy-middleware');
        createProxyMiddleware = hpm.createProxyMiddleware;
    } catch(err) {
        console.warn('http-proxy-middleware not loaded:', err);
    }
    const app = express();
    const PORT = process.env.PORT || 3000;

    // Helper per scrittura atomica sicura contro corruzione dati e cali di corrente
    function safeWriteAtomic(filePath, data) {
        const tempPath = filePath + '.tmp.' + Date.now();
        try {
            fs.writeFileSync(tempPath, data, 'utf8');
            fs.renameSync(tempPath, filePath);
            return true;
        } catch(err) {
            console.error('[ERRORE SCRITTURA ATOMICA]', filePath, err);
            try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch(e){}
            // Fallback diretto
            fs.writeFileSync(filePath, data, 'utf8');
            return true;
        }
    }

    // Servizio statico diretto per foto e uploads (istantaneo, nessun ritardo o errore proxy)
    app.use('/Foto_Attrezzi', express.static(path.join(__dirname, 'data', 'Foto_Attrezzi')));
    app.use('/uploads', express.static(path.join(__dirname, '..', 'RicettarioWeb', 'public', 'uploads')));
    app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

    // Servizio Statico Ricettario (funziona sia in Cloud su Render sia in locale USB)
    const ricettarioDir = fs.existsSync(path.join(__dirname, 'public', 'ricettario')) 
        ? path.join(__dirname, 'public', 'ricettario') 
        : path.join(__dirname, '..', 'RicettarioWeb', 'public');
    app.use('/ricettario', express.static(ricettarioDir));

    // Database e Percorsi Ricettario
    const ricettarioDataDir = fs.existsSync(path.join(__dirname, 'data')) ? path.join(__dirname, 'data') : path.join(__dirname, '..', 'RicettarioWeb', 'data');
    const ricettarioJsonPath = path.join(ricettarioDataDir, 'ricette.json');
    const ricettarioUploadsDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(ricettarioDataDir)) fs.mkdirSync(ricettarioDataDir, { recursive: true });
    if (!fs.existsSync(ricettarioUploadsDir)) fs.mkdirSync(ricettarioUploadsDir, { recursive: true });
    if (!fs.existsSync(ricettarioJsonPath)) fs.writeFileSync(ricettarioJsonPath, '[]');

    // API Ricettario Native (Zero errori proxy)
    app.get(['/api/recipes', '/ricettario/api/recipes'], (req, res) => {
        try {
            const data = fs.readFileSync(ricettarioJsonPath, 'utf8');
            res.json(JSON.parse(data || '[]'));
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.post(['/api/recipes', '/ricettario/api/recipes'], (req, res) => {
        try {
            safeWriteAtomic(ricettarioJsonPath, JSON.stringify(req.body, null, 4));
            res.json({ success: true });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    const storageRicettario = multer.diskStorage({
        destination: function (req, file, cb) { cb(null, ricettarioUploadsDir); },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, 'ricetta_' + Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
        }
    });
    const uploadRicettario = multer({ storage: storageRicettario });

    app.post(['/api/upload', '/ricettario/api/upload'], uploadRicettario.single('foto'), (req, res) => {
        if (!req.file) return res.status(400).json({ error: 'Nessun file caricato' });
        res.json({ path: 'uploads/' + req.file.filename });
    });

    app.delete(['/api/upload/:filename', '/ricettario/api/upload/:filename'], (req, res) => {
        try {
            const filePath = path.join(ricettarioUploadsDir, req.params.filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            res.json({ success: true });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // Logging diagnostico richieste
    app.use((req, res, next) => {
        try { fs.appendFileSync(path.join(__dirname, 'requests.log'), `${new Date().toISOString()} ${req.method} ${req.url}\n`); } catch(e){}
        next();
    });

// Configurazione base
app.use(cors());
app.use(express.json());

// Endpoint leggero di Healthcheck e Keep-Alive H24 (risposta immediata)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'active', time: new Date().toISOString(), suite: 'C. Milella' });
});

// ==============================================================================
// SISTEMA DI CONTROLLO LICENZA & SCADENZA - AUTORE: CIRO MILELLA
// ==============================================================================
const licenseFile = path.join(__dirname, 'licenza_attiva.json');


// --- GESTIONE CHIAVI DI RINNOVO LICENZA (CIRO MILELLA) ---
const crypto = require('crypto');
const LICENSE_SECRET = 'CIRO_MILELLA_SUITE_MASTER_KEY_2026';

function generateLicenseKey(destName, daysValid) {
    const cleanName = (destName || 'UTENTE').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    const expDate = new Date(Date.now() + (parseInt(daysValid, 10) * 24 * 60 * 60 * 1000));
    const expStr = expDate.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    
    // Hash di controllo HMAC
    const rawData = cleanName + '-' + expStr + '-' + daysValid;
    const sig = crypto.createHmac('sha256', LICENSE_SECRET).update(rawData).digest('hex').toUpperCase().slice(0, 6);
    return 'CM-' + cleanName + '-' + expStr + '-' + sig;
}

function verifyAndApplyLicenseKey(keyString) {
    if (!keyString || typeof keyString !== 'string') return { success: false, message: 'Chiave non valida' };
    const cleanKey = keyString.trim().toUpperCase();
    const parts = cleanKey.split('-');
    if (parts.length !== 4 || parts[0] !== 'CM') {
        return { success: false, message: 'Formato chiave errato. Es: CM-NOME-AAAAMMGG-XXXXXX' };
    }

    const [prefix, cleanName, expStr, sig] = parts;
    const year = expStr.slice(0, 4);
    const month = expStr.slice(4, 6);
    const day = expStr.slice(6, 8);
    const newExpDate = new Date(year + '-' + month + '-' + day + 'T23:59:59');

    if (isNaN(newExpDate.getTime())) {
        return { success: false, message: 'Data contenuta nella chiave non valida' };
    }

    // Verifica firma
    let verifiedDays = null;
    const standardDays = [15, 30, 90, 180, 365, 730, 3650];
    for (let d of standardDays) {
        const testRaw = cleanName + '-' + expStr + '-' + d;
        const testSig = crypto.createHmac('sha256', LICENSE_SECRET).update(testRaw).digest('hex').toUpperCase().slice(0, 6);
        if (testSig === sig) {
            verifiedDays = d;
            break;
        }
    }

    // Se non trovato nei giorni standard, calcola la differenza in giorni dalla data di creazione
    if (!verifiedDays) {
        // Prova brute check 1..3650 se necessario
        for (let d = 1; d <= 3650; d++) {
            const testRaw = cleanName + '-' + expStr + '-' + d;
            const testSig = crypto.createHmac('sha256', LICENSE_SECRET).update(testRaw).digest('hex').toUpperCase().slice(0, 6);
            if (testSig === sig) {
                verifiedDays = d;
                break;
            }
        }
    }

    if (!verifiedDays) {
        return { success: false, message: 'Firma di sicurezza della chiave non valida o manomessa!' };
    }

    // Applica il rinnovo al file licenza_attiva.json
    try {
        let lic = {};
        if (fs.existsSync(licenseFile)) {
            try { lic = JSON.parse(fs.readFileSync(licenseFile, 'utf8')); } catch(e){}
        }
        lic.scadenza = newExpDate.toISOString();
        lic.scadenzaLabel = 'Fino al ' + newExpDate.toLocaleDateString('it-IT');
        lic.lastRun = new Date().toISOString();
        lic.ultimaChiave = cleanKey;
        lic.dataRinnovo = new Date().toISOString();
        fs.writeFileSync(licenseFile, JSON.stringify(lic, null, 2), 'utf8');
        return { success: true, message: 'Licenza rinnovata con successo fino al ' + newExpDate.toLocaleDateString('it-IT'), newExp: newExpDate };
    } catch(err) {
        return { success: false, message: 'Errore di scrittura file licenza: ' + err.message };
    }
}

function checkLicenseStatus() {
    if (!fs.existsSync(licenseFile)) {
        // Nessun file di licenza presente -> Modalita Master (nessuna scadenza)
        return { valid: true, master: true };
    }

    try {
        const lic = JSON.parse(fs.readFileSync(licenseFile, 'utf8'));
        if (!lic.scadenza) {
            return { valid: true, master: false, lic };
        }

        const now = new Date();
        const expDate = new Date(lic.scadenza);

        // Controllo anti-retrodatazione dell'orologio
        if (lic.lastRun) {
            const lastRunDate = new Date(lic.lastRun);
            // Se l'orologio di sistema e stato portato indietro di oltre 24 ore rispetto all'ultimo avvio
            if (now.getTime() < lastRunDate.getTime() - (24 * 60 * 60 * 1000)) {
                return { 
                    valid: false, 
                    reason: 'CLOCK_TAMPERED', 
                    message: "Rilevata anomalia nell'orologio di sistema. Contatta Ciro Milella.",
                    lic 
                };
            }
        }

        // Salva periodicamente l'ultimo utilizzo registrato
        lic.lastRun = now.toISOString();
        try { fs.writeFileSync(licenseFile, JSON.stringify(lic, null, 2), 'utf8'); } catch(e){}

        if (now > expDate) {
            return { 
                valid: false, 
                reason: 'EXPIRED', 
                message: 'Periodo di licenza terminato il ' + expDate.toLocaleDateString('it-IT') + '.',
                lic 
            };
        }

        return { valid: true, lic, expDate };
    } catch(err) {
        return { valid: true };
    }
}

// Middleware globale di blocco alla scadenza per tutte le pagine e rotte
app.use((req, res, next) => {
    // Risorse sempre consentite (icone, manifest)
    if (req.path.endsWith('.ico') || req.path.endsWith('.png') || req.path.endsWith('.jpg') || req.path === '/manifest.json') {
        return next();
    }

    const licCheck = checkLicenseStatus();
    if (licCheck.valid) {
        return next();
    }

    // Se scaduto e la richiesta e per una pagina HTML (navigazione)
    if (req.accepts('html') || req.path.endsWith('.html') || req.path === '/' || req.path.startsWith('/progetto_gioco') || req.path.startsWith('/ricettario') || req.path.startsWith('/mednutri') || req.path.startsWith('/salute') || req.path.startsWith('/careassist')) {
        const lic = licCheck.lic || {};
        const dest = lic.destinatario || 'Utente';
        const scadFmt = lic.scadenza ? new Date(lic.scadenza).toLocaleDateString('it-IT') : 'Data non specificata';
        const msg = licCheck.reason === 'CLOCK_TAMPERED' 
            ? "Rilevata anomalia nell'orologio di sistema. Riporta l'orario corretto o contatta l'autore."
            : `La licenza d'uso per <strong>${dest}</strong> e terminata in data <strong>${scadFmt}</strong>.`;

        const lockHtml = `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Licenza Scaduta - Suite C. Milella</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&display=swap" rel="stylesheet">
    <style>
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Outfit', sans-serif; }
        body {
            background:#040914;
            color:#fff;
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:1.5rem;
            position:relative;
            overflow:hidden;
        }
        .lock-card {
            background:rgba(15, 23, 42, 0.95);
            border:2px solid #ef4444;
            border-radius:28px;
            box-shadow:0 0 60px rgba(239, 68, 68, 0.35);
            max-width:560px;
            width:100%;
            padding:2.8rem 2.2rem;
            text-align:center;
            position:relative;
            backdrop-filter:blur(16px);
            animation:popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popIn {
            from { opacity:0; transform:scale(0.92); }
            to { opacity:1; transform:scale(1); }
        }
        .icon-badge {
            width:84px;
            height:84px;
            border-radius:26px;
            background:linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(185, 28, 28, 0.4) 100%);
            border:2px solid rgba(239, 68, 68, 0.5);
            display:inline-flex;
            align-items:center;
            justify-content:center;
            font-size:2.8rem;
            margin-bottom:1.5rem;
            box-shadow:0 0 30px rgba(239, 68, 68, 0.4);
        }
        h1 { font-size:1.85rem; font-weight:900; letter-spacing:0.5px; color:#ffffff; margin-bottom:0.8rem; }
        .sub { font-size:1.05rem; color:#94a3b8; line-height:1.6; margin-bottom:1.8rem; }
        .info-box {
            background:rgba(255,255,255,0.03);
            border:1px solid rgba(212,175,55,0.3);
            border-radius:18px;
            padding:1.2rem;
            margin-bottom:2rem;
            text-align:left;
            font-size:0.95rem;
        }
        .info-row { display:flex; justify-content:space-between; margin-bottom:0.5rem; }
        .info-row:last-child { margin-bottom:0; }
        .info-lbl { color:#94a3b8; font-weight:600; }
        .info-val { color:#fef08a; font-weight:800; }
        .btn-wa {
            display:flex;
            align-items:center;
            justify-content:center;
            gap:10px;
            background:linear-gradient(135deg, #10b981 0%, #059669 100%);
            color:#fff;
            padding:14px 24px;
            border-radius:16px;
            font-weight:800;
            font-size:1rem;
            text-decoration:none;
            box-shadow:0 8px 25px rgba(16, 185, 129, 0.4);
            transition:all 0.2s;
            cursor:pointer;
            border:none;
            width:100%;
        }
        .btn-wa:hover { transform:scale(1.03); }
        .footer-note { margin-top:1.4rem; font-size:0.82rem; color:#64748b; }
    </style>
</head>
<body>
    <div class="lock-card">
        <div class="icon-badge">🔒</div>
        <h1>LICENZA SCADUTA</h1>
        <p class="sub">${msg}<br>Per rinnovare o approfondire il software rivolgiti a Ciro Milella.</p>

        <div class="info-box">
            <div class="info-row">
                <span class="info-lbl">Destinatario:</span>
                <span class="info-val">${dest}</span>
            </div>
            <div class="info-row">
                <span class="info-lbl">Progetto Sviluppato da:</span>
                <span class="info-val" style="color:#fef08a;">Ciro Milella</span>
            </div>
            <div class="info-row">
                <span class="info-lbl">Data Scadenza:</span>
                <span class="info-val" style="color:#ef4444;">${scadFmt}</span>
            </div>
        </div>

        <button onclick="window.open('https://wa.me/?text=' + encodeURIComponent('Salve Ciro, la licenza della mia copia di ' + '${encodeURIComponent(dest)}' + ' e scaduta il ' + '${scadFmt}' + '. Vorrei concordare il rinnovo/approfondimento.'), '_blank')" class="btn-wa" style="margin-bottom:1.5rem;">
            <span>💬</span> <span>Contatta Ciro Milella per Rinnovo</span>
        </button>

        <!-- BOX ATTIVAZIONE CHIAVE IMMEDIATA -->
        <div style="background:rgba(255,255,255,0.04); border:1.5px solid rgba(56,189,248,0.35); border-radius:20px; padding:1.4rem; text-align:left;">
            <div style="font-size:0.95rem; font-weight:800; color:#38bdf8; margin-bottom:6px; display:flex; align-items:center; gap:8px;">
                <span>🔑</span> Inserisci Chiave di Rinnovo Fornita da Ciro
            </div>
            <div style="font-size:0.82rem; color:#94a3b8; margin-bottom:12px; line-height:1.4;">
                Se hai già ricevuto il codice di sblocco personale, incollalo qui sotto per riattivare immediatamente il sistema.
            </div>
            <div style="display:flex; gap:8px;">
                <input type="text" id="inputLicKey" placeholder="Es: CM-ROSA-20271020-XXXXXX" style="flex:1; background:rgba(0,0,0,0.5); border:1px solid rgba(56,189,248,0.5); border-radius:12px; padding:10px 14px; color:#fff; font-family:'Outfit',monospace; font-size:0.9rem; font-weight:700; text-transform:uppercase; outline:none;" />
                <button onclick="riscattaChiaveLicenza()" id="btnRedeem" style="background:linear-gradient(135deg, #38bdf8 0%, #0284c7 100%); color:#fff; border:none; padding:10px 18px; border-radius:12px; font-weight:800; font-size:0.9rem; cursor:pointer; white-space:nowrap; transition:all 0.2s;">
                    SBLOCCA 🔓
                </button>
            </div>
            <div id="renewMsg" style="margin-top:10px; font-size:0.85rem; font-weight:700; display:none;"></div>
        </div>
        <script>
        async function riscattaChiaveLicenza() {
            const key = document.getElementById('inputLicKey').value.trim();
            const msgEl = document.getElementById('renewMsg');
            const btn = document.getElementById('btnRedeem');
            if (!key) { alert('Inserisci il codice di rinnovo ricevuto da Ciro Milella'); return; }
            btn.disabled = true; btn.innerText = 'Verifica...';
            try {
                const res = await fetch('/api/redeem-license-key', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key })
                });
                const data = await res.json();
                if (data.success) {
                    msgEl.style.display = 'block';
                    msgEl.style.color = '#4ade80';
                    msgEl.innerText = '✅ ' + data.message + ' Ricarico in corso...';
                    setTimeout(() => { window.location.reload(); }, 1500);
                } else {
                    msgEl.style.display = 'block';
                    msgEl.style.color = '#f87171';
                    msgEl.innerText = '❌ ' + (data.error || 'Chiave non valida');
                    btn.disabled = false; btn.innerText = 'SBLOCCA 🔓';
                }
            } catch(e) {
                alert('Errore di connessione al server locale');
                btn.disabled = false; btn.innerText = 'SBLOCCA 🔓';
            }
        }
        </script>

        <div class="footer-note">
            Software Aziendale con Tutela della Proprieta Intellettuale &copy; Ciro Milella
        </div>
    </div>
</body>
</html>`;
        return res.status(403).send(lockHtml);
    }

    // Se chiamata API JSON (chiamata ajax o backend)
    return res.status(403).json({
        error: 'LICENSE_EXPIRED',
        message: 'Licenza scaduta. Contatta Ciro Milella per il rinnovo.',
        scadenza: (licCheck.lic && licCheck.lic.scadenza) || null
    });
});

// Reindirizzamento automatico per facilitare la condivisione: digitando solo il dominio si va dritti al Launcher
app.get(['/', '/index.html'], (req, res, next) => {
    // Se la richiesta è per la pagina principale via browser, apri il Launcher C. Milella
    if (req.accepts('html')) {
        return res.redirect('/launcher.html');
    }
    next();
});

app.get('/launcher.html', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    const p1 = path.join(__dirname, 'public', 'launcher.html');
    const p2 = path.join(__dirname, 'launcher.html');
    if (fs.existsSync(p1)) return res.sendFile(p1);
    if (fs.existsSync(p2)) return res.sendFile(p2);
    res.status(404).send('launcher.html non trovato');
});

// ==============================================================================
// GESTIONE ACCESSO: PIN MASTER (SOS999) & REGISTRO OPERATORI ABILITATI
// ==============================================================================
let operatoriPath = path.join(__dirname, 'data', 'operatori.json');
if (!fs.existsSync(operatoriPath) && fs.existsSync(path.join(__dirname, 'operatori.json'))) {
    operatoriPath = path.join(__dirname, 'operatori.json');
}
const PIN_MASTER = 'SOS999';

function loadOperatori() {
    try {
        if (!fs.existsSync(operatoriPath)) {
            const initial = [
                { id: "op_master", nome: "Ciro Milella (Admin)", ruolo: "admin", codice: "SOS999", attivo: true },
                { id: "op_collega1", nome: "Operatore Magazzino", ruolo: "operatore", codice: "1111", attivo: true },
                { id: "op_collega2", nome: "Operatore Cantiere", ruolo: "operatore", codice: "2222", attivo: true }
            ];
            fs.writeFileSync(operatoriPath, JSON.stringify(initial, null, 2), 'utf8');
            return initial;
        }
        return JSON.parse(fs.readFileSync(operatoriPath, 'utf8') || '[]');
    } catch(e) {
        return [{ id: "op_master", nome: "Ciro Milella (Admin)", ruolo: "admin", codice: "SOS999", attivo: true }];
    }
}

// Lista pubblica degli operatori per la selezione rapida all'accesso
app.get('/api/operatori/lista-pubblica', (req, res) => {
    const list = loadOperatori().filter(o => o.attivo).map(o => ({ id: o.id, nome: o.nome, ruolo: o.ruolo }));
    res.json(list);
});

// Verifica autenticazione (PIN Master o Codice Operatore - Case-Insensitive per SOS999/sos999)
app.post('/api/auth/login', (req, res) => {
    const { codice } = req.body || {};
    const clean = (codice || '').trim();
    if (clean.toUpperCase() === PIN_MASTER.toUpperCase()) {
        return res.json({ 
            success: true, 
            ruolo: 'admin', 
            nome: 'Ciro Milella (Admin)',
            appAbilitate: ['all'] 
        });
    }
    const ops = loadOperatori();
    const found = ops.find(o => o.attivo && o.codice.toLowerCase() === clean.toLowerCase());
    if (found) {
        return res.json({ 
            success: true, 
            ruolo: found.ruolo || 'operatore', 
            nome: found.nome,
            appAbilitate: found.appAbilitate || []
        });
    }
    return res.status(401).json({ success: false, message: 'Codice o PIN non riconosciuto.' });
});

// Gestione operatori (solo per Admin autenticato con PIN Master)
app.post('/api/operatori/gestione', (req, res) => {
    const { pinAdmin, azione, operatore } = req.body || {};
    if ((pinAdmin || '').trim().toUpperCase() !== PIN_MASTER.toUpperCase()) {
        return res.status(403).json({ success: false, message: 'Accesso negato: PIN Master errato.' });
    }
    let ops = loadOperatori();
    if (azione === 'list') {
        return res.json({ success: true, operatori: ops });
    } else if (azione === 'add') {
        if (!operatore || !operatore.nome || !operatore.codice) {
            return res.status(400).json({ success: false, message: 'Nome e codice richiesti' });
        }
        const newOp = {
            id: 'op_' + Date.now(),
            nome: operatore.nome.trim(),
            ruolo: operatore.ruolo || 'operatore',
            codice: operatore.codice.trim(),
            appAbilitate: operatore.appAbilitate || (operatore.appId ? [operatore.appId] : []),
            attivo: true
        };
        ops.push(newOp);
        fs.writeFileSync(operatoriPath, JSON.stringify(ops, null, 2), 'utf8');
        return res.json({ success: true, operatori: ops });
    } else if (azione === 'toggle') {
        ops = ops.map(o => o.id === operatore.id && o.id !== 'op_master' ? { ...o, attivo: !o.attivo } : o);
        fs.writeFileSync(operatoriPath, JSON.stringify(ops, null, 2), 'utf8');
        return res.json({ success: true, operatori: ops });
    } else if (azione === 'delete') {
        ops = ops.filter(o => o.id !== operatore.id || o.id === 'op_master');
        fs.writeFileSync(operatoriPath, JSON.stringify(ops, null, 2), 'utf8');
        return res.json({ success: true, operatori: ops });
    }
    res.status(400).json({ success: false, message: 'Azione non valida' });
});

// ==============================================================================
// GESTIONE PROGETTI DINAMICI NEL LAUNCHER (AGGIUNGI / ELIMINA / MODIFICA)
// ==============================================================================
let progettiConfigPath = path.join(__dirname, 'data', 'progetti_config.json');
if (!fs.existsSync(progettiConfigPath) && fs.existsSync(path.join(__dirname, 'progetti_config.json'))) {
    progettiConfigPath = path.join(__dirname, 'progetti_config.json');
}

function loadProgetti() {
    try {
        if (!fs.existsSync(progettiConfigPath)) {
            const defProjects = [
                { id: "app_veicoli", titolo: "Flotta Veicoli & Spese", icona: "🚗", url: "/veicoli_mobile/", descrizione: "Controllo scadenze revisioni, bolli, manutenzioni e rimborsi chilometrici aziendali.", visibilita: "tutti", attivo: true },
                { id: "app_inventario", titolo: "Inventario Attrezzi", icona: "🛠️", url: "/", descrizione: "Catalogo fotografico intelligente e ricerca rapida degli attrezzi tra garage, casa e furgone.", visibilita: "tutti", attivo: true },
                { id: "app_ricettario", titolo: "Il Ricettario", icona: "👨‍🍳", url: "/ricettario/", descrizione: "L'archivio prezioso delle tue ricette personali con lista della spesa automatica.", visibilita: "tutti", attivo: true },
                { id: "app_mednutri", titolo: "MedNutri Pro", icona: "🥗", url: "/mednutri/", descrizione: "Software avanzato per piani nutrizionali personalizzati e gestione clinica.", visibilita: "admin", attivo: true },
                { id: "app_salute", titolo: "Progetto Salute", icona: "❤️", url: "/salute/", descrizione: "Monitoraggio parametri vitali, fitness e benessere personale quotidiano.", visibilita: "admin", attivo: true },
                { id: "app_gioco", titolo: "Progetto Gioco", icona: "🎰", url: "/progetto_gioco/", descrizione: "Monitoraggio statistico SuperEnalotto e Gratta & Vinci con bilancio netto.", visibilita: "admin", attivo: true },
                { id: "app_careassist", titolo: "CareAssist Pro", icona: "🩺", url: "/careassist/", descrizione: "Diario socio-sanitario, terapie farmacologiche e gestione assistenza domiciliare.", visibilita: "admin", attivo: true }
            ];
            fs.writeFileSync(progettiConfigPath, JSON.stringify(defProjects, null, 2), 'utf8');
            return defProjects;
        }
        return JSON.parse(fs.readFileSync(progettiConfigPath, 'utf8') || '[]');
    } catch(e) {
        return [];
    }
}

// Lettura progetti (filtrati per ruolo)
app.get('/api/progetti/lista', (req, res) => {
    res.json(loadProgetti());
});

// Modifica/Aggiunta/Eliminazione progetti (protetta da PIN Master)
app.post('/api/progetti/gestione', (req, res) => {
    const { pinAdmin, azione, progetto } = req.body || {};
    if ((pinAdmin || '').trim().toUpperCase() !== PIN_MASTER.toUpperCase()) {
        return res.status(403).json({ success: false, message: 'Accesso negato: PIN Master errato.' });
    }
    let projs = loadProgetti();
    if (azione === 'list') {
        return res.json({ success: true, progetti: projs });
    } else if (azione === 'add') {
        if (!progetto || !progetto.titolo || !progetto.url) {
            return res.status(400).json({ success: false, message: 'Titolo e URL richiesti' });
        }
        const newP = {
            id: 'proj_' + Date.now(),
            titolo: progetto.titolo.trim(),
            icona: (progetto.icona || '📁').trim(),
            url: progetto.url.trim(),
            descrizione: (progetto.descrizione || '').trim(),
            visibilita: progetto.visibilita || 'tutti',
            attivo: true
        };
        projs.push(newP);
        fs.writeFileSync(progettiConfigPath, JSON.stringify(projs, null, 2), 'utf8');
        return res.json({ success: true, progetti: projs });
    } else if (azione === 'toggle') {
        projs = projs.map(p => p.id === progetto.id ? { ...p, attivo: !p.attivo } : p);
        fs.writeFileSync(progettiConfigPath, JSON.stringify(projs, null, 2), 'utf8');
        return res.json({ success: true, progetti: projs });
    } else if (azione === 'toggleVis') {
        // Cambia visibilità: da 'admin' a 'tutti' e viceversa con 1 clic!
        projs = projs.map(p => {
            if (p.id === progetto.id) {
                const nuovaVis = p.visibilita === 'admin' ? 'tutti' : 'admin';
                return { ...p, visibilita: nuovaVis };
            }
            return p;
        });
        fs.writeFileSync(progettiConfigPath, JSON.stringify(projs, null, 2), 'utf8');
        return res.json({ success: true, progetti: projs });
    } else if (azione === 'delete') {
        projs = projs.filter(p => p.id !== progetto.id);
        fs.writeFileSync(progettiConfigPath, JSON.stringify(projs, null, 2), 'utf8');
        return res.json({ success: true, progetti: projs });
    }
    res.status(400).json({ success: false, message: 'Azione non valida' });
});

// ==============================================================================
// 1. STATISTICHE KPI DASHBOARD LIVE (ATTREZZI, OPERATORI, PROGETTI, PRESTITI)
// ==============================================================================
app.get('/api/kpi/stats', (req, res) => {
    try {
        let attrezzi = [];
        const invPath = path.join(__dirname, 'data', 'inventario.json');
        if (fs.existsSync(invPath)) {
            try { attrezzi = JSON.parse(fs.readFileSync(invPath, 'utf8') || '[]'); } catch(e){}
        }
        const totAttrezzi = attrezzi.length;
        const inUso = attrezzi.filter(a => a.stato === 'In uso' || (a.prestato_a && a.prestato_a.trim() !== '')).length;
        const disponibili = totAttrezzi - inUso;

        const ops = loadOperatori().filter(o => o.attivo);
        const totOperatori = ops.length;
        const projs = loadProgetti().filter(p => p.attivo);
        const totProgetti = projs.length;

        res.json({
            totAttrezzi,
            inUso,
            disponibili,
            totOperatori,
            totProgetti,
            prossimaScadenza: "In regola"
        });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// ==============================================================================
// 4. REGISTRO PRESTITI: PRESA IN CARICO E RIENTRO CON NOME OPERATORE
// ==============================================================================
app.post('/api/inventory/prestito', (req, res) => {
    const { idAttrezzo, operatoreNome, azione, destinazione } = req.body || {};
    const invPath = path.join(__dirname, 'data', 'inventario.json');
    if (!fs.existsSync(invPath)) return res.status(404).json({ error: 'Database inventario non trovato' });

    try {
        let attrezzi = JSON.parse(fs.readFileSync(invPath, 'utf8') || '[]');
        const idx = attrezzi.findIndex(a => a.id == idAttrezzo);
        if (idx === -1) return res.status(404).json({ error: 'Attrezzo non trovato' });

        const item = attrezzi[idx];
        const dataOggi = new Date().toLocaleDateString('it-IT') + ' ' + new Date().toLocaleTimeString('it-IT').slice(0,5);

        if (azione === 'prendi') {
            item.stato = 'In uso';
            item.prestato_a = operatoreNome || 'Operatore';
            item.data_prestito = dataOggi;
            item.destinazione_prestito = destinazione || 'Cantiere';
            item.storico_prestiti = item.storico_prestiti || [];
            item.storico_prestiti.unshift(`Preso da ${operatoreNome} il ${dataOggi} (${destinazione || 'Cantiere'})`);
        } else {
            // Rientro
            const exOperatore = item.prestato_a || 'Operatore';
            item.stato = 'Disponibile';
            item.prestato_a = '';
            item.data_rientro = dataOggi;
            item.storico_prestiti = item.storico_prestiti || [];
            item.storico_prestiti.unshift(`Restituito da ${exOperatore} il ${dataOggi}`);
        }

        safeWriteAtomic(invPath, JSON.stringify(attrezzi, null, 4));
        res.json({ success: true, item });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// MedNutri Pro
const medNutriDir = fs.existsSync(path.join(__dirname, 'public', 'mednutri')) 
    ? path.join(__dirname, 'public', 'mednutri') 
    : path.join(__dirname, '..', 'MedNutri_Pro');
app.use('/mednutri', express.static(medNutriDir));

// Progetto Salute
const saluteDir = fs.existsSync(path.join(__dirname, 'public', 'salute')) 
    ? path.join(__dirname, 'public', 'salute') 
    : path.join(__dirname, '..', 'Progetto_Salute');
app.use('/salute', express.static(saluteDir));

// Flotta Veicoli
const veicoliDir = fs.existsSync(path.join(__dirname, 'public', 'veicoli')) 
    ? path.join(__dirname, 'public', 'veicoli') 
    : path.join(__dirname, '..', 'questa', 'Sistema_Logistica_C_Milella', 'File_Sistema');
app.use('/veicoli', express.static(veicoliDir));
app.use('/veicoli/File_Sistema', express.static(veicoliDir));

// Integrazione CareAssist Pro
const careAssistLocalPath = path.resolve(__dirname, '..', 'CareAssist_Pro');
const careAssistPublicPath = path.join(__dirname, 'public', 'careassist');
const careAssistDesktopPath = 'C:\\Users\\Utente\\Desktop\\17102026 care1\\CareAssist_Pro';
const careAssistDesktopLegacy = 'C:\\Users\\Utente\\Desktop\\CareAssist Pro\\CareAssist_Pro';
const careAssistDir = fs.existsSync(careAssistPublicPath) ? careAssistPublicPath : (fs.existsSync(careAssistDesktopPath) ? careAssistDesktopPath : (fs.existsSync(careAssistLocalPath) ? careAssistLocalPath : careAssistDesktopLegacy));
const careAssistDbFile = path.join(careAssistDir, 'careassist_database.json');

app.use('/careassist', express.static(careAssistDir));

// API sincronizzazione dati CareAssist Pro

// ==============================================================================
// GESTIONE SINCRONIZZAZIONE DATABASE PROGETTO GIOCO (PC & MOBILE)
// ==============================================================================
const giocoDbPath = path.join(__dirname, 'data', 'gioco_records.json');

app.get('/api/gioco/get-data', (req, res) => {
    try {
        if (!fs.existsSync(giocoDbPath)) {
            return res.json([]);
        }
        const data = fs.readFileSync(giocoDbPath, 'utf8');
        res.json(JSON.parse(data || '[]'));
    } catch(err) {
        console.error('Errore get gioco data:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/gioco/save-data', (req, res) => {
    try {
        const payload = JSON.stringify(req.body, null, 2);
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        safeWriteAtomic(giocoDbPath, payload);
        res.json({ success: true, count: req.body.length });
    } catch(err) {
        console.error('Errore save gioco data:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/get-db', (req, res) => {
    try {
        if (fs.existsSync(careAssistDbFile)) {
            const data = fs.readFileSync(careAssistDbFile, 'utf8');
            res.type('application/json').send(data || '{}');
        } else {
            res.json({ status: 'not_found' });
        }
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/save-db', (req, res) => {
    try {
        const payload = JSON.stringify(req.body, null, 2);
        // Salva nel percorso primario
        safeWriteAtomic(careAssistDbFile, payload);
        
        // Esegui mirroring automatico sia su USB (D:\questa\CareAssist_Pro) che su Desktop se diversi
        const usbDb = path.join(careAssistLocalPath, 'careassist_database.json');
        const deskDb = path.join(careAssistDesktopPath, 'careassist_database.json');
        
        if (careAssistDbFile !== usbDb && fs.existsSync(careAssistLocalPath)) {
            try { safeWriteAtomic(usbDb, payload); } catch(err){}
        }
        if (careAssistDbFile !== deskDb && fs.existsSync(careAssistDesktopPath)) {
            try { safeWriteAtomic(deskDb, payload); } catch(err){}
        }

        res.json({ success: true, timestamp: Date.now() });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// API sincronizzazione dati MedNutri Pro (condivisione istantanea tra PC e Smartphone)
const medNutriLocalPath = path.resolve(__dirname, '..', 'MedNutri_Pro');
const medNutriDbFile = path.join(medNutriLocalPath, 'mednutri_server_data.json');

app.get('/api/mednutri/get-data', (req, res) => {
    try {
        if (fs.existsSync(medNutriDbFile)) {
            const data = fs.readFileSync(medNutriDbFile, 'utf8');
            res.type('application/json').send(data || '{}');
        } else {
            const defaultData = {
                "mednutri_doc_profile": JSON.stringify({"avatar":"👩‍⚕️","name":"Dott.ssa Chiara Diagnosi","spec":"Medico Chirurgo Nutrizionista","clinic":"Ambulatorio Medico"}),
                "mednutri_security_pin": "f53a8cc51204bdb35e8fd0ba841c1b8c2f238bd6f069410b0a44b97a3354dbf3"
            };
            res.json(defaultData);
        }
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/mednutri/save-data', (req, res) => {
    try {
        let current = {};
        if (fs.existsSync(medNutriDbFile)) {
            try { current = JSON.parse(fs.readFileSync(medNutriDbFile, 'utf8')); } catch(e){}
        }
        const updated = Object.assign({}, current, req.body);
        safeWriteAtomic(medNutriDbFile, JSON.stringify(updated, null, 2));
        res.json({ success: true, timestamp: Date.now() });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/presentazione', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '0_PRESENTAZIONE_E_ARCHITETTURA.html'));
});

const dataDir = path.join(__dirname, 'data');
const jsonPath = path.join(dataDir, 'inventario.json');
const posizioniPath = path.join(dataDir, 'posizioni.json');
const fotoDir = path.join(dataDir, 'Foto_Attrezzi');

// Assicurarsi che le directory esistano
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(fotoDir)) fs.mkdirSync(fotoDir);
if (!fs.existsSync(jsonPath)) fs.writeFileSync(jsonPath, '[]');
if (!fs.existsSync(posizioniPath)) fs.writeFileSync(posizioniPath, JSON.stringify(["Garage", "Casa", "Furgone"], null, 4));

// Configurazione Multer per upload foto
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, fotoDir)
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'foto_' + uniqueSuffix + ext)
    }
});
const upload = multer({ storage: storage });

// API GET: Leggi inventario
app.get('/api/inventory', (req, res) => {
    try {
        const data = fs.readFileSync(jsonPath, 'utf8');
        res.json(JSON.parse(data || '[]'));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// API POST: Salva inventario
app.post('/api/inventory', (req, res) => {
    try {
        safeWriteAtomic(jsonPath, JSON.stringify(req.body, null, 4));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// API GET: Leggi posizioni
app.get('/api/locations', (req, res) => {
    try {
        const data = fs.readFileSync(posizioniPath, 'utf8');
        res.json(JSON.parse(data || '["Garage", "Casa", "Furgone"]'));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// API POST: Salva posizioni
app.post('/api/locations', (req, res) => {
    try {
        fs.writeFileSync(posizioniPath, JSON.stringify(req.body, null, 4));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// API POST: Upload foto
app.post('/api/upload', upload.single('foto'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nessun file caricato' });
    }
    // Ritorniamo il percorso relativo che il frontend userà
    res.json({ path: 'Foto_Attrezzi/' + req.file.filename });
});

// API DELETE: Elimina foto
app.delete('/api/upload/:filename', (req, res) => {
    try {
        const filePath = path.join(fotoDir, req.params.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// API POST: Avvia Logistica (Electron Nativo)
app.post('/api/launch-logistica', (req, res) => {
    const { exec } = require('child_process');
    const rootPath = path.resolve(__dirname, '..', 'questa', 'Sistema_Logistica_C_Milella');
    const electronExe = path.join(rootPath, 'node_modules', 'electron', 'dist', 'electron.exe');
    const batPath = path.join(rootPath, '0_AVVIA_SISTEMA_LOGISTICA.bat');

    if (fs.existsSync(electronExe)) {
        exec(`"${electronExe}" .`, { cwd: rootPath });
    } else if (fs.existsSync(batPath)) {
        exec(`cmd.exe /c start "" "${batPath}"`, { cwd: rootPath });
    }
    res.json({ success: true });
});

// API POST: Avvia Gestione Veicoli & Spese Auto (MSHTA nativo o Web)
app.post('/api/launch-veicoli', (req, res) => {
    const { exec } = require('child_process');
    const autoHtml = path.resolve(__dirname, '..', 'questa', 'Sistema_Logistica_C_Milella', 'File_Sistema', 'auto.html');
    if (fs.existsSync(autoHtml)) {
        exec(`start "" mshta.exe "${autoHtml}"`, { cwd: path.dirname(autoHtml) });
    } else {
        exec(`start http://localhost:3000/veicoli/auto.html`);
    }
    res.json({ success: true });
});

// API POST: Avvia Progetto Salute (Electron Nativo)
app.post('/api/launch-salute', (req, res) => {
    const { exec } = require('child_process');
    const rootPath = path.resolve(__dirname, '..', 'Progetto_Salute');
    const exePath = path.join(rootPath, 'dist', 'ProgettoSalute-win32-x64', 'ProgettoSalute.exe');
    const electronExe = path.join(rootPath, 'node_modules', 'electron', 'dist', 'electron.exe');
    const batPath = path.join(rootPath, 'AVVIA_PROGETTO_SALUTE.bat');

    if (fs.existsSync(exePath)) {
        exec(`cmd.exe /c start "" "${exePath}"`, { cwd: path.dirname(exePath) });
    } else if (fs.existsSync(electronExe)) {
        exec(`cmd.exe /c start "" "${electronExe}" "${rootPath}"`, { cwd: rootPath });
    } else if (fs.existsSync(batPath)) {
        exec(`cmd.exe /c start "" "${batPath}"`, { cwd: rootPath });
    }
    res.json({ success: true });
});

// Endpoint per recuperare l'IP della macchina (Tailscale o Locale)
app.get('/api/my-ip', (req, res) => {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    let bestIp = 'localhost';
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                if (iface.address.startsWith('100.')) {
                    return res.json({ ip: iface.address });
                }
                bestIp = iface.address;
            }
        }
    }
    res.json({ ip: bestIp });
});

// Chiusura aggraziata del server se richiesta
app.post('/api/shutdown', (req, res) => {
    res.json({ success: true });
    setTimeout(() => {
        const { spawn } = require('child_process');
        const child = spawn('cmd.exe', ['/c', 'timeout /t 1 /nobreak >nul & taskkill /IM node.exe /F /T & taskkill /IM cloudflared.exe /F /T'], {
            detached: true,
            windowsHide: true,
            stdio: 'ignore'
        });
        child.unref();
        process.exit(0);
    }, 200);
});

// ==============================================================================
// CENTRO SICUREZZA, BACKUP E SINCRONIZZAZIONE CLOUD SUITE C. MILELLA
// ==============================================================================
app.get('/api/sicurezza/scarica-backup-zip', (req, res) => {
    try {
        const { execSync } = require('child_process');
        const sourceDir = fs.existsSync(path.join(__dirname, '..', 'AGGIORNAMENTO_RENDER')) 
            ? path.join(__dirname, '..', 'AGGIORNAMENTO_RENDER')
            : __dirname;
        const tempZip = path.join(__dirname, 'data', `SUITE_MILELLA_BACKUP_${new Date().toISOString().slice(0,10)}.zip`);
        
        execSync(`tar.exe -a -c -f "${tempZip}" -C "${sourceDir}" *`);
        res.download(tempZip, `SUITE_MILELLA_BACKUP_${new Date().toISOString().slice(0,10)}.zip`, (err) => {
            try { if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip); } catch(e){}
        });
    } catch(err) {
        console.error('Errore generazione zip backup:', err);
        res.status(500).json({ error: 'Errore durante la creazione del pacchetto di sicurezza' });
    }
});

app.post('/api/sicurezza/crea-backup-locale', (req, res) => {
    try {
        const { execSync } = require('child_process');
        const backupFolder = path.join(__dirname, '..', '_BACKUP_SICUREZZA');
        const desktopFolder = path.join(process.env.USERPROFILE || 'C:\\Users\\Utente', 'Desktop');
        if (!fs.existsSync(backupFolder)) fs.mkdirSync(backupFolder, { recursive: true });

        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        const timeStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
        const zipName = `BACKUP_SUITE_MILELLA_${timeStr}.zip`;
        const destZip = path.join(backupFolder, zipName);
        const sourceDir = fs.existsSync(path.join(__dirname, '..', 'AGGIORNAMENTO_RENDER')) 
            ? path.join(__dirname, '..', 'AGGIORNAMENTO_RENDER')
            : __dirname;

        execSync(`tar.exe -a -c -f "${destZip}" -C "${sourceDir}" *`);
        try { fs.copyFileSync(destZip, path.join(desktopFolder, zipName)); } catch(e){}

        const sizeMB = (fs.statSync(destZip).size / (1024 * 1024)).toFixed(1);
        res.json({ success: true, nome: zipName, sizeMB });
    } catch(err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/sicurezza/lista-backup', (req, res) => {
    try {
        const backupFolder = path.join(__dirname, '..', '_BACKUP_SICUREZZA');
        if (!fs.existsSync(backupFolder)) return res.json([]);
        const list = fs.readdirSync(backupFolder)
            .filter(f => f.endsWith('.zip'))
            .map(f => {
                const stat = fs.statSync(path.join(backupFolder, f));
                return {
                    nome: f,
                    data: stat.mtime.toLocaleString('it-IT'),
                    sizeMB: (stat.size / (1024 * 1024)).toFixed(1)
                };
            })
            .sort((a,b) => b.nome.localeCompare(a.nome));
        res.json(list);
    } catch(err) {
        res.json([]);
    }
});

// API POST: Avvia Tunnel Cloudflare per Attrezzi/Ricettario
app.post('/api/start-tunnel-attrezzi', (req, res) => {
    const { exec } = require('child_process');
    const batFile = path.join(__dirname, 'start_tunnel_attrezzi.bat');
    
    // Eseguiamo il .bat che avvia cloudflared.exe
    exec(`"${batFile}"`, { cwd: __dirname }, (error) => {
        if (error) console.error("Errore avvio tunnel attrezzi:", error);
    });
    
    // Risponde subito, il bat lavora in background
    res.json({ success: true });
});

// API GET: Ottieni URL Tunnel Cloudflare
app.get('/api/tunnel-url', (req, res) => {
    const logFile = path.join(__dirname, 'tunnel_log.txt');
    if (!fs.existsSync(logFile)) {
        return res.json({ url: null });
    }
    
    try {
        const content = fs.readFileSync(logFile, 'utf8');
        // Cerchiamo l'URL trycloudflare.com nel log. 
        // Cloudflared stampa linee JSON, una delle quali ha il messaggio con l'URL.
        const match = content.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
        if (match) {
            return res.json({ url: match[0] });
        }
    } catch (e) {
        console.error("Errore lettura tunnel log", e);
    }
    res.json({ url: null });
});

// --- MODULO ESPORTAZIONE PROGETTI STANDALONE (USB / DESKTOP) ---

// 1. Rileva unita disponibili (USB e Desktop)
app.get('/api/export-drives', (req, res) => {
    const { exec } = require('child_process');
    const desktopPath = path.join(process.env.USERPROFILE || 'C:\\Users\\Utente', 'Desktop');
    const psCmd = 'powershell -NoProfile -Command "Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, VolumeName, DriveType, FreeSpace, Size | ConvertTo-Json -Compress"';
    
    exec(psCmd, (err, stdout) => {
        let drives = [];
        if (!err && stdout && stdout.trim()) {
            try {
                let parsed = JSON.parse(stdout.trim());
                if (!Array.isArray(parsed)) parsed = [parsed];
                drives = parsed.map(d => ({
                    id: d.DeviceID,
                    name: d.VolumeName ? `${d.VolumeName} (${d.DeviceID})` : (d.DriveType === 2 ? `Chiavetta USB (${d.DeviceID})` : `Unità Esterna (${d.DeviceID})`),
                    isUsb: d.DriveType === 2 || (d.DeviceID && d.DeviceID.toUpperCase() !== 'C:'),
                    driveType: d.DriveType,
                    freeGb: d.FreeSpace ? (d.FreeSpace / (1024 * 1024 * 1024)).toFixed(1) : '0',
                    totalGb: d.Size ? (d.Size / (1024 * 1024 * 1024)).toFixed(1) : '0'
                }));
            } catch(e) {}
        }
        res.json({ drives, desktopPath });
    });
});

// 2. Esegui esportazione progetto



// API: Stato Licenza Attiva per Client (Banner Pre-Scadenza)
app.get('/api/get-license-status', (req, res) => {
    try {
        if (!fs.existsSync(licenseFile)) {
            return res.json({ valid: true, master: true, daysLeft: null });
        }
        const lic = JSON.parse(fs.readFileSync(licenseFile, 'utf8'));
        if (!lic.scadenza) {
            return res.json({ valid: true, master: false, daysLeft: null, dest: lic.destinatario || '' });
        }
        const now = new Date();
        const expDate = new Date(lic.scadenza);
        const diffTime = expDate.getTime() - now.getTime();
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        res.json({
            valid: now <= expDate,
            dest: lic.destinatario || 'Utente',
            scadenza: lic.scadenza,
            scadenzaFmt: expDate.toLocaleDateString('it-IT'),
            daysLeft: daysLeft
        });
    } catch(e) {
        res.json({ valid: true, daysLeft: null });
    }
});

// API: Elenco Completo Registro Licenze Rilasciate
app.get('/api/list-released-licenses', (req, res) => {
    try {
        const releasedBase = path.resolve('D:\\VERSIONI_RILASCIATE');
        if (!fs.existsSync(releasedBase)) {
            return res.json({ licenses: [] });
        }

        const folders = fs.readdirSync(releasedBase).filter(f => {
            try { return fs.statSync(path.join(releasedBase, f)).isDirectory(); } catch(e){ return false; }
        });

        const now = new Date();
        const list = [];

        folders.forEach(f => {
            const licFile = path.join(releasedBase, f, 'licenza_attiva.json');
            let lic = null;
            if (fs.existsSync(licFile)) {
                try { lic = JSON.parse(fs.readFileSync(licFile, 'utf8')); } catch(e){}
            }

            let destName = f;
            const match = f.match(/_per_(.*?)_(DEMO|PROD)$/i);
            if (match) destName = match[1].replace(/_/g, ' ').trim();

            let status = 'ATTIVA';
            let daysLeft = null;

            if (lic && lic.scadenza) {
                const expDate = new Date(lic.scadenza);
                const diffTime = expDate.getTime() - now.getTime();
                daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (daysLeft < 0) {
                    status = 'SCADUTA';
                } else if (daysLeft <= 15) {
                    status = 'IN_SCADENZA';
                } else {
                    status = 'ATTIVA';
                }
            } else if (!lic) {
                status = 'SENZA_FILE';
            }

            list.push({
                folderName: f,
                folderPath: path.join(releasedBase, f),
                destinatario: (lic && lic.destinatario) || destName,
                tipo: (lic && lic.tipo) || (f.includes('_DEMO') ? 'DEMO DIMOSTRATIVA' : 'PRODUZIONE COMPLETA'),
                modulo: (lic && lic.modulo) || f.replace(/_/g, ' '),
                scadenza: (lic && lic.scadenza) || null,
                scadenzaLabel: (lic && lic.scadenzaLabel) || (lic && lic.scadenza ? new Date(lic.scadenza).toLocaleDateString('it-IT') : 'Illimitata'),
                daysLeft,
                status,
                lastRun: (lic && lic.lastRun) || null
            });
        });

        res.json({ success: true, count: list.length, licenses: list });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Rinnovo Diretto da Registro Sala Regia
app.post('/api/renew-license-direct', (req, res) => {
    try {
        const { folderName, days } = req.body;
        if (!folderName || !days) return res.status(400).json({ error: 'Cartella e durata obbligatorie' });

        const releasedBase = path.resolve('D:\\VERSIONI_RILASCIATE');
        const targetDir = path.join(releasedBase, folderName);
        const licFile1 = path.join(targetDir, 'licenza_attiva.json');
        const licFile2 = path.join(targetDir, 'InventarioWeb', 'licenza_attiva.json');

        const now = new Date();
        const expDate = new Date(now.getTime() + (parseInt(days, 10) * 24 * 60 * 60 * 1000));

        let lic = {};
        if (fs.existsSync(licFile1)) {
            try { lic = JSON.parse(fs.readFileSync(licFile1, 'utf8')); } catch(e){}
        }

        lic.scadenza = expDate.toISOString();
        lic.scadenzaLabel = days + ' Giorni (Fino al ' + expDate.toLocaleDateString('it-IT') + ')';
        lic.lastRun = now.toISOString();
        lic.rinnovoDirettoData = now.toISOString();

        const jsonStr = JSON.stringify(lic, null, 2);
        fs.writeFileSync(licFile1, jsonStr, 'utf8');
        if (fs.existsSync(path.join(targetDir, 'InventarioWeb'))) {
            fs.writeFileSync(licFile2, jsonStr, 'utf8');
        }

        res.json({ success: true, newExp: expDate.toLocaleDateString('it-IT'), days });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Riscatta Chiave di Rinnovo
app.post('/api/redeem-license-key', (req, res) => {
    const { key } = req.body;
    const result = verifyAndApplyLicenseKey(key);
    if (result.success) {
        return res.json({ success: true, message: result.message });
    }
    return res.status(400).json({ success: false, error: result.message });
});

// API: Genera Nuova Chiave di Rinnovo (Sala Regia)
app.post('/api/generate-license-key', (req, res) => {
    const { destName, days } = req.body;
    if (!destName || !days) {
        return res.status(400).json({ error: 'Nome destinatario e durata obbligatori' });
    }
    const key = generateLicenseKey(destName, days);
    res.json({ success: true, key, destName, days });
});

app.post('/api/export-project', (req, res) => {
    const { projectId, destinationType, targetDrive } = req.body;
    const desktopPath = path.join(process.env.USERPROFILE || 'C:\\Users\\Utente', 'Desktop');
    const rootSuite = path.resolve(__dirname, '..');
    
    let sourceFolder = '';
    let targetFolderName = '';
    let launcherFile = '';
    let projectName = '';

    switch(projectId) {
        case 'mednutri':
            projectName = 'MedNutri Pro (Piano Nutrizionale)';
            sourceFolder = path.join(rootSuite, 'MedNutri_Pro');
            targetFolderName = 'MedNutri_Pro';
            launcherFile = '0_AVVIA_MEDNUTRI_PORTATILE.vbs';
            break;
        case 'logistica':
            projectName = 'Sistema Logistica C. Milella';
            sourceFolder = path.join(rootSuite, 'questa', 'Sistema_Logistica_C_Milella');
            targetFolderName = 'Sistema_Logistica_C_Milella';
            launcherFile = '0_AVVIA_SISTEMA_LOGISTICA.vbs';
            break;
        case 'salute':
            projectName = 'Progetto Salute (Parametri Vitali)';
            sourceFolder = path.join(rootSuite, 'Progetto_Salute');
            targetFolderName = 'Progetto_Salute';
            launcherFile = 'AVVIA_PROGETTO_SALUTE.bat';
            break;
        case 'inventario':
            projectName = 'Inventario Attrezzi';
            sourceFolder = path.join(rootSuite, 'InventarioWeb');
            targetFolderName = 'Inventario_Attrezzi';
            launcherFile = 'start_tunnel_attrezzi.bat';
            break;
        case 'ricettario':
            projectName = 'Il Ricettario';
            sourceFolder = path.join(rootSuite, 'RicettarioWeb');
            targetFolderName = 'Il_Ricettario';
            launcherFile = 'server.js';
            break;
        case 'suite':
            projectName = 'Suite Completa Aziendale C. Milella';
            sourceFolder = rootSuite;
            targetFolderName = 'SUITE_AZIENDALE_MILELLA';
            launcherFile = '0_AVVIA_SUITE_MILELLA.bat';
            break;
        default:
            return res.status(400).json({ error: 'Progetto non valido' });
    }

    if (!fs.existsSync(sourceFolder)) {
        return res.status(404).json({ error: 'Cartella sorgente non trovata: ' + sourceFolder });
    }

    let destBase = '';
    if (destinationType === 'usb') {
        if (!targetDrive) return res.status(400).json({ error: 'Nessuna unità USB selezionata' });
        destBase = targetDrive.endsWith('\\') ? targetDrive : targetDrive + '\\';
    } else {
        destBase = desktopPath;
    }

    const finalDestPath = path.join(destBase, targetFolderName);

    // Esegui la copia ricorsiva con robocopy
    const { exec } = require('child_process');
    let excludeParams = '/XD ".git" "scratch" "data\\Foto_Attrezzi\\temp" /XF "*.tmp"';
    if (projectId === 'suite') {
        excludeParams = '/XD ".git" "scratch" "temp" "Backup_*" /XF "*.tmp"';
    }

    const robocopyCmd = `robocopy "${sourceFolder}" "${finalDestPath}" /E ${excludeParams} /R:1 /W:1 /NP /NFL /NDL /NJH /NJS`;

    exec(robocopyCmd, (error, stdout, stderr) => {
        const exitCode = error ? error.code : 0;
        if (exitCode >= 8) {
            console.error('Robocopy error code:', exitCode, stderr);
            return res.status(500).json({ error: 'Errore durante la copia dei file.' });
        }

        // Assicurati che all'interno della cartella ci sia un lanciatore rapido 0_AVVIA_PROGETTO.bat
        try {
            const quickBatPath = path.join(finalDestPath, '0_AVVIA_PROGETTO.bat');
            let batContent = `@echo off\r\ntitle ${projectName}\r\ncd /d "%~dp0"\r\n`;
            if (launcherFile.endsWith('.vbs')) {
                batContent += `wscript.exe "${launcherFile}"\r\n`;
            } else if (launcherFile.endsWith('.bat')) {
                batContent += `call "${launcherFile}"\r\n`;
            } else {
                batContent += `start "" "${launcherFile}"\r\n`;
            }
            batContent += `exit\r\n`;
            fs.writeFileSync(quickBatPath, batContent, 'utf8');

            // Se esportato sul Desktop, crea anche il collegamento .lnk con icona
            if (destinationType === 'desktop') {
                const shortcutPath = path.join(desktopPath, `${projectName}.lnk`);
                const vbsShortcut = path.join(__dirname, 'data', 'create_export_shortcut.vbs');
                let vbsCode = `Set sh = CreateObject("WScript.Shell")\r\n` +
                              `Set sc = sh.CreateShortcut("${shortcutPath.replace(/"/g, '""')}")\r\n` +
                              `sc.TargetPath = "${quickBatPath.replace(/"/g, '""')}"\r\n` +
                              `sc.WorkingDirectory = "${finalDestPath.replace(/"/g, '""')}"\r\n` +
                              `sc.Description = "${projectName.replace(/"/g, '""')} - Versione Autonoma"\r\n` +
                              `sc.Save\r\n`;
                fs.writeFileSync(vbsShortcut, vbsCode);
                exec(`wscript.exe "${vbsShortcut}"`);
            }
        } catch(e) {}

        res.json({
            success: true,
            projectName,
            targetPath: finalDestPath,
            launcherName: '0_AVVIA_PROGETTO.bat'
        });
    });
});

// 3. Apri cartella esportata in Esplora Risorse
app.post('/api/open-exported-folder', (req, res) => {
    let { folderPath } = req.body;
    if (!folderPath) {
        return res.status(400).json({ error: 'Nessun percorso fornito' });
    }

    folderPath = path.resolve(folderPath);
    if (!fs.existsSync(folderPath)) {
        return res.status(404).json({ error: 'Cartella non trovata: ' + folderPath });
    }

    try {
        const { exec } = require('child_process');
        exec(`explorer.exe "${folderPath}"`);
        res.json({ success: true, folderPath });
    } catch(e) {
        try {
            const { exec } = require('child_process');
            exec(`cmd.exe /c start "" explorer.exe "${folderPath}"`);
            res.json({ success: true, folderPath });
        } catch(err2) {
            res.status(500).json({ error: e.message });
        }
    }
});

// 4. API Avanzata Generatore Versioni Personalizzate & Antigravity Orchestrator
app.post('/api/generate-custom-version', (req, res) => {
    const { destName, destCompany, isDemo, modules, destinationType, targetDrive, scadenza } = req.body;
    if (!destName || !destName.trim()) {
        return res.status(400).json({ error: 'Nome del destinatario obbligatorio' });
    }

    const { exec } = require('child_process');
    const psScript = path.resolve(__dirname, '..', '_Lanciatori_e_Utility_USB', 'Generatore_Versioni.ps1');
    const altScript = path.resolve('E:\\CREA_VERSIONI_PERSONALIZZATE\\Generatore_Versioni.ps1');
    const targetScript = fs.existsSync(psScript) ? psScript : altScript;

    const tipoParam = isDemo ? '1' : '2';
    const destParam = destinationType === 'desktop' ? '2' : '1';
    const driveParam = targetDrive || 'E:';
    let modulesParam = '0';
    if (Array.isArray(modules) && modules.length > 0) {
        modulesParam = modules.join(',');
    } else if (typeof modules === 'string' && modules.trim()) {
        modulesParam = modules.trim();
    }

    const safeDestName = destName.replace(/["`$]/g, '');
    const safeCompany = (destCompany || '').replace(/["`$]/g, '');

    const safeScadenza = (scadenza || '').replace(/["`$]/g, '');
    const psCommand = `powershell.exe -NoProfile -ExecutionPolicy Bypass -File "${targetScript}" -ParamDestName "${safeDestName}" -ParamDestCompany "${safeCompany}" -ParamTipo "${tipoParam}" -ParamModuli "${modulesParam}" -ParamDest "${destParam}" -ParamTargetDrive "${driveParam}" -ParamScadenza "${safeScadenza}"`;

    console.log('[GENERATORE] Avvio generazione per:', safeDestName);

    exec(psCommand, { cwd: path.dirname(targetScript), maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
        if (err) {
            console.error('[GENERATORE ERRORE]', err, stderr);
            return res.status(500).json({ error: 'Errore durante la generazione: ' + (stderr || err.message) });
        }

        let result = {
            success: true,
            destName: safeDestName,
            destCompany: safeCompany,
            isDemo: isDemo,
            rawOutput: stdout
        };

        const match = stdout.match(/RESULT_JSON:\s*(\{.*\})/);
        if (match && match[1]) {
            try {
                const parsed = JSON.parse(match[1]);
                Object.assign(result, parsed);
            } catch(e) {}
        }

        res.json(result);
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Inventario Server running on http://localhost:${PORT}`);
    // Scrivi l'IP in un file per farlo leggere al Pannello HTA
    try {
        const os = require('os');
        const interfaces = os.networkInterfaces();
        let bestIp = '127.0.0.1';
        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    // Evitiamo le interfacce VMware
                    if (name.toLowerCase().includes('vmware')) continue;
                    bestIp = iface.address;
                    if (iface.address.startsWith('100.') || iface.address.startsWith('192.168.')) {
                        break;
                    }
                }
            }
        }
        fs.writeFileSync(path.join(dataDir, 'myip.txt'), bestIp);
    } catch(e) {}

    // --- SISTEMA AUTO-BACKUP AUTOMATICO GIORNALIERO ---
    function runAutoBackup() {
        try {
            const rootSuite = path.resolve(__dirname, '..');
            const autoBackupDir = path.join(rootSuite, 'Backup_Automatico_Dati');
            if (!fs.existsSync(autoBackupDir)) {
                fs.mkdirSync(autoBackupDir, { recursive: true });
            }

            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
            const todayFolder = path.join(autoBackupDir, `Backup_${dateStr}`);
            if (!fs.existsSync(todayFolder)) {
                fs.mkdirSync(todayFolder, { recursive: true });
            }

            // 1. Inventario
            const invSrc = path.join(__dirname, 'data', 'inventario.json');
            if (fs.existsSync(invSrc)) {
                fs.copyFileSync(invSrc, path.join(todayFolder, 'inventario.json'));
            }
            // 2. Posizioni
            const posSrc = path.join(__dirname, 'data', 'posizioni.json');
            if (fs.existsSync(posSrc)) {
                fs.copyFileSync(posSrc, path.join(todayFolder, 'posizioni.json'));
            }
            // 3. Ricettario
            const ricSrc = path.join(rootSuite, 'RicettarioWeb', 'data', 'ricette.json');
            if (fs.existsSync(ricSrc)) {
                fs.copyFileSync(ricSrc, path.join(todayFolder, 'ricette.json'));
            }
            // 4. MedNutri Pro
            const medSrc = path.join(rootSuite, 'MedNutri_Pro', 'mednutri_server_data.json');
            if (fs.existsSync(medSrc)) {
                fs.copyFileSync(medSrc, path.join(todayFolder, 'mednutri_server_data.json'));
            }
            // 5. CareAssist Pro
            if (fs.existsSync(careAssistDbFile)) {
                fs.copyFileSync(careAssistDbFile, path.join(todayFolder, 'careassist_database.json'));
            }

            // Pulizia automatica: conserva solo gli ultimi 14 backup giornalieri
            const allBackups = fs.readdirSync(autoBackupDir)
                .filter(name => name.startsWith('Backup_'))
                .sort();
            if (allBackups.length > 14) {
                const toRemove = allBackups.slice(0, allBackups.length - 14);
                toRemove.forEach(oldFolder => {
                    try {
                        fs.rmSync(path.join(autoBackupDir, oldFolder), { recursive: true, force: true });
                    } catch(e){}
                });
            }
            console.log(`[AUTO-BACKUP] Backup giornaliero salvato in ${todayFolder}`);
        } catch(err) {
            console.error('[AUTO-BACKUP ERRORE]', err);
        }
    }

    // Esegui backup all'avvio (dopo 5 secondi) e poi ogni 12 ore
    setTimeout(runAutoBackup, 5000);
    setInterval(runAutoBackup, 12 * 60 * 60 * 1000);

    // Sistema Anti-Sospensione H24 (Keep-Alive per Render Cloud)
    // Invia un auto-ping leggero ogni 10 minuti per evitare che il server vada in standby
    const KEEP_ALIVE_URL = process.env.RENDER_EXTERNAL_URL || 'https://milella-suite.onrender.com';
    function keepAlivePing() {
        try {
            const https = require('https');
            const pingUrl = KEEP_ALIVE_URL + '/api/health';
            https.get(pingUrl, (res) => {
                // Keep-alive riuscito
            }).on('error', () => {
                // Ignora errori di rete transitori
            });
        } catch(e) {}
    }
    // Avvia auto-ping ogni 9 minuti (540000 ms)
    setInterval(keepAlivePing, 9 * 60 * 1000);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} in use, Inventario already active.`);
    } else {
        console.error("Inventario Server error:", err);
    }
});
}

startServer().catch((err) => {
    console.error("Errore critico avvio server:", err);
});

