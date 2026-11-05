// Database Medico delle Patologie
const pathologyDB = {
    'nessuna': { 
        name: "Nessuna / Prevenzione Base", desc: "Regime bilanciato standard mediterraneo.", 
        goldenRule: "Bevi almeno 2 litri d'acqua al giorno e mangia 5 porzioni di frutta e verdura.",
        avoid: ["Eccesso di sale", "Zuccheri aggiunti", "Bevande gassate", "Superalcolici", "Grassi idrogenati (Margarina)", "Carni processate (Wurstel)"], 
        promote: ["Frutta fresca", "Verdura di stagione", "Cereali Integrali", "Pesce azzurro", "Legumi", "Olio EVO a crudo"] 
    },
    'diabete': { 
        name: "Diabete di Tipo 2", desc: "Controllo rigoroso del carico glicemico.", 
        goldenRule: "Regola delle 4 P: Non abbinare MAI nello stesso pasto Pane, Pasta, Patate o Pizza.",
        avoid: ["Zucchero aggiunto", "Miele e Sciroppi", "Dolci e Pasticceria", "Pane bianco", "Succhi di frutta", "Bevande zuccherate", "Frutta sciroppata", "Caramelle e Cioccolato al latte"], 
        promote: ["Cereali integrali (Avena, Orzo)", "Legumi", "Verdure fibrose", "Noci e Mandorle", "Pesce ricco di Omega-3", "Carni bianche magre"] 
    },
    'ipertensione': { 
        name: "Ipertensione Arteriosa", desc: "Dieta DASH. Controllo rigoroso del sodio (< 2g/die).", 
        goldenRule: "Usa le spezie, il limone e le erbe aromatiche per insaporire al posto del sale.",
        avoid: ["Sale aggiunto da cucina", "Dadi da brodo", "Salumi e Insaccati", "Cibi in scatola e Salamoie", "Formaggi stagionati (Pecorino, Grana)", "Salse pronte (Ketchup, Soia)", "Snack salati (Patatine)", "Liquirizia"], 
        promote: ["Verdure fresche", "Banane (Ricche di Potassio)", "Latticini magri", "Pesce fresco", "Spezie ed erbe aromatiche", "Aglio e Cipolla"] 
    },
    'ipercolesterolemia': { 
        name: "Ipercolesterolemia", desc: "Riduzione colesterolo LDL e grassi saturi.", 
        goldenRule: "Aumenta la fibra solubile: i beta-glucani dell'avena intrappolano il colesterolo.",
        avoid: ["Burro e Panna", "Formaggi stagionati e fusi", "Insaccati e Salumi", "Frattaglie (Fegato, Cervello)", "Carni rosse grasse", "Prodotti da forno industriali", "Olio di palma e cocco", "Maionese"], 
        promote: ["Avena (Beta-glucani)", "Pesce Azzurro (Salmone, Sgombro)", "Legumi (Soia, Ceci)", "Frutta secca", "Olio EVO", "Fibre solubili (Mele con buccia)"] 
    },
    'steatosi': { 
        name: "Steatosi Epatica (Fegato Grasso)", desc: "Protocollo per ripristino epatico. Azzeramento alcol e grassi saturi.", 
        goldenRule: "Evita tassativamente il consumo di alcol: il fegato ha bisogno di disintossicarsi completamente.",
        avoid: ["Alcolici e Superalcolici", "Burro, Panna e Lardo", "Insaccati e Carni lavorate", "Fritti e Soffritti", "Zuccheri semplici e Bevande dolci", "Salse elaborate (Maionese, Ketchup)", "Carni rosse grasse", "Cibi da fast-food"], 
        promote: ["Carciofi e Cardo (Epatoprotettori)", "Verdure a foglia amara (Cicoria, Rucola)", "Pesce magro", "Olio EVO", "Limone a digiuno", "Tè verde (Antiossidante)"] 
    },
    'reflusso': { 
        name: "Reflusso Gastroesofageo (MRGE)", desc: "Controllo dell'acidità gastrica e svuotamento rapido.", 
        goldenRule: "Evita di sdraiarti subito dopo i pasti. Attendi almeno 2 o 3 ore prima di andare a letto.",
        avoid: ["Pomodoro crudo e passata", "Agrumi (Arance, Limoni)", "Caffè e Tè forte", "Cioccolato e Cacao", "Menta", "Cibi fritti e molto grassi", "Spezie piccanti (Peperoncino, Pepe nero)", "Bevande gassate", "Alcolici", "Aglio e Cipolla crudi"], 
        promote: ["Verdure cotte (Zucchine, Carote)", "Carni bianche ai ferri", "Pesce al vapore", "Cereali ben cotti", "Patate lesse", "Banane mature", "Finocchio (Digestivo)"] 
    },
    'gastrite': { 
        name: "Gastrite Acuta / Cronica", desc: "Regime non irritante per la mucosa gastrica.", 
        goldenRule: "Mastica molto lentamente e fai piccoli pasti frequenti per tamponare l'acidità.",
        avoid: ["Pepe, Peperoncino e Spezie forti", "Brodo di carne o dadi", "Caffè (anche decaffeinato)", "Alcolici e Superalcolici", "Agrumi e Succhi acidi", "Pomodoro", "Fritti", "Cibi troppo caldi o troppo freddi", "Gomme da masticare"], 
        promote: ["Riso bianco o Pasta ben cotta", "Zucchine e Carote lesse", "Pollo o Tacchino al vapore", "Olio EVO a crudo", "Patate", "Mele cotte"] 
    },
    'colon': { 
        name: "Sindrome Intestino Irritabile (IBS)", desc: "Protocollo Low-FODMAP per riduzione del gonfiore.", 
        goldenRule: "Riduci temporaneamente gli alimenti fermentescibili (FODMAP) e reintroducili gradualmente.",
        avoid: ["Legumi (Ceci, Fagioli, Lenticchie)", "Latticini con Lattosio", "Cipolla e Aglio", "Mele, Pere, Pesche, Susine", "Cavoli, Broccoli e Cavolfiori", "Gomme da masticare (Xilitolo, Sorbitolo)", "Frumento e Segale in grandi quantità", "Funghi", "Cibi molto elaborati"], 
        promote: ["Latte delattosato o vegetale", "Kiwi, Banane, Mirtilli, Arance", "Zucchine, Melanzane, Carote", "Riso, Quinoa, Avena", "Carni magre", "Pesce", "Patate"] 
    },
    'gotta': { 
        name: "Iperuricemia / Gotta", desc: "Controllo rigoroso delle purine.", 
        goldenRule: "Evita alimenti ad alta densità cellulare (come le frattaglie) per limitare la produzione di acido urico.",
        avoid: ["Frattaglie (Fegato, Rognone)", "Carni rosse (Manzo, Castrato)", "Molluschi e Crostacei", "Acciughe, Sardine e Sgombro", "Estratti di carne e Dadi", "Alcolici (specialmente Birra)", "Selvaggina", "Cibi ricchi di fruttosio industriale"], 
        promote: ["Ciliegie e Frutti di bosco (Uricosurici)", "Latticini magri", "Uova", "Pasta e Riso", "Verdure (eccetto Spinaci e Asparagi in eccesso)", "Acqua abbondante (>2.5 litri/die)"] 
    },
    'celiachia': { 
        name: "Celiachia (Gluten-Free)", desc: "Esclusione totale e a vita del glutine.", 
        goldenRule: "Attenzione alle contaminazioni incrociate: usa taglieri e pentole separate per cucinare il senza glutine.",
        avoid: ["Frumento (Grano)", "Farro, Orzo e Segale", "Kamut e Spelta", "Pangrattato e Farine normali", "Lievito madre tradizionale", "Seitan", "Birra tradizionale", "Cibi industriali non certificati 'Senza Glutine'"], 
        promote: ["Riso, Mais e Grano Saraceno", "Quinoa, Amaranto e Miglio", "Tuberi (Patate, Tapioca)", "Carni fresche e Pesce", "Uova", "Legumi", "Frutta e Verdura fresca"] 
    },
    'renale': { 
        name: "Insufficienza Renale (Stadio 1-3)", desc: "Controllo di proteine, potassio e fosforo.", 
        goldenRule: "Per ridurre il potassio, taglia le verdure a pezzetti e lasciale a bagno nell'acqua per alcune ore prima di cuocerle.",
        avoid: ["Eccesso di Proteine (Carni rosse grandi porzioni)", "Sale aggiunto", "Cibi in scatola", "Formaggi fusi e Sottilette (Ricchi di Fosforo)", "Frutta secca e Cacao", "Brodo di carne", "Banane e Kiwi (Se il potassio è alto)", "Salumi"], 
        promote: ["Cereali aproteici (se prescritti)", "Pasta e Riso bianco", "Verdure bollite (scartando l'acqua)", "Olio EVO", "Burro (con moderazione per calorie)", "Mela, Pera"] 
    },
    'tiroide': { 
        name: "Ipotiroidismo", desc: "Supporto metabolico e modulazione iodio/gozzigeni.", 
        goldenRule: "Non esagerare con cavoli e broccoli crudi, poiché contengono sostanze 'gozzigene' che ostacolano l'assorbimento dello iodio.",
        avoid: ["Verdure crucifere crude (Cavoli, Broccoli, Rapanelli)", "Eccesso di Soia (Ostacola l'assorbimento degli ormoni tiroidei)", "Zuccheri raffinati (A causa del metabolismo rallentato)", "Grassi idrogenati", "Alghe in eccesso (Senza consulto medico)", "Alimenti ultra-processati"], 
        promote: ["Pesce di mare (Ricco di Iodio)", "Uova", "Carni magre", "Noci del Brasile (Ricche di Selenio)", "Cereali integrali (Per la stipsi)", "Sale iodato (Con moderazione)"] 
    },
    'pcos': { 
        name: "Sindrome Ovaio Policistico (PCOS)", desc: "Controllo dell'insulino-resistenza associata.", 
        goldenRule: "Prediligi sempre carboidrati a basso indice glicemico per tenere a bada i picchi di insulina.",
        avoid: ["Farine raffinate (Pane bianco, Pizza normale)", "Zuccheri semplici e Dolci", "Bevande zuccherate", "Latte vaccino in eccesso (Stimola l'IGF-1)", "Cibi confezionati", "Grassi saturi (Burro, Insaccati)"], 
        promote: ["Cereali integrali (Avena, Quinoa, Farro)", "Legumi", "Semi di Lino e Zucca", "Pesce azzurro (Omega-3)", "Verdure a foglia verde", "Carboidrati abbinati a proteine o grassi buoni"] 
    },
    'stipsi': { 
        name: "Stipsi Cronica", desc: "Aumento dell'apporto di fibre insolubili e acqua.", 
        goldenRule: "Non basta mangiare fibre: senza un adeguato apporto d'acqua (almeno 2L), le fibre induriscono ulteriormente le feci.",
        avoid: ["Pane bianco e Riso brillato", "Patate", "Banane poco mature", "Mele senza buccia", "Formaggi stagionati", "Tè molto concentrato", "Eccesso di Cioccolato fondente", "Cibi astringenti (Limone in eccesso)"], 
        promote: ["Prugne e Kiwi maturi", "Crusca d'avena o frumento", "Cereali 100% integrali", "Legumi", "Verdura cotta (Spinaci, Bietole)", "Zuppe e Minestroni", "Acqua ricca di magnesio"] 
    },
    'osteoporosi': { 
        name: "Osteoporosi / Osteopenia", desc: "Ottimizzazione di Calcio e Vitamina D.", 
        goldenRule: "L'eccesso di sale e di caffeina aumenta la perdita di calcio attraverso le urine. Moderazione!",
        avoid: ["Sale aggiunto (Aumenta l'escrezione di calcio)", "Caffè in eccesso (>3 tazzine/die)", "Superalcolici", "Bevande tipo Cola (Ricche di fosfati)", "Crusca in eccesso (Ostacola l'assorbimento del calcio)", "Eccesso di proteine animali"], 
        promote: ["Latticini magri (Yogurt, Ricotta)", "Grana padano o Parmigiano (30g)", "Mandorle", "Acqua calcica (>200 mg/L di Calcio)", "Verdure a foglia verde scura", "Pesce azzurro (Per Vitamina D)"] 
    }
};
    

