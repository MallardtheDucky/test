const stage = document.getElementById('stage');
const S = { stage: 'start', tab: 0, sub: [0, 0, 0, 0, 0], sel: {}, msg: '', unlocked: [], len: 0, lock: '' };
const TABS = ['STAT', 'INV', 'DATA', 'MAP', 'RADIO'];
const SUBS = [['STATUS', 'SPECIAL', 'PERKS'], ['WEAPONS', 'APPAREL', 'AID', 'MISC', 'AMMO'], ['QUESTS', 'MAIL', 'FILES'], [], []];
const RESTRICTED_CODES = ['admin_key', 'caldwell'];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const skey = () => S.tab + '.' + S.sub[S.tab];
const sel = () => Math.min(S.sel[skey()] || 0, Math.max(S.len - 1, 0));

const LIMBS = [['HEAD', 100], ['TORSO', 100], ['L ARM', 92], ['R ARM', 100], ['L LEG', 85], ['R LEG', 100]];
const SPECIAL = [
    ['STRENGTH', 6, 'Carrying capacity and melee damage. Maintenance drills keep Vault 254 residents sturdy.'],
    ['PERCEPTION', 7, 'Awareness of sensor anomalies and surface threats. Helps decode the Ghost Signal.'],
    ['ENDURANCE', 5, 'Health and radiation resistance. Two centuries of recycled air.'],
    ['CHARISMA', 6, 'Standing with Loyalists, Reclamationists, Preservationists, Innovators and Educators.'],
    ['INTELLIGENCE', 8, 'Hacking, repair and science. Required for Council clearance.'],
    ['AGILITY', 5, 'Action Points and stealth in the maintenance tunnels.'],
    ['LUCK', 4, 'Critical hit chance. Most of the Vault used theirs up in 2077.']
];
const PERKS = [
    ['CORPORATE LADDER', 1, 'Terminals reveal one extra file entry.'],
    ['ALGAE EATER', 2, 'Algae Paste restores 50% more health and carries no radiation.'],
    ['THE HEARTBEAT', 1, 'You can feel the reactor through the floor. Repairs in Engineering cost less.'],
    ['LOYAL TO THE PLAN', 1, 'Standing with the Overseer improves by 10%.'],
    ['GREY DRIFT SURVIVOR', 1, '+25 resistance to disease and poison.']
];
const QUESTS = [
    ['RECLAMATION DAY', 'MAIN', 'Open the blast door under Protocol 77-RECLAIM.', [[1, 'Read the Overseer briefing'], [0, 'Obtain the Overseer authorization code'], [0, 'Confirm surface radiation is survivable'], [0, 'Initiate the 12-hour thaw cycle']]],
    ['THE HEARTBEAT', 'ENGINEERING', 'Natasha Volkova needs a GE-V7 turbine stabilizer or the reactor will fail.', [[1, 'Speak with Natasha Volkova'], [0, 'Scavenge the secondary backup generator'], [0, 'Install the stabilizer in the Reactor']]],
    ['GHOST SIGNAL', 'SENSORS', 'Patriotic music loops on the surface. Michaela Torres wants a drone launched.', [[1, 'Review Drone Recon Request #442'], [0, 'Triangulate the signal source'], [0, 'Convince the Council to authorize recon']]],
    ['POD 089', 'MEDICAL', 'Executive V.P. S. Calvin is stirring in cryo.', [[0, 'Inspect Pod 089 in Cryo Control'], [0, 'Decide: thaw or leave frozen']]],
    ['GREY DRIFT', 'MEDICAL', 'Generation 6 immune systems are failing. New DNA is needed within 50 years.', [[1, 'Read Dr. Morrison study'], [0, 'Collect a clinic sample set']]]
];
const INV = [
    [
        { n: '10MM PISTOL', q: 1, wt: 3.5, val: 50, ico: 'gun', st: [['DMG', 18], ['RNG', 120], ['AP', 20]], d: 'Standard Vault 254 security sidearm. 150 units in stock. Ballistic ammo conservation is mandatory.' },
        { n: 'R91 ASSAULT RIFLE', q: 1, wt: 8, val: 140, ico: 'gun', st: [['DMG', 24], ['RNG', 300], ['AP', 28]], d: 'Armory issue. 5.56mm stocks are depleting. No energy weapon capability exists in the Vault.' },
        { n: 'SECURITY BATON', q: 1, wt: 2, val: 25, ico: 'gun', st: [['DMG', 14], ['SPD', 'FAST']], d: 'Non-lethal crowd control for Chief Drake\'s Guards.' }
    ],
    [
        { n: 'VAULT 254 JUMPSUIT', q: 1, wt: 4, val: 30, ico: 'shield', st: [['DR', 2], ['ER', 0]], d: 'Blue and gold, A.R.C. insignia on the sleeve. Pre-War fabric, re-stitched many times.' },
        { n: 'SECURITY VEST', q: 1, wt: 8, val: 90, ico: 'shield', st: [['DR', 12], ['ER', 4]], d: 'Standard Guards torso protection.' },
        { n: 'T-45D POWER ARMOR', q: 1, wt: 0, val: 900, ico: 'helmet', st: [['DR', 34], ['ER', 34]], d: 'Stored in the Armory. 20 suits exist, only 10 operational and only 10 qualified operators.' }
    ],
    [
        { n: 'STIMPAK', q: 5, wt: 0.5, val: 50, ico: 'ammo', st: [['HP', '+60']], d: 'Clinic synthesis is stable. Four Auto-Docs on site, three operational.' },
        { n: 'RADAWAY', q: 3, wt: 0.5, val: 80, ico: 'ammo', st: [['RADS', '-80']], d: 'Clinic stocks are high.' },
        { n: 'ALGAE PASTE', q: 12, wt: 0.2, val: 2, ico: 'ammo', st: [['HP', '+10']], d: 'Cafeteria staple. Day 442 of the same menu. Coffee ran out in 2274.' },
        { n: 'PURIFIED WATER', q: 4, wt: 1, val: 20, ico: 'ammo', st: [['HP', '+10'], ['RADS', '-2']], d: 'Mountain aquifer water, filtered by the last Water Chip.' }
    ],
    [
        { n: 'HOLOTAPE: RECLAMATION DAY', q: 1, wt: 0, val: 0, ico: 'time', st: [], d: 'Protocol 77-RECLAIM. Unseal Blast Door, deploy Security Perimeter, initiate the Thaw Cycle. Authorization code required.' },
        { n: 'HOLOTAPE: G.O.A.T. PREP', q: 1, wt: 0, val: 0, ico: 'time', st: [], d: 'Mandatory Grade 3 module. Includes the Langston quote you memorized as a child.' },
        { n: 'HOLOTAPE: GHOST SIGNAL', q: 1, wt: 0, val: 0, ico: 'time', st: [], d: 'Sensor capture of patriotic music from the Capital Wasteland. Origin unknown.' },
        { n: 'GE-V7 TURBINE (BLUEPRINT)', q: 1, wt: 0, val: 0, ico: 'time', st: [], d: 'Volkova\'s wish list. The real part does not exist in the Vault.' }
    ],
    [
        { n: '10MM ROUND', q: 120, wt: 0.1, val: 1, ico: 'ammo', st: [], d: 'Vault stores: 75,240 rounds.' },
        { n: '5.56MM ROUND', q: 80, wt: 0.1, val: 1, ico: 'ammo', st: [], d: 'Vault stores: 3,420 rounds. LOW.' },
        { n: 'FUSION CORE', q: 2, wt: 2, val: 90, ico: 'ammo', st: [], d: 'Vault stores: 18. CRITICAL.' }
    ]
];
const FILES = Object.values(FILE_SYSTEM).filter(f => f.type === 'file');
const LOCKED = FILE_SYSTEM.restricted.children;
const BOOT = ['VAULT-TEC BIOS v6.21', 'COPYRIGHT 2077 ROBCO INDUSTRIES', 'PIP-BOY 3000 MK IV ... OK', '> DOSIMETER ... OK', '> VITAL SENSORS ... OK', '> RADIO RECEIVER ... OK', 'MOUNTING DRIVE: A.R.C. ARCHIVE ... DONE', 'LINKING VAULT 254 LOCAL NETWORK ... DONE', 'WELCOME, RESIDENT.', 'RECLAMATION DAY IS PENDING.'];

