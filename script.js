/* --- CONFIGURATION --- */
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');
const terminalOutput = document.getElementById('terminal-output');
const cmdInput = document.getElementById('cmd-input');
const screenOverlay = document.getElementById('screen-overlay');
const headerTitle = document.getElementById('header-title');
const clockEl = document.getElementById('system-clock');

// State
let activeInterval = null; 
let isLocked = false;
let currentDataSource = []; 
let startTime = Date.now(); // For uptime command

// Rain Config
let columns = 0;
let drops = [];
let config = { 
    fontSize: 14, 
    dimmed: false,
    rainColor: '#00ff41',
    dimmedColor: '#003300' 
};

/* --- 1. REALISM DATABASE --- */
const locationDB = {
    countries: {
        'usa': { firewall: 'NSA_PRISM_V4', defense: 'MAXIMUM', pop: '331.9M', status: 'ACTIVE' },
        'india': { firewall: 'CYBER_SURAKSHA', defense: 'HIGH', pop: '1.4B', status: 'GROWING' },
        'china': { firewall: 'GREAT_FIREWALL', defense: 'IRONCLAD', pop: '1.41B', status: 'RESTRICTED' },
        'russia': { firewall: 'RUNET_ISOLATION', defense: 'AGGRESSIVE', pop: '144M', status: 'VOLATILE' },
        'japan': { firewall: 'TYPE-99_ICE', defense: 'MODERATE', pop: '125M', status: 'STABLE' },
        'uk': { firewall: 'GCHQ_NET', defense: 'HIGH', pop: '67M', status: 'MONITORED' },
        'germany': { firewall: 'BND_SHIELD', defense: 'HIGH', pop: '83M', status: 'STABLE' },
        'brazil': { firewall: 'LGPD_GUARD', defense: 'MODERATE', pop: '214M', status: 'UNSTABLE' }
    },
    cities: {
        'tokyo': { cams: 'EXTREME', neon: '99%', traffic: 'GRIDLOCK', drones: 'HIGH' },
        'new york': { cams: 'HIGH', neon: '85%', traffic: 'HEAVY', drones: 'MED' },
        'london': { cams: 'MAXIMUM (CCTV)', neon: '60%', traffic: 'CONGESTED', drones: 'HIGH' },
        'mumbai': { cams: 'MODERATE', neon: '50%', traffic: 'CRITICAL', drones: 'LOW' },
        'moscow': { cams: 'HIGH', neon: '40%', traffic: 'HEAVY', drones: 'MED' },
        'beijing': { cams: 'TOTAL', neon: '70%', traffic: 'RESTRICTED', drones: 'MAX' },
        'berlin': { cams: 'LOW', neon: '55%', traffic: 'MODERATE', drones: 'LOW' },
        'paris': { cams: 'MED', neon: '65%', traffic: 'HEAVY', drones: 'MED' },
        'dubai': { cams: 'HIGH', neon: '90%', traffic: 'FLUID', drones: 'HIGH' },
        'singapore': { cams: 'EXTREME', neon: '80%', traffic: 'AUTONOMOUS', drones: 'MAX' }
    }
};

/* --- DATA BANKS --- */
const physicsData = ["H(t)|ψ(t)⟩ = iħ ∂/∂t |ψ(t)⟩", "CRITICAL MASS: APPROACHING", "Dark Matter Density: 26.8%", "String Theory Dimensions: 11", "Quantum Entanglement: STABLE"];
const chemData = ["Synthesizing C8H10N4O2...", "Exothermic Reaction ΔH < 0", "Valence Shell: FULL", "Isotope Separation: U-235", "pH Level: 1.5 (ACIDIC)"];
const bioData = ["DNA Sequence: AGCT-TAGC-GCTA", "Subject Pulse: 180 BPM", "Adrenaline Levels: CRITICAL", "CRISPR Editing: IN PROGRESS", "Viral Load: 98% DETECTED"];
const astroData = ["Target: ALPHA CENTAURI", "Distance: 4.37 Light Years", "Black Hole Telemetry: EVENT HORIZON", "Solar Flare Imminent: CLASS X"];
const geoData = ["Tracking Sat: US-GOV-44", "Coords: [34.0522° N, 118.2437° W]", "Intercepting Radio Freq: 446.000 MHz", "Global Grid: SECTOR 7G"];
const historyData = ["FILE: ROSWELL_1947 [REDACTED]", "MK-ULTRA SUBPROJECT 68", "Voynich Manuscript: DECRYPTING..."];
const cppData = ["void* ptr = malloc(1024);", "std::cout << 'KERNEL PANIC';", "Segmentation Fault (Core Dumped)", "while(true) { fork(); }"];
const webData = ["<div class='inject-malware'></div>", "document.cookie = 'SESSION_HIJACK';", "fetch('https://darkweb.onion/api')", "SQL Injection: ' OR 1=1 --"];