function updateAnalysis() {
    const pat = document.getElementById('patient-pathology').value;
    const panel = document.getElementById('medical-analysis');
    
    if (pat === 'altro') {
        const cName = document.getElementById('custom-pat-name').value || "Patologia Personalizzata";
        const cAvoid = document.getElementById('custom-pat-avoid').value;
        const cPromote = document.getElementById('custom-pat-promote').value;
        
        let avoidHtml = cAvoid ? cAvoid.split(',').map(i => `<li>❌ ${i.trim()}</li>`).join('') : "<li>❌ (Nessun dato)</li>";
        let promoteHtml = cPromote ? cPromote.split(',').map(i => `<li>✅ ${i.trim()}</li>`).join('') : "<li>✅ (Nessun dato)</li>";
        
        panel.innerHTML = `
            <p style="margin-bottom:15px; font-weight:600; color:#1e293b;">${cName} (Personalizzata)</p>
            <div class="rule-item danger">
                <strong>Da Evitare Tassativamente:</strong>
                <ul style="list-style:none; margin-top:8px; display:flex; flex-direction:column; gap:4px; font-size:0.9rem;">${avoidHtml}</ul>
            </div>
            <div class="rule-item success">
                <strong>Da Promuovere Fortemente:</strong>
                <ul style="list-style:none; margin-top:8px; display:flex; flex-direction:column; gap:4px; font-size:0.9rem;">${promoteHtml}</ul>
            </div>
        `;
        return;
    }
    
    const mainPat = pathologyDB[pat];
    
    // Raccogli comorbidità selezionate
    let selectedComorbidities = [];
    document.querySelectorAll('.com-checkbox input:checked').forEach(cb => {
        if(pathologyDB[cb.value]) selectedComorbidities.push(pathologyDB[cb.value]);
    });

    // Unisci divieti e promozioni
    let mergedAvoid = new Set(mainPat.avoid);
    let mergedPromote = new Set(mainPat.promote);
    let mergedGoldenRules = [];
    if(mainPat.goldenRule) mergedGoldenRules.push(`<strong>⭐ ${mainPat.name}:</strong> ${mainPat.goldenRule}`);
    
    let titleNames = [mainPat.name];

    selectedComorbidities.forEach(p => {
        titleNames.push(p.name);
        p.avoid.forEach(item => mergedAvoid.add(item));
        p.promote.forEach(item => mergedPromote.add(item));
        if (p.goldenRule) {
            mergedGoldenRules.push(`<strong>⭐ ${p.name}:</strong> ${p.goldenRule}`);
        }
    });

    let avoidHtml = Array.from(mergedAvoid).map(i => `<li>❌ ${i}</li>`).join('');
    let promoteHtml = Array.from(mergedPromote).map(i => `<li>✅ ${i}</li>`).join('');
    let rulesHtml = mergedGoldenRules.map(r => `<div style="margin-bottom:5px;">${r}</div>`).join('');

    let combinedTitle = titleNames.length > 1 
        ? `Protocollo Unificato: ${titleNames.join(' + ')}` 
        : mainPat.desc;

    panel.innerHTML = `
        <p style="margin-bottom:15px; font-weight:600; color:#1e293b;">${combinedTitle}</p>
        ${mergedGoldenRules.length > 0 ? `<div class="golden-rule">${rulesHtml}</div>` : ''}
        <div class="rule-item danger">
            <strong>Da Evitare Tassativamente:</strong>
            <ul style="list-style:none; margin-top:8px; display:flex; flex-direction:column; gap:4px; font-size:0.9rem;">${avoidHtml}</ul>
        </div>
        <div class="rule-item success">
            <strong>Da Promuovere Fortemente:</strong>
            <ul style="list-style:none; margin-top:8px; display:flex; flex-direction:column; gap:4px; font-size:0.9rem;">${promoteHtml}</ul>
        </div>
    `;
}