const item = (label, on, idx, right = '', cls = '') => `<div class="item ${on ? 'on' : ''} ${cls}" onclick="pick(${idx})"><span>${esc(label)}</span><span>${esc(right)}</span></div>`;
const split = (list, det) => `<div class="cols"><div class="list sc">${list}</div><div class="detail sc">${det}</div></div>`;

function vStatus() {
    const tags = ['top:2%;left:calc(100% + 14px)', 'top:30%;left:calc(100% + 14px)', 'top:26%;right:calc(100% + 14px)', 'top:52%;left:calc(100% + 14px)', 'top:78%;right:calc(100% + 14px)', 'top:78%;left:calc(100% + 14px)'];
    return `<div class="cols"><div class="detail sc" style="max-width:46%">
        <h3>RESIDENT 254-0412</h3>
        <div class="row"><span>LEVEL</span><span>12</span></div>
        <div class="row"><span>CLEARANCE</span><span>LEVEL 3</span></div>
        <div class="row"><span>FACTION</span><span>LOYALISTS</span></div>
        <div class="row"><span>DAYS SEALED</span><span>198 YRS</span></div>
        <div class="row"><span>RAD EXPOSURE</span><span>14 / 1000</span></div>
        <div class="dim" style="margin-top:8px">HIT POINTS</div><div class="meter"><i style="width:84%"></i></div>
        <div class="dim">ACTION POINTS</div><div class="meter"><i style="width:100%"></i></div>
        <div class="dim">EXPERIENCE TO LEVEL 13</div><div class="meter"><i style="width:62%"></i></div>
    </div><div class="vb"><div class="fig">
        <img class="hd mono" src="assets/vaultboy/heads/normal.svg" alt="">
        <img id="legs" class="lg mono" src="assets/vaultboy/legs/1.svg" alt="">
        ${LIMBS.map((l, i) => `<div class="tag" style="${tags[i]}">${l[0]} ${l[1]}%</div>`).join('')}
    </div></div></div>`;
}

