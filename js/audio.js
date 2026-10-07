const A = { ctx: null, master: null, an: null, ng: null, routed: false, vol: 0.7, timer: null, step: 0 };
const R = { stations: [], cur: -1, order: [], pos: 0, playing: false, fails: 0 };
const el = document.getElementById('player');

function initAudio() {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    A.ctx = new (window.AudioContext || window.webkitAudioContext)();
    A.master = A.ctx.createGain();
    A.master.gain.value = A.vol;
    A.an = A.ctx.createAnalyser();
    A.an.fftSize = 128;
    A.master.connect(A.an);
    A.an.connect(A.ctx.destination);
    if (location.protocol !== 'file:') {
        try { A.ctx.createMediaElementSource(el).connect(A.master); A.routed = true; } catch (e) { A.routed = false; }
    }
    const len = A.ctx.sampleRate * 2;
    const buf = A.ctx.createBuffer(1, len, A.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const n = A.ctx.createBufferSource();
    n.buffer = buf;
    n.loop = true;
    const f = A.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 2400;
    A.ng = A.ctx.createGain();
    A.ng.gain.value = 0;
    n.connect(f);
    f.connect(A.ng);
    A.ng.connect(A.master);
    n.start();
    setVol(A.vol);
}

function setVol(v) {
    A.vol = Math.max(0, Math.min(1, v));
    if (A.master) A.master.gain.value = A.vol;
    el.volume = A.routed ? 1 : A.vol;
}

function tone(freq, dur = 0.06, type = 'square', vol = 0.12, at = 0) {
    if (!A.ctx) return;
    const t = A.ctx.currentTime + at;
    const o = A.ctx.createOscillator();
    const g = A.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(A.master);
    o.start(t);
    o.stop(t + dur + 0.02);
}

const sfx = {
    tick: () => tone(950, 0.03, 'square', 0.07),
    tab: () => { tone(240, 0.1, 'sawtooth', 0.1); tone(480, 0.06, 'square', 0.05, 0.04); },
    sel: () => { tone(1300, 0.05, 'square', 0.09); tone(1700, 0.04, 'square', 0.06, 0.05); },
    err: () => tone(110, 0.25, 'sawtooth', 0.14),
    boot: () => [200, 300, 450, 700].forEach((f, i) => tone(f, 0.12, 'square', 0.08, i * 0.1))
};

function staticBurst(ms = 400, level = 0.5) {
    if (!A.ng) return;
    const t = A.ctx.currentTime;
    A.ng.gain.cancelScheduledValues(t);
    A.ng.gain.setValueAtTime(level, t);
    A.ng.gain.linearRampToValueAtTime(0.0, t + ms / 1000);
}

const LEAD = [392, 392, 523, 523, 659, 659, 523, 0, 587, 587, 494, 494, 392, 0, 392, 0];
const BASS = [131, 0, 196, 0, 131, 0, 196, 0, 147, 0, 196, 0, 131, 0, 196, 0];

function synthStart() {
    synthStop();
    A.step = 0;
    A.timer = setInterval(() => {
        const i = A.step++ % LEAD.length;
        if (LEAD[i]) tone(LEAD[i], 0.2, 'square', 0.05);
        if (BASS[i]) tone(BASS[i], 0.22, 'triangle', 0.11);
        if (Math.random() < 0.15) staticBurst(60, 0.08);
    }, 230);
}

function synthStop() { clearInterval(A.timer); A.timer = null; }

function addStation(name, ordered, tracks, synth = false) {
    const existing = R.stations.find(s => s.name === name);
    if (existing) { existing.tracks.push(...tracks); return existing; }
    const st = { name, ordered, tracks: tracks.slice(), synth };
    R.stations.push(st);
    return st;
}

function buildOrder(st) {
    R.order = st.tracks.map((_, i) => i);
    if (!st.ordered) R.order.sort(() => Math.random() - 0.5);
    R.pos = 0;
}

function tune(i) {
    if (!R.stations.length) return;
    i = (i + R.stations.length) % R.stations.length;
    stopRadio(true);
    R.cur = i;
    R.fails = 0;
    buildOrder(R.stations[i]);
    initAudio();
    staticBurst(450, 0.55);
    setTimeout(() => { if (R.cur === i) playCurrent(); }, 380);
}

function playCurrent() {
    const st = R.stations[R.cur];
    if (!st || !st.tracks.length) return;
    R.playing = true;
    if (st.synth) { el.removeAttribute('src'); synthStart(); return; }
    synthStop();
    el.src = st.tracks[R.order[R.pos]].url;
    el.play().catch(() => failTrack());
}

function failTrack() {
    R.fails++;
    if (R.fails > R.stations[R.cur].tracks.length) { R.playing = false; sfx.err(); return; }
    nextTrack();
}

function nextTrack() {
    const st = R.stations[R.cur];
    if (!st || st.synth) return;
    R.pos = (R.pos + 1) % R.order.length;
    if (R.pos === 0 && !st.ordered) buildOrder(st);
    staticBurst(250, 0.3);
    playCurrent();
}

function prevTrack() {
    const st = R.stations[R.cur];
    if (!st || st.synth) return;
    R.pos = (R.pos + R.order.length - 1) % R.order.length;
    playCurrent();
}

function stopRadio(keepStation) {
    synthStop();
    el.pause();
    R.playing = false;
    if (!keepStation) R.cur = -1;
}

function toggleRadio() {
    if (R.cur < 0) return tune(0);
    initAudio();
    const st = R.stations[R.cur];
    if (R.playing) { synthStop(); el.pause(); R.playing = false; return; }
    R.playing = true;
    if (st.synth) synthStart(); else if (el.src) el.play().catch(() => failTrack()); else playCurrent();
}

function nowPlaying() {
    const st = R.stations[R.cur];
    if (!st) return null;
    const tr = st.tracks[st.synth ? 0 : R.order[R.pos]];
    return { station: st, track: tr, cur: el.currentTime || 0, dur: el.duration || 0, live: st.synth };
}

function bars(n) {
    const out = [];
    if (A.an && A.routed && R.playing) {
        const d = new Uint8Array(A.an.frequencyBinCount);
        A.an.getByteFrequencyData(d);
        for (let i = 0; i < n; i++) out.push(d[Math.floor(i * d.length * 0.7 / n)] / 255);
    } else {
        for (let i = 0; i < n; i++) out.push(R.playing ? Math.random() * 0.7 * (0.4 + 0.6 * Math.abs(Math.sin(Date.now() / 400 + i / 3))) : 0.03);
    }
    return out;
}

function niceName(file) {
    let s = file.replace(/\.[^.]+$/, '').replace(/^.*?mus_/, '');
    s = s.replace(/^(radio_)?(diamond|institute|minutemen|magnolia)_/, '').replace(/_(mix|radio)$/, '');
    return s.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();
}

const isAudio = f => /^audio\//.test(f.type) || /\.(ogg|mp3|wav|m4a|flac|opus|aac)$/i.test(f.name);

function addFiles(files) {
    const list = [...files].filter(isAudio).sort((a, b) => a.name.localeCompare(b.name));
    if (!list.length) return 0;
    addStation('MY SONGS', false, list.map(f => ({ title: niceName(f.name), url: URL.createObjectURL(f) })));
    return list.length;
}

async function addFolder(files) {
    const groups = {};
    const ini = {};
    for (const f of [...files]) {
        const p = f.webkitRelativePath.split('/');
        if (p.some(x => /intermission/i.test(x))) continue;
        const dir = p.slice(0, -1).join('/');
        if (/^station\.ini$/i.test(f.name)) ini[dir] = await f.text();
        else if (isAudio(f)) (groups[dir] = groups[dir] || []).push(f);
    }
    const hasIni = Object.keys(ini).length > 0;
    let count = 0;
    Object.keys(groups).sort().forEach(dir => {
        if (hasIni && !ini[dir]) return;
        const txt = ini[dir] || '';
        const nm = (txt.match(/station_name\s*=\s*(.+)/i) || [])[1];
        const ordered = /ordered\s*=\s*true/i.test(txt);
        const tracks = groups[dir].sort((a, b) => a.name.localeCompare(b.name)).map(f => ({ title: niceName(f.name), url: URL.createObjectURL(f) }));
        addStation(nm ? nm.trim().toUpperCase() : dir.split('/').pop().toUpperCase(), ordered, tracks);
        count += tracks.length;
    });
    return count;
}

function loadManifest() {
    return fetch('radio/stations.json').then(r => r.ok ? r.json() : []).then(arr => {
        arr.forEach(s => addStation(String(s.name).toUpperCase(), !!s.ordered, s.tracks.map(t => ({ title: t.title, url: encodeURI(t.file) }))));
    }).catch(() => {});
}

el.addEventListener('ended', nextTrack);
el.addEventListener('error', () => { if (R.playing && el.getAttribute('src')) failTrack(); });
el.addEventListener('playing', () => { R.fails = 0; });

addStation('ARC GHOST SIGNAL', false, [{ title: 'Unidentified Patriotic Loop (Sector 4)' }], true);