function generateDiet() {
    const pat = document.getElementById('patient-pathology').value;
    const name = document.getElementById('patient-name').value || 'il Paziente';
    
    if (pat === 'altro') {
        if(typeof showToast !== 'undefined') showToast("Hai selezionato 'Altra Patologia'. Inserisci i pasti manualmente.", "warning");
        return;
    }

    const tbody = document.getElementById('diet-body');
    const rows = tbody.querySelectorAll('tr');
    
    // Variazioni Pasti per Patologia (7 varianti per ogni pasto)
    const menus = {
        'diabete': {
            colazione: [
                "Yogurt greco, 30g avena, mirtilli", 
                "Latte di soia, 3 fette Wasa, mandorle", 
                "Kefir, semi di lino, mezza mela verde",
                "Yogurt magro, 1 kiwi, noci",
                "Tè verde, 4 biscotti integrali per diabetici",
                "Latte scremato, 30g crusca, fragole",
                "Yogurt greco, noci pecan, cannella"
            ],
            pranzo: [
                "70g farro, 150g tacchino, insalata, olio EVO", 
                "70g quinoa, 150g pollo, zucchine grigliate", 
                "80g orzo, 100g ricotta, spinaci baby",
                "150g lenticchie, verdure miste, 1 cucchiaio olio",
                "70g riso integrale, 150g petto di pollo, melanzane",
                "70g pasta integrale, 100g tonno naturale, pomodorini",
                "Zuppa di ceci (150g), verdure a foglia, crostini integrali"
            ],
            spuntino: [
                "1 mela verde", "15 mandorle", "Yogurt magro bianco", "1 finocchio", "10 noci", "Mezza pera", "Kefir"
            ],
            cena: [
                "200g merluzzo, broccoli, 50g pane segale", 
                "2 uova sode, asparagi, 50g pane integrale", 
                "150g salmone, fagiolini, 50g pane segale",
                "200g platessa al vapore, cavolfiore, 50g pane segale",
                "150g fesa di tacchino, insalata mista, 50g pane integrale",
                "100g formaggio magro, verdure grigliate, 50g pane",
                "200g spigola al forno, zucchine, 50g pane segale"
            ]
        },
        'steatosi': {
            colazione: ["Porridge avena", "Yogurt bianco magro", "Tè verde, fette integrali", "Kefir e mirtilli", "Latte di mandorla, noci", "Yogurt greco magro", "Tè deteinato, fette Wasa"],
            pranzo: ["70g riso integrale, 150g salmone, carciofi", "70g farro, 150g tacchino, insalata", "Zuppa lenticchie, carote", "70g orzo, verdure grigliate", "70g pasta integrale, 150g pollo, zucchine", "70g quinoa, pomodorini e rucola", "Riso venere 70g, 150g pesce magro, broccoli"],
            spuntino: ["150g kefir", "1 mela", "10 noci", "1 finocchio", "Yogurt magro", "15 mandorle", "Spremuta d'arancia"],
            cena: ["Minestrone verdure, pollo", "200g branzino, spinaci", "100g bresaola, rucola", "150g vitello magro, cavolfiore", "2 uova, asparagi", "200g merluzzo, fagiolini", "Insalatona mista, 100g ricotta"]
        },
        'ipertensione': {
            colazione: ["Latte scremato, banana", "Yogurt magro, mirtilli", "Tè, pane sciapo e ricotta", "Spremuta, fette senza sale", "Porridge con mela", "Latte e fiocchi d'avena", "Yogurt e noci"],
            pranzo: ["80g pasta (zero sale), zucchine", "70g riso, pollo limone", "Minestrone fresco, pane sciapo", "70g farro, pomodori freschi", "150g ceci, verdure", "70g pasta, sugo fresco basilico", "Zuppa orzo e legumi"],
            spuntino: ["1 banana", "Yogurt", "1 arancia", "Mandorle non salate", "1 kiwi", "Mezza mela", "Kefir"],
            cena: ["150g pollo, spinaci (zero sale)", "200g pesce azzurro, pomodori", "2 uova, melanzane", "200g merluzzo, fagiolini", "150g tacchino, carote", "Formaggio magro dolce, insalata", "150g vitello, asparagi"]
        },
        'ipercolesterolemia': {
            colazione: ["Porridge avena (beta-glucani)", "Yogurt soia, frutti rossi", "Latte scremato, fette", "Tè verde, biscotti avena", "Kefir, semi di chia", "Spremuta, mandorle", "Yogurt magro, mela"],
            pranzo: ["70g orzo, 150g salmone", "70g pasta int, legumi", "70g quinoa, tacchino", "150g fagioli, verdure", "70g riso int, pollo", "70g farro, zucchine", "Zuppa ceci e cavolo nero"],
            spuntino: ["1 mela", "15 mandorle", "Yogurt magro", "1 finocchio", "10 noci", "1 pera", "Kefir"],
            cena: ["200g merluzzo, broccoli", "150g pollo, insalata", "Minestrone, pane int", "200g sgombro, fagiolini", "2 uova, spinaci", "150g tacchino, carote", "100g ricotta, verdure grigliate"]
        },
        'reflusso': {
            colazione: ["Latte parz. scremato, fette", "Yogurt magro, mela cotta", "Tè leggero, biscotti", "Latte mandorla, fette", "Yogurt bianco, pera cotta", "Latte, fiocchi riso", "Tè, fette e marmellata"],
            pranzo: ["70g riso, pollo bollito", "70g pasta, ricotta, zucchine", "70g farro, platessa, patate", "70g pasta, carote lesse", "70g riso, tacchino", "70g orzo, verdure lesse", "Vellutata zucca, crostini"],
            spuntino: ["1 banana matura", "Mela cotta", "Yogurt", "Pera cotta", "Fette biscottate", "Latte scremato", "Banana"],
            cena: ["200g pesce magro, patate", "150g tacchino, carote", "2 uova coque, vellutata", "200g merluzzo, zucchine", "150g pollo, fagiolini", "Formaggio magro, patate", "Pesce al vapore, finocchi lessi"]
        },
        'colon': {
            colazione: ["Latte s/lattosio, avena", "Yogurt delatt, banana", "Tè verde, gallette riso", "Kefir, noci", "Latte s/lattosio, fette", "Tè, biscotti s/lattosio", "Yogurt soia"],
            pranzo: ["70g riso, carne magra, carote", "70g quinoa, pollo, zucchine", "70g pasta GF, pesce, spinaci", "70g riso, tacchino", "70g miglio, verdure", "70g riso, tonno", "Pasta GF, zucchine"],
            spuntino: ["1 kiwi", "Mezza banana", "10 arachidi", "Yogurt s/latt", "Mandarino", "Gallette di riso", "Mandorle"],
            cena: ["200g orata, patate forno", "150g tacchino, carote", "2 uova, insalata", "200g spigola, spinaci", "150g pollo, fagiolini", "Formaggio s/latt, patate", "Pesce, zucchine"]
        },
        'celiachia': {
            colazione: ["Yogurt, quinoa soffiata", "Latte, gallette mais", "Kefir, grano saraceno", "Tè, fette GF", "Latte, biscotti GF", "Yogurt, frutta fresca", "Tè, gallette riso"],
            pranzo: ["70g pasta GF, pollo", "70g riso, tonno", "70g grano saraceno, tacchino", "70g mais, pesce", "70g quinoa, verdure", "70g riso, carne", "Pasta GF, zucchine"],
            spuntino: ["Frutta fresca", "Yogurt", "Mandorle", "Gallette riso", "1 mela", "Noci", "Kefir"],
            cena: ["200g pesce, patate", "150g carne, fagiolini", "Frittata, insalata", "200g spigola, carote", "150g pollo, spinaci", "Formaggio, verdure", "Pesce, patate"]
        }
    };

    // Fallback menu for pathologies not explicitly defined in variants yet
    const fallback = {
        colazione: ["Yogurt magro, 30g avena, 1 frutto", "Latte parz. scremato, 3 fette integrali", "Tè, 4 biscotti secchi, 1 frutto"],
        pranzo: ["70g pasta integrale, 150g pollo, insalata", "70g riso, 150g pesce, verdure di stagione", "70g farro, 100g formaggio magro, verdure"],
        spuntino: ["1 frutto di stagione", "Yogurt magro", "15 mandorle"],
        cena: ["200g pesce bianco, verdure, pane", "150g tacchino, insalata, pane", "Minestrone di verdure, 2 uova"]
    };

    const selMenu = menus[pat] || fallback;

    // Mescola (Shuffle) casualmente le opzioni così ogni 'Generazione' crea una dieta diversa
    function shuffle(array) {
        let arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    const shColazione = shuffle(selMenu.colazione);
    const shPranzo = shuffle(selMenu.pranzo);
    const shSpuntino = shuffle(selMenu.spuntino);
    const shCena = shuffle(selMenu.cena);

    const goal = (document.getElementById('patient-goal') || {}).value || 'normo';
    applyGoalChange();

    // Ciascun giorno ha il suo pasto unico e randomizzato!
    rows.forEach((r, index) => {
        let tds = r.querySelectorAll('td');
        
        let cIdx = index % shColazione.length;
        let pIdx = index % shPranzo.length;
        let sIdx = index % shSpuntino.length;
        let ceIdx = index % shCena.length;
        
        tds[1].innerText = adjustPortionText(shColazione[cIdx], goal);
        tds[2].innerText = adjustPortionText(shPranzo[pIdx], goal);
        tds[3].innerText = adjustPortionText(shSpuntino[sIdx], goal);
        tds[4].innerText = adjustPortionText(shCena[ceIdx], goal);
        
        for (let i = 1; i <= 4; i++) {
            tds[i].setAttribute('contenteditable', 'true');
            tds[i].setAttribute('title', 'Clicca per modificare il piatto a mano');
        }
    });

    let goalLabel = goal === 'ipo' ? ' (Ipocalorica)' : (goal === 'iper' ? ' (Iperproteica)' : '');
    showToast(`Terapia generata per ${name}: ${pat !== 'nessuna' ? pathologyDB[pat].name : 'Mantenimento Base'}${goalLabel}.`, "success");
}

function adjustPortionText(dish, goal) {
    if (!dish || goal === 'normo') return dish;
    // Ricalcola quantitativi in grammi es. 70g -> 55g (ipo) o 85g (iper)
    return dish.replace(/(\d+)\s*g\b/gi, (match, p1) => {
        let val = parseInt(p1, 10);
        if (isNaN(val)) return match;
        let factor = (goal === 'ipo') ? 0.8 : 1.2;
        let adjusted = Math.round((val * factor) / 5) * 5;
        if (adjusted < 15) adjusted = 15;
        return adjusted + 'g';
    });
}

function applyGoalChange() {
    const goalEl = document.getElementById('patient-goal');
    if (!goalEl) return;
    const goal = goalEl.value;
    const dietBadge = document.getElementById('diet-goal-badge');
    const goalBadge = document.getElementById('goal-badge');
    
    let text = '⚖️ Normocalorica';
    let color = '#0369a1';
    let bg = '#e0f2fe';
    if (goal === 'ipo') {
        text = '🔻 Ipocalorica (-20% carbo/porzioni)';
        color = '#b45309';
        bg = '#fef3c7';
    } else if (goal === 'iper') {
        text = '🔺 Iperproteica / Sport (+20% porzioni)';
        color = '#15803d';
        bg = '#dcfce7';
    }
    
    if (dietBadge) {
        dietBadge.innerText = text;
        dietBadge.style.color = color;
        dietBadge.style.background = bg;
    }
    if (goalBadge) {
        goalBadge.innerText = goal === 'normo' ? '' : (goal === 'ipo' ? '(-20%)' : '(+20%)');
        goalBadge.style.color = color;
    }
}

function calculateAge() {
    let dob = document.getElementById('patient-dob').value;
    if (dob) {
        let birthDate = new Date(dob);
        let today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
            calculateBMI();
}
        document.getElementById('calculated-age').innerText = '(' + age + ' anni)';
    } else {
        document.getElementById('calculated-age').innerText = '';
    }
}