/* --- 2. RAIN ENGINE --- */
function initRain() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    // Mobile check
    if (canvas.width < 600) config.fontSize = 10;
    else config.fontSize = 14;
    
    columns = Math.floor(canvas.width / config.fontSize);
    drops = [];
    for(let x = 0; x < columns; x++) drops[x] = 1;
}

function drawRain() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = config.dimmed ? config.dimmedColor : config.rainColor;
    ctx.font = config.fontSize + 'px monospace';

    for(let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96); 
        ctx.fillText(text, i * config.fontSize, drops[i] * config.fontSize);
        if(drops[i] * config.fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
    requestAnimationFrame(drawRain);
}

/* --- 3. HUD CONTROLS --- */
function hudPurge() {
    screenOverlay.innerHTML = '';
    const flash = document.createElement('div');
    flash.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:#fff;opacity:0.8;transition:0.5s;";
    screenOverlay.appendChild(flash);
    setTimeout(() => flash.style.opacity = '0', 50); setTimeout(() => flash.remove(), 500);
    print("SYSTEM PURGE INITIATED.", "error");
}
function hudBoost() {
    if(activeInterval) {
        clearInterval(activeInterval); print("OVERCLOCKING DATA STREAM...", "warning");
        startActiveDataStream(20); 
        setTimeout(() => { if(activeInterval) clearInterval(activeInterval); startActiveDataStream(100); print("SPEED NORMALIZED.", "sys-msg"); }, 3000);
    }
}
function hudLock() {
    isLocked = !isLocked;
    const btn = document.querySelectorAll('.hud-btn')[2];
    if(isLocked) { if(activeInterval) clearInterval(activeInterval); btn.style.background = '#ff003c'; btn.innerText = "[UNLOCK]"; print("FEED FROZEN.", "warning"); }
    else { btn.style.background = ''; btn.innerText = "[LOCK]"; startActiveDataStream(100); print("FEED RESUMED.", "sys-msg"); }
}
function hudScan() {
    screenOverlay.innerHTML = "<div class='scan-line'></div>";
    print("INITIATING SECTOR SCAN...", "sys-msg");
    setTimeout(() => { print("SCAN COMPLETE. 0 THREATS FOUND.", "highlight"); screenOverlay.innerHTML = ""; }, 3000);
}
function hudDecrypt() {
    screenOverlay.innerHTML = "";
    headerTitle.innerText = "BRUTE_FORCE_ATTACK";
    const box = document.createElement('div'); box.className = 'data-stream-box'; screenOverlay.appendChild(box);
    let attempts = 0;
    const crack = setInterval(() => {
        attempts++;
        const line = document.createElement('div');
        line.innerHTML = `TRY: ${Math.random().toString(36).substring(2,10).toUpperCase()}... <span style="color:#f00">FAIL</span>`;
        box.appendChild(line); box.scrollTop = box.scrollHeight;
        if(attempts > 20) {
            clearInterval(crack);
            line.innerHTML = `KEY FOUND: ${Math.random().toString(36).substring(2,12).toUpperCase()} <span style="color:#0f0">MATCH</span>`;
            print("DECRYPTION SUCCESSFUL.", "highlight");
        }
    }, 100);
}

/* --- 4. COMMAND LOGIC --- */
function switchMode(mode) {
    if(activeInterval) clearInterval(activeInterval);
    screenOverlay.innerHTML = ''; config.dimmed = true; isLocked = false;
    const btn = document.querySelectorAll('.hud-btn')[2]; if(btn) { btn.style.background = ''; btn.innerText = "[LOCK]"; }
    
    const modes = {
        'NET': () => { config.dimmed = false; headerTitle.innerText = "SYSTEM_IDLE"; },
        'CRYPTO': startCryptoStream,
        'PHYSICS': () => startDataStream(physicsData, "QUANTUM_PHYSICS"),
        'CHEM': () => startDataStream(chemData, "CHEM_LAB_SYNTHESIS"),
        'BIO': () => startDataStream(bioData, "BIO_HAZARD_SCAN"),
        'ASTRO': () => startDataStream(astroData, "DEEP_SPACE_TELEM"),
        'GEO': () => startDataStream(geoData, "GLOBAL_SURVEILLANCE"),
        'HISTORY': () => startDataStream(historyData, "CLASSIFIED_ARCHIVES"),
        'CPP': () => startDataStream(cppData, "MEMORY_DUMP_C++"),
        'WEB': () => startDataStream(webData, "WEB_INJECTION_LOG")
    };
    if (modes[mode]) modes[mode](); else switchMode('NET');
}