function vSpecial() {
    const i = sel(); S.len = SPECIAL.length;
    const s = SPECIAL[i];
    return split(SPECIAL.map((p, k) => item(p[0], k === i, k, p[1])).join(''), `<h3>${s[0]} ${s[1]}</h3><div class="meter" style="height:18px"><i style="width:${s[1] * 10}%"></i></div><div class="desc">${s[2]}</div>`);
}

function vPerks() {
    const i = sel(); S.len = PERKS.length;
    const p = PERKS[i];
    return split(PERKS.map((x, k) => item(x[0], k === i, k, 'RANK ' + x[1])).join(''), `<h3>${p[0]}</h3><div class="desc">${p[2]}</div>`);
}

function vInv() {
    const items = INV[S.sub[1]];
    const i = sel(); S.len = items.length;
    const it = items[i];
    const stats = it.st.map(s => `<div class="row"><span>${s[0]}</span><span>${s[1]}</span></div>`).join('');
    const hdr = `<div class="row dim"><span>WG ${INV.flat().reduce((a, x) => a + x.wt * x.q, 0).toFixed(0)}/200</span><span>CAPS 340</span></div>`;
    return split(items.map((x, k) => item(x.n + (x.q > 1 ? ' (' + x.q + ')' : ''), k === i, k)).join(''), `${hdr}<img class="ico" src="assets/${it.ico}.svg" alt=""><h3>${it.n}</h3>${stats}<div class="row"><span>WEIGHT</span><span>${it.wt}</span></div><div class="row"><span>VALUE</span><span>${it.val}</span></div><div class="desc">${it.d}</div>`);
}

function vQuests() {
    const i = sel(); S.len = QUESTS.length;
    const q = QUESTS[i];
    return split(QUESTS.map((x, k) => item(x[0], k === i, k, x[1])).join(''), `<h3>${q[0]}</h3><div class="desc">${q[2]}</div>${q[3].map(o => `<div class="row"><span>[${o[0] ? 'X' : ' '}] ${o[1]}</span></div>`).join('')}`);
}

function vMail() {
    const i = sel(); S.len = EMAILS.length;
    const m = EMAILS[i];
    return split(EMAILS.map((x, k) => item(x.subject, k === i, k, x.date)).join(''), `<h3>${esc(m.subject)}</h3><div class="row"><span>FROM</span><span>${esc(m.from)}</span></div><div class="row"><span>TO</span><span>${esc(m.to)}</span></div><div class="row"><span>DATE</span><span>${m.date}</span></div><div class="desc">${esc(m.body)}</div>`);
}

function vFiles() {
    const i = sel(); S.len = FILES.length;
    const f = FILES[i];
    const locked = LOCKED.includes(f.id) && !S.unlocked.includes(f.id);
    const body = locked
        ? `<div class="warn">RESTRICTED. ENTER PASSWORD</div><div style="margin-top:8px">&gt; <input id="pw" class="pw" type="password" autocomplete="off" onkeydown="if(event.key==='Enter')tryUnlock('${f.id}')"> <button onclick="tryUnlock('${f.id}')">ENTER</button></div><div class="dim">${esc(S.lock)}</div>`
        : `<div class="desc">${esc(f.content)}</div>`;
    return split(FILES.map((x, k) => item(x.name, k === i, k, LOCKED.includes(x.id) && !S.unlocked.includes(x.id) ? 'LOCKED' : '')).join(''), `<h3>${f.name}</h3>${body}`);
}