const daysOfWeek = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
function initTable() {
    const tbody = document.getElementById('diet-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    daysOfWeek.forEach(day => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${day}</strong></td>
            <td contenteditable="true" title="Clicca per modificare il piatto a mano">-</td>
            <td contenteditable="true" title="Clicca per modificare il piatto a mano">-</td>
            <td contenteditable="true" title="Clicca per modificare il piatto a mano">-</td>
            <td contenteditable="true" title="Clicca per modificare il piatto a mano">-</td>
        `;
        tbody.appendChild(tr);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    // Se non ci sono pazienti in archivio o il profilo manca, ripristina automaticamente dal backup predefinito
    try {
        const seedData = {
            "mednutri_doc_profile": JSON.stringify({"avatar":"👨‍⚕️","name":"Dott. Ciro Milella","spec":"Medico Chirurgo Nutrizionista","clinic":"Ambulatorio Medico"}),
            "mednutri_security_pin": "f53a8cc51204bdb35e8fd0ba841c1b8c2f238bd6f069410b0a44b97a3354dbf3",
            "mednutri_pat_ciro milella": JSON.stringify({"name":"Ciro Milella","gender":"M","dob":"1967-12-16","height":"160","weight":"79.3","wrist":"25","lifestyle":"1.375","start":"2026-10-06","end":"2026-11-05","mainPathology":"steatosi","comorbidities":[],"lastSaved":"06/10/2026"}),
            "mednutri_custom_pathologies": JSON.stringify({"items":{},"deleted":[]}),
            "mednutri_last_cloud_sync": "12/10/2026 alle 20:30",
            "mednutri_cloud_config": JSON.stringify({"studioId":"STUDIO-AA-890","autoSyncEnabled":true,"endpoint":"https://api.jsonbin.io/v3/b"})
        };

        if (!localStorage.getItem('mednutri_pat_ciro milella') || !localStorage.getItem('mednutri_doc_profile')) {
            for (let k in seedData) {
                if (!localStorage.getItem(k)) {
                    localStorage.setItem(k, seedData[k]);
                }
            }
            checkDoctorProfile();
            if (typeof loadPatient === 'function') loadPatient('Ciro Milella');
        }
    } catch(e) {
        console.warn('MedNutri seed error:', e);
    }

    initDates();
    initComorbidities();
    checkDoctorProfile();
    initTable();
    applyGoalChange();

    // Auto-carica l'ultimo paziente se il campo nome è vuoto
    setTimeout(() => {
        let nameEl = document.getElementById('patient-name');
        if (nameEl && !nameEl.value.trim()) {
            if (localStorage.getItem('mednutri_pat_ciro milella') && typeof loadPatient === 'function') {
                loadPatient('Ciro Milella');
            } else {
                for (let i = 0; i < localStorage.length; i++) {
                    let k = localStorage.key(i);
                    if (k && k.startsWith('mednutri_pat_')) {
                        try {
                            let p = JSON.parse(localStorage.getItem(k));
                            if (p && p.name && typeof loadPatient === 'function') {
                                loadPatient(p.name);
                                break;
                            }
                        } catch(e) {}
                    }
                }
            }
        }
    }, 150);
});


function prepareAndPrint() {
    let saved = localStorage.getItem('mednutri_doc_profile');
    let docName = "Medico non specificato";
    if (saved) {
        let doc = JSON.parse(saved);
        docName = doc.name;
    }
    
    let patName = document.getElementById('patient-name').value || "Non specificato";
    let dateStart = document.getElementById('period-start').value || "...";
    let dateEnd = document.getElementById('period-end').value || "...";
    
    // Formatta le date se presenti
    if(dateStart !== "...") { let d = new Date(dateStart); dateStart = d.toLocaleDateString('it-IT'); }
    if(dateEnd !== "...") { let d = new Date(dateEnd); dateEnd = d.toLocaleDateString('it-IT'); }
    
    let patDob = document.getElementById('patient-dob').value;
    if(patDob) { let d = new Date(patDob); patDob = d.toLocaleDateString('it-IT'); } else { patDob = "N/D"; }
    
    let gender = document.getElementById('patient-gender').value === 'M' ? 'Uomo' : 'Donna';
    if(patDob !== "N/D") patDob += " (" + gender + ")";
    
    let pHeight = document.getElementById('patient-height').value || '-';
    let pWeight = document.getElementById('patient-weight').value || '-';
    
    document.getElementById('print-doc-info').innerText = docName;
    document.getElementById('print-pat-info').innerText = patName;
    document.getElementById('print-pat-dob').innerText = patDob;
    document.getElementById('print-pat-hw').innerText = `${pWeight} Kg / ${pHeight} cm`;
    document.getElementById('print-period-info').innerText = "dal " + dateStart + " al " + dateEnd;
    
    // Dati Clinici Stampati
    let goalEl = document.getElementById('patient-goal');
    let goalText = goalEl ? goalEl.options[goalEl.selectedIndex].text : "Standard";
    let patVal = (document.getElementById('patient-pathology') || {}).value || 'nessuna';
    let mainPatName = (pathologyDB[patVal] || {}).name || "Prevenzione Base";
    
    let coms = [];
    document.querySelectorAll('#comorbidities-container input:checked').forEach(cb => {
        if (pathologyDB[cb.value]) coms.push(pathologyDB[cb.value].name);
    });
    
    let notesText = (document.getElementById('patient-notes') || {}).value || '';

    let prDiag = document.getElementById('print-diagnosis-info');
    let prGoal = document.getElementById('print-goal-info');
    let prComRow = document.getElementById('print-comorbidities-row');
    let prComInfo = document.getElementById('print-comorbidities-info');
    let prNotes = document.getElementById('print-notes-text');
    let prDate = document.getElementById('print-date-today');

    if (prDiag) prDiag.innerText = mainPatName;
    if (prGoal) prGoal.innerText = goalText;
    if (prComRow && prComInfo) {
        if (coms.length > 0) {
            prComRow.style.display = 'block';
            prComInfo.innerText = coms.join(', ');
        } else {
            prComRow.style.display = 'none';
        }
    }
    if (prNotes) {
        prNotes.innerText = notesText.trim() ? notesText.trim() : "Seguire il piano alimentare rispettando le combinazioni prescritte. Idratazione raccomandata: almeno 1.5 - 2 litri d'acqua al giorno.";
    }
    if (prDate) prDate.innerText = new Date().toLocaleDateString('it-IT');

    window.print();
}



function initComorbidities() {
    const container = document.getElementById('comorbidities-container');
    container.innerHTML = '';
    
    const excludedKeys = ['nessuna', 'altro'];
    
    let sortedKeys = Object.keys(pathologyDB).filter(k => !excludedKeys.includes(k));
    sortedKeys.sort((a, b) => pathologyDB[a].name.localeCompare(pathologyDB[b].name));
    
    sortedKeys.forEach(key => {
        let label = document.createElement('label');
        label.className = 'com-checkbox';
        label.innerHTML = `<input type="checkbox" value="${key}" onchange="updateAnalysis()"> ${pathologyDB[key].name}`;
        container.appendChild(label);
    });
}

function initDates() {
    const today = new Date();
    document.getElementById('period-start').valueAsDate = today;
    
    // Default validità 30 giorni
    const nextMonth = new Date(today);
    nextMonth.setDate(nextMonth.getDate() + 30);
    document.getElementById('period-end').valueAsDate = nextMonth;
}


function calculateBMI() {
    let hRaw = document.getElementById('patient-height').value;
    let wRaw = document.getElementById('patient-weight').value;
    let wristRaw = document.getElementById('patient-wrist').value;
    
    let h = parseFloat(hRaw.replace(',', '.'));
    let w = parseFloat(wRaw.replace(',', '.'));
    let wrist = parseFloat(wristRaw.replace(',', '.'));
    let gender = document.getElementById('patient-gender').value;
    let lifestyle = document.getElementById('patient-lifestyle').value;
    
    let ageText = document.getElementById('calculated-age').innerText;
    let age = parseInt(ageText.replace(/\D/g, '')) || 0;
    
    let badge = document.getElementById('bmi-badge');
    let frameBadge = document.getElementById('frame-badge');
    let tdeeBadge = document.getElementById('tdee-badge');
    
    // Auto-correzione se il medico inserisce l'altezza in metri (es. 1.60) invece di cm (es. 160)
    if (h > 0 && h < 3) {
        h = h * 100;
    }
    
    // Calcolo Costituzione (Morfologia)
    if (h > 0 && wrist > 0) {
        let r = h / wrist;
        let frame = '';
        let fColor = '';
        if (gender === 'M') {
            if (r > 10.4) { frame = 'Longilinea (Ossa fini)'; fColor = '#8b5cf6'; }
            else if (r >= 9.6 && r <= 10.4) { frame = 'Normolinea'; fColor = '#10b981'; }
            else { frame = 'Brevilinea (Ossa grosse)'; fColor = '#f59e0b'; }
        } else {
            if (r > 10.9) { frame = 'Longilinea (Ossa fini)'; fColor = '#8b5cf6'; }
            else if (r >= 9.9 && r <= 10.9) { frame = 'Normolinea'; fColor = '#10b981'; }
            else { frame = 'Brevilinea (Ossa grosse)'; fColor = '#f59e0b'; }
        }
        
        if (wrist < 5 || wrist > 35) {
            frame = 'Valore errato'; fColor = '#ef4444';
        }
        
        frameBadge.innerHTML = `<span style="color: ${fColor}; background: ${fColor}20; padding: 2px 6px; border-radius: 4px;">${frame}</span>`;
    } else {
        frameBadge.innerHTML = '';
    }

    // Calcolo BMI & TDEE
    if (h > 0 && w > 0) {
        let heightM = h / 100;
        let bmi = (w / (heightM * heightM)).toFixed(1);
        
        let status = '';
        let color = '';
        
        if (bmi < 18.5) { status = 'Sottopeso'; color = '#3b82f6'; }
        else if (bmi >= 18.5 && bmi < 25) { status = 'Normopeso'; color = '#22c55e'; }
        else if (bmi >= 25 && bmi < 30) { status = 'Sovrappeso'; color = '#eab308'; }
        else if (bmi >= 30 && bmi < 35) { status = 'Obesità 1'; color = '#f97316'; }
        else if (bmi >= 35 && bmi < 40) { status = 'Obesità 2'; color = '#ef4444'; }
        else { status = 'Obesità 3'; color = '#991b1b'; }
        
        badge.innerHTML = `<span style="color: ${color}; background: ${color}20; padding: 2px 6px; border-radius: 4px;">BMI ${bmi} (${status})</span>`;
        
        // Calcolo BMR (Mifflin-St Jeor) e TDEE
        if (age > 0) {
            let bmr = 0;
            if (gender === 'M') {
                bmr = (10 * w) + (6.25 * h) - (5 * age) + 5;
            } else {
                bmr = (10 * w) + (6.25 * h) - (5 * age) - 161;
            }
            let tdee = Math.round(bmr * parseFloat(lifestyle));
            tdeeBadge.innerHTML = `<span style="color: #0284c7; background: #0284c720; padding: 2px 6px; border-radius: 4px;">${tdee} Kcal/die</span>`;
        }
    } else {
        badge.innerHTML = '';
        tdeeBadge.innerHTML = '';
    }
}


function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if(type === 'success') icon = '✅';
    if(type === 'error') icon = '❌';
    if(type === 'warning') icon = '⚠️';
    
    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}


function savePatient() {
    let fields = [
        { id: 'patient-name', val: document.getElementById('patient-name').value.trim() },
        { id: 'patient-dob', val: document.getElementById('patient-dob').value },
        { id: 'patient-height', val: document.getElementById('patient-height').value },
        { id: 'patient-weight', val: document.getElementById('patient-weight').value },
        { id: 'patient-wrist', val: document.getElementById('patient-wrist').value }
    ];
    
    // Reset errors and re-add normal listeners
    fields.forEach(f => {
        let el = document.getElementById(f.id);
        el.classList.remove('input-error');
        // Rimuove l'errore non appena l'utente inizia a scrivere
        el.addEventListener('input', function() { this.classList.remove('input-error'); });
    });
    
    let missing = fields.filter(f => !f.val);
    
    if (missing.length > 0) {
        // Applica classe errore a tutti i campi vuoti
        missing.forEach(f => document.getElementById(f.id).classList.add('input-error'));
        
        // Sposta il focus sul primo campo vuoto
        document.getElementById(missing[0].id).focus();
        
        showToast("Compila i campi evidenziati in rosso prima di salvare.", "error");
        return;
    }
    
    let name = fields[0].val;
    
    // Raccogli patologie
    let pathologies = [];
    document.querySelectorAll('#comorbidities-container input:checked').forEach(cb => pathologies.push(cb.value));

    // Raccogli la tabella settimanale con eventuali piatti modificati manualmente
    let dietGrid = [];
    document.querySelectorAll('#diet-body tr').forEach(tr => {
        let cells = tr.querySelectorAll('td');
        if (cells.length >= 5) {
            dietGrid.push([cells[1].innerText, cells[2].innerText, cells[3].innerText, cells[4].innerText]);
        }
    });

    let patientData = {
        name: name,
        gender: document.getElementById('patient-gender').value,
        dob: document.getElementById('patient-dob').value,
        height: document.getElementById('patient-height').value,
        weight: document.getElementById('patient-weight').value,
        wrist: document.getElementById('patient-wrist').value,
        lifestyle: document.getElementById('patient-lifestyle').value,
        goal: (document.getElementById('patient-goal') || {}).value || 'normo',
        notes: (document.getElementById('patient-notes') || {}).value || '',
        start: document.getElementById('period-start').value,
        end: document.getElementById('period-end').value,
        mainPathology: document.getElementById('patient-pathology').value,
        comorbidities: pathologies,
        dietGrid: dietGrid,
        lastSaved: new Date().toLocaleDateString()
    };
    
    localStorage.setItem('mednutri_pat_' + name.toLowerCase(), JSON.stringify(patientData));
    showToast(`Scheda di ${name} salvata in archivio (incluso piano pasti personalizzato)!`, "success");

    // TRASMISSIONE AUTOMATICA AL DATABASE UNIFICATO DELLA SUITE (CAREASSIST & SALUTE)
    try {
        fetch('/api/suite/pazienti', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: 'paz_' + Date.now(),
                nome: name,
                dataNascita: document.getElementById('patient-dob').value,
                sesso: document.getElementById('patient-gender').value,
                altezza: document.getElementById('patient-height')?.value || '',
                peso: document.getElementById('patient-weight')?.value || '',
                polso: document.getElementById('patient-wrist')?.value || '',
                bmi: (typeof calculateBMI === 'function' ? (document.getElementById('calculated-bmi')?.textContent || '') : ''),
                noteCliniche: document.getElementById('patient-notes')?.value || '',
                patologie: pathologies,
                nutrizione: {
                    patologiaTarget: document.getElementById('patologia')?.value || '',
                    ultimoAggiornamento: new Date().toISOString()
                },
                origini: ['Ambulatorio Medico', 'CareAssist Pro', 'Progetto Salute']
            })
        }).then(r => r.json()).then(res => {
            console.log('Paziente sincronizzato su Suite centrale:', res);
        }).catch(err => console.warn('Errore sync suite da MedNutri:', err.message));
    } catch(eSync) {}

    // Sincronizzazione automatica su Cloud in background
    if (typeof triggerAutoCloudSync === 'function') {
        triggerAutoCloudSync(false);
    }
}

function openArchive() {
    let list = document.getElementById('archive-list');
    list.innerHTML = '';
    
    let patients = [];
    for(let i=0; i<localStorage.length; i++) {
        let key = localStorage.key(i);
        if(key.startsWith('mednutri_pat_')) {
            patients.push(JSON.parse(localStorage.getItem(key)));
        }
    }
    
    if(patients.length === 0) {
        list.innerHTML = '<p style="color:#64748b; text-align:center;">Nessun paziente in archivio.</p>';
    } else {
        patients.forEach(p => {
            let div = document.createElement('div');
            div.style.cssText = 'padding:15px; border:1px solid #e2e8f0; border-radius:8px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition:background 0.2s;';
            div.onmouseover = () => div.style.background = '#f8fafc';
            div.onmouseout = () => div.style.background = 'white';
            div.onclick = () => loadPatient(p.name);
            
            div.innerHTML = `
                <div>
                    <div style="font-weight:600; color:#1e293b;">${p.name}</div>
                    <div style="font-size:0.85rem; color:#64748b;">Ultimo agg: ${p.lastSaved}</div>
                </div>
                <button style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:1.2rem;" onclick="event.stopPropagation(); deletePatient('${p.name}')">🗑️</button>
            `;
            list.appendChild(div);
        });
    }
    
    document.getElementById('archive-modal').style.display = 'flex';
}

function loadPatient(name) {
    let key = 'mednutri_pat_' + name.toLowerCase();
    let data = JSON.parse(localStorage.getItem(key));
    if(data) {
        document.getElementById('patient-name').value = data.name;
        document.getElementById('patient-gender').value = data.gender;
        document.getElementById('patient-dob').value = data.dob;
        document.getElementById('patient-height').value = data.height;
        document.getElementById('patient-weight').value = data.weight;
        document.getElementById('patient-wrist').value = data.wrist || '';
        document.getElementById('patient-lifestyle').value = data.lifestyle || '1.2';
        document.getElementById('period-start').value = data.start;
        document.getElementById('period-end').value = data.end;
        
        if (data.goal && document.getElementById('patient-goal')) {
            document.getElementById('patient-goal').value = data.goal;
            applyGoalChange();
        }
        if (data.notes && document.getElementById('patient-notes')) {
            document.getElementById('patient-notes').value = data.notes;
        }
        
        document.getElementById('patient-pathology').value = data.mainPathology;
        
        // Ricalcola tutto
        calculateAge();
        
        // Reset checkbox prima di ricaricare
        document.querySelectorAll('#comorbidities-container input').forEach(cb => cb.checked = false);
        
        if(data.comorbidities) {
            data.comorbidities.forEach(c => {
                let cb = document.querySelector(`#comorbidities-container input[value="${c}"]`);
                if(cb) cb.checked = true;
            });
        }
        
        // Se presente la griglia pasti salvata (con eventuali modifiche a mano), ripristinala!
        if (data.dietGrid && Array.isArray(data.dietGrid)) {
            let trs = document.querySelectorAll('#diet-body tr');
            data.dietGrid.forEach((rowMeals, rIdx) => {
                if (trs[rIdx]) {
                    let tds = trs[rIdx].querySelectorAll('td');
                    if (tds.length >= 5 && Array.isArray(rowMeals)) {
                        tds[1].innerText = rowMeals[0] || '-';
                        tds[2].innerText = rowMeals[1] || '-';
                        tds[3].innerText = rowMeals[2] || '-';
                        tds[4].innerText = rowMeals[3] || '-';
                        for (let i = 1; i <= 4; i++) {
                            tds[i].setAttribute('contenteditable', 'true');
                            tds[i].setAttribute('title', 'Clicca per modificare il piatto a mano');
                        }
                    }
                }
            });
        }

        updateAnalysis();
        document.getElementById('archive-modal').style.display = 'none';
        showToast(`Scheda di ${data.name} caricata con successo!`, "success");
    }
}