function startActiveDataStream(speed) {
    if(activeInterval) clearInterval(activeInterval);
    const addLine = () => {
        const item = currentDataSource[Math.floor(Math.random() * currentDataSource.length)];
        const memAddr = "0x" + Math.floor(Math.random()*65535).toString(16).toUpperCase().padStart(4, '0');
        const line = document.createElement('div');
        line.innerHTML = `<span style="color:#555">[${memAddr}]</span> ${item}`;
        const box = screenOverlay.querySelector('.data-stream-box');
        if(box) { box.appendChild(line); box.scrollTop = box.scrollHeight; if(box.childElementCount > 40) box.removeChild(box.firstChild); }
    };
    activeInterval = setInterval(addLine, speed);
}

function startDataStream(dataSource, title) {
    headerTitle.innerText = title; currentDataSource = dataSource;
    const box = document.createElement('div'); box.className = 'data-stream-box'; screenOverlay.appendChild(box);
    startActiveDataStream(100);
}

function startCryptoStream() {
    headerTitle.innerText = "DECENTRALIZED_EXCHANGE";
    let coins = [ { sym: "BTC", price: 94230 }, { sym: "ETH", price: 3450 }, { sym: "SOL", price: 145 }, { sym: "XMR", price: 178 } ];
    const render = () => {
        let html = '<div class="crypto-grid">';
        coins.forEach(c => {
            let change = (Math.random() - 0.5) * (c.price * 0.01); c.price += change;
            let color = change >= 0 ? 'up' : 'down'; let sign = change >= 0 ? '+' : '';
            html += `<div class="coin-card"><span class="highlight">${c.sym}</span><span>$${c.price.toFixed(2)}</span><span class="${color}">${sign}${(Math.random()).toFixed(2)}%</span></div>`;
        });
        html += '</div>'; screenOverlay.innerHTML = html;
    };
    render(); activeInterval = setInterval(render, 1000);
}

function displayLocationStats(name, type) {
    const key = name.toLowerCase();
    let data = null;
    if (type === 'COUNTRY' && locationDB.countries[key]) data = locationDB.countries[key];
    if (type === 'CITY' && locationDB.cities[key]) data = locationDB.cities[key];

    if (!data) {
        print(`ERR: '${name.toUpperCase()}' NOT FOUND.`, "error");
        return;
    }

    config.dimmed = true;
    headerTitle.innerText = `${type}_SURVEILLANCE: ${name.toUpperCase()}`;
    screenOverlay.innerHTML = '';
    const box = document.createElement('div'); box.className = 'data-stream-box'; screenOverlay.appendChild(box);
    
    const stats = type === 'COUNTRY' ? [
        `TARGET: ${name.toUpperCase()}`,
        `FIREWALL: ${data.firewall}`,
        `DEFENSE: <span class="highlight">${data.defense}</span>`,
        `POPULATION: ${data.pop}`,
        `STATUS: ${data.status}`
    ] : [
        `TARGET: ${name.toUpperCase()}`,
        `CAMS: ${data.cams}`,
        `NEON: ${data.neon}`,
        `TRAFFIC: ${data.traffic}`,
        `DRONES: ${data.drones}`,
        `GRID: ONLINE`
    ];

    let i = 0;
    const interval = setInterval(() => {
        if(i < stats.length) {
            const line = document.createElement('div');
            line.innerHTML = `<span class="highlight">></span> ${stats[i]}`;
            box.appendChild(line);
            i++;
        } else { clearInterval(interval); startActiveDataStream(300); }
    }, 400);
    print(`ACCESSING MAINFRAME FOR ${name.toUpperCase()}...`, "sys-msg");
}