function vMap() {
    const flat = LEVELS.flatMap(l => l.rooms);
    const i = sel(); S.len = flat.length;
    const r = flat[i];
    let n = 0;
    const grid = LEVELS.map((lv, li) => `<div class="row dim" style="margin-top:${li ? 8 : 0}px"><span>LEVEL ${li + 1}: ${lv.name}</span><span>${lv.depth}</span></div><div class="grid lvl">${lv.rooms.map(x => {
        const k = n++;
        const bad = x.status === 'CRITICAL' || x.status === 'SEALED' || x.status === 'WARNING';
        return `<div class="room ${k === i ? 'on' : ''} ${bad ? 'bad' : ''}" style="grid-column:span ${Math.min(x.cols || 1, 4)}" onclick="pick(${k})">${x.name === 'ATRIUM' ? '<span class="me">&#9650;</span>' : ''}<span>${esc(x.name)}</span><small>${esc(x.status)}</small></div>`;
    }).join('')}</div>`).join('');
    const integ = r.status === 'OK' ? 100 : 84;
    return `<div class="cols"><div class="list sc grid" style="width:58%">${grid}</div><div class="detail sc">
        <h3>${esc(r.name)}</h3>
        <div class="row"><span>STATUS</span><span>${esc(r.status)}</span></div>
        <div class="row"><span>HEAD</span><span>${esc(r.head)}</span></div>
        <div class="row"><span>FACTION</span><span>${esc(r.faction)}</span></div>
        <div class="row"><span>PERSONNEL</span><span>${esc(r.personnel)}</span></div>
        <div class="dim">INTEGRITY ${integ}%</div><div class="meter"><i style="width:${integ}%"></i></div>
        <div class="desc">${esc(r.desc)}</div>
        ${r.alert ? `<div class="warn">&#9888; ${esc(r.alert)}</div>` : ''}</div></div>`;
}

function vRadio() {
    S.len = R.stations.length;
    const i = sel();
    const np = nowPlaying();
    const list = R.stations.map((s, k) => item(s.name, k === i, k, k === R.cur ? (R.playing ? 'ON AIR' : 'PAUSED') : '')).join('');
    const marks = R.stations.map((s, k) => `<b style="left:${(k + 0.5) / R.stations.length * 100}%">${k + 1}</b>`).join('');
    const needle = R.cur >= 0 ? (R.cur + 0.5) / R.stations.length * 100 : 0;
    return split(list || '<div class="dim">NO SIGNAL</div>', `
        <div class="tuner"><div class="ticks"></div>${marks}<div class="needle" style="left:${needle}%"></div></div>
        <h3 id="npStation">${np ? esc(np.station.name) : 'RADIO OFF'}</h3>
        <div id="npTrack" class="desc" style="margin:2px 0">${np ? esc(np.track.title) : 'SELECT A STATION AND PRESS ENTER'}</div>
        <div class="meter"><i id="npBar" style="width:0%"></i></div>
        <div class="row dim"><span id="npTime">--:--</span><span>VOL ${Math.round(A.vol * 100)}%</span></div>
        <canvas id="viz" width="600" height="110"></canvas>
        <div class="btns">
            <button onclick="act('prev')">&#9664;&#9664; PREV</button><button onclick="act('toggle')">${R.playing ? 'PAUSE' : 'PLAY'}</button><button onclick="act('next')">NEXT &#9654;&#9654;</button>
            <button onclick="act('vdn')">VOL -</button><button onclick="act('vup')">VOL +</button>
        </div>
        <div class="btns"><button onclick="document.getElementById('pickFiles').click()">+ ADD SONGS</button><button onclick="document.getElementById('pickDir').click()">+ ADD RADIO FOLDER</button></div>
        <div class="dim">${esc(S.msg) || 'ADD AUDIO FILES, OR PICK A FOLDER WITH STATION.INI FILES (FALLOUT RADIO LAYOUT).'}</div>`);
}

const VIEWS = [[vStatus, vSpecial, vPerks], [vInv, vInv, vInv, vInv, vInv], [vQuests, vMail, vFiles], [vMap], [vRadio]];

