const codeEditor = document.getElementById('codeEditor');
const livePreview = document.getElementById('livePreview');
const toggleRoentgen = document.getElementById('toggleRoentgen');

// Spillets tilstand
let nuvaerendeLevel = 1;

let gennemfoerteLevels = {
    1: false,
    2: false,
    3: false,
    4: false
};

// Standard-koderne med indbygget browser-beskyttelse via contenteditable='false'
const standardKoder = {
    1: "<span class='laast' contenteditable='false'>&lt;!DOCTYPE html&gt;\n&lt;html lang=\"da\"&gt;\n&lt;head&gt;\n  &lt;meta charset=\"UTF-8\"&gt;\n  &lt;title&gt;Køge Kaffeblog&lt;/title&gt;\n&lt;/head&gt;\n&lt;body&gt;\n  </span><span class='aktivt-felt'></span><span class='laast' contenteditable='false'>\n  &lt;main&gt;\n    &lt;section&gt;\n      &lt;h2&gt;Nye bønner i byen&lt;/h2&gt;\n    &lt;/section&gt;\n  &lt;/main&gt;\n\n  &lt;footer&gt;\n    &lt;p&gt;© 2026&lt;/p&gt;\n  &lt;/footer&gt;\n&lt;/body&gt;\n&lt;/html&gt;</span>",

    2: "<span class='laast' contenteditable='false'>&lt;!DOCTYPE html&gt;\n&lt;html lang=\"da\"&gt;\n&lt;head&gt;\n  &lt;title&gt;Køge Kaffeblog&lt;/title&gt;\n&lt;/head&gt;\n&lt;body&gt;\n\n  &lt;header&gt;\n    &lt;h1&gt;Køge Kaffeblog&lt;/h1&gt;\n    </span><span class='aktivt-felt'></span><span class='laast' contenteditable='false'>\n  &lt;/header&gt;\n\n  &lt;main&gt;\n    &lt;section&gt;\n      &lt;h2&gt;Nye bønner i byen&lt;/h2&gt;\n    &lt;/section&gt;\n  &lt;/main&gt;\n\n  &lt;footer&gt;\n    &lt;p&gt;© 2026&lt;/p&gt;\n  &lt;/footer&gt;\n&lt;/body&gt;\n&lt;/html&gt;</span>",

    3: "<span class='laast' contenteditable='false'>&lt;!DOCTYPE html&gt;\n&lt;html lang=\"da\"&gt;\n&lt;body&gt;\n\n  &lt;header&gt;\n    &lt;h1&gt;Køge Kaffeblog&lt;/h1&gt;\n    &lt;nav&gt;\n      &lt;a href='index.html'&gt;Forside&lt;/a&gt;\n      &lt;a href='blog.html'&gt;Blog&lt;/a&gt;\n      &lt;a href='#kontakt'&gt;Kontakt&lt;/a&gt;\n    &lt;/nav&gt;\n  &lt;/header&gt;\n\n  </span><span class='aktivt-felt'></span><span class='laast' contenteditable='false'>\n  &lt;section&gt;\n    &lt;h2&gt;Nye bønner i byen&lt;/h2&gt;\n  &lt;/section&gt;\n\n  &lt;main&gt;\n  \n  &lt;/main&gt;\n  &lt;footer&gt;\n    &lt;p&gt;© 2026&lt;/p&gt;\n  &lt;/footer&gt;\n&lt;/body&gt;\n&lt;/html&gt;</span>",

    4: "<span class='laast' contenteditable='false'>&lt;!DOCTYPE html&gt;\n&lt;html lang=\"da\"&gt;\n&lt;body&gt;\n\n  &lt;header&gt;\n    &lt;h1&gt;Køge Kaffeblog&lt;/h1&gt;\n    &lt;nav&gt;\n      &lt;a href='index.html'&gt;Forside&lt;/a&gt;\n      &lt;a href='blog.html'&gt;Blog&lt;/a&gt;\n      &lt;a href='#kontakt'&gt;Kontakt&lt;/a&gt;\n    &lt;/nav&gt;\n  &lt;/header&gt;\n\n  &lt;main&gt;\n    &lt;section&gt;\n      </span><span class='aktivt-felt'></span><span class='laast' contenteditable='false'>\n    &lt;/section&gt;\n  &lt;/main&gt;\n\n  &lt;footer&gt;\n    &lt;p&gt;© 2026&lt;/p&gt;\n  &lt;/footer&gt;\n&lt;/body&gt;\n&lt;/html&gt;</span>"
};