function deletePatient(name) {
    let modal = document.getElementById('custom-confirm');
    document.getElementById('custom-confirm-message').innerHTML = `Vuoi eliminare definitivamente <strong>${name}</strong> dall'archivio?<br><span style="font-size:0.8rem; color:#94a3b8; display:block; margin-top:5px;">Questa azione è irreversibile.</span>`;
    
    modal.style.display = 'flex';
    
    document.getElementById('custom-confirm-cancel').onclick = function() {
        modal.style.display = 'none';
    };
    
    document.getElementById('custom-confirm-ok').onclick = function() {
        localStorage.removeItem('mednutri_pat_' + name.toLowerCase());
        openArchive(); // Ricarica la lista
        showToast(`Paziente eliminato con successo.`, "success");
        modal.style.display = 'none';
    };
}


// FUNZIONI PROFILO MEDICO
function checkDoctorProfile() {
    let saved = localStorage.getItem('mednutri_doc_profile');
    let setupModal = document.getElementById('doctor-setup-modal');
    let mainApp = document.getElementById('main-app');
    let cancelBtn = document.getElementById('setup-cancel-btn');
    
    if (saved) {
        let doc = {};
        try { doc = JSON.parse(saved); } catch(e) {}
        let avatarEl = document.querySelector('.doc-avatar');
        let nameEl = document.getElementById('ui-doc-name');
        let specEl = document.getElementById('ui-doc-spec');
        let clinicEl = document.getElementById('ui-doc-clinic');
        
        if(avatarEl) avatarEl.innerText = doc.avatar || '👨‍⚕️';
        if(nameEl) nameEl.innerText = doc.name || 'Dott. Ciro Milella';
        if(specEl) specEl.innerText = doc.spec || 'Medico Chirurgo Nutrizionista';
        if(clinicEl) clinicEl.innerText = doc.clinic || 'Ambulatorio Medico';
        
        if(cancelBtn) cancelBtn.style.display = 'block';
        
        // Se l'ambulatorio non è ancora stato sbloccato col PIN, mostra SEMPRE la schermata di blocco
        if (typeof isAppUnlocked !== 'undefined' && !isAppUnlocked) {
            if(setupModal) setupModal.style.display = 'none';
            if (typeof showLockscreen === 'function') {
                showLockscreen();
            } else {
                if(mainApp) mainApp.style.display = 'none';
            }
        } else {
            if(setupModal) setupModal.style.display = 'none';
            if(mainApp) mainApp.style.display = 'flex';
        }
    } else {
        // Se non esiste ancora il profilo e non è sbloccato, mostra la schermata PIN di default (1234)
        if (typeof isAppUnlocked !== 'undefined' && !isAppUnlocked) {
            if (typeof showLockscreen === 'function') showLockscreen();
        } else {
            if(setupModal) setupModal.style.display = 'flex';
            if(mainApp) mainApp.style.display = 'none';
            if(cancelBtn) cancelBtn.style.display = 'none';
        }
    }
}