function render() {
    if (S.stage !== 'main') return;
    const t = S.tab;
    S.len = 0;
    const view = VIEWS[t][S.sub[t]]();
    document.getElementById('main').innerHTML = `
        <div id="head"><img src="assets/logo.png" alt="A.R.C."><div id="tabs">${TABS.map((x, i) => `<div class="tab ${i === t ? 'on' : ''}" onclick="setTab(${i})">${x}</div>`).join('')}</div><div id="clock">${clock()}</div></div>
        <div id="subs">${SUBS[t].map((x, i) => `<span class="sub ${i === S.sub[t] ? 'on' : ''}" onclick="setSub(${i})">${x}</span>`).join('')}${SUBS[t].length ? '' : '<span class="sub on">' + (t === 3 ? 'VAULT 254 CROSS-SECTION' : 'TRANSMISSIONS') + '</span>'}</div>
        <div id="view">${view}</div>
        <div id="foot"><div class="cell">HP 210/250</div><div class="cell">LVL 12</div><div class="msg" id="fmsg">${footMsg()}</div><div class="cell">AP 90/90</div><div class="cell">${CURRENT_DATE}</div></div>`;
    const keep = document.querySelector('.item.on, .room.on');
    if (keep && keep.scrollIntoView) keep.scrollIntoView({ block: 'nearest' });
}

const FOOT = ['VAULT 254 // STATUS: SEALED', 'SURFACE SEISMIC ACTIVITY DETECTED', 'RECLAMATION DAY IS PENDING', 'REACTOR OUTPUT 98.4%'];
const footMsg = () => FOOT[Math.floor(Date.now() / 6000) % FOOT.length];
const clock = () => new Date().toLocaleTimeString('en-US', { hour12: false });

function setTab(i) { S.tab = (i + TABS.length) % TABS.length; sfx.tab(); render(); }
function setSub(i) { const n = SUBS[S.tab].length; if (!n) return; S.sub[S.tab] = (i + n) % n; sfx.tick(); S.lock = ''; render(); }
function pick(i) { S.sel[skey()] = i; sfx.tick(); if (S.tab === 4) { if (i === R.cur) toggleRadio(); else tune(i); } render(); }
function move(d) { const n = S.len; if (!n) return; S.sel[skey()] = (sel() + d + n) % n; sfx.tick(); render(); }

function act(a) {
    initAudio();
    if (a === 'toggle') toggleRadio();
    if (a === 'next') { if (R.stations[R.cur] && R.stations[R.cur].synth) tune(R.cur); else nextTrack(); }
    if (a === 'prev') prevTrack();
    if (a === 'vup') setVol(A.vol + 0.1);
    if (a === 'vdn') setVol(A.vol - 0.1);
    sfx.sel();
    render();
}

function tryUnlock(id) {
    const v = document.getElementById('pw').value.trim().toLowerCase();
    if (RESTRICTED_CODES.includes(v)) { S.unlocked.push(id); S.lock = ''; sfx.sel(); } else { S.lock = 'ERROR: ACCESS DENIED'; sfx.err(); }
    render();
}

function startBoot() {
    initAudio();
    sfx.boot();
    S.stage = 'boot';
    stage.innerHTML = `<div class="full" style="cursor:default"><img class="gif" src="assets/loading.gif" alt=""><div>LOADING<span class="blink">_</span></div><div class="bar"><i id="bp"></i></div><div id="bootlog"></div></div>`;
    let n = 0;
    const t = setInterval(() => {
        if (n < BOOT.length) {
            const d = document.createElement('div');
            d.textContent = BOOT[n++];
            document.getElementById('bootlog').appendChild(d);
            document.getElementById('bp').style.width = Math.round(n / BOOT.length * 100) + '%';
            tone(600 + n * 40, 0.03, 'square', 0.05);
        } else {
            clearInterval(t);
            setTimeout(startMain, 700);
        }
    }, 230);
}

function startMain() {
    S.stage = 'main';
    stage.innerHTML = '<div id="main"></div>';
    sfx.tab();
    render();
    loadManifest().then(() => { if (S.tab === 4) render(); });
}

function startScreen() {
    stage.innerHTML = `<div class="full" id="start"><img class="logo" src="assets/logo.png" alt="A.R.C."><div>ROBCO INDUSTRIES (TM) PIP-BOY 3000 MK IV</div><div>VAULT-TEC ADMINISTRATIVE RECLAMATION COMMAND</div><div>VAULT 254 // PERSONAL DATA UNIT</div><div style="margin-top:26px">CLICK OR PRESS ANY KEY TO POWER ON<span class="blink">_</span></div></div>`;
}