let brugerKoder = {
    1: standardKoder[1],
    2: standardKoder[2],
    3: standardKoder[3],
    4: standardKoder[4]
};

// Dynamisk generering af linjenumre baseret på reel editor-højde
function opdaterLinjeNumre() {
    const lineNumbersContainer = document.querySelector('.line-numbers');
    if (!lineNumbersContainer) return;

    const editorHeight = codeEditor.scrollHeight;
    const linjeHoejde = 22.5; // Baseret på CSS: 15px font-size * 1.5 line-height
    const antalLinjer = Math.max(1, Math.ceil(editorHeight / linjeHoejde));

    let numreHTML = "";
    for (let i = 1; i <= antalLinjer; i++) {
        numreHTML += `<span>${i}</span>`;
    }
    lineNumbersContainer.innerHTML = numreHTML;
}

function opdaterSandbox() {
    brugerKoder[nuvaerendeLevel] = codeEditor.innerHTML;
    let renHTML = codeEditor.innerText;
    livePreview.innerHTML = renHTML;

    opdaterLinjeNumre();
    tjekSpilProgression();
}

function tjekSpilProgression() {
    const missionBar = document.querySelector('.mission-bar');
    const h2 = missionBar.querySelector('h2');
    const p = missionBar.querySelector('p');
    let infoBoks = document.getElementById('studie-info');

    if (!infoBoks) {
        infoBoks = document.createElement('div');
        infoBoks.id = 'studie-info';
        infoBoks.className = 'info-popup-animation';
        const browserSide = document.querySelector('.browser-side');
        if (browserSide) browserSide.appendChild(infoBoks);
    }

    let levelKlaret = false;
    let vidensbankHTML = "";
    let raaTekst = codeEditor.innerText;

    if (gennemfoerteLevels[nuvaerendeLevel] === true) { levelKlaret = true; }

    // --- LEVEL 1 ---
    if (nuvaerendeLevel === 1) {
        const header = livePreview.querySelector('header');
        const h1InsideHeader = livePreview.querySelector('header h1');
        const harLukkedeTags = raaTekst.includes('</header>') && raaTekst.includes('</h1>');

        if (header && h1InsideHeader && harLukkedeTags) { levelKlaret = true; }

        vidensbankHTML = `
            <h3>Aktuel Vidensbank: &lt;header&gt; og &lt;h1&gt; 🧠</h3>
            <p><strong>&lt;header&gt;:</strong> Sidens top-bjælke. Bruges til at introducere websitet.</p>
            <p><strong>&lt;h1&gt;:</strong> Den primære hovedoverskrift. Der må kun være én pr. side!</p>
        `;
        p.innerHTML = "<strong>Brief:</strong> Siden mangler en top-bjælke! Opret et komplet <code>&lt;header&gt;&lt;/header&gt;</code> tag i det fremhævede felt, og placer din hovedoverskrift <code>&lt;h1&gt;Køge Kaffeblog&lt;/h1&gt;</code> indeni.";
    }

    // --- LEVEL 2 ---
    if (nuvaerendeLevel === 2) {
        const navElement = livePreview.querySelector('nav');
        const harHref = raaTekst.includes('href=');
        const harLukkedeTags = raaTekst.includes('</nav>') && raaTekst.includes('</a>');
        const harTommeHrefs = raaTekst.includes('href="#"') || raaTekst.includes('href=""') || raaTekst.includes("href='#'") || raaTekst.includes("href=''");

        if (navElement && harHref && harLukkedeTags && !harTommeHrefs) {
            levelKlaret = true;
        }

        vidensbankHTML = `
            <h3>Aktuel Vidensbank: Anatomi af et Link (&lt;a&gt;) 🧠</h3>
            <p>Syntaksen kan være drilsk! Brug denne skabelon, når du bygger dine links:</p>
            <div style="background: #fff; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 14px; margin: 10px 0; color: #2d3748;">
                &lt;a <span style="color: #e53e3e; font-weight:bold;">href=</span><span style="color: #3182ce;">"index.html"</span>&gt;<span style="color: #2f855a; font-weight:bold;">Forside&lt;/a&gt;</span>
            </div>
            <ul style="margin-left: 15px; font-size: 12px; color: #4a5568; line-height: 1.4;">
                <li><strong style="color: #e53e3e;">href=</strong> HUSK lighedstegnet direkte efter href.</li>
                <li><strong style="color: #3182ce;">"..."</strong> Gåseøjnene SKAL være der. Skriv filnavnet indeni.</li>
                <li><strong style="color: #ff5f56;">&lt;/a&gt;</strong> Glem ikke at lukke tagget efter din link-tekst!</li>
            </ul>
        `;

        if (levelKlaret) {
        } else if (!navElement || !raaTekst.includes('</nav>')) {
            p.innerHTML = "<strong>Brief:</strong> Start med at oprette dit menutag indeni din header: <code>&lt;nav&gt;&lt;/nav&gt;</code>.";
        } else if (!harHref || !raaTekst.includes('</a>')) {
            p.innerHTML = "<strong>Brief:</strong> Lav nu dine links indeni menuen! Følg skabelonen i Vidensbanken: <code>&lt;a href=\"index.html\"&gt;Forside&lt;/a&gt;</code>.";
        } else if (harTommeHrefs) {
            p.innerHTML = "<strong>Næsten i mål!</strong> Erstat de tomme links (<code>#</code>) med rigtige filnavne, fx <code>href=\"index.html\"</code>.";
        } else {
            p.innerHTML = "<strong>Brief:</strong> Opret en <code>&lt;nav&gt;</code> og indsæt menulinks med reelle navne (fx <code>href=\"index.html\"</code>) indeni.";
        }
    }

    // --- LEVEL 3 ---
    if (nuvaerendeLevel === 3) {
        let rensetTekst = raaTekst.replace(/\s+/g, '').toLowerCase();

        const sectionErIndeniMain = rensetTekst.includes('<main><section>');
        const harLukkedeTags = raaTekst.includes('</main>') && raaTekst.includes('</section>');
        const harForkertPlacering = rensetTekst.includes('</header><section>');

        if (sectionErIndeniMain && harLukkedeTags && !harForkertPlacering) {
            levelKlaret = true;
        }

        vidensbankHTML = `
            <h3>Aktuel Vidensbank: Semantisk Struktur 🧠</h3>
            <p><strong>&lt;main&gt;:</strong> Bruges til at fortælle søgemaskiner og browsere, hvor websidens hovedindhold bor.</p>
            <p><strong>&lt;section&gt;:</strong> Inddeler indholdet i logiske emner.</p>
        `;

        if (levelKlaret) {
        } else if (harForkertPlacering) {
            p.innerHTML = "<strong>Næsten!</strong> Du har stadig din <code>&lt;section&gt;</code> liggende og flyve oppe over dit <code>&lt;main&gt;</code> tag. Klip den ud, og flyt den herned.";
        } else if (!raaTekst.includes('<main>') || !raaTekst.includes('</main>')) {
            p.innerHTML = "<strong>Hov!</strong> Du er kommet til at slette eller ødelægge dit <code>&lt;main&gt;</code> tag. Sørg for, det står i bunden.";
        } else {
            p.innerHTML = "<strong>Brief:</strong> Artiklen flyder udenfor! Flyt hele dit <code>&lt;section&gt;...&lt;/section&gt;</code> tag ind på den tomme plads indeni <code>&lt;main&gt;&lt;/main&gt;</code>.";
        }
    }

    // --- LEVEL 4 ---
    if (nuvaerendeLevel === 4) {
        const images = livePreview.querySelectorAll('main section img');
        const harTreBilleder = images.length >= 3;
        let korrekteBilledNavne = true;

        images.forEach((img, index) => {
            const forventetSrc = `img/kaffe${index + 1}.jpg`;
            if (img.getAttribute('src') !== forventetSrc) {
                korrekteBilledNavne = false;
            }
        });

        if (harTreBilleder && korrekteBilledNavne) { levelKlaret = true; }

        vidensbankHTML = `
            <h3>Aktuel Vidensbank: Billed-stier & Flexbox 🧠</h3>
            <p><strong>Relative stier:</strong> Billeder i undermapper hentes via <code>src="img/filnavn.jpg"</code>.</p>
        `;
        p.innerHTML = "<strong>Brief:</strong> Find navnene i <strong>img-mappen</strong> til venstre. Indsæt 3 billedtags i det fremhævede felt via: <code>&lt;img src=\"img/navn.jpg\"&gt;</code>.";
    }

    // --- NAVIGATION OG VISNING ---
    if (levelKlaret) {
        gennemfoerteLevels[nuvaerendeLevel] = true;
        missionBar.style.backgroundColor = '#27c93f';
        h2.innerText = `✓ Level ${nuvaerendeLevel} Klaret!`;

        let tilbageKnap = nuvaerendeLevel > 1 ? `<button class="btn-tilbage" onclick="startLevel(${nuvaerendeLevel - 1})">← Gå tilbage</button>` : '';
        let naesteKnap = nuvaerendeLevel < 4 ? `<button class="btn-naeste" onclick="startLevel(${nuvaerendeLevel + 1})">Gå til Level ${nuvaerendeLevel + 1} →</button>` : '';

        infoBoks.innerHTML = `
            <div class="info-kort">
                ${vidensbankHTML}
                <div class="knap-container">
                    ${tilbageKnap}
                    ${naesteKnap}
                </div>
            </div>
        `;
    } else {
        if (nuvaerendeLevel === 1) missionBar.style.backgroundColor = '#2d3748';
        if (nuvaerendeLevel === 2) missionBar.style.backgroundColor = '#2b6cb0';
        if (nuvaerendeLevel === 3) missionBar.style.backgroundColor = '#c53030';
        if (nuvaerendeLevel === 4) missionBar.style.backgroundColor = '#d35400';

        h2.innerText = `Level ${nuvaerendeLevel}: I gang...`;

        let tilbageKnap = nuvaerendeLevel > 1 ? `<button class="btn-tilbage" onclick="startLevel(${nuvaerendeLevel - 1})">← Gå tilbage</button>` : '';

        infoBoks.innerHTML = `
            <div class="info-kort" style="border: 1px dashed #cbd5e0;">
                ${vidensbankHTML}
                <div class="knap-container">
                    ${tilbageKnap}
                </div>
            </div>
        `;
    }
}