/* --- 5. TERMINAL & BOOT --- */
function print(text, type = "") {
    const div = document.createElement('div'); div.classList.add('line');
    if(type) div.classList.add(type); div.innerHTML = text;
    terminalOutput.appendChild(div); terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
function processCommand(raw) {
    const args = raw.trim().split(' '); const cmd = args[0].toLowerCase();
    const arg1 = args.slice(1).join(" "); 
    
    print(`<span class="prompt">admin@node_01:~#</span> ${raw}`);
    
    const commands = {
        'help': () => {
            print("--- CORE COMMANDS ---", "highlight");
            print("<span class='cmd-list'>sys</span>     : System Info");
            print("<span class='cmd-list'>whoami</span>  : User Identity");
            print("<span class='cmd-list'>uptime</span>  : Session Duration");
            print("<span class='cmd-list'>clear</span>   : Clear Screen");
            print("--- SURVEILLANCE ---", "highlight");
            print("<span class='cmd-list'>country</span> : [name] stats");
            print("<span class='cmd-list'>city</span>    : [name] stats");
            print("<span class='cmd-list'>geo</span>     : Satellite Track");
            print("--- MODULES ---", "highlight");
            print("chem, bio, phys, astro, hist, cryp");
            print("cpp, web, net");
        },
        'clear': () => terminalOutput.innerHTML = '',
        'whoami': () => print("USER: ROOT_ADMIN | ACCESS: LEVEL 5", "highlight"),
        'sys': () => print("CPU: QUANTUM_CORE | RAM: 256TB | OS: CYBERDECK_V16.2", "sys-msg"),
        'uptime': () => {
            const up = Math.floor((Date.now() - startTime) / 1000);
            print(`SESSION ACTIVE: ${Math.floor(up/60)}m ${up%60}s`, "sys-msg");
        },
        'net': () => { switchMode('NET'); print("RESTORING ROOT TOPOLOGY...", "sys-msg"); },
        'chem': () => { switchMode('CHEM'); print("INITIATING SYNTHESIS...", "sys-msg"); },
        'bio': () => { switchMode('BIO'); print("SEQUENCING DNA...", "sys-msg"); },
        'phys': () => { switchMode('PHYSICS'); print("QUANTUM SIMULATION...", "sys-msg"); },
        'astro': () => { switchMode('ASTRO'); print("CONNECTING HUBBLE...", "sys-msg"); },
        'geo': () => { switchMode('GEO'); print("SATELLITE TRACKING...", "sys-msg"); },
        'hist': () => { switchMode('HISTORY'); print("DECRYPTING...", "warning"); },
        'cryp': () => { switchMode('CRYPTO'); print("MARKET DATA...", "sys-msg"); },
        'cpp': () => { switchMode('CPP'); print("DUMPING MEMORY...", "sys-msg"); },
        'web': () => { switchMode('WEB'); print("INJECTING PAYLOAD...", "sys-msg"); },
        'country': () => arg1 ? displayLocationStats(arg1, 'COUNTRY') : print("USAGE: country [name]", "error"),
        'city': () => arg1 ? displayLocationStats(arg1, 'CITY') : print("USAGE: city [name]", "error")
    };
    if (commands[cmd]) commands[cmd](); else if (cmd !== '') print(`ERR_CMD_UNKNOWN: ${cmd}`, "error");
}
cmdInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { processCommand(cmdInput.value); cmdInput.value = ''; } });

async function bootSystem() {
    cmdInput.disabled = true; cmdInput.placeholder = "SYSTEM BOOTING...";
    const logs = ["BIOS DATE 01/20/2077", "MEMORY TEST: 64TB OK", "LOADING KERNEL...", "ACCESS GRANTED."];
    for (let log of logs) { print(log, "sys-msg"); await new Promise(r => setTimeout(r, 200)); }
    print("<br>"); 
    print("--------------------------------", "sys-msg"); 
    print(" SYSTEM READY", "highlight"); 
    print("--------------------------------", "sys-msg");
    print(" > Type <span class='highlight'>'help'</span> for modules.");
    print("--------------------------------", "sys-msg"); 
    print("<br>");
    cmdInput.disabled = false; cmdInput.placeholder = "Awaiting Command..."; cmdInput.focus();
}

window.addEventListener('resize', initRain);
initRain(); 
drawRain(); 
setInterval(() => { clockEl.innerText = new Date().toISOString().split('T')[1].split('.')[0]; }, 1000); 
bootSystem();