document.addEventListener('keydown', e => {
    if (S.stage === 'start') { startBoot(); return; }
    if (S.stage !== 'main' || e.target.tagName === 'INPUT') return;
    const k = e.key.toLowerCase();
    const radio = S.tab === 4;
    if (k === 'q' || k === 'pageup') setTab(S.tab - 1);
    else if (k === 'e' || k === 'pagedown') setTab(S.tab + 1);
    else if (k === 'arrowup' || k === 'w') { e.preventDefault(); move(-1); }
    else if (k === 'arrowdown' || k === 's') { e.preventDefault(); move(1); }
    else if (k === 'arrowleft' || k === 'a') { if (radio) tune(R.cur - 1 < 0 ? R.stations.length - 1 : R.cur - 1), S.sel[skey()] = R.cur, render(); else if (S.tab === 3) move(-1); else setSub(S.sub[S.tab] - 1); }
    else if (k === 'arrowright' || k === 'd') { if (radio) tune(R.cur + 1), S.sel[skey()] = R.cur, render(); else if (S.tab === 3) move(1); else setSub(S.sub[S.tab] + 1); }
    else if (radio && k === 'enter') pick(sel());
    else if (radio && k === ' ') { e.preventDefault(); act('toggle'); }
    else if (radio && k === 'n') act('next');
    else if (radio && k === 'p') act('prev');
    else if (radio && (k === '+' || k === '=')) act('vup');
    else if (radio && (k === '-' || k === '_')) act('vdn');
});

stage.addEventListener('click', () => { if (S.stage === 'start') startBoot(); });

document.getElementById('pickFiles').addEventListener('change', e => {
    const n = addFiles(e.target.files);
    S.msg = n ? 'LOADED ' + n + ' TRACKS INTO MY SONGS' : 'NO AUDIO FILES FOUND';
    e.target.value = '';
    if (n) { const idx = R.stations.findIndex(s => s.name === 'MY SONGS'); S.sel[skey()] = idx; tune(idx); }
    render();
});

document.getElementById('pickDir').addEventListener('change', async e => {
    const before = R.stations.length;
    const n = await addFolder(e.target.files);
    S.msg = n ? 'LOADED ' + n + ' TRACKS, ' + (R.stations.length - before) + ' NEW STATIONS' : 'NO STATIONS FOUND IN THAT FOLDER';
    e.target.value = '';
    if (n && R.stations.length > before) { S.sel[skey()] = before; tune(before); }
    render();
});

setInterval(() => {
    const c = document.getElementById('clock');
    if (c) c.textContent = clock();
    const f = document.getElementById('fmsg');
    if (f) f.textContent = footMsg();
}, 1000);

let leg = 0;
const FRAMES = [1, 3, 4, 5, 6, 7, 8, 9];
setInterval(() => {
    const l = document.getElementById('legs');
    if (l) l.src = 'assets/vaultboy/legs/' + FRAMES[leg++ % FRAMES.length] + '.svg';
}, 150);

let sig = '';
setInterval(() => {
    if (S.stage === 'main' && S.tab === 4) {
        const now = R.cur + '|' + R.playing + '|' + R.stations.length;
        if (now !== sig) { sig = now; render(); }
    }
    const cv = document.getElementById('viz');
    if (!cv) return;
    const x = cv.getContext('2d');
    const w = cv.width, h = cv.height, n = 48;
    x.clearRect(0, 0, w, h);
    x.fillStyle = '#1aff6e';
    bars(n).forEach((v, i) => { const bh = Math.max(2, v * h); x.fillRect(i * (w / n) + 2, h - bh, w / n - 4, bh); });
    const np = nowPlaying();
    if (!np) return;
    const t = document.getElementById('npTime'), b = document.getElementById('npBar');
    const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    if (np.live) { t.textContent = 'LIVE'; b.style.width = '100%'; }
    else { t.textContent = fmt(np.cur) + ' / ' + (np.dur ? fmt(np.dur) : '--:--'); b.style.width = np.dur ? (np.cur / np.dur * 100) + '%' : '0%'; }
    const tk = document.getElementById('npTrack');
    if (tk && tk.textContent !== np.track.title) { tk.textContent = np.track.title; document.getElementById('npStation').textContent = np.station.name; }
}, 90);

startScreen();