window.startLevel = function(levelNummer) {
    nuvaerendeLevel = levelNummer;
    codeEditor.innerHTML = brugerKoder[levelNummer];

    let renHTML = codeEditor.innerText;
    livePreview.innerHTML = renHTML;

    opdaterLinjeNumre();
    tjekSpilProgression();
};

// 1. FORVANDL PASTE TIL REN TEKST UDEN LINJESKIFT (Løser layout-sammentrækning)
codeEditor.addEventListener('paste', function(e) {
    e.preventDefault();
    let text = (e.clipboardData || window.clipboardData).getData('text');
    text = text.replace(/[\r\n]+/g, ' ');
    document.execCommand('insertText', false, text);
});

// 2. AVANCERET INPUT-FORSVAR (Løser soft-locks og linjesletning)
codeEditor.addEventListener('keydown', function(e) {
    // Tving inputtet til kun at blive på én linje
    if (e.key === 'Enter') {
        e.preventDefault();
        return;
    }

    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    // Stop sletninger der forsøger at ødelægge DOM'en
    if (e.key === 'Backspace' || e.key === 'Delete') {
        let node = range.startContainer;
        let aktivtFelt = null;

        while (node && node !== codeEditor) {
            if (node.nodeType === 1 && node.classList.contains('aktivt-felt')) {
                aktivtFelt = node;
                break;
            }
            node = node.parentNode;
        }

        if (aktivtFelt) {
            const tekstLaengde = aktivtFelt.textContent.length;
            const markeretLaengde = selection.toString().length;

            // Hvis hele feltet slettes, så nulstil teksten uden at slette selve span-elementet
            if (markeretLaengde === tekstLaengde || tekstLaengde <= 1) {
                e.preventDefault();
                aktivtFelt.textContent = "";
                opdaterSandbox();
                return;
            }

            // Forhindr Backspace i at spise de skjulte rammer yderst til venstre
            if (e.key === 'Backspace' && range.collapsed && range.startOffset === 0) {
                e.preventDefault();
                return;
            }
        }
    }
});

window.visBilledHjælp = function(billedNavn) {
    const tooltip = document.getElementById('file-tooltip');
    if (tooltip) {
        tooltip.className = "file-tooltip-visible";
        tooltip.innerHTML = `<strong>Kopier sti:</strong><br><code>src="img/${billedNavn}"</code>`;
    }
};

if (toggleRoentgen) {
    toggleRoentgen.addEventListener('click', () => {
        livePreview.classList.toggle('roentgen');
    });
}

codeEditor.addEventListener('input', opdaterSandbox);

// Start spillet
window.startLevel(1);