function saveDoctorProfile() {
    let avatar = document.getElementById('setup-doc-avatar').value;
    let name = document.getElementById('setup-doc-name').value.trim();
    let spec = document.getElementById('setup-doc-spec').value.trim();
    let clinic = document.getElementById('setup-doc-clinic').value.trim();
    let studioNameInput = document.getElementById('setup-doc-studioname');
    let studioName = studioNameInput ? studioNameInput.value.trim() : '';
    let pinInput = document.getElementById('setup-doc-pin');
    let pin = pinInput ? pinInput.value.trim() : '';
    
    if(!name || !spec) {
        if (typeof showToast !== 'undefined') showToast('Inserisci almeno Titolo, Nome e Specializzazione.', 'error');
        else alert('Inserisci almeno Titolo, Nome e Specializzazione.');
        return;
    }
    
    let doc = { avatar, name, spec, clinic, studioName };
    localStorage.setItem('mednutri_doc_profile', JSON.stringify(doc));
    
    // Sincronizza profilo anche sul server per smartphone e tablet
    try {
        fetch('/api/mednutri/save-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mednutri_doc_profile: JSON.stringify(doc) })
        }).catch(() => {});
    } catch(e) {}
    
    // Aggiorna il Codice Studio Cloud se specificato
    if (studioName) {
        let cleanId = studioName.toUpperCase().replace(/\s+/g, '-').replace(/[^A-Z0-9\-_]/g, '');
        if (!cleanId.startsWith('STUDIO-')) cleanId = 'STUDIO-' + cleanId;
        let conf = (typeof getCloudConfig === 'function') ? getCloudConfig() : { autoSyncEnabled: true };
        conf.studioId = cleanId;
        if (typeof saveCloudConfig === 'function') {
            saveCloudConfig(conf);
        } else {
            localStorage.setItem('mednutri_cloud_config', JSON.stringify(conf));
        }
    }
    
    // Se l'utente ha inserito un nuovo PIN (minimo 4 caratteri), lo salviamo
    if (pin && pin.length >= 4 && typeof setSecurityPin === 'function') {
        setSecurityPin(pin).then(() => {
            if (typeof showToast !== 'undefined') showToast('Profilo e nuovo PIN salvati con successo!', 'success');
            setTimeout(() => { window.location.reload(); }, 500);
        });
    } else {
        // Se non ha digitato un nuovo PIN ma non esisteva ancora un PIN, assicuriamo il default 1234
        if (typeof getStoredPinHash === 'function' && !getStoredPinHash() && typeof setSecurityPin === 'function') {
            setSecurityPin('1234');
        }
        let setupModal = document.getElementById('doctor-setup-modal');
        let mainApp = document.getElementById('main-app');
        if(setupModal) setupModal.style.display = 'none';
        if (typeof isAppUnlocked !== 'undefined' && isAppUnlocked) {
            if(mainApp) mainApp.style.display = 'flex';
        } else {
            if (typeof showLockscreen === 'function') showLockscreen();
        }
        checkDoctorProfile();
        if (typeof showToast !== 'undefined') showToast('Profilo salvato con successo! Ambulatorio protetto con PIN.', 'success');
    }
}

function resetDoctorProfile() {
    let saved = localStorage.getItem('mednutri_doc_profile');
    let conf = (typeof getCloudConfig === 'function') ? getCloudConfig() : {};
    if(saved) {
        let doc = JSON.parse(saved);
        document.getElementById('setup-doc-avatar').value = doc.avatar || '👩‍⚕️';
        document.getElementById('setup-doc-name').value = doc.name || '';
        document.getElementById('setup-doc-spec').value = doc.spec || '';
        document.getElementById('setup-doc-clinic').value = doc.clinic || '';
        let stEl = document.getElementById('setup-doc-studioname');
        if (stEl) stEl.value = doc.studioName || conf.studioId || '';
    } else {
        let stEl = document.getElementById('setup-doc-studioname');
        if (stEl) stEl.value = conf.studioId || '';
    }
    
    let cancelBtn = document.getElementById('setup-cancel-btn');
    if (cancelBtn) {
        cancelBtn.style.display = saved ? 'block' : 'none';
    }
    
    let setupModal = document.getElementById('doctor-setup-modal');
    if(setupModal) setupModal.style.display = 'flex';
}

function closeDoctorSetup() {
    let setupModal = document.getElementById('doctor-setup-modal');
    if(setupModal) setupModal.style.display = 'none';
    let mainApp = document.getElementById('main-app');
    if (typeof isAppUnlocked !== 'undefined' && isAppUnlocked) {
        if(mainApp) mainApp.style.display = 'flex';
    } else {
        if (typeof showLockscreen === 'function') showLockscreen();
    }
}


function showDatabase(ev) {
    if (ev && ev.preventDefault) ev.preventDefault();
    try {
    let modal = document.getElementById('database-modal');
    let list = document.getElementById('database-list');
    if (!modal || !list) { alert('Errore: finestra Database non trovata nella pagina.'); return false; }
    // Sposta il modal direttamente nel body per evitare che contenitori nascosti lo blocchino
    if (modal.parentElement !== document.body) document.body.appendChild(modal);
    list.innerHTML = '';
    
    for (const key in pathologyDB) {
        if (key === 'altro') continue;
        const pat = pathologyDB[key];
        
        let avoidHtml = pat.avoid && pat.avoid.length ? pat.avoid.map(i => `<li>❌ ${i}`).join('</li>') + '</li>' : '';
        let promoteHtml = pat.promote && pat.promote.length ? pat.promote.map(i => `<li>✅ ${i}`).join('</li>') + '</li>' : '';
        
        let div = document.createElement('div');
        div.style.cssText = 'padding:15px; border:1px solid #e2e8f0; border-radius:8px; background:#f8fafc;';
        div.innerHTML = `
            <h3 style="color:#0f172a; font-size:1.1rem; margin-bottom:5px;">${pat.name || key}</h3>
            <p style="color:#64748b; font-size:0.9rem; margin-bottom:10px;">${pat.desc || ''}</p>
            ${pat.goldenRule ? `<p style="font-size:0.9rem; margin-bottom:10px; background:#e0f2fe; padding:8px; border-radius:6px; color:#0284c7;"><strong>⭐ Golden Rule:</strong> ${pat.goldenRule}</p>` : ''}
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
                <div>
                    <strong style="font-size:0.85rem; color:#ef4444;">Da Evitare:</strong>
                    <ul style="list-style:none; padding:0; margin-top:5px; font-size:0.8rem; display:flex; flex-direction:column; gap:3px;">${avoidHtml}</ul>
                </div>
                <div>
                    <strong style="font-size:0.85rem; color:#10b981;">Da Promuovere:</strong>
                    <ul style="list-style:none; padding:0; margin-top:5px; font-size:0.8rem; display:flex; flex-direction:column; gap:3px;">${promoteHtml}</ul>
                </div>
            </div>
        `;
        list.appendChild(div);
    }
    
    modal.style.zIndex = '100000';
    modal.style.display = 'flex';
    } catch (err) {
        console.error(err);
        alert('Errore apertura Database Patologie: ' + err.message);
    }
    return false;
}

// Chiudi il Database cliccando fuori dalla finestra o premendo ESC
document.addEventListener('click', (e) => {
    const m = document.getElementById('database-modal');
    if (m && e.target === m) m.style.display = 'none';
});
document.addEventListener('keydown', (e) => {
    const m = document.getElementById('database-modal');
    if (e.key === 'Escape' && m) m.style.display = 'none';
});
